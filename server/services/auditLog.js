/**
 * SOC2 Compliance - Comprehensive Audit Logging System
 * Tracks all security-relevant events for compliance
 */

const { logger } = require('../config/logger');

class AuditLogService {
  static EVENT_TYPES = {
    // Authentication events
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    USER_LOGIN_FAILED: 'user_login_failed',
    PASSWORD_CHANGED: 'password_changed',
    PASSWORD_RESET_REQUESTED: 'password_reset_requested',
    MFA_ENABLED: 'mfa_enabled',
    MFA_DISABLED: 'mfa_disabled',
    
    // Access control events
    PERMISSION_GRANTED: 'permission_granted',
    PERMISSION_REVOKED: 'permission_revoked',
    ROLE_ASSIGNED: 'role_assigned',
    ROLE_REMOVED: 'role_removed',
    ACCESS_DENIED: 'access_denied',
    RESOURCE_ACCESSED: 'resource_accessed',
    
    // Data events
    DATA_CREATED: 'data_created',
    DATA_UPDATED: 'data_updated',
    DATA_DELETED: 'data_deleted',
    DATA_EXPORTED: 'data_exported',
    DATA_IMPORTED: 'data_imported',
    
    // Security events
    SECURITY_INCIDENT: 'security_incident',
    UNUSUAL_ACTIVITY: 'unusual_activity',
    ACCOUNT_LOCKED: 'account_locked',
    ACCOUNT_UNLOCKED: 'account_unlocked',
    IP_BLOCKED: 'ip_blocked',
    
    // Compliance events
    GDPR_REQUEST: 'gdpr_request',
    DATA_RETENTION_PURGE: 'data_retention_purge',
    ENCRYPTION_KEY_ROTATED: 'encryption_key_rotated',
    BACKUP_CREATED: 'backup_created',
    BACKUP_RESTORED: 'backup_restored',
    
    // Administrative events
    SYSTEM_CONFIG_CHANGED: 'system_config_changed',
    USER_CREATED: 'user_created',
    USER_DELETED: 'user_deleted',
    INTEGRATION_CONNECTED: 'integration_connected',
    INTEGRATION_DISCONNECTED: 'integration_disconnected',
  };

  static SEVERITY = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    CRITICAL: 'critical',
  };

  /**
   * Log an audit event
   * @param {object} event - Event details
   */
  static async log(event) {
    const {
      eventType,
      severity = this.SEVERITY.INFO,
      userId,
      targetUserId = null,
      resourceType = null,
      resourceId = null,
      action,
      outcome,
      ipAddress,
      userAgent,
      details = {},
      timestamp = new Date(),
    } = event;

    try {
      const AuditLog = require('../models/AuditLog');
      
      const auditEntry = await AuditLog.create({
        eventType,
        severity,
        userId,
        targetUserId,
        resourceType,
        resourceId,
        action,
        outcome,
        ipAddress,
        userAgent,
        details: JSON.stringify(details),
        timestamp,
      });

      // Log to file for SOC2 compliance
      logger.info('AUDIT_EVENT', {
        id: auditEntry.id,
        eventType,
        severity,
        userId,
        timestamp,
      });

      // Alert on critical events
      if (severity === this.SEVERITY.CRITICAL) {
        await this.sendCriticalAlert(auditEntry);
      }

      return auditEntry;
    } catch (error) {
      logger.error('Failed to create audit log:', error);
      // Don't throw - audit logging should never break the app
    }
  }

  /**
   * Log user authentication event
   */
  static async logAuthentication(userId, success, ipAddress, userAgent, details = {}) {
    return await this.log({
      eventType: success ? this.EVENT_TYPES.USER_LOGIN : this.EVENT_TYPES.USER_LOGIN_FAILED,
      severity: success ? this.SEVERITY.INFO : this.SEVERITY.WARNING,
      userId: success ? userId : null,
      action: 'authenticate',
      outcome: success ? 'success' : 'failure',
      ipAddress,
      userAgent,
      details: {
        ...details,
        attemptedUserId: userId,
      },
    });
  }

  /**
   * Log data access event
   */
  static async logDataAccess(userId, resourceType, resourceId, action, ipAddress) {
    return await this.log({
      eventType: this.EVENT_TYPES.RESOURCE_ACCESSED,
      severity: this.SEVERITY.INFO,
      userId,
      resourceType,
      resourceId,
      action,
      outcome: 'success',
      ipAddress,
      details: {
        accessTime: new Date(),
      },
    });
  }

  /**
   * Log permission change
   */
  static async logPermissionChange(adminUserId, targetUserId, permission, granted, ipAddress) {
    return await this.log({
      eventType: granted ? this.EVENT_TYPES.PERMISSION_GRANTED : this.EVENT_TYPES.PERMISSION_REVOKED,
      severity: this.SEVERITY.WARNING,
      userId: adminUserId,
      targetUserId,
      action: granted ? 'grant_permission' : 'revoke_permission',
      outcome: 'success',
      ipAddress,
      details: {
        permission,
        granted,
      },
    });
  }

  /**
   * Log security incident
   */
  static async logSecurityIncident(type, severity, userId, ipAddress, details) {
    return await this.log({
      eventType: this.EVENT_TYPES.SECURITY_INCIDENT,
      severity,
      userId,
      action: 'security_event',
      outcome: 'detected',
      ipAddress,
      details: {
        incidentType: type,
        ...details,
      },
    });
  }

  /**
   * Log GDPR compliance event
   */
  static async logGDPRRequest(userId, requestType, ipAddress, details) {
    return await this.log({
      eventType: this.EVENT_TYPES.GDPR_REQUEST,
      severity: this.SEVERITY.WARNING,
      userId,
      action: requestType,
      outcome: 'initiated',
      ipAddress,
      details,
    });
  }

  /**
   * Query audit logs with filters
   */
  static async query(filters = {}) {
    const AuditLog = require('../models/AuditLog');
    const { Op } = require('sequelize');

    const where = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.eventType) where.eventType = filters.eventType;
    if (filters.severity) where.severity = filters.severity;
    if (filters.resourceType) where.resourceType = filters.resourceType;
    if (filters.resourceId) where.resourceId = filters.resourceId;
    
    if (filters.startDate || filters.endDate) {
      where.timestamp = {};
      if (filters.startDate) where.timestamp[Op.gte] = filters.startDate;
      if (filters.endDate) where.timestamp[Op.lte] = filters.endDate;
    }

    const logs = await AuditLog.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: filters.limit || 100,
      offset: filters.offset || 0,
    });

    return logs;
  }

  /**
   * Generate compliance report
   */
  static async generateComplianceReport(startDate, endDate) {
    const logs = await this.query({
      startDate,
      endDate,
      limit: 100000, // Get all
    });

    const report = {
      period: { startDate, endDate },
      totalEvents: logs.length,
      eventsByType: {},
      securityIncidents: 0,
      failedLogins: 0,
      dataExports: 0,
      permissionChanges: 0,
      criticalEvents: [],
    };

    logs.forEach(log => {
      // Count by type
      report.eventsByType[log.eventType] = (report.eventsByType[log.eventType] || 0) + 1;

      // Count specific events
      if (log.eventType === this.EVENT_TYPES.SECURITY_INCIDENT) {
        report.securityIncidents++;
      }
      if (log.eventType === this.EVENT_TYPES.USER_LOGIN_FAILED) {
        report.failedLogins++;
      }
      if (log.eventType === this.EVENT_TYPES.DATA_EXPORTED) {
        report.dataExports++;
      }
      if ([this.EVENT_TYPES.PERMISSION_GRANTED, this.EVENT_TYPES.PERMISSION_REVOKED].includes(log.eventType)) {
        report.permissionChanges++;
      }

      // Collect critical events
      if (log.severity === this.SEVERITY.CRITICAL) {
        report.criticalEvents.push({
          id: log.id,
          eventType: log.eventType,
          timestamp: log.timestamp,
          userId: log.userId,
        });
      }
    });

    return report;
  }

  /**
   * Send critical alert to security team
   */
  static async sendCriticalAlert(auditEntry) {
    const NotificationService = require('./notification');
    
    // Send to all admins
    await NotificationService.sendToAdmins({
      type: 'security_alert',
      priority: 'critical',
      subject: `Critical Security Event: ${auditEntry.eventType}`,
      message: `A critical security event has been detected.
      
Event Type: ${auditEntry.eventType}
User ID: ${auditEntry.userId}
IP Address: ${auditEntry.ipAddress}
Timestamp: ${auditEntry.timestamp}

Please investigate immediately.`,
      metadata: {
        auditLogId: auditEntry.id,
      },
    });

    // Could also integrate with PagerDuty, Slack, etc.
  }

  /**
   * Detect unusual patterns (SOC2 monitoring)
   */
  static async detectAnomalies(userId) {
    const recentLogs = await this.query({
      userId,
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      limit: 1000,
    });

    const anomalies = [];

    // Check for mass data access
    const dataAccessCount = recentLogs.filter(
      log => log.eventType === this.EVENT_TYPES.RESOURCE_ACCESSED
    ).length;

    if (dataAccessCount > 100) {
      anomalies.push({
        type: 'mass_data_access',
        severity: this.SEVERITY.CRITICAL,
        description: `User accessed ${dataAccessCount} resources in 24 hours`,
      });
    }

    // Check for multiple failed logins
    const failedLogins = recentLogs.filter(
      log => log.eventType === this.EVENT_TYPES.USER_LOGIN_FAILED
    ).length;

    if (failedLogins > 5) {
      anomalies.push({
        type: 'brute_force_attempt',
        severity: this.SEVERITY.CRITICAL,
        description: `${failedLogins} failed login attempts in 24 hours`,
      });
    }

    // Check for unusual IP addresses
    const ipAddresses = [...new Set(recentLogs.map(log => log.ipAddress))];
    if (ipAddresses.length > 10) {
      anomalies.push({
        type: 'multiple_ip_addresses',
        severity: this.SEVERITY.WARNING,
        description: `User logged in from ${ipAddresses.length} different IP addresses`,
      });
    }

    // Log anomalies found
    for (const anomaly of anomalies) {
      await this.logSecurityIncident(
        anomaly.type,
        anomaly.severity,
        userId,
        null,
        { description: anomaly.description }
      );
    }

    return anomalies;
  }

  /**
   * Archive old logs (data retention policy)
   */
  static async archiveOldLogs(retentionDays = 2555) { // 7 years for SOC2
    const AuditLog = require('../models/AuditLog');
    const { Op } = require('sequelize');

    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    // In production, move to cold storage instead of deleting
    const oldLogs = await AuditLog.findAll({
      where: {
        timestamp: { [Op.lt]: cutoffDate },
      },
    });

    // Export to S3 or other archive storage
    const archived = await this.exportToArchive(oldLogs);

    // Only delete if successfully archived
    if (archived) {
      await AuditLog.destroy({
        where: {
          timestamp: { [Op.lt]: cutoffDate },
        },
      });

      await this.log({
        eventType: this.EVENT_TYPES.DATA_RETENTION_PURGE,
        severity: this.SEVERITY.INFO,
        action: 'archive_logs',
        outcome: 'success',
        details: {
          logsArchived: oldLogs.length,
          cutoffDate,
        },
      });
    }

    return { archived: oldLogs.length };
  }

  /**
   * Export logs to archive storage (S3)
   */
  static async exportToArchive(logs) {
    try {
      const AWS = require('aws-sdk');
      const s3 = new AWS.S3();

      const fileName = `audit-logs-${new Date().toISOString()}.json`;
      const data = JSON.stringify(logs, null, 2);

      await s3.putObject({
        Bucket: process.env.S3_AUDIT_ARCHIVE_BUCKET || process.env.S3_BUCKET,
        Key: `audit-logs/${fileName}`,
        Body: data,
        ServerSideEncryption: 'AES256',
        StorageClass: 'GLACIER', // Low-cost long-term storage
      }).promise();

      logger.info(`Archived ${logs.length} audit logs to S3: ${fileName}`);
      return true;
    } catch (error) {
      logger.error('Failed to archive audit logs:', error);
      return false;
    }
  }
}

module.exports = AuditLogService;
