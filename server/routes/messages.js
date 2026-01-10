const express = require('express');
const router = express.Router();
const { Message, User, Sequelize } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get Conversation History
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        // For now, simple logic: get all messages where user is sender OR receiver
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            order: [['createdAt', 'ASC']],
            include: [
                { model: User, as: 'sender', attributes: ['name', 'role'] },
                { model: User, as: 'receiver', attributes: ['name', 'role'] }
            ]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send Message
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        // In a real app, we'd validate receiverId exists and is associated with the user

        const message = await Message.create({
            senderId: req.user.id,
            receiverId,
            content
        });

        // In a real app, here we would trigger a socket.io event

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
