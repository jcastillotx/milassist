const twilio = require('twilio');
const { Call, RoutingRule, User } = require('../models');

class TwilioService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (this.accountSid && this.authToken) {
      this.client = twilio(this.accountSid, this.authToken);
    }
  }

  /**
   * Initialize Twilio service
   */
  isConfigured() {
    return !!(this.accountSid && this.authToken && this.fromNumber);
  }

  /**
   * Make outbound call
   */
  async makeOutboundCall(to, clientId, assistantId = null) {
    if (!this.isConfigured()) {
      throw new Error('Twilio not configured');
    }

    try {
      const call = await this.client.calls.create({
        url: `${process.env.APP_URL}/api/twilio/incoming-call-handler`,
        to: to,
        from: this.fromNumber,
        record: true,
        recordingStatusCallback: `${process.env.APP_URL}/api/twilio/recording-callback`,
        recordingStatusCallbackMethod: 'POST'
      });

      // Log the call in database
      await Call.create({
        caller_number: to,
        direction: 'outbound',
        status: 'completed',
        duration_seconds: 0,
        twilio_call_sid: call.sid,
        clientId: clientId,
        assistantId: assistantId
      });

      return call;
    } catch (error) {
      console.error('Twilio outbound call error:', error);
      throw error;
    }
  }

  /**
   * Handle incoming call from Twilio webhook
   */
  async handleIncomingCall(from, to, callSid) {
    try {
      // Find routing rules for this client
      const routingRule = await this.findRoutingRule(from);
      
      // Log the incoming call
      const callRecord = await Call.create({
        caller_number: from,
        direction: 'inbound',
        status: 'ringing',
        twilio_call_sid: callSid,
        clientId: routingRule?.clientId || null
      });

      // Generate TwiML response based on routing
      const twiml = this.generateTwiMLResponse(from, routingRule, callRecord.id);
      
      return twiml;
    } catch (error) {
      console.error('Twilio incoming call error:', error);
      return this.generateErrorResponse();
    }
  }

  /**
   * Find routing rules for incoming number
   */
  async findRoutingRule(callerNumber) {
    // Try to find client by phone number
    const client = await User.findOne({
      where: { 
        phone: callerNumber,
        role: 'client'
      }
    });

    if (client) {
      return await RoutingRule.findOne({
        where: { clientId: client.id }
      });
    }

    return null;
  }

  /**
   * Generate TwiML response for call handling
   */
  generateTwiMLResponse(callerNumber, routingRule, callId) {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    if (!routingRule) {
      // No routing rules found - play default message
      response.say({ voice: 'alice' }, 'Thank you for calling. Please try again later.');
      response.hangup();
      return response.toString();
    }

    const now = new Date();
    const businessHours = this.isBusinessHours(now, routingRule);

    switch (routingRule.strategy) {
      case 'forward_to_assistant':
        if (businessHours) {
          // Forward to assistant
          const assistantNumber = routingRule.assistant_phone;
          if (assistantNumber) {
            response.dial({}, assistantNumber);
          } else {
            response.say({ voice: 'alice' }, 'All assistants are currently unavailable. Please leave a message.');
            response.record({
              maxLength: 30,
              action: `${process.env.APP_URL}/api/twilio/voicemail-complete?callId=${callId}`
            });
          }
        } else {
          // Outside business hours - send to voicemail
          response.say({ voice: 'alice' }, 'We are currently outside business hours. Please leave a message.');
          response.record({
            maxLength: 30,
            action: `${process.env.APP_URL}/api/twilio/voicemail-complete?callId=${callId}`
          });
        }
        break;

      case 'voicemail':
        response.say({ voice: 'alice' }, 'Please leave a message after the tone.');
        response.record({
          maxLength: 30,
          action: `${process.env.APP_URL}/api/twilio/voicemail-complete?callId=${callId}`
        });
        break;

      case 'forward_to_external':
        const externalNumber = routingRule.external_phone;
        if (externalNumber) {
          response.dial({}, externalNumber);
        } else {
          response.say({ voice: 'alice' }, 'Forwarding number not configured. Please try again.');
          response.hangup();
        }
        break;

      default:
        response.say({ voice: 'alice' }, 'Thank you for calling. Goodbye.');
        response.hangup();
    }

    return response.toString();
  }

  /**
   * Generate error response TwiML
   */
  generateErrorResponse() {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    
    response.say({ voice: 'alice' }, 'We are experiencing technical difficulties. Please try again later.');
    response.hangup();
    
    return response.toString();
  }

  /**
   * Check if current time is within business hours
   */
  isBusinessHours(now, routingRule) {
    if (!routingRule.business_hours_start || !routingRule.business_hours_end) {
      return true; // No business hours set, always available
    }

    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = this.parseTime(routingRule.business_hours_start);
    const endTime = this.parseTime(routingRule.business_hours_end);

    // Check if current time is within business hours
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Overnight hours (e.g., 9 PM to 6 AM)
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Parse time string to minutes
   */
  parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Handle voicemail completion
   */
  async handleVoicemailComplete(callId, recordingUrl, recordingDuration) {
    try {
      await Call.update(
        {
          status: 'voicemail',
          recording_url: recordingUrl,
          duration_seconds: recordingDuration || 0
        },
        { where: { id: callId } }
      );

      // Optionally transcribe the voicemail
      if (recordingUrl && this.isConfigured()) {
        try {
          const transcription = await this.transcribeRecording(recordingUrl);
          await Call.update(
            { transcription },
            { where: { id: callId } }
          );
        } catch (transcriptionError) {
          console.error('Transcription failed:', transcriptionError);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Voicemail completion error:', error);
      throw error;
    }
  }

  /**
   * Transcribe audio recording
   */
  async transcribeRecording(recordingUrl) {
    if (!this.isConfigured()) {
      throw new Error('Twilio not configured for transcription');
    }

    try {
      // Use Twilio's transcription service
      const transcription = await this.client.transcriptions.create({
        recordingSid: this.extractRecordingSid(recordingUrl)
      });

      return transcription.transcriptionText;
    } catch (error) {
      console.error('Transcription error:', error);
      return null;
    }
  }

  /**
   * Extract recording SID from URL
   */
  extractRecordingSid(recordingUrl) {
    const match = recordingUrl.match(/Recordings\/([A-Za-z0-9]+)/);
    return match ? match[1] : null;
  }

  /**
   * Handle call status updates
   */
  async handleCallStatusUpdate(callSid, callStatus, recordingUrl = null) {
    try {
      const call = await Call.findOne({
        where: { twilio_call_sid: callSid }
      });

      if (call) {
        const updateData = {
          status: this.mapTwilioStatus(callStatus)
        };

        if (recordingUrl) {
          updateData.recording_url = recordingUrl;
        }

        await Call.update(updateData, {
          where: { id: call.id }
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Call status update error:', error);
      throw error;
    }
  }

  /**
   * Map Twilio call status to our status
   */
  mapTwilioStatus(twilioStatus) {
    const statusMap = {
      'queued': 'ringing',
      'ringing': 'ringing',
      'in-progress': 'completed',
      'completed': 'completed',
      'failed': 'missed',
      'busy': 'missed',
      'no-answer': 'missed',
      'canceled': 'missed'
    };

    return statusMap[twilioStatus] || 'missed';
  }

  /**
   * Get call recording
   */
  async getCallRecording(recordingSid) {
    if (!this.isConfigured()) {
      throw new Error('Twilio not configured');
    }

    try {
      const recording = await this.client.recordings(recordingSid).fetch();
      return recording;
    } catch (error) {
      console.error('Get recording error:', error);
      throw error;
    }
  }

  /**
   * Send SMS message
   */
  async sendSMS(to, message, clientId = null) {
    if (!this.isConfigured()) {
      throw new Error('Twilio not configured');
    }

    try {
      const sms = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: to
      });

      // Log SMS if needed
      console.log(`SMS sent to ${to}: ${sms.sid}`);

      return sms;
    } catch (error) {
      console.error('SMS send error:', error);
      throw error;
    }
  }

  /**
   * Get available phone numbers
   */
  async getAvailableNumbers(areaCode = null) {
    if (!this.isConfigured()) {
      throw new Error('Twilio not configured');
    }

    try {
      const availableNumbers = await this.client.availablePhoneNumbers('US')
        .local
        .list({
          areaCode: areaCode,
          limit: 10,
          voiceEnabled: true,
          smsEnabled: true
        });

      return availableNumbers;
    } catch (error) {
      console.error('Get available numbers error:', error);
      throw error;
    }
  }

  /**
   * Purchase phone number
   */
  async purchaseNumber(phoneNumber) {
    if (!this.isConfigured()) {
      throw new Error('Twilio not configured');
    }

    try {
      const incomingPhoneNumber = await this.client.incomingPhoneNumbers.create({
        phoneNumber: phoneNumber,
        voiceUrl: `${process.env.APP_URL}/api/twilio/incoming-call-handler`,
        voiceMethod: 'POST',
        smsUrl: `${process.env.APP_URL}/api/twilio/incoming-sms`,
        smsMethod: 'POST'
      });

      return incomingPhoneNumber;
    } catch (error) {
      console.error('Purchase number error:', error);
      throw error;
    }
  }
}

module.exports = TwilioService;
