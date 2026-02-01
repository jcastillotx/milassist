const express = require('express');
const router = express.Router();
const RBACService = require('../services/rbac');
const AuditLogService = require('../services/auditLog');
const { AccessControl, User } = require('../models');
const { Op } = require('sequelize');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @route   GET /api/rbac/permissions
 * @desc    Get all available permissions
 * @access  Admin only
 */
router.get('/permissions', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const permissions = RBACService.PERMISSIONS;
    res.json({ permissions });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
});

/**
 * @route   GET /api/rbac/roles
 * @desc    Get all predefined roles with their permissions
 * @access  Admin only
 */
router.get('/roles', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const roles = RBACService.ROLES;
    res.json({ roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

/**
 * @route   GET /api/rbac/user/:userId/permissions
 * @desc    Get all permissions for a specific user
 * @access  Admin or own user
 */
router.get('/user/:userId/permissions', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Permission check: Only admin or the user themselves can view permissions
    if (req.user.id !== userId && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied. You can only view your own permissions or be an admin.'
      });
    }

    const permissions = await RBACService.getUserPermissions(userId);

    res.json({
      userId,
      permissions
    });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    res.status(500).json({ error: 'Failed to fetch user permissions' });
  }
});

/**
 * @route   POST /api/rbac/check-permission
 * @desc    Check if user has a specific permission
 * @access  Any authenticated user
 */
router.post('/check-permission', authenticateToken, async (req, res) => {
  try {
    const { userId, permission, resourceId } = req.body;

    if (!userId || !permission) {
      return res.status(400).json({ error: 'userId and permission are required' });
    }

    const hasPermission = await RBACService.checkPermission(
      userId,
      permission,
      resourceId
    );

    res.json({ 
      userId,
      permission,
      resourceId,
      hasPermission 
    });
  } catch (error) {
    console.error('Error checking permission:', error);
    res.status(500).json({ error: 'Failed to check permission' });
  }
});

/**
 * @route   POST /api/rbac/grant-permission
 * @desc    Grant a permission to a user for a specific resource
 * @access  Admin only
 */
router.post('/grant-permission', authenticateToken, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const { userId, resourceType, resourceId, permissions, expiresAt } = req.body;
    const grantedBy = req.user.id;

    if (!userId || !resourceType || !resourceId || !permissions) {
      return res.status(400).json({ 
        error: 'userId, resourceType, resourceId, and permissions are required' 
      });
    }

    // Grant the permission
    const accessControl = await AccessControl.create({
      userId,
      resourceType,
      resourceId,
      permissions: Array.isArray(permissions) ? permissions : [permissions],
      grantedBy,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    // Log the permission grant
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.PERMISSION_GRANTED,
      userId: grantedBy,
      targetUserId: userId,
      resourceType,
      resourceId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        permissions,
        expiresAt
      }
    });

    res.status(201).json({
      success: true,
      accessControl
    });
  } catch (error) {
    console.error('Error granting permission:', error);
    res.status(500).json({ error: 'Failed to grant permission' });
  }
});

/**
 * @route   POST /api/rbac/revoke-permission
 * @desc    Revoke permissions for a user on a specific resource
 * @access  Admin only
 */
router.post('/revoke-permission', authenticateToken, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const { userId, resourceType, resourceId } = req.body;
    const revokedBy = req.user.id;

    if (!userId || !resourceType || !resourceId) {
      return res.status(400).json({ 
        error: 'userId, resourceType, and resourceId are required' 
      });
    }

    // Find and delete the access control
    const deleted = await AccessControl.destroy({
      where: { userId, resourceType, resourceId }
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    // Log the permission revocation
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.PERMISSION_REVOKED,
      userId: revokedBy,
      targetUserId: userId,
      resourceType,
      resourceId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        permissionsRevoked: deleted
      }
    });

    res.json({
      success: true,
      message: 'Permission revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking permission:', error);
    res.status(500).json({ error: 'Failed to revoke permission' });
  }
});

/**
 * @route   GET /api/rbac/resource/:resourceType/:resourceId
 * @desc    Get all users with access to a specific resource
 * @access  Admin or resource owner
 */
router.get('/resource/:resourceType/:resourceId', authenticateToken, async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;

    const accessControls = await AccessControl.findAll({
      where: { resourceType, resourceId },
      include: [
        { 
          association: 'user', 
          attributes: ['id', 'email', 'name', 'role'] 
        },
        { 
          association: 'grantor', 
          attributes: ['id', 'email', 'name'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      resourceType,
      resourceId,
      accessControls
    });
  } catch (error) {
    console.error('Error fetching resource access:', error);
    res.status(500).json({ error: 'Failed to fetch resource access' });
  }
});

/**
 * @route   POST /api/rbac/assign-role
 * @desc    Assign a predefined role to a user (updates user.role)
 * @access  Admin only
 */
router.post('/assign-role', authenticateToken, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const { userId, role } = req.body;
    const assignedBy = req.user.id;

    if (!userId || !role) {
      return res.status(400).json({ error: 'userId and role are required' });
    }

    // Validate role exists
    if (!RBACService.ROLES[role]) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Update user role
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Log the role change
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.PERMISSION_GRANTED,
      userId: assignedBy,
      targetUserId: userId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        action: 'role_assigned',
        oldRole,
        newRole: role,
        permissions: RBACService.ROLES[role]
      }
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ error: 'Failed to assign role' });
  }
});

/**
 * @route   GET /api/rbac/access-controls
 * @desc    Get all access controls with filtering
 * @access  Admin only
 */
router.get('/access-controls', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { userId, resourceType, includeExpired = false, page = 1, limit = 50 } = req.query;

    const where = {};
    if (userId) where.userId = userId;
    if (resourceType) where.resourceType = resourceType;
    
    if (!includeExpired) {
      where[Op.or] = [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: new Date() } }
      ];
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await AccessControl.findAndCountAll({
      where,
      include: [
        { association: 'user', attributes: ['id', 'email', 'name'] },
        { association: 'grantor', attributes: ['id', 'email', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      accessControls: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching access controls:', error);
    res.status(500).json({ error: 'Failed to fetch access controls' });
  }
});

/**
 * @route   DELETE /api/rbac/cleanup-expired
 * @desc    Remove expired access controls
 * @access  Admin only
 */
router.delete('/cleanup-expired', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const deleted = await AccessControl.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date()
        }
      }
    });

    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.SETTINGS_CHANGED,
      userId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        action: 'expired_access_cleanup',
        deletedCount: deleted
      }
    });

    res.json({
      success: true,
      deletedCount: deleted
    });
  } catch (error) {
    console.error('Error cleaning up expired access:', error);
    res.status(500).json({ error: 'Failed to cleanup expired access' });
  }
});

module.exports = router;
