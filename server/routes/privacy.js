const express = require('express');
const router = express.Router();
const { PrivacyRequest } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get My Requests
router.get('/', authenticateToken, async (req, res) => {
    try {
        const requests = await PrivacyRequest.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit Request
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { type, reason } = req.body;

        // Check for existing pending request of same type
        const existing = await PrivacyRequest.findOne({
            where: {
                userId: req.user.id,
                type,
                status: ['PENDING', 'PROCESSING']
            }
        });

        if (existing) {
            return res.status(400).json({ error: `A ${type} request is already in progress.` });
        }

        const request = await PrivacyRequest.create({
            userId: req.user.id,
            type,
            reason
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
