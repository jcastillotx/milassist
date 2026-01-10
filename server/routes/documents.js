const express = require('express');
const router = express.Router();
const { Document, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get Documents
router.get('/', authenticateToken, async (req, res) => {
    try {
        const where = {};
        if (req.user.role === 'client') where.clientId = req.user.id;

        const docs = await Document.findAll({
            where,
            include: [{ model: User, as: 'client', attributes: ['name'] }]
        });
        res.json(docs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload Document (Mock)
router.post('/', authenticateToken, async (req, res) => {
    if (req.user.role !== 'client') return res.sendStatus(403);
    try {
        // In real app, handle file upload here
        const doc = await Document.create({
            ...req.body,
            clientId: req.user.id,
            url: 'https://example.com/mock-doc.pdf' // Placeholder
        });
        res.status(201).json(doc);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Comment
router.post('/:id/comments', authenticateToken, async (req, res) => {
    try {
        const doc = await Document.findByPk(req.params.id);
        if (!doc) return res.status(404).json({ error: 'Not found' });

        const newComment = {
            user: req.user.name || 'User',
            text: req.body.text,
            date: new Date()
        };

        // Parse existing, add new, save
        const comments = doc.comments || [];
        doc.comments = [...comments, newComment];

        if (req.body.status) doc.status = req.body.status;

        await doc.save();
        res.json(doc);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
