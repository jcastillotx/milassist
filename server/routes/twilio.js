const express = require('express');
const router = express.Router();
const TwilioService = require('../services/twilioService');
const { Call, User } = require('../models');

const twilioService = new TwilioService();

/**
 * @route   POST /api/twilio/incoming-call-handler
 * @desc    Handle incoming calls from Twilio
 * @access  Public (Twilio webhook)
 */
router.post('/incoming-call-handler', express.urlencoded({ extended: false }), async (req, res) => {
  try {
    const { From: callerNumber, To: toNumber, CallSid: callSid } = req.body;
    
    // Generate TwiML response
    const twiml = await twilioService.handleIncomingCall(callerNumber, toNumber, callSid);
    
    res.set('Content-Type', 'text/xml');
    res.send(twiml);
  } catch (error) {
    console.error('Incoming call handler error:', error);
    
    // Send error response
    const errorTwiML = twilioService.generateErrorResponse();
    res.set('Content-Type', 'text/xml');
    res.send(errorTwiML);
  }
});

/**
 * @route   POST /api/twilio/voicemail-complete
 * @desc    Handle voicemail recording completion
 * @access  Public (Twilio webhook)
 */
router.post('/voicemail-complete', express.urlencoded({ extended: false }), async (req, res) => {
  try {
    const { callId, RecordingUrl: recordingUrl, RecordingDuration: recordingDuration } = req.body;
    
    await twilioService.handleVoicemailComplete(callId, recordingUrl, recordingDuration);
    
    // Send success response
    const VoiceResponse = require('twilio').twiml.VoiceResponse;
    const response = new VoiceResponse();
    response.say({ voice: 'alice' }, 'Thank you for your message. Goodbye.');
    response.hangup();
    
    res.set('Content-Type', 'text/xml');
    res.send(response.toString());
  } catch (error) {
    console.error('Voicemail complete error:', error);
    res.status(500).send('Error processing voicemail');
  }
});

/**
 * @route   POST /api/twilio/call-status
 * @desc    Handle call status updates from Twilio
 * @access  Public (Twilio webhook)
 */
router.post('/call-status', express.urlencoded({ extended: false }), async (req, res) => {
  try {
    const { CallSid: callSid, CallStatus: callStatus, RecordingUrl: recordingUrl } = req.body;
    
    await twilioService.handleCallStatusUpdate(callSid, callStatus, recordingUrl);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Call status update error:', error);
    res.status(500).send('Error updating call status');
  }
});

/**
 * @route   POST /api/twilio/incoming-sms
 * @desc    Handle incoming SMS messages
 * @access  Public (Twilio webhook)
 */
router.post('/incoming-sms', express.urlencoded({ extended: false }), async (req, res) => {
  try {
    const { From: fromNumber, To: toNumber, Body: messageBody } = req.body;
    
    // Log incoming SMS
    console.log(`SMS from ${fromNumber} to ${toNumber}: ${messageBody}`);
    
    // Find user by phone number
    const user = await User.findOne({
      where: { phone: fromNumber }
    });
    
    if (user) {
      // Here you could trigger notifications, create tasks, etc.
      console.log(`SMS received from user ${user.id}: ${messageBody}`);
    }
    
    // Send auto-response if needed
    const MessagingResponse = require('twilio').twiml.MessagingResponse;
    const response = new MessagingResponse();
    
    if (user) {
      response.message('Thank you for your message. We will get back to you shortly.');
    } else {
      response.message('Thank you for contacting MilAssist. Please visit our website to get started.');
    }
    
    res.set('Content-Type', 'text/xml');
    res.send(response.toString());
  } catch (error) {
    console.error('Incoming SMS error:', error);
    res.status(500).send('Error processing SMS');
  }
});

/**
 * @route   POST /api/twilio/make-call
 * @desc    Make outbound call
 * @access  Private
 */
router.post('/make-call', async (req, res) => {
  try {
    const { to, clientId, assistantId } = req.body;
    
    if (!to) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }
    
    const call = await twilioService.makeOutboundCall(to, clientId, assistantId);
    
    res.json({
      success: true,
      data: {
        callSid: call.sid,
        status: call.status,
        to: call.to,
        from: call.from
      },
      message: 'Call initiated successfully'
    });
  } catch (error) {
    console.error('Make call error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/twilio/send-sms
 * @desc    Send SMS message
 * @access  Private
 */
router.post('/send-sms', async (req, res) => {
  try {
    const { to, message, clientId } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and message are required'
      });
    }
    
    const sms = await twilioService.sendSMS(to, message, clientId);
    
    res.json({
      success: true,
      data: {
        sid: sms.sid,
        status: sms.status,
        to: sms.to,
        from: sms.from
      },
      message: 'SMS sent successfully'
    });
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/twilio/available-numbers
 * @desc    Get available phone numbers
 * @access  Private (Admin only)
 */
router.get('/available-numbers', async (req, res) => {
  try {
    const { areaCode } = req.query;
    
    const numbers = await twilioService.getAvailableNumbers(areaCode);
    
    res.json({
      success: true,
      data: {
        numbers: numbers.map(num => ({
          phoneNumber: num.phoneNumber,
          friendlyName: num.friendlyName,
          locality: num.locality,
          region: num.region
        }))
      },
      message: 'Available numbers retrieved successfully'
    });
  } catch (error) {
    console.error('Get available numbers error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/twilio/purchase-number
 * @desc    Purchase phone number
 * @access  Private (Admin only)
 */
router.post('/purchase-number', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }
    
    const purchasedNumber = await twilioService.purchaseNumber(phoneNumber);
    
    res.json({
      success: true,
      data: {
        sid: purchasedNumber.sid,
        phoneNumber: purchasedNumber.phoneNumber,
        dateCreated: purchasedNumber.dateCreated
      },
      message: 'Phone number purchased successfully'
    });
  } catch (error) {
    console.error('Purchase number error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/twilio/recordings/:recordingSid
 * @desc    Get call recording
 * @access  Private
 */
router.get('/recordings/:recordingSid', async (req, res) => {
  try {
    const { recordingSid } = req.params;
    
    const recording = await twilioService.getCallRecording(recordingSid);
    
    res.json({
      success: true,
      data: {
        sid: recording.sid,
        duration: recording.duration,
        dateCreated: recording.dateCreated,
        uri: recording.uri
      },
      message: 'Recording retrieved successfully'
    });
  } catch (error) {
    console.error('Get recording error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/twilio/status
 * @desc    Check Twilio configuration status
 * @access  Private
 */
router.get('/status', async (req, res) => {
  try {
    const isConfigured = twilioService.isConfigured();
    
    res.json({
      success: true,
      data: {
        configured: isConfigured,
        accountSid: isConfigured ? process.env.TWILIO_ACCOUNT_SID?.substring(0, 8) + '...' : null,
        fromNumber: process.env.TWILIO_PHONE_NUMBER || null
      },
      message: isConfigured ? 'Twilio is configured' : 'Twilio is not configured'
    });
  } catch (error) {
    console.error('Twilio status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
