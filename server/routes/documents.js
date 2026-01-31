const express = require('express');
const router = express.Router();
const { Document, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { upload, deleteFromS3, getSignedUrl } = require('../config/storage');
const { validate, validators } = require('../middleware/validation');
const { logger } = require('../config/logger');

// GET all documents (with access control)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const where = {};
        
        // Filter by role
        if (req.user.role === 'client') {
            where.clientId = req.user.id;
        } else if (req.user.role === 'assistant') {
            where.assistantId = req.user.id;
        }
        // Admin sees all

        const documents = await Document.findAll({ 
            where,
            include: [{ model: User, as: 'client', attributes: ['name'] }]
        });
        
        // Generate signed URLs for S3 documents
        for (let doc of documents) {
            if (doc.url && doc.url.includes('amazonaws.com')) {
                const key = doc.url.split('.com/')[1];
                doc.url = await getSignedUrl(key);
            }
        }
        
        res.json(documents);
    } catch (error) {
        logger.error('Error fetching documents:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Upload new document
router.post('/', authenticateToken, upload.single('file'), validate(validators.documentMetadata), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { title, type, description } = req.body;
        
        // Get file URL (S3 or local)
        const fileUrl = req.file.location || `/uploads/${req.file.filename}`;
        
        const document = await Document.create({
            title,
            type,
            description,
            url: fileUrl,
            status: 'draft',
            clientId: req.user.role === 'client' ? req.user.id : req.body.clientId,
            uploadedBy: req.user.id,
        });

        logger.info(`Document uploaded: ${document.id} by user ${req.user.id}`);
        res.status(201).json(document);
    } catch (error) {
        logger.error('Error uploading document:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET single document
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const document = await Document.findByPk(req.params.id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Access control
        if (req.user.role !== 'admin' && 
            document.clientId !== req.user.id && 
            document.assistantId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Generate signed URL for S3
        if (document.url && document.url.includes('amazonaws.com')) {
            const key = document.url.split('.com/')[1];
            document.url = await getSignedUrl(key);
        }

        res.json(document);
    } catch (error) {
        logger.error('Error fetching document:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add Comment
router.post('/:id/comments', authenticateToken, async (req, res) => {
    try {
        const doc = await Document.findByPk(req.params.id);
        if (!doc) return res.status(404).json({ error: 'Document not found' });

        const comments = doc.comments || [];
        comments.push({
            user: req.user.name,
            text: req.body.text,
            date: new Date()
        });
        doc.comments = comments;
        
        // Update status if provided
        if (req.body.status) {
            doc.status = req.body.status;
        }
        
        await doc.save();
        logger.info(`Comment added to document ${doc.id} by ${req.user.name}`);
        res.json(doc);
    } catch (error) {
        logger.error('Error adding comment:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE document
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const document = await Document.findByPk(req.params.id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Only admin or uploader can delete
        if (req.user.role !== 'admin' && document.uploadedBy !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Delete from S3 if applicable
        if (document.url && document.url.includes('amazonaws.com')) {
            await deleteFromS3(document.url);
        }

        await document.destroy();
        logger.info(`Document deleted: ${document.id} by user ${req.user.id}`);
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        logger.error('Error deleting document:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
