const express = require('express');
const router = express.Router();
const { Task, User, TaskHandoff } = require('../models');
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

// Hand off task to another assistant
router.post('/:id/handoff', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'assistant' && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Only assistants can hand off tasks' });
        }

        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Verify current user is assigned to this task (or is admin)
        if (req.user.role === 'assistant' && task.assistantId !== req.user.id) {
            return res.status(403).json({ error: 'You are not assigned to this task' });
        }

        const { toAssistantId, notes } = req.body;

        // Verify new assistant exists and is an assistant
        const newAssistant = await User.findByPk(toAssistantId);
        if (!newAssistant || newAssistant.role !== 'assistant') {
            return res.status(400).json({ error: 'Invalid assistant' });
        }

        // Create handoff record
        const handoff = await TaskHandoff.create({
            taskId: task.id,
            fromAssistantId: task.assistantId,
            toAssistantId,
            notes,
            status: 'accepted'
        });

        // Update task assignment
        task.assistantId = toAssistantId;
        await task.save();

        res.json({ message: 'Task handed off successfully', handoff, task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get handoff history for a task
router.get('/:id/handoffs', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        const handoffs = await TaskHandoff.findAll({
            where: { taskId: req.params.id },
            include: [
                { model: User, as: 'fromAssistant', attributes: ['name', 'email'] },
                { model: User, as: 'toAssistant', attributes: ['name', 'email'] }
            ],
            order: [['handoffDate', 'DESC']]
        });

        res.json(handoffs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get available assistants for handoff
router.get('/assistants/available', authenticateToken, async (req, res) => {
    try {
        const assistants = await User.findAll({
            where: { role: 'assistant' },
            attributes: ['id', 'name', 'email']
        });
        res.json(assistants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
