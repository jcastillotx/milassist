const express = require('express');
const router = express.Router();
const { TimeEntry, Task, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get Time Logs
router.get('/', authenticateToken, async (req, res) => {
    try {
        const where = {};
        if (req.user.role === 'assistant') where.assistantId = req.user.id;
        else if (req.user.role === 'client') where.clientId = req.user.id;

        const logs = await TimeEntry.findAll({
            where,
            include: [
                { model: Task, attributes: ['title'] },
                { model: User, as: 'client', attributes: ['name'] }
            ],
            order: [['startTime', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Timer
router.post('/start', authenticateToken, async (req, res) => {
    if (req.user.role !== 'assistant') return res.sendStatus(403);
    try {
        // Stop any running timer first
        const running = await TimeEntry.findOne({
            where: { assistantId: req.user.id, endTime: null }
        });
        if (running) {
            running.endTime = new Date();
            running.duration_seconds = Math.round((running.endTime - running.startTime) / 1000);
            await running.save();
        }

        const { description, taskId, clientId } = req.body;
        const entry = await TimeEntry.create({
            assistantId: req.user.id,
            startTime: new Date(),
            description,
            taskId,
            clientId
        });
        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Stop Timer
router.post('/stop', authenticateToken, async (req, res) => {
    if (req.user.role !== 'assistant') return res.sendStatus(403);
    try {
        const entry = await TimeEntry.findOne({
            where: { assistantId: req.user.id, endTime: null }
        });

        if (!entry) return res.status(404).json({ error: 'No active timer' });

        entry.endTime = new Date();
        entry.duration_seconds = Math.round((entry.endTime - entry.startTime) / 1000);
        await entry.save();

        res.json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Current Running Timer
router.get('/current', authenticateToken, async (req, res) => {
    try {
        const entry = await TimeEntry.findOne({
            where: { assistantId: req.user.id, endTime: null }
        });
        res.json(entry || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
