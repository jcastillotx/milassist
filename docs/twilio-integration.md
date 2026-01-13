# Twilio Integration Guide

This guide covers the complete Twilio integration for adding VoIP capabilities to the MilAssist platform.

## 🌟 Features Enabled

### Voice Services
- **Incoming Call Handling**: Automatic call routing based on business rules
- **Outbound Calling**: Make calls from the platform
- **Voicemail**: Record and transcribe voicemail messages
- **Call Recording**: Automatic call recording with transcription
- **Call Routing**: Forward to assistants, external numbers, or voicemail

### SMS Services
- **Two-Way Messaging**: Send and receive SMS messages
- **Auto-Responses**: Automatic replies to incoming messages
- **Message Logging**: Track all SMS communications

### Phone Number Management
- **Number Purchase**: Buy phone numbers through the platform
- **Number Search**: Find available numbers by area code
- **Number Configuration**: Set up webhooks and routing

## 🔧 Setup Instructions

### 1. Create Twilio Account

1. **Sign up** at [twilio.com](https://twilio.com)
2. **Verify your phone number** (required for trial accounts)
3. **Get your Account SID** and **Auth Token** from the dashboard
4. **Purchase a phone number** or use the trial number

### 2. Configure Environment Variables

Add these to your `.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# Webhook URLs (Twilio will call these)
APP_URL=https://your-domain.com
```

### 3. Install Dependencies

```bash
cd server
npm install twilio
```

### 4. Configure Phone Number

In your Twilio dashboard, configure your phone number webhooks:

**Voice URL:** `https://your-domain.com/api/twilio/incoming-call-handler`
**SMS URL:** `https://your-domain.com/api/twilio/incoming-sms`

**Method:** POST for both

## 📋 API Endpoints

### Webhook Endpoints (Public)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/twilio/incoming-call-handler` | Handle incoming calls |
| POST | `/api/twilio/voicemail-complete` | Process voicemail recordings |
| POST | `/api/twilio/call-status` | Update call status |
| POST | `/api/twilio/incoming-sms` | Handle incoming SMS |

### Application Endpoints (Private)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/twilio/make-call` | Make outbound call |
| POST | `/api/twilio/send-sms` | Send SMS message |
| GET | `/api/twilio/available-numbers` | Find available numbers |
| POST | `/api/twilio/purchase-number` | Buy phone number |
| GET | `/api/twilio/recordings/:sid` | Get call recording |
| GET | `/api/twilio/status` | Check configuration |

## 🔄 Call Flow

### Incoming Call Process

1. **Call Received** → Twilio webhook to `/incoming-call-handler`
2. **Routing Rules** → Check client's routing configuration
3. **Business Hours** → Verify if within business hours
4. **Action Taken**:
   - **Forward to Assistant** → Dial assistant's number
   - **Voicemail** → Record message
   - **External Forward** → Dial external number
5. **Call Logging** → Update call status in database
6. **Recording** → Save recording and transcription

### Outbound Call Process

1. **Initiate Call** → API call to `/make-call`
2. **Twilio Call** → Create call via Twilio API
3. **Call Status** → Track call progress
4. **Recording** → Auto-record if enabled
5. **Logging** → Update database with call details

## 📞 Call Routing Strategies

### Forward to Assistant
- **Business Hours Only**: Only forward during configured hours
- **Assistant Priority**: Round-robin or priority-based assignment
- **Fallback**: Voicemail if no assistant available

### Voicemail
- **Always Available**: 24/7 voicemail recording
- **Transcription**: Automatic speech-to-text
- **Notifications**: Alert assistants of new messages

### External Forward
- **Backup Number**: Forward to external phone number
- **After Hours**: Use when assistants unavailable
- **Emergency**: Forward to on-call number

## 📱 SMS Features

### Incoming SMS
- **Auto-Response**: Send immediate acknowledgment
- **User Detection**: Identify registered users
- **Message Logging**: Store all messages
- **Task Creation**: Convert messages to tasks (optional)

### Outbound SMS
- **Notifications**: Send alerts and updates
- **Reminders**: Appointment and task reminders
- **Marketing**: Promotional messages (if enabled)

## 🛠️ Advanced Configuration

### Business Hours Setup

```javascript
// In client routing rules
{
  strategy: 'forward_to_assistant',
  business_hours_start: '09:00',
  business_hours_end: '17:00',
  assistant_phone: '+1234567890',
  external_phone: '+0987654321'
}
```

### Call Recording

```javascript
// Automatic recording enabled
const call = await twilioService.makeOutboundCall(to, clientId, assistantId);
// Recording automatically saved and transcribed
```

### Voicemail Transcription

```javascript
// Automatic transcription enabled
const transcription = await twilioService.transcribeRecording(recordingUrl);
// Saved to Call.transcription field
```

## 🔒 Security Considerations

### Webhook Security
- **Request Validation**: Verify Twilio signatures
- **IP Whitelisting**: Restrict to Twilio IPs only
- **Rate Limiting**: Prevent webhook abuse

### Data Privacy
- **Recording Storage**: Secure storage with access controls
- **Transcription Privacy**: Handle sensitive transcriptions
- **Number Masking**: Protect personal phone numbers

## 📊 Monitoring & Analytics

### Call Metrics
- **Call Volume**: Track incoming/outbound calls
- **Duration Analysis**: Average call lengths
- **Missed Calls**: Identify service gaps
- **Recording Usage**: Monitor storage needs

### SMS Metrics
- **Message Volume**: Track SMS usage
- **Response Rates**: Measure engagement
- **Delivery Success**: Monitor deliverability

## 🚨 Troubleshooting

### Common Issues

#### 1. Webhook Not Receiving
```bash
# Check webhook URL accessibility
curl -X POST https://your-domain.com/api/twilio/incoming-call-handler

# Verify ngrok if using local development
ngrok http 3000
```

#### 2. Call Not Connecting
```bash
# Check Twilio configuration
curl https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Calls.json \
  -u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```

#### 3. Recording Not Working
- Verify recording permissions in Twilio console
- Check webhook URL for recording status
- Ensure sufficient account balance

### Debug Mode

Enable debug logging:
```env
DEBUG=twilio:*
```

## 💰 Cost Management

### Twilio Pricing (as of 2024)

| Service | Cost |
|---------|------|
| Phone Number | $1.00/month |
| Incoming Calls | $0.0085/minute |
| Outbound Calls | $0.0130/minute |
| SMS Messages | $0.0079/message |
| Call Recording | $0.0025/minute |
| Transcription | $0.015/minute |

### Cost Optimization
- **Monitor Usage**: Track call volumes and costs
- **Efficient Routing**: Minimize unnecessary calls
- **Recording Limits**: Set recording duration limits
- **Bulk SMS**: Use bulk messaging for campaigns

## 🔄 Testing

### Local Development
Use ngrok to expose local server:
```bash
ngrok http 3000
# Use ngrok URL for webhooks
```

### Test Scenarios
1. **Incoming Call**: Test routing to different strategies
2. **Voicemail**: Test recording and transcription
3. **SMS**: Test two-way messaging
4. **Outbound Call**: Test call initiation

### Sample Test Data
```javascript
// Test call
{
  "to": "+1234567890",
  "clientId": "client-uuid",
  "assistantId": "assistant-uuid"
}

// Test SMS
{
  "to": "+1234567890",
  "message": "Test message from MilAssist",
  "clientId": "client-uuid"
}
```

## 📚 Additional Resources

- **Twilio Documentation**: https://www.twilio.com/docs
- **Twilio Node.js SDK**: https://www.twilio.com/docs/libraries/reference/twilio-node
- **TwiML Reference**: https://www.twilio.com/docs/twiml
- **Webhook Security**: https://www.twilio.com/docs/security

## 🆘 Support

### Twilio Support
- **Email**: support@twilio.com
- **Documentation**: https://www.twilio.com/docs
- **Status Page**: https://status.twilio.com

### MilAssist Integration Support
- **Documentation**: Check `/docs` folder
- **Issues**: Create GitHub issue
- **Email**: support@milassist.com

---

*Last Updated: 2026-01-11*
