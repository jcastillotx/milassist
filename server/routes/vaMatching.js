const express = require('express');
const router = express.Router();
const VAMatchingService = require('../services/vaMatching');
const { VAMatch, VAProfile, User } = require('../models');
const AuditLogService = require('../services/auditLog');

/**
 * @route   POST /api/va-matching/find-matches
 * @desc    Find matching VAs for a client based on requirements
 * @access  Authenticated clients
 */
router.post('/find-matches', async (req, res) => {
  try {
    const {
      clientId,
      requiredSkills,
      preferredSkills,
      industry,
      budget,
      timezone,
      languages,
      tier,
      hoursPerWeek
    } = req.body;

    // Validate required fields
    if (!clientId || !requiredSkills || !budget) {
      return res.status(400).json({
        error: 'clientId, requiredSkills, and budget are required'
      });
    }

    // Find matches using the matching service
    const matches = await VAMatchingService.matchVAToClient({
      requiredSkills,
      preferredSkills,
      industry,
      budget,
      timezone,
      languages,
      tier,
      hoursPerWeek
    });

    // Save matches to database
    const savedMatches = [];
    for (const match of matches) {
      const vaMatch = await VAMatch.create({
        clientId,
        vaId: match.vaProfile.userId,
        matchScore: match.matchScore,
        scoreBreakdown: match.scoreBreakdown,
        requirements: {
          requiredSkills,
          preferredSkills,
          industry,
          budget,
          timezone,
          languages,
          tier,
          hoursPerWeek
        },
        status: 'suggested'
      });
      savedMatches.push({
        ...match,
        matchId: vaMatch.id
      });
    }

    // Log matching request
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.DATA_ACCESSED,
      userId: clientId,
      resourceType: 'VAMatch',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        action: 'find_matches',
        matchCount: matches.length,
        requirements: { requiredSkills, industry, budget }
      }
    });

    res.json({
      success: true,
      matches: savedMatches,
      count: savedMatches.length
    });
  } catch (error) {
    console.error('Error finding VA matches:', error);
    res.status(500).json({ error: 'Failed to find VA matches' });
  }
});

/**
 * @route   GET /api/va-matching/matches/:clientId
 * @desc    Get all matches for a specific client
 * @access  Admin or client themselves
 */
router.get('/matches/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    const where = { clientId };
    if (status) where.status = status;

    const offset = (page - 1) * limit;
    const { count, rows } = await VAMatch.findAndCountAll({
      where,
      include: [
        {
          model: VAProfile,
          as: 'va',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['matchScore', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      matches: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching client matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

/**
 * @route   GET /api/va-matching/match/:matchId
 * @desc    Get a specific match by ID
 * @access  Admin, client, or VA involved
 */
router.get('/match/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await VAMatch.findByPk(matchId, {
      include: [
        {
          model: VAProfile,
          as: 'va',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json({ match });
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
});

/**
 * @route   PUT /api/va-matching/match/:matchId/status
 * @desc    Update match status (reviewed, accepted, rejected)
 * @access  Client or Admin
 */
router.put('/match/:matchId/status', async (req, res) => {
  try {
    const { matchId } = req.params;
    const { status, notes } = req.body;

    if (!status || !['suggested', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        error: 'Valid status required (suggested, reviewed, accepted, rejected)'
      });
    }

    const match = await VAMatch.findByPk(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const oldStatus = match.status;
    match.status = status;
    if (notes) match.notes = notes;
    await match.save();

    // Log status change
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.DATA_EDITED,
      userId: req.user?.id || match.clientId,
      resourceType: 'VAMatch',
      resourceId: matchId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        action: 'status_changed',
        oldStatus,
        newStatus: status,
        notes
      }
    });

    res.json({
      success: true,
      match
    });
  } catch (error) {
    console.error('Error updating match status:', error);
    res.status(500).json({ error: 'Failed to update match status' });
  }
});

/**
 * @route   POST /api/va-matching/match/:matchId/accept
 * @desc    Accept a match and potentially create assignment
 * @access  Client or Admin
 */
router.post('/match/:matchId/accept', async (req, res) => {
  try {
    const { matchId } = req.params;
    const { startDate, notes } = req.body;

    const match = await VAMatch.findByPk(matchId, {
      include: [
        {
          model: VAProfile,
          as: 'va'
        }
      ]
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.status === 'accepted') {
      return res.status(400).json({ error: 'Match already accepted' });
    }

    // Update match status
    match.status = 'accepted';
    match.startDate = startDate ? new Date(startDate) : new Date();
    if (notes) match.notes = notes;
    await match.save();

    // Update VA status to busy (optional - depends on capacity)
    if (match.va) {
      // TODO: Check if VA has capacity before marking as busy
      // For now, just increment currentLoad
      match.va.currentLoad += (match.requirements?.hoursPerWeek || 40);
      if (match.va.currentLoad >= match.va.weeklyCapacity) {
        match.va.status = 'busy';
      }
      await match.va.save();
    }

    // Log acceptance
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.DATA_EDITED,
      userId: req.user?.id || match.clientId,
      targetUserId: match.vaId,
      resourceType: 'VAMatch',
      resourceId: matchId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        action: 'match_accepted',
        matchScore: match.matchScore,
        startDate: match.startDate
      }
    });

    res.json({
      success: true,
      message: 'Match accepted successfully',
      match
    });
  } catch (error) {
    console.error('Error accepting match:', error);
    res.status(500).json({ error: 'Failed to accept match' });
  }
});

/**
 * @route   GET /api/va-matching/va/:vaId/matches
 * @desc    Get all matches for a specific VA
 * @access  Admin or VA themselves
 */
router.get('/va/:vaId/matches', async (req, res) => {
  try {
    const { vaId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    const where = { vaId };
    if (status) where.status = status;

    const offset = (page - 1) * limit;
    const { count, rows } = await VAMatch.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        },
        {
          model: VAProfile,
          as: 'va',
          attributes: ['id', 'role', 'tier', 'hourlyRate']
        }
      ],
      order: [['matchScore', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      matches: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching VA matches:', error);
    res.status(500).json({ error: 'Failed to fetch VA matches' });
  }
});

/**
 * @route   GET /api/va-matching/stats
 * @desc    Get matching statistics
 * @access  Admin only
 */
router.get('/stats', async (req, res) => {
  try {
    const totalMatches = await VAMatch.count();
    const byStatus = await VAMatch.count({ group: ['status'] });
    
    const avgMatchScore = await VAMatch.findOne({
      attributes: [
        [VAMatch.sequelize.fn('AVG', VAMatch.sequelize.col('matchScore')), 'avgScore']
      ],
      raw: true
    });

    const acceptanceRate = await VAMatch.count({ where: { status: 'accepted' } });
    const rejectionRate = await VAMatch.count({ where: { status: 'rejected' } });

    res.json({
      totalMatches,
      byStatus,
      averageMatchScore: avgMatchScore?.avgScore ? parseFloat(avgMatchScore.avgScore).toFixed(2) : null,
      acceptanceRate: totalMatches > 0 ? ((acceptanceRate / totalMatches) * 100).toFixed(2) + '%' : '0%',
      rejectionRate: totalMatches > 0 ? ((rejectionRate / totalMatches) * 100).toFixed(2) + '%' : '0%'
    });
  } catch (error) {
    console.error('Error fetching matching stats:', error);
    res.status(500).json({ error: 'Failed to fetch matching statistics' });
  }
});

module.exports = router;
