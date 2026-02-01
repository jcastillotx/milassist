const express = require('express');
const router = express.Router();
const { Alert, AuditLog } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../config/logger');
const { Op } = require('sequelize');

// Middleware to ensure Admin access
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    next();
};

// Get all active alerts (Admin Only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { status = 'active', limit = 50 } = req.query;

        const whereClause = {};
        if (status !== 'all') {
            whereClause.status = status;
        }

        // Also filter out expired alerts
        whereClause[Op.or] = [
            { expiresAt: null },
            { expiresAt: { [Op.gt]: new Date() } }
        ];

        const alerts = await Alert.findAll({
            where: whereClause,
            order: [
                ['priority', 'DESC'],
                ['createdAt', 'DESC']
            ],
            limit: parseInt(limit)
        });

        res.json(alerts);
    } catch (error) {
        logger.error(`Error fetching alerts: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Get alert history (including dismissed)
router.get('/history', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { limit = 100, offset = 0 } = req.query;

        const alerts = await Alert.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            alerts: alerts.rows,
            total: alerts.count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        logger.error(`Error fetching alert history: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Create a new alert
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { type, title, description, action, actionUrl, priority, metadata, expiresAt } = req.body;

        const alert = await Alert.create({
            type: type || 'info',
            title,
            description,
            action,
            actionUrl,
            priority: priority || 'normal',
            metadata: metadata || {},
            expiresAt
        });

        // Log the alert creation
        await AuditLog.create({
            userId: req.user.id,
            action: 'alert_created',
            resource: 'Alert',
            resourceId: alert.id,
            details: { title, type, priority },
            ipAddress: req.ip
        });

        logger.info(`Alert created: ${title}`);
        res.status(201).json(alert);
    } catch (error) {
        logger.error(`Error creating alert: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Dismiss an alert
router.post('/:id/dismiss', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const alert = await Alert.findByPk(id);
        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        // Update the alert status
        alert.status = 'dismissed';
        alert.dismissedAt = new Date();
        alert.dismissedBy = req.user.id;
        await alert.save();

        // Log the dismissal in audit log
        await AuditLog.create({
            userId: req.user.id,
            action: 'alert_dismissed',
            resource: 'Alert',
            resourceId: alert.id,
            details: {
                title: alert.title,
                type: alert.type,
                dismissedAt: alert.dismissedAt
            },
            ipAddress: req.ip
        });

        logger.info(`Alert dismissed: ${alert.title} by user ${req.user.id}`);
        res.json({ message: 'Alert dismissed successfully', alert });
    } catch (error) {
        logger.error(`Error dismissing alert: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Resolve an alert (mark as resolved rather than dismissed)
router.post('/:id/resolve', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { resolution } = req.body;

        const alert = await Alert.findByPk(id);
        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        alert.status = 'resolved';
        alert.dismissedAt = new Date();
        alert.dismissedBy = req.user.id;
        alert.metadata = { ...alert.metadata, resolution };
        await alert.save();

        // Log the resolution
        await AuditLog.create({
            userId: req.user.id,
            action: 'alert_resolved',
            resource: 'Alert',
            resourceId: alert.id,
            details: {
                title: alert.title,
                type: alert.type,
                resolution
            },
            ipAddress: req.ip
        });

        logger.info(`Alert resolved: ${alert.title}`);
        res.json({ message: 'Alert resolved successfully', alert });
    } catch (error) {
        logger.error(`Error resolving alert: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Delete an alert permanently
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const alert = await Alert.findByPk(id);
        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        const alertTitle = alert.title;
        await alert.destroy();

        // Log the deletion
        await AuditLog.create({
            userId: req.user.id,
            action: 'alert_deleted',
            resource: 'Alert',
            resourceId: id,
            details: { title: alertTitle },
            ipAddress: req.ip
        });

        logger.info(`Alert deleted: ${alertTitle}`);
        res.json({ message: 'Alert deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting alert: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Bulk dismiss alerts
router.post('/bulk-dismiss', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { alertIds } = req.body;

        if (!alertIds || !Array.isArray(alertIds)) {
            return res.status(400).json({ error: 'alertIds array is required' });
        }

        const result = await Alert.update(
            {
                status: 'dismissed',
                dismissedAt: new Date(),
                dismissedBy: req.user.id
            },
            {
                where: { id: alertIds }
            }
        );

        // Log the bulk dismissal
        await AuditLog.create({
            userId: req.user.id,
            action: 'alerts_bulk_dismissed',
            resource: 'Alert',
            details: { count: result[0], alertIds },
            ipAddress: req.ip
        });

        logger.info(`${result[0]} alerts dismissed by user ${req.user.id}`);
        res.json({ message: `${result[0]} alerts dismissed successfully` });
    } catch (error) {
        logger.error(`Error bulk dismissing alerts: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Get alert stats
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [active, dismissed, resolved] = await Promise.all([
            Alert.count({ where: { status: 'active' } }),
            Alert.count({ where: { status: 'dismissed' } }),
            Alert.count({ where: { status: 'resolved' } })
        ]);

        const urgentCount = await Alert.count({
            where: {
                status: 'active',
                priority: 'urgent'
            }
        });

        res.json({
            active,
            dismissed,
            resolved,
            total: active + dismissed + resolved,
            urgent: urgentCount
        });
    } catch (error) {
        logger.error(`Error fetching alert stats: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
