const express = require('express');
const router = express.Router();
const { Trip } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get Client Trips
router.get('/', authenticateToken, async (req, res) => {
    try {
        const where = {};
        if (req.user.role === 'client') where.clientId = req.user.id;
        // Assistants might see trips for their assigned clients eventually

        const trips = await Trip.findAll({ where });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Trip
router.post('/', authenticateToken, async (req, res) => {
    if (req.user.role !== 'client') return res.sendStatus(403);
    try {
        const trip = await Trip.create({
            ...req.body,
            clientId: req.user.id
        });
        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
