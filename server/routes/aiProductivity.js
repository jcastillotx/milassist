const express = require('express');
const router = express.Router();
const AIProductivityService = require('../services/aiProductivity');
const AuditLogService = require('../services/auditLog');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @route   POST /api/ai/draft-email
 * @desc    Generate an email draft using AI
 * @access  Authenticated users
 */
router.post('/draft-email', authenticateToken, async (req, res) => {
  try {
    const {
      recipient,
      purpose,
      tone = 'professional',
      keyPoints = [],
      previousContext
    } = req.body;

    if (!recipient || !purpose) {
      return res.status(400).json({
        error: 'recipient and purpose are required'
      });
    }

    const draft = await AIProductivityService.generateEmailDraft({
      recipient,
      purpose,
      tone,
      keyPoints,
      previousContext
    });

    // Log AI usage
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.DATA_ACCESSED,
      userId: req.user?.id,
      resourceType: 'AI',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        action: 'email_draft_generated',
        recipient,
        tone,
        draftLength: draft.length
      }
    });

    res.json({
      success: true,
      draft
    });
  } catch (error) {
    console.error('Error generating email draft:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate email draft'
    });
  }
});

/**
 * @route   POST /api/ai/summarize
 * @desc    Summarize a document or text
 * @access  Authenticated users
 */
router.post('/summarize', authenticateToken, async (req, res) => {
  try {
    const { text, style = 'bullet-points', maxLength } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    if (text.length > 50000) {
      return res.status(400).json({ 
        error: 'Text too long. Maximum 50,000 characters.' 
      });
    }

    const summary = await AIProductivityService.summarizeDocument(
      text,
      style,
      maxLength
    );

    // Log AI usage
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.DATA_ACCESSED,
      userId: req.user?.id,
      resourceType: 'AI',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        action: 'document_summarized',
        style,
        originalLength: text.length,
        summaryLength: summary.length
      }
    });

    res.json({
      success: true,
      summary,
      originalLength: text.length,
      summaryLength: summary.length
    });
  } catch (error) {
    console.error('Error summarizing document:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to summarize document'
    });
  }
});

/**
 * @route   POST /api/ai/extract-actions
 * @desc    Extract action items from meeting notes or emails
 * @access  Authenticated users
 */
router.post('/extract-actions', authenticateToken, async (req, res) => {
  try {
    const { text, context } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    const actionItems = await AIProductivityService.extractActionItems(
      text,
      context
    );

    // Log AI usage
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.DATA_ACCESSED,
      userId: req.user?.id,
      resourceType: 'AI',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        action: 'action_items_extracted',
        actionCount: actionItems.length,
        textLength: text.length
      }
    });

    res.json({
      success: true,
      actionItems,
      count: actionItems.length
    });
  } catch (error) {
    console.error('Error extracting action items:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to extract action items'
    });
  }
});

/**
 * @route   POST /api/ai/generate-agenda
 * @desc    Generate a meeting agenda
 * @access  Authenticated users
 */
router.post('/generate-agenda', authenticateToken, async (req, res) => {
  try {
    const {
      meetingTitle,
      participants = [],
      duration,
      topics = [],
      objectives = []
    } = req.body;

    if (!meetingTitle || !duration) {
      return res.status(400).json({
        error: 'meetingTitle and duration are required'
      });
    }

    const agenda = await AIProductivityService.generateMeetingAgenda({
      meetingTitle,
      participants,
      duration,
      topics,
      objectives
    });

    // Log AI usage
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.DATA_CREATED,
      userId: req.user?.id,
      resourceType: 'AI',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        action: 'agenda_generated',
        meetingTitle,
        duration,
        topicCount: topics.length
      }
    });

    res.json({
      success: true,
      agenda
    });
  } catch (error) {
    console.error('Error generating agenda:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate agenda'
    });
  }
});

/**
 * @route   POST /api/ai/estimate-duration
 * @desc    Estimate task duration using AI
 * @access  Authenticated users
 */
router.post('/estimate-duration', authenticateToken, async (req, res) => {
  try {
    const {
      taskDescription,
      vaSkillLevel = 5,
      historicalTasks = []
    } = req.body;

    if (!taskDescription) {
      return res.status(400).json({ error: 'taskDescription is required' });
    }

    const estimate = await AIProductivityService.estimateTaskDuration(
      taskDescription,
      vaSkillLevel,
      historicalTasks
    );

    res.json({
      success: true,
      estimatedHours: estimate.hours,
      confidence: estimate.confidence,
      breakdown: estimate.breakdown
    });
  } catch (error) {
    console.error('Error estimating duration:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to estimate duration'
    });
  }
});

/**
 * @route   POST /api/ai/generate-social-post
 * @desc    Generate social media post
 * @access  Authenticated users
 */
router.post('/generate-social-post', authenticateToken, async (req, res) => {
  try {
    const {
      platform,
      topic,
      tone = 'professional',
      includeHashtags = true,
      targetAudience
    } = req.body;

    if (!platform || !topic) {
      return res.status(400).json({
        error: 'platform and topic are required'
      });
    }

    const validPlatforms = ['twitter', 'linkedin', 'facebook', 'instagram'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      return res.status(400).json({
        error: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}`
      });
    }

    const post = await AIProductivityService.generateSocialPost({
      platform: platform.toLowerCase(),
      topic,
      tone,
      includeHashtags,
      targetAudience
    });

    // Log AI usage
    await AuditLogService.log({
      eventType: AuditLogService.EVENT_TYPES.DATA_CREATED,
      userId: req.user?.id,
      resourceType: 'AI',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        action: 'social_post_generated',
        platform,
        topic,
        postLength: post.length
      }
    });

    res.json({
      success: true,
      post,
      platform,
      characterCount: post.length
    });
  } catch (error) {
    console.error('Error generating social post:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate social post'
    });
  }
});

/**
 * @route   POST /api/ai/improve-text
 * @desc    Improve/rewrite text for professionalism
 * @access  Authenticated users
 */
router.post('/improve-text', authenticateToken, async (req, res) => {
  try {
    const { text, instructions } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    const improved = await AIProductivityService.improveText(
      text,
      instructions
    );

    res.json({
      success: true,
      original: text,
      improved,
      originalLength: text.length,
      improvedLength: improved.length
    });
  } catch (error) {
    console.error('Error improving text:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to improve text'
    });
  }
});

/**
 * @route   GET /api/ai/status
 * @desc    Check AI service availability
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

    res.json({
      available: hasOpenAI || hasAnthropic,
      providers: {
        openai: hasOpenAI,
        anthropic: hasAnthropic
      },
      features: {
        emailDrafting: hasOpenAI || hasAnthropic,
        summarization: hasOpenAI || hasAnthropic,
        actionExtraction: hasOpenAI || hasAnthropic,
        agendaGeneration: hasOpenAI || hasAnthropic,
        durationEstimation: hasOpenAI || hasAnthropic,
        socialPosts: hasOpenAI || hasAnthropic,
        textImprovement: hasOpenAI || hasAnthropic
      }
    });
  } catch (error) {
    console.error('Error checking AI status:', error);
    res.status(500).json({ error: 'Failed to check AI status' });
  }
});

/**
 * @route   GET /api/ai/usage-stats
 * @desc    Get AI usage statistics
 * @access  Admin only
 */
router.get('/usage-stats', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    const { AuditLog } = require('../models');
    const { Op } = require('sequelize');

    // Build filter for audit logs
    const where = {
      resourceType: 'AI'
    };

    if (userId) {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    // Get usage statistics from audit logs
    const logs = await AuditLog.findAll({
      where,
      attributes: ['userId', 'details', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    // Aggregate statistics
    const stats = {
      totalRequests: logs.length,
      byAction: {},
      byUser: {},
      timeline: {}
    };

    logs.forEach(log => {
      const action = log.details?.action || 'unknown';
      const date = log.createdAt.toISOString().split('T')[0];

      // Count by action type
      stats.byAction[action] = (stats.byAction[action] || 0) + 1;

      // Count by user
      if (log.userId) {
        stats.byUser[log.userId] = (stats.byUser[log.userId] || 0) + 1;
      }

      // Count by date
      stats.timeline[date] = (stats.timeline[date] || 0) + 1;
    });

    res.json({
      success: true,
      period: {
        startDate: startDate || 'all time',
        endDate: endDate || 'now'
      },
      statistics: stats
    });
  } catch (error) {
    console.error('Error fetching AI usage stats:', error);
    res.status(500).json({ error: 'Failed to fetch usage statistics' });
  }
});

module.exports = router;
