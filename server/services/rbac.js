/**
 * Advanced Role-Based Access Control (RBAC) System
 * Implements granular permissions for SOC2 compliance
 */

const { logger } = require('../config/logger');
const AuditLogService = require('./auditLog');

class RBACService {
  // Define all available permissions
  static PERMISSIONS = {
    // Task permissions
    'tasks:view': 'View tasks',
    'tasks:view:own': 'View own tasks',
    'tasks:view:assigned': 'View assigned tasks',
    'tasks:view:all': 'View all tasks',
    'tasks:create': 'Create new tasks',
    'tasks:edit': 'Edit task details',
    'tasks:edit:own': 'Edit own tasks',
    'tasks:edit:assigned': 'Edit assigned tasks',
    'tasks:delete': 'Delete tasks',
    'tasks:assign': 'Assign tasks to others',
    'tasks:approve': 'Approve task completion',
    
    // Document permissions
    'documents:view': 'View documents',
    'documents:view:own': 'View own documents',
    'documents:view:shared': 'View shared documents',
    'documents:upload': 'Upload documents',
    'documents:edit': 'Edit document metadata',
    'documents:delete': 'Delete documents',
    'documents:share': 'Share documents externally',
    'documents:download': 'Download documents',
    
    // Client data permissions
    'clients:view': 'View client information',
    'clients:view:basic': 'View basic client info',
    'clients:view:full': 'View full client profile',
    'clients:edit': 'Edit client information',
    'clients:create': 'Create new clients',
    'clients:delete': 'Delete clients',
    'clients:financials': 'View financial data',
    'clients:contact': 'Contact clients',
    
    // Calendar permissions
    'calendar:view': 'View calendar',
    'calendar:view:own': 'View own calendar',
    'calendar:view:team': 'View team calendar',
    'calendar:create': 'Create events',
    'calendar:edit': 'Edit events',
    'calendar:delete': 'Delete events',
    
    // Email permissions
    'email:view': 'View emails',
    'email:send': 'Send emails',
    'email:draft': 'Draft emails for review',
    
    // Time tracking permissions
    'time:log': 'Log time entries',
    'time:view': 'View time logs',
    'time:edit': 'Edit time entries',
    'time:approve': 'Approve time entries',
    
    // Payment permissions
    'payments:view': 'View payments',
    'payments:create': 'Create payments',
    'payments:approve': 'Approve payments',
    'payments:refund': 'Process refunds',
    
    // User management permissions
    'users:view': 'View users',
    'users:create': 'Create new users',
    'users:edit': 'Edit user profiles',
    'users:delete': 'Delete users',
    'users:permissions': 'Manage permissions',
    'users:impersonate': 'Impersonate users',
    
    // Administrative permissions
    'settings:view': 'View settings',
    'settings:edit': 'Edit settings',
    'audit:view': 'View audit logs',
    'audit:export': 'Export audit data',
    'billing:view': 'View billing',
    'billing:manage': 'Manage billing',
    'integrations:manage': 'Manage integrations',
    
    // VA-specific permissions
    'va:onboard': 'Onboard new VAs',
    'va:evaluate': 'Evaluate VA performance',
    'va:terminate': 'Terminate VA contracts',
  };

  // Predefined roles with permission sets
  static ROLES = {
    // Client roles
    client: [
      'tasks:view:all', 'tasks:create', 'tasks:edit', 'tasks:delete', 'tasks:assign', 'tasks:approve',
      'documents:view:own', 'documents:view:shared', 'documents:upload', 'documents:edit', 'documents:delete', 'documents:share', 'documents:download',
      'clients:view:basic', 'clients:edit',
      'calendar:view:own', 'calendar:create', 'calendar:edit', 'calendar:delete',
      'email:view', 'email:send', 'email:draft',
      'time:view', 'time:approve',
      'payments:view', 'payments:create',
    ],
    
    // VA roles (by tier)
    va_general: [
      'tasks:view:assigned', 'tasks:edit:assigned',
      'documents:view:shared', 'documents:upload',
      'clients:view:basic',
      'calendar:view:team', 'calendar:create',
      'email:draft',
      'time:log', 'time:view',
    ],
    
    va_specialized: [
      'tasks:view:assigned', 'tasks:create', 'tasks:edit:assigned',
      'documents:view:shared', 'documents:upload', 'documents:edit',
      'clients:view:basic', 'clients:edit',
      'calendar:view:team', 'calendar:create', 'calendar:edit',
      'email:view', 'email:draft', 'email:send',
      'time:log', 'time:view',
    ],
    
    va_executive: [
      'tasks:view:all', 'tasks:create', 'tasks:edit', 'tasks:assign',
      'documents:view:shared', 'documents:upload', 'documents:edit', 'documents:download',
      'clients:view:full', 'clients:edit', 'clients:contact',
      'calendar:view:team', 'calendar:create', 'calendar:edit', 'calendar:delete',
      'email:view', 'email:send', 'email:draft',
      'time:log', 'time:view', 'time:edit',
      'payments:view',
    ],
    
    // Success Manager role
    success_manager: [
      'tasks:view:all', 'tasks:create', 'tasks:edit', 'tasks:assign',
      'documents:view:shared', 'documents:upload', 'documents:edit',
      'clients:view:full', 'clients:edit', 'clients:contact', 'clients:financials',
      'calendar:view:team',
      'email:view', 'email:send',
      'time:view', 'time:approve',
      'payments:view',
      'users:view', 'users:edit',
      'va:onboard', 'va:evaluate',
      'audit:view',
    ],
    
    // Admin roles
    admin: Object.keys(RBACService.PERMISSIONS).filter(p => !p.includes('impersonate')),
    superadmin: Object.keys(RBACService.PERMISSIONS),
  };

  /**
   * Check if user has permission
   */
  static async checkPermission(userId, permission, resourceId = null, context = {}) {
    try {
      const User = require('../models/User');
      const user = await User.findByPk(userId);

      if (!user) {
        logger.warn(`Permission check failed: User ${userId} not found`);
        return false;
      }

      // Superadmins bypass all checks
      if (user.role === 'superadmin') {
        return true;
      }

      // Get base role permissions
      const rolePermissions = this.ROLES[user.role] || [];
      
      // Check if user has the permission from their role
      if (!rolePermissions.includes(permission)) {
        // Check for wildcard permission (e.g., 'tasks:view' covers 'tasks:view:own')
        const basePermission = permission.split(':').slice(0, 2).join(':');
        if (!rolePermissions.includes(basePermission)) {
          await AuditLogService.log({
            eventType: AuditLogService.EVENT_TYPES.ACCESS_DENIED,
            severity: AuditLogService.SEVERITY.WARNING,
            userId,
            action: 'check_permission',
            outcome: 'denied',
            ipAddress: context.ipAddress,
            details: {
              permission,
              role: user.role,
              resourceId,
            },
          });
          return false;
        }
      }

      // Check resource-specific access control
      if (resourceId) {
        const hasResourceAccess = await this.checkResourceAccess(userId, resourceId, permission);
        if (!hasResourceAccess) {
          return false;
        }
      }

      // Check for scope-specific permissions (e.g., :own, :assigned)
      if (permission.includes(':own') && resourceId) {
        const resource = await this.getResource(permission.split(':')[0], resourceId);
        if (resource && resource.userId !== userId && resource.ownerId !== userId) {
          return false;
        }
      }

      if (permission.includes(':assigned') && resourceId) {
        const resource = await this.getResource(permission.split(':')[0], resourceId);
        if (resource && resource.assignedTo !== userId) {
          return false;
        }
      }

      return true;
    } catch (error) {
      logger.error('Permission check error:', error);
      return false; // Fail closed
    }
  }

  /**
   * Check resource-specific access
   */
  static async checkResourceAccess(userId, resourceId, permission) {
    const AccessControl = require('../models/AccessControl');
    
    const access = await AccessControl.findOne({
      where: {
        userId,
        resourceId,
        status: 'active',
      },
    });

    if (!access) {
      return true; // No specific restrictions
    }

    // Check if access has expired
    if (access.expiresAt && access.expiresAt < new Date()) {
      await access.update({ status: 'expired' });
      return false;
    }

    // Check if permission is in allowed list
    if (access.permissions && !access.permissions.includes(permission)) {
      return false;
    }

    return true;
  }

  /**
   * Grant temporary access to a resource
   */
  static async grantAccess(granterId, userId, resourceId, permissions, options = {}) {
    const AccessControl = require('../models/AccessControl');
    
    const access = await AccessControl.create({
      userId,
      resourceId,
      resourceType: options.resourceType || 'unknown',
      permissions: JSON.stringify(permissions),
      grantedBy: granterId,
      expiresAt: options.expiresAt || null,
      reason: options.reason || null,
      status: 'active',
    });

    await AuditLogService.logPermissionChange(
      granterId,
      userId,
      permissions.join(', '),
      true,
      options.ipAddress
    );

    return access;
  }

  /**
   * Revoke access to a resource
   */
  static async revokeAccess(revokerId, userId, resourceId, ipAddress) {
    const AccessControl = require('../models/AccessControl');
    
    const updated = await AccessControl.update(
      { status: 'revoked', revokedBy: revokerId, revokedAt: new Date() },
      { where: { userId, resourceId, status: 'active' } }
    );

    if (updated[0] > 0) {
      await AuditLogService.logPermissionChange(
        revokerId,
        userId,
        'all',
        false,
        ipAddress
      );
    }

    return updated[0] > 0;
  }

  /**
   * Get resource by type and ID
   */
  static async getResource(resourceType, resourceId) {
    try {
      const modelMap = {
        tasks: require('../models/Task'),
        documents: require('../models/Document'),
        clients: require('../models/Client'),
      };

      const Model = modelMap[resourceType];
      if (!Model) return null;

      return await Model.findByPk(resourceId);
    } catch (error) {
      logger.error('Error fetching resource:', error);
      return null;
    }
  }

  /**
   * Middleware to check permission
   */
  static requirePermission(permission, options = {}) {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const resourceId = options.getResourceId 
        ? options.getResourceId(req) 
        : req.params.id || req.body.resourceId;

      const hasPermission = await this.checkPermission(
        req.user.id,
        permission,
        resourceId,
        { ipAddress: req.ip }
      );

      if (!hasPermission) {
        logger.warn(`Access denied: User ${req.user.id} lacks permission ${permission}`);
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          required: permission,
        });
      }

      next();
    };
  }

  /**
   * Get all permissions for a user
   */
  static async getUserPermissions(userId) {
    const User = require('../models/User');
    const user = await User.findByPk(userId);

    if (!user) return [];

    const rolePermissions = this.ROLES[user.role] || [];

    // Get resource-specific permissions
    const AccessControl = require('../models/AccessControl');
    const resourceAccess = await AccessControl.findAll({
      where: { userId, status: 'active' },
    });

    const additionalPermissions = resourceAccess
      .filter(access => !access.expiresAt || access.expiresAt > new Date())
      .flatMap(access => JSON.parse(access.permissions || '[]'));

    return [...new Set([...rolePermissions, ...additionalPermissions])];
  }

  /**
   * Assign role to user
   */
  static async assignRole(adminId, userId, role, ipAddress) {
    const User = require('../models/User');
    
    if (!this.ROLES[role]) {
      throw new Error(`Invalid role: ${role}`);
    }

    const user = await User.findByPk(userId);
    const oldRole = user.role;

    await user.update({ role });

    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.ROLE_ASSIGNED,
      severity: AuditLogService.SEVERITY.WARNING,
      userId: adminId,
      targetUserId: userId,
      action: 'assign_role',
      outcome: 'success',
      ipAddress,
      details: {
        oldRole,
        newRole: role,
      },
    });

    return user;
  }
}

module.exports = RBACService;
