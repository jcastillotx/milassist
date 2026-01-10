const express = require('express');
const router = express.Router();
const { Invoice, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get My Invoices
router.get('/', authenticateToken, async (req, res) => {
    try {
        const where = {};
        if (req.user.role === 'client') where.clientId = req.user.id;
        else if (req.user.role === 'assistant') where.assistantId = req.user.id;
        // Admins see all

        const invoices = await Invoice.findAll({ where });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Invoice (Admin Only)
router.post('/', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    try {
        const { clientId, assistantId, amount, description, due_date } = req.body;
        const invoice = await Invoice.create({
            clientId,
            assistantId,
            amount,
            description,
            due_date
        });
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
