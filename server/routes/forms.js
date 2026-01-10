const express = require('express');
const router = express.Router();
const { FormTemplate, ServiceRequest, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// --- Templates ---

// Get All Form Templates (Public/All)
router.get('/templates', async (req, res) => {
    try {
        const templates = await FormTemplate.findAll({ where: { is_active: true } });
        res.json(templates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Form Template (Admin Only)
router.post('/templates', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    try {
        const template = await FormTemplate.create(req.body);
        res.status(201).json(template);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Service Requests ---

// Get Requests
router.get('/requests', authenticateToken, async (req, res) => {
    try {
        const where = {};
        if (req.user.role === 'client') where.clientId = req.user.id;
        // Assistants might see requests assigned to them eventually, keeping simple for now

        const requests = await ServiceRequest.findAll({
            where,
            include: [
                { model: FormTemplate, attributes: ['title'] },
                { model: User, as: 'client', attributes: ['name'] }
            ]
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit Request (Client)
router.post('/requests', authenticateToken, async (req, res) => {
    if (req.user.role !== 'client') return res.sendStatus(403);
    try {
        const { formTemplateId, submission_data } = req.body;
        const request = await ServiceRequest.create({
            clientId: req.user.id,
            formTemplateId,
            submission_data
        });
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
