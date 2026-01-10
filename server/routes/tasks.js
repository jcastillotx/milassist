const express = require('express');
const router = express.Router();
const { Task, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get Tasks
router.get('/', authenticateToken, async (req, res) => {
    try {
        const where = {};
        if (req.user.role === 'client') where.clientId = req.user.id;
        else if (req.user.role === 'assistant') where.assistantId = req.user.id;
        // Admins see all

        const tasks = await Task.findAll({
            where,
            include: [
                { model: User, as: 'client', attributes: ['name'] },
                { model: User, as: 'assistant', attributes: ['name'] }
            ]
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Task (Client or Admin)
router.post('/', authenticateToken, async (req, res) => {
    if (req.user.role === 'assistant') return res.sendStatus(403);

    try {
        const { title, description, due_date, priority, assistantId } = req.body;
        const clientId = req.user.role === 'client' ? req.user.id : req.body.clientId;

        const task = await Task.create({
            title, description, due_date, priority, clientId, assistantId
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Task (Status/Assignment)
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Permission check: simplified for demo
        // In real app, verify user owns the task or is assigned

        const { status, assistantId } = req.body;
        if (status) task.status = status;
        if (assistantId && req.user.role === 'admin') task.assistantId = assistantId;

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
