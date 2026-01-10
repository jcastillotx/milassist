const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Mock AI Service Integration

// Chat Endpoint (Text + Image)
router.post('/chat', authenticateToken, async (req, res) => {
    try {
        const { message, image } = req.body;

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        let reply = "I'm processing your request using MilAssist Intelligence.";

        if (image) {
            reply = "I see you've uploaded an image. Based on my visual analysis, this appears to be a financial document. I can extract the total amount for you.";
        } else if (message.toLowerCase().includes('flight')) {
            reply = "I can help you with travel. Would you like me to draft a new itinerary for your upcoming trip?";
        } else {
            reply = `I understand you said: "${message}". How can I assist you further with your tasks today?`;
        }

        res.json({ reply, timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Document Analysis Endpoint
router.post('/analyze-doc', authenticateToken, async (req, res) => {
    try {
        const { docId } = req.body;
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        res.json({
            summary: "This document is a standard Service Agreement. It outlines the scope of work, payment terms (Net 30), and confidentiality clauses.",
            risks: ["Clause 4.2 has an indefinite liability period", "Missing termination date"],
            compliance: "mostly_compliant"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
