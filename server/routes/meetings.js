const express = require('express');
const router = express.Router();
const { Meeting, VideoIntegration, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const videoService = require('../services/video');

// Create meeting
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { clientId, title, description, startTime, endTime, provider } = req.body;

        // Get video integration for the user
        const integration = await VideoIntegration.findOne({
            where: { userId: req.user.id, provider, status: 'active' }
        });

        if (!integration) {
            return res.status(404).json({ error: `No ${provider} connection found. Please connect first.` });
        }

        // Create meeting via provider API
        const meetingDetails = await videoService.createMeeting(provider, integration.accessToken, {
            title,
            startTime,
            endTime
        });

        // Store meeting in database
        const meeting = await Meeting.create({
            clientId: clientId || req.user.id,
            assistantId: req.user.role === 'assistant' ? req.user.id : null,
            title,
            description,
            startTime,
            endTime,
            provider,
            meetingUrl: meetingDetails.meetingUrl,
            meetingId: meetingDetails.meetingId,
            passcode: meetingDetails.passcode,
            status: 'scheduled'
        });

        res.json(meeting);
    } catch (error) {
        console.error('Meeting creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get meetings
router.get('/', authenticateToken, async (req, res) => {
    try {
        const where = {};
        
        if (req.user.role === 'client') {
            where.clientId = req.user.id;
        } else if (req.user.role === 'assistant') {
            where.assistantId = req.user.id;
        }
        // Admins see all

        const meetings = await Meeting.findAll({
            where,
            include: [
                { model: User, as: 'client', attributes: ['name', 'email'] },
                { model: User, as: 'assistant', attributes: ['name', 'email'] }
            ],
            order: [['startTime', 'ASC']]
        });

        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel meeting
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const meeting = await Meeting.findByPk(req.params.id);

        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        // Check permissions
        if (req.user.role !== 'admin' && 
            meeting.clientId !== req.user.id && 
            meeting.assistantId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        meeting.status = 'cancelled';
        await meeting.save();

        res.json({ message: 'Meeting cancelled' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
