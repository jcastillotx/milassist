const express = require('express');
const router = express.Router();
const { Integration } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Middleware to ensure Admin access
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    next();
};

// Get All Integrations (Admin Only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const integrations = await Integration.findAll({
            attributes: { exclude: ['encrypted_credentials'] } // Don't return secrets
        });
        res.json(integrations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create/Update Integration
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { provider, credentials, settings, status } = req.body;

        // Simple find or create based on provider
        const [integration, created] = await Integration.findOrCreate({
            where: { provider },
            defaults: {
                encrypted_credentials: credentials, // In real app, encrypt this!
                settings,
                status
            }
        });

        if (!created) {
            if (credentials) integration.encrypted_credentials = credentials;
            if (settings) integration.settings = settings;
            if (status) integration.status = status;
            await integration.save();
        }

        res.json({ message: 'Integration saved', provider: integration.provider });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
