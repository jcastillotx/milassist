const express = require('express');
const router = express.Router();
const { VAProfile, User } = require('../models');
const AuditLogService = require('../services/auditLog');
const { Op } = require('sequelize');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @route   POST /api/va-profiles
 * @desc    Create a new VA profile
 * @access  Admin or VA user themselves
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      userId,
      role,
      tier,
      hourlyRate,
      skills,
      certifications,
      toolProficiency,
      languages,
      timezone,
      availabilitySchedule,
      weeklyCapacity,
      yearsExperience,
      industries,
      bio,
      tagline,
      portfolio
    } = req.body;

    // Validate required fields
    if (!userId || !role || !tier || !hourlyRate || !timezone) {
      return res.status(400).json({
        error: 'userId, role, tier, hourlyRate, and timezone are required'
      });
    }

    // Check if profile already exists
    const existing = await VAProfile.findOne({ where: { userId } });
    if (existing) {
      return res.status(400).json({ error: 'VA profile already exists for this user' });
    }

    // Create VA profile
    const vaProfile = await VAProfile.create({
      userId,
      role,
      tier,
      hourlyRate,
      skills: skills || [],
      certifications: certifications || [],
      toolProficiency: toolProficiency || {},
      languages: languages || [],
      timezone,
      availabilitySchedule: availabilitySchedule || {},
      weeklyCapacity: weeklyCapacity || 40,
      currentLoad: 0,
      yearsExperience: yearsExperience || 0,
      industries: industries || [],
      bio: bio || '',
      tagline: tagline || '',
      portfolio: portfolio || [],
      status: 'available',
      rating: null,
      completedTasks: 0,
      responseTime: null
    });

    // Log profile creation
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.DATA_CREATED,
      userId: req.user?.id || userId,
      resourceType: 'VAProfile',
      resourceId: vaProfile.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        role,
        tier,
        hourlyRate
      }
    });

    res.status(201).json({
      success: true,
      vaProfile
    });
  } catch (error) {
    console.error('Error creating VA profile:', error);
    res.status(500).json({ error: 'Failed to create VA profile' });
  }
});

/**
 * @route   GET /api/va-profiles
 * @desc    Get all VA profiles with filtering
 * @access  Public (filtered data) or Admin (full data)
 */
router.get('/', async (req, res) => {
  try {
    const {
      role,
      tier,
      status,
      minRate,
      maxRate,
      skills,
      industries,
      timezone,
      languages,
      minRating,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter
    const where = {};
    
    if (role) where.role = role;
    if (tier) where.tier = tier;
    if (status) where.status = status;
    
    if (minRate || maxRate) {
      where.hourlyRate = {};
      if (minRate) where.hourlyRate[Op.gte] = parseFloat(minRate);
      if (maxRate) where.hourlyRate[Op.lte] = parseFloat(maxRate);
    }

    if (minRating) {
      where.rating = { [Op.gte]: parseFloat(minRating) };
    }

    if (timezone) where.timezone = timezone;

    // JSON field filters (skills, industries, languages) need raw SQL or post-filtering
    // For now, we'll fetch all and filter in memory (optimize later with JSON queries)

    const offset = (page - 1) * limit;
    let { count, rows } = await VAProfile.findAndCountAll({
      where,
      include: [
        { 
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [
        ['rating', 'DESC NULLS LAST'],
        ['completedTasks', 'DESC']
      ],
      limit: parseInt(limit),
      offset
    });

    // Post-filter for JSON fields
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
      rows = rows.filter(profile => {
        const profileSkills = (profile.skills || []).map(s => s.toLowerCase());
        return skillsArray.some(skill => profileSkills.includes(skill));
      });
    }

    if (industries) {
      const industriesArray = industries.split(',').map(i => i.trim().toLowerCase());
      rows = rows.filter(profile => {
        const profileIndustries = (profile.industries || []).map(i => i.toLowerCase());
        return industriesArray.some(industry => profileIndustries.includes(industry));
      });
    }

    if (languages) {
      const languagesArray = languages.split(',').map(l => l.trim().toLowerCase());
      rows = rows.filter(profile => {
        const profileLangs = (profile.languages || []).map(l => 
          typeof l === 'string' ? l.toLowerCase() : l.language?.toLowerCase()
        );
        return languagesArray.some(lang => profileLangs.includes(lang));
      });
    }

    res.json({
      profiles: rows,
      pagination: {
        total: rows.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(rows.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching VA profiles:', error);
    res.status(500).json({ error: 'Failed to fetch VA profiles' });
  }
});

/**
 * @route   GET /api/va-profiles/:id
 * @desc    Get a specific VA profile by ID
 * @access  Public (limited data) or Admin/Owner (full data)
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const vaProfile = await VAProfile.findByPk(id, {
      include: [
        { 
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!vaProfile) {
      return res.status(404).json({ error: 'VA profile not found' });
    }

    // Filter sensitive data based on permissions
    const isOwner = req.user && req.user.id === vaProfile.userId;
    const isAdmin = req.user && ['admin', 'superadmin', 'success_manager'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      // Public view - hide sensitive information
      const publicProfile = {
        id: vaProfile.id,
        userId: vaProfile.userId,
        role: vaProfile.role,
        tier: vaProfile.tier,
        skills: vaProfile.skills,
        certifications: vaProfile.certifications,
        languages: vaProfile.languages,
        timezone: vaProfile.timezone,
        yearsExperience: vaProfile.yearsExperience,
        industries: vaProfile.industries,
        bio: vaProfile.bio,
        tagline: vaProfile.tagline,
        status: vaProfile.status,
        rating: vaProfile.rating,
        completedTasks: vaProfile.completedTasks,
        user: vaProfile.user ? { id: vaProfile.user.id, name: vaProfile.user.name } : null
        // Hide: hourlyRate, availabilitySchedule, weeklyCapacity, currentLoad, backgroundCheck, NDA, portfolio
      };
      return res.json({ vaProfile: publicProfile });
    }

    res.json({ vaProfile });
  } catch (error) {
    console.error('Error fetching VA profile:', error);
    res.status(500).json({ error: 'Failed to fetch VA profile' });
  }
});

/**
 * @route   GET /api/va-profiles/user/:userId
 * @desc    Get VA profile by user ID
 * @access  Admin or VA user themselves
 */
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const vaProfile = await VAProfile.findOne({
      where: { userId },
      include: [
        { 
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!vaProfile) {
      return res.status(404).json({ error: 'VA profile not found for this user' });
    }

    res.json({ vaProfile });
  } catch (error) {
    console.error('Error fetching VA profile by user:', error);
    res.status(500).json({ error: 'Failed to fetch VA profile' });
  }
});

/**
 * @route   PUT /api/va-profiles/:id
 * @desc    Update a VA profile
 * @access  Admin or VA user themselves
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vaProfile = await VAProfile.findByPk(id);
    if (!vaProfile) {
      return res.status(404).json({ error: 'VA profile not found' });
    }

    // Permission check: Only admin or the VA themselves can update the profile
    const isOwner = req.user.id === vaProfile.userId;
    const isAdmin = ['admin', 'superadmin', 'success_manager'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access denied. You can only update your own profile or be an admin.'
      });
    }

    // Fields that can be updated
    const allowedUpdates = [
      'role', 'tier', 'hourlyRate', 'skills', 'certifications',
      'toolProficiency', 'languages', 'timezone', 'availabilitySchedule',
      'weeklyCapacity', 'currentLoad', 'yearsExperience', 'industries',
      'bio', 'tagline', 'portfolio', 'status', 'backgroundCheckStatus',
      'backgroundCheckDate', 'ndaSigned', 'ndaSignedDate'
    ];

    const oldValues = {};
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        oldValues[field] = vaProfile[field];
        vaProfile[field] = updates[field];
      }
    });

    await vaProfile.save();

    // Log profile update
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.DATA_EDITED,
      userId: req.user?.id || vaProfile.userId,
      resourceType: 'VAProfile',
      resourceId: vaProfile.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        updatedFields: Object.keys(updates),
        oldValues,
        newValues: updates
      }
    });

    res.json({
      success: true,
      vaProfile
    });
  } catch (error) {
    console.error('Error updating VA profile:', error);
    res.status(500).json({ error: 'Failed to update VA profile' });
  }
});

/**
 * @route   DELETE /api/va-profiles/:id
 * @desc    Delete a VA profile
 * @access  Admin only
 */
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const vaProfile = await VAProfile.findByPk(id);
    if (!vaProfile) {
      return res.status(404).json({ error: 'VA profile not found' });
    }

    // Log deletion before deleting
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.DATA_DELETED,
      userId: req.user?.id,
      targetUserId: vaProfile.userId,
      resourceType: 'VAProfile',
      resourceId: vaProfile.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        role: vaProfile.role,
        tier: vaProfile.tier
      }
    });

    await vaProfile.destroy();

    res.json({
      success: true,
      message: 'VA profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting VA profile:', error);
    res.status(500).json({ error: 'Failed to delete VA profile' });
  }
});

/**
 * @route   POST /api/va-profiles/:id/update-stats
 * @desc    Update performance statistics for a VA
 * @access  System or Admin
 */
router.post('/:id/update-stats', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, completedTasks, responseTime } = req.body;

    const vaProfile = await VAProfile.findByPk(id);
    if (!vaProfile) {
      return res.status(404).json({ error: 'VA profile not found' });
    }

    if (rating !== undefined) vaProfile.rating = rating;
    if (completedTasks !== undefined) vaProfile.completedTasks = completedTasks;
    if (responseTime !== undefined) vaProfile.responseTime = responseTime;

    await vaProfile.save();

    res.json({
      success: true,
      stats: {
        rating: vaProfile.rating,
        completedTasks: vaProfile.completedTasks,
        responseTime: vaProfile.responseTime
      }
    });
  } catch (error) {
    console.error('Error updating VA stats:', error);
    res.status(500).json({ error: 'Failed to update VA stats' });
  }
});

/**
 * @route   GET /api/va-profiles/stats/overview
 * @desc    Get overview statistics of all VAs
 * @access  Admin only
 */
router.get('/stats/overview', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const totalVAs = await VAProfile.count();
    const availableVAs = await VAProfile.count({ where: { status: 'available' } });
    const busyVAs = await VAProfile.count({ where: { status: 'busy' } });
    
    const byRole = await VAProfile.count({
      group: ['role']
    });

    const byTier = await VAProfile.count({
      group: ['tier']
    });

    const avgRating = await VAProfile.findOne({
      attributes: [
        [VAProfile.sequelize.fn('AVG', VAProfile.sequelize.col('rating')), 'avgRating']
      ],
      raw: true
    });

    res.json({
      total: totalVAs,
      available: availableVAs,
      busy: busyVAs,
      unavailable: totalVAs - availableVAs - busyVAs,
      byRole,
      byTier,
      averageRating: avgRating?.avgRating ? parseFloat(avgRating.avgRating).toFixed(2) : null
    });
  } catch (error) {
    console.error('Error fetching VA stats:', error);
    res.status(500).json({ error: 'Failed to fetch VA statistics' });
  }
});

module.exports = router;
