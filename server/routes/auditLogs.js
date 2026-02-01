const express = require('express');
const router = express.Router();
const AuditLogService = require('../services/auditLog');
const { AuditLog } = require('../models');
const { Op } = require('sequelize');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @route   GET /api/audit-logs
 * @desc    Get audit logs with filtering and pagination
 * @access  Admin only
 */
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const {
      userId,
      eventType,
      severity,
      resourceType,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    // Build filter
    const where = {};
    
    if (userId) where.userId = userId;
    if (eventType) where.eventType = eventType;
    if (severity) where.severity = severity;
    if (resourceType) where.resourceType = resourceType;
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    // Query with pagination
    const offset = (page - 1) * limit;
    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [
        { association: 'user', attributes: ['id', 'email', 'name'] },
        { association: 'targetUser', attributes: ['id', 'email', 'name'] }
      ]
    });

    res.json({
      logs: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

/**
 * @route   GET /api/audit-logs/event-types
 * @desc    Get all available event types
 * @access  Admin only
 */
router.get('/event-types', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const eventTypes = Object.keys(AuditLogService.EVENT_TYPES);
    res.json({ eventTypes });
  } catch (error) {
    console.error('Error fetching event types:', error);
    res.status(500).json({ error: 'Failed to fetch event types' });
  }
});

/**
 * @route   GET /api/audit-logs/stats
 * @desc    Get audit log statistics
 * @access  Admin only
 */
router.get('/stats', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    // Count by severity
    const bySeverity = await AuditLog.count({
      where,
      group: ['severity']
    });

    // Count by event type
    const byEventType = await AuditLog.count({
      where,
      group: ['eventType'],
      order: [[AuditLog.sequelize.fn('COUNT', '*'), 'DESC']],
      limit: 10
    });

    // Total count
    const total = await AuditLog.count({ where });

    res.json({
      total,
      bySeverity,
      byEventType
    });
  } catch (error) {
    console.error('Error fetching audit log stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * @route   GET /api/audit-logs/user/:userId
 * @desc    Get audit logs for a specific user
 * @access  Admin or own user
 */
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Permission check: Only admin or the user themselves can view their logs
    if (req.user.id !== userId && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied. You can only view your own audit logs or be an admin.'
      });
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await AuditLog.findAndCountAll({
      where: {
        [Op.or]: [
          { userId },
          { targetUserId: userId }
        ]
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [
        { association: 'user', attributes: ['id', 'email', 'name'] },
        { association: 'targetUser', attributes: ['id', 'email', 'name'] }
      ]
    });

    res.json({
      logs: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch user audit logs' });
  }
});

/**
 * @route   GET /api/audit-logs/security-incidents
 * @desc    Get recent security incidents
 * @access  Admin only
 */
router.get('/security-incidents', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const incidents = await AuditLog.findAll({
      where: {
        eventType: {
          [Op.in]: [
            AuditLogService.EVENT_TYPES.SECURITY_INCIDENT,
            AuditLogService.EVENT_TYPES.SUSPICIOUS_ACTIVITY,
            AuditLogService.EVENT_TYPES.ACCOUNT_LOCKED,
            AuditLogService.EVENT_TYPES.LOGIN_FAILED
          ]
        }
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      include: [
        { association: 'user', attributes: ['id', 'email', 'name'] }
      ]
    });

    res.json({ incidents });
  } catch (error) {
    console.error('Error fetching security incidents:', error);
    res.status(500).json({ error: 'Failed to fetch security incidents' });
  }
});

/**
 * @route   POST /api/audit-logs/export
 * @desc    Export audit logs (for GDPR/CCPA compliance)
 * @access  Admin only
 */
router.post('/export', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { userId, startDate, endDate, format = 'json' } = req.body;

    const where = {};
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const logs = await AuditLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        { association: 'user', attributes: ['id', 'email', 'name'] },
        { association: 'targetUser', attributes: ['id', 'email', 'name'] }
      ]
    });

    // Log the export action
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.DATA_EXPORTED,
      userId: req.user?.id,
      targetUserId: userId,
      resourceType: 'AuditLog',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        recordCount: logs.length,
        dateRange: { startDate, endDate },
        format
      }
    });

    if (format === 'csv') {
      // Convert to CSV format
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');

      // Create CSV header
      const headers = ['ID', 'Event Type', 'Severity', 'User ID', 'User Email', 'Target User ID', 'Resource Type', 'Resource ID', 'IP Address', 'Timestamp', 'Details'];
      const csvRows = [headers.join(',')];

      // Add data rows
      logs.forEach(log => {
        const row = [
          log.id,
          log.eventType,
          log.severity,
          log.userId || '',
          log.user?.email || '',
          log.targetUserId || '',
          log.resourceType || '',
          log.resourceId || '',
          log.ipAddress || '',
          log.createdAt,
          JSON.stringify(log.details || {}).replace(/,/g, ';') // Escape commas in JSON
        ];
        csvRows.push(row.map(field => `"${field}"`).join(','));
      });

      res.send(csvRows.join('\n'));
    } else {
      res.json(logs);
    }
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    res.status(500).json({ error: 'Failed to export audit logs' });
  }
});

/**
 * @route   POST /api/audit-logs/archive
 * @desc    Manually trigger archival of old logs
 * @access  Admin only
 */
router.post('/archive', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await AuditLogService.archiveOldLogs();
    
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.SETTINGS_CHANGED,
      userId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        action: 'manual_archive_triggered',
        result
      }
    });

    res.json({
      success: true,
      message: 'Archive process completed',
      result
    });
  } catch (error) {
    console.error('Error archiving logs:', error);
    res.status(500).json({ error: 'Failed to archive logs' });
  }
});

module.exports = router;
