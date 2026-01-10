const express = require('express');
const router = express.Router();
const { CalendarConnection } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const calendarService = require('../services/calendar');
const crypto = require('crypto');

// Initiate OAuth2 flow for calendar
router.get('/auth/:provider', authenticateToken, async (req, res) => {
    try {
        const { provider } = req.params;
        if (!['google', 'outlook'].includes(provider)) {
            return res.status(400).json({ error: 'Invalid provider' });
        }

        const state = `${crypto.randomBytes(16).toString('hex')}:${req.user.id}`;
        const redirectUri = `${process.env.APP_URL || 'http://localhost:3000'}/calendar/callback/${provider}`;

        const authUrl = calendarService.getAuthUrl(provider, redirectUri, state);
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

        const [stateToken, userId] = state.split(':');
        const tokens = await calendarService.exchangeCodeForTokens(provider, code);

        const expiryDate = new Date(Date.now() + tokens.expires_in * 1000);

        await CalendarConnection.create({
            userId,
            provider,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenExpiry: expiryDate,
            calendarId: 'primary',
            status: 'active'
        });

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/client?calendar_connected=true`);
    } catch (error) {
        console.error('Calendar OAuth callback error:', error);
        res.status(500).send('Authentication failed');
    }
});

// Get calendar connections
router.get('/connections', authenticateToken, async (req, res) => {
    try {
        const connections = await CalendarConnection.findAll({
            where: { userId: req.user.id },
            attributes: ['id', 'provider', 'status', 'createdAt']
        });
        res.json(connections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get calendar events
router.get('/events', authenticateToken, async (req, res) => {
    try {
        const connection = await CalendarConnection.findOne({
            where: { userId: req.user.id, status: 'active' }
        });

        if (!connection) {
            return res.status(404).json({ error: 'No calendar connected' });
        }

        const events = await calendarService.getEvents(
            connection.provider,
            connection.accessToken,
            new Date(),
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
        );

        res.json({ provider: connection.provider, events });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create calendar event
router.post('/events', authenticateToken, async (req, res) => {
    try {
        const { title, start, end, description } = req.body;

        const connection = await CalendarConnection.findOne({
            where: { userId: req.user.id, status: 'active' }
        });

        if (!connection) {
            return res.status(404).json({ error: 'No calendar connected' });
        }

        const event = await calendarService.createEvent(connection.provider, connection.accessToken, {
            title,
            start,
            end,
            description
        });

        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
