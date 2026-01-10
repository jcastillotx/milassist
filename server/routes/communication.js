const express = require('express');
const router = express.Router();
const { Call, RoutingRule, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get Call Logs
router.get('/logs', authenticateToken, async (req, res) => {
    try {
        const where = {};
        if (req.user.role === 'client') where.clientId = req.user.id;
        // Assistants might see calls for their clients

        const calls = await Call.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });
        res.json(calls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Routing Rules
router.get('/rules', authenticateToken, async (req, res) => {
    try {
        const where = {};
        if (req.user.role === 'client') where.clientId = req.user.id;

        const rule = await RoutingRule.findOne({ where });
        res.json(rule || {}); // Return empty obj if no rule set
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Routing Rules
router.post('/rules', authenticateToken, async (req, res) => {
    if (req.user.role !== 'client') return res.sendStatus(403);
    try {
        const [rule, created] = await RoutingRule.findOrCreate({
            where: { clientId: req.user.id },
            defaults: { ...req.body, clientId: req.user.id }
        });

        if (!created) {
            await rule.update(req.body);
        }
        res.json(rule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mock Incoming Call (for demo purposes testing routing)
router.post('/incoming-mock', async (req, res) => {
    // This would effectively test the routing logic API
    res.json({ status: 'called', logic: 'forwarded_to_assistant' });
});

module.exports = router;
