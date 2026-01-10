const express = require('express');
const router = express.Router();
const { Resource } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get Resources
router.get('/', authenticateToken, async (req, res) => {
    try {
        const resources = await Resource.findAll({ where: { is_public: true } });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Resource (Admin Only)
router.post('/', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    try {
        const resource = await Resource.create(req.body);
        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
