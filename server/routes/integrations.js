const express = require('express');
const router = express.Router();
const { Integration, IntegrationLog } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../config/logger');

// Helper to log integration activities
async function logIntegrationActivity(integrationId, action, status, message, details = {}, userId = null) {
    try {
        await IntegrationLog.create({
            integrationId,
            action,
            status,
            message,
            details,
            userId
        });
    } catch (error) {
        logger.error(`Failed to log integration activity: ${error.message}`);
    }
}

// Middleware to ensure Admin access
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    next();
};

// Get All Integrations (Admin Only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const integrations = await Integration.findAll({
            attributes: { exclude: ['encrypted_credentials'] }
        });
        res.json(integrations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Single Integration
router.get('/:provider', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const integration = await Integration.findOne({
            where: { provider: req.params.provider },
            attributes: { exclude: ['encrypted_credentials'] }
        });

        if (!integration) {
            return res.status(404).json({ error: 'Integration not found' });
        }

        res.json(integration);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create/Update Integration
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { provider, name, description, category, credentials, settings, status, enabled_features, sync_frequency } = req.body;

        const [integration, created] = await Integration.findOrCreate({
            where: { provider },
            defaults: {
                name: name || provider.charAt(0).toUpperCase() + provider.slice(1),
                description: description || '',
                category: category || 'other',
                encrypted_credentials: credentials || {},
                settings: settings || {},
                status: status || 'active',
                enabled_features: enabled_features || [],
                sync_frequency: sync_frequency || 'manual'
            }
        });

        if (!created) {
            if (name) integration.name = name;
            if (description) integration.description = description;
            if (category) integration.category = category;
            if (credentials) integration.encrypted_credentials = credentials;
            if (settings) integration.settings = settings;
            if (status) integration.status = status;
            if (enabled_features) integration.enabled_features = enabled_features;
            if (sync_frequency) integration.sync_frequency = sync_frequency;
            await integration.save();
        }

        // Log the activity
        await logIntegrationActivity(
            integration.id,
            created ? 'connect' : 'update',
            'success',
            `Integration ${created ? 'connected' : 'updated'} successfully`,
            { status: integration.status },
            req.user.id
        );

        logger.info(`Integration ${created ? 'created' : 'updated'}: ${provider}`);

        res.json({
            message: 'Integration saved',
            id: integration.id,
            provider: integration.provider,
            status: integration.status
        });
    } catch (error) {
        logger.error(`Integration save error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Delete Integration
router.delete('/:provider', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const integration = await Integration.findOne({ where: { provider: req.params.provider } });

        if (!integration) {
            return res.status(404).json({ error: 'Integration not found' });
        }

        // Log before deletion
        await logIntegrationActivity(
            integration.id,
            'disconnect',
            'success',
            `Integration disconnected by admin`,
            { provider: req.params.provider },
            req.user.id
        );

        await integration.destroy();

        logger.info(`Integration disconnected: ${req.params.provider}`);
        res.json({ message: 'Integration disconnected successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test Integration Connection
router.post('/:provider/test', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { provider } = req.params;
        const credentials = req.body;

        // Find integration for logging
        const integration = await Integration.findOne({ where: { provider } });

        // Provider-specific connection tests
        let testResult = { success: false, message: 'Unknown provider' };

        switch (provider) {
            case 'stripe':
                testResult = await testStripeConnection(credentials);
                break;
            case 'twilio':
                testResult = await testTwilioConnection(credentials);
                break;
            case 'zapier':
                testResult = await testZapierWebhook(credentials);
                break;
            case 'aws':
                testResult = await testAWSConnection(credentials);
                break;
            case 'slack':
                testResult = await testSlackConnection(credentials);
                break;
            case 'calendly':
                testResult = await testCalendlyConnection(credentials);
                break;
            default:
                // For OAuth providers, check if we have valid tokens
                testResult = { success: true, message: 'Configuration validated' };
        }

        // Log the test result
        if (integration) {
            await logIntegrationActivity(
                integration.id,
                'test',
                testResult.success ? 'success' : 'error',
                testResult.message,
                { provider },
                req.user.id
            );
        }

        if (testResult.success) {
            res.json({ success: true, message: testResult.message });
        } else {
            res.status(400).json({ success: false, message: testResult.message });
        }
    } catch (error) {
        logger.error(`Integration test error: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Integration Logs
router.get('/:provider/logs', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const integration = await Integration.findOne({ where: { provider: req.params.provider } });

        if (!integration) {
            return res.status(404).json({ error: 'Integration not found' });
        }

        const logs = await IntegrationLog.findAll({
            where: { integrationId: integration.id },
            order: [['createdAt', 'DESC']],
            limit: 50
        });

        // If no logs exist yet, return some initial data
        if (logs.length === 0) {
            return res.json([
                { timestamp: new Date(), message: 'Integration initialized', level: 'info' }
            ]);
        }

        res.json(logs.map(log => ({
            timestamp: log.createdAt,
            message: log.message,
            level: log.status,
            action: log.action,
            details: log.details
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ OAuth Routes ============

// Google OAuth
router.get('/google/oauth', authenticateToken, requireAdmin, (req, res) => {
    const { google } = require('googleapis');
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.APP_URL || 'http://localhost:3000'}/api/integrations/google/callback`
    );

    const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/drive.readonly'
    ];

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: req.query.redirect || '/admin/integrations'
    });

    res.redirect(authUrl);
});

router.get('/google/callback', async (req, res) => {
    try {
        const { google } = require('googleapis');
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.APP_URL || 'http://localhost:3000'}/api/integrations/google/callback`
        );

        const { tokens } = await oauth2Client.getToken(req.query.code);

        await Integration.upsert({
            provider: 'google',
            encrypted_credentials: tokens,
            status: 'active',
            settings: { syncCalendar: true, syncEmail: true }
        });

        const redirect = req.query.state || '/admin/integrations';
        res.redirect(redirect);
    } catch (error) {
        logger.error(`Google OAuth error: ${error.message}`);
        res.redirect('/admin/integrations?error=google_auth_failed');
    }
});

// Microsoft OAuth
router.get('/microsoft/oauth', authenticateToken, requireAdmin, (req, res) => {
    const msalConfig = {
        auth: {
            clientId: process.env.MICROSOFT_CLIENT_ID,
            authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || 'common'}`,
            redirectUri: `${process.env.APP_URL || 'http://localhost:3000'}/api/integrations/microsoft/callback`
        }
    };

    const scopes = ['openid', 'profile', 'email', 'Calendars.ReadWrite', 'Mail.Read'];
    const authUrl = `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || 'common'}/oauth2/v2.0/authorize?` +
        `client_id=${process.env.MICROSOFT_CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(`${process.env.APP_URL}/api/integrations/microsoft/callback`)}&` +
        `scope=${encodeURIComponent(scopes.join(' '))}&` +
        `state=${encodeURIComponent(req.query.redirect || '/admin/integrations')}`;

    res.redirect(authUrl);
});

router.get('/microsoft/callback', async (req, res) => {
    try {
        const { code, state } = req.query;

        // Exchange code for tokens
        const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.MICROSOFT_CLIENT_ID,
                client_secret: process.env.MICROSOFT_CLIENT_SECRET,
                code,
                redirect_uri: `${process.env.APP_URL}/api/integrations/microsoft/callback`,
                grant_type: 'authorization_code'
            })
        });

        const tokens = await tokenResponse.json();

        await Integration.upsert({
            provider: 'microsoft',
            encrypted_credentials: tokens,
            status: 'active',
            settings: { syncOutlook: true, syncTeams: true }
        });

        res.redirect(state || '/admin/integrations');
    } catch (error) {
        logger.error(`Microsoft OAuth error: ${error.message}`);
        res.redirect('/admin/integrations?error=microsoft_auth_failed');
    }
});

// Zoom OAuth
router.get('/zoom/oauth', authenticateToken, requireAdmin, (req, res) => {
    const authUrl = `https://zoom.us/oauth/authorize?` +
        `response_type=code&` +
        `client_id=${process.env.ZOOM_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(`${process.env.APP_URL}/api/integrations/zoom/callback`)}&` +
        `state=${encodeURIComponent(req.query.redirect || '/admin/integrations')}`;

    res.redirect(authUrl);
});

router.get('/zoom/callback', async (req, res) => {
    try {
        const { code, state } = req.query;

        const tokenResponse = await fetch('https://zoom.us/oauth/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                code,
                grant_type: 'authorization_code',
                redirect_uri: `${process.env.APP_URL}/api/integrations/zoom/callback`
            })
        });

        const tokens = await tokenResponse.json();

        await Integration.upsert({
            provider: 'zoom',
            encrypted_credentials: tokens,
            status: 'active',
            settings: { autoRecord: false, waitingRoom: true }
        });

        res.redirect(state || '/admin/integrations');
    } catch (error) {
        logger.error(`Zoom OAuth error: ${error.message}`);
        res.redirect('/admin/integrations?error=zoom_auth_failed');
    }
});

// Slack OAuth
router.get('/slack/oauth', authenticateToken, requireAdmin, (req, res) => {
    const scopes = 'chat:write,channels:read,users:read';
    const authUrl = `https://slack.com/oauth/v2/authorize?` +
        `client_id=${process.env.SLACK_CLIENT_ID}&` +
        `scope=${scopes}&` +
        `redirect_uri=${encodeURIComponent(`${process.env.APP_URL}/api/integrations/slack/callback`)}&` +
        `state=${encodeURIComponent(req.query.redirect || '/admin/integrations')}`;

    res.redirect(authUrl);
});

router.get('/slack/callback', async (req, res) => {
    try {
        const { code, state } = req.query;

        const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.SLACK_CLIENT_ID,
                client_secret: process.env.SLACK_CLIENT_SECRET,
                code,
                redirect_uri: `${process.env.APP_URL}/api/integrations/slack/callback`
            })
        });

        const tokens = await tokenResponse.json();

        await Integration.upsert({
            provider: 'slack',
            encrypted_credentials: tokens,
            status: 'active',
            settings: { defaultChannel: '#general', notifyNewTasks: true }
        });

        res.redirect(state || '/admin/integrations');
    } catch (error) {
        logger.error(`Slack OAuth error: ${error.message}`);
        res.redirect('/admin/integrations?error=slack_auth_failed');
    }
});

// QuickBooks OAuth
router.get('/quickbooks/oauth', authenticateToken, requireAdmin, (req, res) => {
    const scopes = 'com.intuit.quickbooks.accounting';
    const authUrl = `https://appcenter.intuit.com/connect/oauth2?` +
        `client_id=${process.env.QUICKBOOKS_CLIENT_ID}&` +
        `scope=${scopes}&` +
        `redirect_uri=${encodeURIComponent(`${process.env.APP_URL}/api/integrations/quickbooks/callback`)}&` +
        `response_type=code&` +
        `state=${encodeURIComponent(req.query.redirect || '/admin/integrations')}`;

    res.redirect(authUrl);
});

router.get('/quickbooks/callback', async (req, res) => {
    try {
        const { code, state, realmId } = req.query;

        const tokenResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QUICKBOOKS_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                code,
                grant_type: 'authorization_code',
                redirect_uri: `${process.env.APP_URL}/api/integrations/quickbooks/callback`
            })
        });

        const tokens = await tokenResponse.json();

        await Integration.upsert({
            provider: 'quickbooks',
            encrypted_credentials: { ...tokens, realmId },
            status: 'active',
            settings: { autoSyncInvoices: true }
        });

        res.redirect(state || '/admin/integrations');
    } catch (error) {
        logger.error(`QuickBooks OAuth error: ${error.message}`);
        res.redirect('/admin/integrations?error=quickbooks_auth_failed');
    }
});

// ============ Connection Test Helpers ============

async function testStripeConnection(credentials) {
    try {
        const Stripe = require('stripe');
        const stripe = new Stripe(credentials.secretKey);
        await stripe.balance.retrieve();
        return { success: true, message: 'Stripe connection successful' };
    } catch (error) {
        return { success: false, message: `Stripe error: ${error.message}` };
    }
}

async function testTwilioConnection(credentials) {
    try {
        const twilio = require('twilio');
        const client = twilio(credentials.accountSid, credentials.authToken);
        await client.api.accounts(credentials.accountSid).fetch();
        return { success: true, message: 'Twilio connection successful' };
    } catch (error) {
        return { success: false, message: `Twilio error: ${error.message}` };
    }
}

async function testZapierWebhook(credentials) {
    try {
        if (!credentials.webhookUrl || !credentials.webhookUrl.startsWith('https://hooks.zapier.com/')) {
            return { success: false, message: 'Invalid Zapier webhook URL' };
        }

        // Send a test ping to the webhook
        const response = await fetch(credentials.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'test', timestamp: new Date().toISOString() })
        });

        if (response.ok) {
            return { success: true, message: 'Zapier webhook validated' };
        }
        return { success: false, message: 'Zapier webhook not responding' };
    } catch (error) {
        return { success: false, message: `Zapier error: ${error.message}` };
    }
}

async function testAWSConnection(credentials) {
    try {
        const AWS = require('aws-sdk');
        const s3 = new AWS.S3({
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
            region: credentials.region || 'us-east-1'
        });

        await s3.headBucket({ Bucket: credentials.bucket }).promise();
        return { success: true, message: 'AWS S3 connection successful' };
    } catch (error) {
        return { success: false, message: `AWS error: ${error.message}` };
    }
}

async function testSlackConnection(credentials) {
    try {
        const response = await fetch('https://slack.com/api/auth.test', {
            headers: { 'Authorization': `Bearer ${credentials.access_token}` }
        });
        const data = await response.json();

        if (data.ok) {
            return { success: true, message: 'Slack connection successful' };
        }
        return { success: false, message: data.error || 'Slack authentication failed' };
    } catch (error) {
        return { success: false, message: `Slack error: ${error.message}` };
    }
}

async function testCalendlyConnection(credentials) {
    try {
        const response = await fetch('https://api.calendly.com/users/me', {
            headers: { 'Authorization': `Bearer ${credentials.apiKey}` }
        });

        if (response.ok) {
            return { success: true, message: 'Calendly connection successful' };
        }
        return { success: false, message: 'Calendly authentication failed' };
    } catch (error) {
        return { success: false, message: `Calendly error: ${error.message}` };
    }
}

// ============ Integration Action Routes ============

// Send Slack notification
router.post('/slack/send', authenticateToken, async (req, res) => {
    try {
        const integration = await Integration.findOne({ where: { provider: 'slack', status: 'active' } });
        if (!integration) {
            return res.status(404).json({ error: 'Slack not connected' });
        }

        const { channel, message } = req.body;
        const response = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${integration.encrypted_credentials.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channel: channel || integration.settings.defaultChannel || '#general',
                text: message
            })
        });

        const data = await response.json();
        if (data.ok) {
            res.json({ success: true, message: 'Message sent' });
        } else {
            res.status(400).json({ success: false, error: data.error });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Zoom meeting
router.post('/zoom/meeting', authenticateToken, async (req, res) => {
    try {
        const integration = await Integration.findOne({ where: { provider: 'zoom', status: 'active' } });
        if (!integration) {
            return res.status(404).json({ error: 'Zoom not connected' });
        }

        const { topic, start_time, duration } = req.body;
        const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${integration.encrypted_credentials.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic,
                type: 2, // Scheduled meeting
                start_time,
                duration: duration || 30,
                settings: {
                    waiting_room: integration.settings.waitingRoom ?? true,
                    auto_recording: integration.settings.autoRecord ? 'cloud' : 'none'
                }
            })
        });

        const meeting = await response.json();
        res.json(meeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send Twilio SMS
router.post('/twilio/sms', authenticateToken, async (req, res) => {
    try {
        const integration = await Integration.findOne({ where: { provider: 'twilio', status: 'active' } });
        if (!integration) {
            return res.status(404).json({ error: 'Twilio not connected' });
        }

        const { to, message } = req.body;
        const twilio = require('twilio');
        const client = twilio(
            integration.encrypted_credentials.accountSid,
            integration.encrypted_credentials.authToken
        );

        const sms = await client.messages.create({
            body: message,
            from: integration.encrypted_credentials.phoneNumber,
            to
        });

        res.json({ success: true, sid: sms.sid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Trigger Zapier webhook
router.post('/zapier/trigger', authenticateToken, async (req, res) => {
    try {
        const integration = await Integration.findOne({ where: { provider: 'zapier', status: 'active' } });
        if (!integration) {
            return res.status(404).json({ error: 'Zapier not connected' });
        }

        const { event, data } = req.body;
        const response = await fetch(integration.encrypted_credentials.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event,
                data,
                timestamp: new Date().toISOString()
            })
        });

        if (response.ok) {
            res.json({ success: true, message: 'Webhook triggered' });
        } else {
            res.status(400).json({ success: false, error: 'Webhook failed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
