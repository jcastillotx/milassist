const express = require('express');
const router = express.Router();
const { EmailConnection, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const oauth2Service = require('../services/oauth2');
const crypto = require('crypto');

// Initiate OAuth2 flow
router.get('/auth/:provider', authenticateToken, async (req, res) => {
    try {
        const { provider } = req.params;
        if (!['gmail', 'outlook'].includes(provider)) {
            return res.status(400).json({ error: 'Invalid provider' });
        }

        const state = crypto.randomBytes(16).toString('hex');
        const redirectUri = `${process.env.APP_URL || 'http://localhost:3000'}/email/callback/${provider}`;

        // Store state in session or database for validation
        // For simplicity, we'll include userId in state (in production, use secure session)
        const stateData = `${state}:${req.user.id}`;

        const authUrl = oauth2Service.getAuthUrl(provider, redirectUri, stateData);
        res.json({ authUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// OAuth2 callback
router.get('/callback/:provider', async (req, res) => {
    try {
        const { provider } = req.params;
        const { code, state } = req.query;

        if (!code || !state) {
            return res.status(400).send('Missing code or state');
        }

        // Extract userId from state (in production, validate against stored state)
        const [stateToken, userId] = state.split(':');

        const redirectUri = `${process.env.APP_URL || 'http://localhost:3000'}/email/callback/${provider}`;
        
        // Exchange code for tokens
        const tokens = await oauth2Service.exchangeCodeForTokens(provider, code, redirectUri);
        
        // Get user email
        const email = await oauth2Service.getUserEmail(provider, tokens.access_token);

        // Store connection
        const expiryDate = new Date(Date.now() + tokens.expires_in * 1000);

        await EmailConnection.create({
            userId,
            provider,
            email,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenExpiry: expiryDate,
            status: 'active',
            scopes: tokens.scope ? tokens.scope.split(' ') : []
        });

        // Redirect to success page
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/client?email_connected=true`);
    } catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).send('Authentication failed');
    }
});

// Get connected emails
router.get('/connections', authenticateToken, async (req, res) => {
    try {
        const connections = await EmailConnection.findAll({
            where: { userId: req.user.id },
            attributes: ['id', 'provider', 'email', 'status', 'createdAt']
        });
        res.json(connections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Disconnect email
router.delete('/connections/:id', authenticateToken, async (req, res) => {
    try {
        const connection = await EmailConnection.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!connection) {
            return res.status(404).json({ error: 'Connection not found' });
        }

        connection.status = 'disconnected';
        await connection.save();

        res.json({ message: 'Email disconnected' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get messages (for assistants managing client inbox)
router.get('/messages/:clientId', authenticateToken, async (req, res) => {
    try {
        // Only assistants can access this
        if (req.user.role !== 'assistant' && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const connection = await EmailConnection.findOne({
            where: { userId: req.params.clientId, status: 'active' }
        });

        if (!connection) {
            return res.status(404).json({ error: 'No email connection found' });
        }

        // Mock email messages (in production, call Gmail/Outlook API)
        const mockMessages = [
            {
                id: '1',
                from: 'sender@example.com',
                subject: 'Meeting Request',
                snippet: 'Can we schedule a call for next week?',
                date: new Date().toISOString(),
                isRead: false
            },
            {
                id: '2',
                from: 'info@company.com',
                subject: 'Invoice #12345',
                snippet: 'Please find attached your invoice...',
                date: new Date(Date.now() - 86400000).toISOString(),
                isRead: true
            }
        ];

        res.json({ provider: connection.provider, email: connection.email, messages: mockMessages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send email (assistant sending on behalf of client)
router.post('/send/:clientId', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'assistant' && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { to, subject, body } = req.body;
        const connection = await EmailConnection.findOne({
            where: { userId: req.params.clientId, status: 'active' }
        });

        if (!connection) {
            return res.status(404).json({ error: 'No email connection found' });
        }

        // Mock sending (in production, use Gmail/Outlook API)
        console.log(`[Email] Sending from ${connection.email} to ${to}: ${subject}`);

        res.json({ message: 'Email sent successfully', messageId: `mock_${Date.now()}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
