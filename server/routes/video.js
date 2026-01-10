const express = require('express');
const router = express.Router();
const { VideoIntegration, Meeting, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const videoService = require('../services/video');
const crypto = require('crypto');

// Initiate OAuth2 flow for video provider
router.get('/auth/:provider', authenticateToken, async (req, res) => {
    try {
        const { provider } = req.params;
        if (!['zoom', 'meet', 'webex', 'teams'].includes(provider)) {
            return res.status(400).json({ error: 'Invalid provider' });
        }

        const state = `${crypto.randomBytes(16).toString('hex')}:${req.user.id}`;
        const redirectUri = `${process.env.APP_URL || 'http://localhost:3000'}/video/callback/${provider}`;

        const authUrl = videoService.getAuthUrl(provider, redirectUri, state);
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
        const tokens = await videoService.exchangeCodeForTokens(provider, code);

        const expiryDate = new Date(Date.now() + tokens.expires_in * 1000);

        await VideoIntegration.create({
            userId,
            provider,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenExpiry: expiryDate,
            status: 'active'
        });

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/client?video_connected=true`);
    } catch (error) {
        console.error('Video OAuth callback error:', error);
        res.status(500).send('Authentication failed');
    }
});

// Get connected video providers
router.get('/connections', authenticateToken, async (req, res) => {
    try {
        const connections = await VideoIntegration.findAll({
            where: { userId: req.user.id },
            attributes: ['id', 'provider', 'status', 'createdAt']
        });
        res.json(connections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Disconnect video provider
router.delete('/connections/:id', authenticateToken, async (req, res) => {
    try {
        const connection = await VideoIntegration.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!connection) {
            return res.status(404).json({ error: 'Connection not found' });
        }

        connection.status = 'disconnected';
        await connection.save();

        res.json({ message: 'Video provider disconnected' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
