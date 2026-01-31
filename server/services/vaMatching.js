/**
 * VA Matching Algorithm Service
 * Intelligently matches clients with the best VA based on multiple criteria
 */

const { logger } = require('../config/logger');
const { Op } = require('sequelize');

class VAMatchingService {
  // Matching weights for score calculation
  static WEIGHTS = {
    SKILLS: 0.40,          // 40% - Most important
    INDUSTRY: 0.20,        // 20%
    TIMEZONE: 0.15,        // 15%
    LANGUAGE: 0.15,        // 15%
    BUDGET: 0.10,          // 10%
  };

  /**
   * Find best VA matches for client requirements
   */
  static async matchVAToClient(requirements) {
    const {
      requiredSkills = [],
      preferredSkills = [],
      industry = null,
      budget = null,
      timezone = null,
      languages = ['en'],
      tier = 'specialized',
      hoursPerWeek = 40,
    } = requirements;

    try {
      const VAProfile = require('../models/VAProfile');

      // Base query - get available VAs
      const baseWhere = {
        status: 'available',
        backgroundCheckStatus: 'approved',
        ndaSigned: true,
      };

      // Filter by tier
      if (tier) {
        baseWhere.tier = this.getTierRange(tier);
      }

      // Filter by budget (hourly rate)
      if (budget) {
        baseWhere.hourlyRate = { [Op.lte]: budget };
      }

      // Filter by capacity
      const minCapacity = hoursPerWeek || 10;
      baseWhere.currentCapacity = { [Op.lte]: 40 - minCapacity };

      // Fetch candidate VAs
      const candidates = await VAProfile.findAll({
        where: baseWhere,
        include: [{
          model: require('../models/User'),
          as: 'user',
          attributes: ['id', 'name', 'email', 'profileImage'],
        }],
      });

      logger.info(`Found ${candidates.length} candidate VAs for matching`);

      // Score each VA
      const scoredVAs = candidates.map(va => ({
        va,
        score: this.calculateMatchScore(va, requirements),
        breakdown: this.getScoreBreakdown(va, requirements),
      }));

      // Sort by score descending
      scoredVAs.sort((a, b) => b.score - a.score);

      // Return top 5
      return scoredVAs.slice(0, 5).map(result => ({
        vaId: result.va.userId,
        vaProfile: result.va,
        matchScore: Math.round(result.score),
        scoreBreakdown: result.breakdown,
        availability: this.getAvailabilityDescription(result.va),
        estimatedCost: this.estimateMonthlyCost(result.va, hoursPerWeek),
      }));
    } catch (error) {
      logger.error('VA matching error:', error);
      throw error;
    }
  }

  /**
   * Calculate overall match score (0-100)
   */
  static calculateMatchScore(va, requirements) {
    let totalScore = 0;

    // 1. Skills match (40% weight)
    const skillScore = this.calculateSkillScore(va, requirements);
    totalScore += skillScore * this.WEIGHTS.SKILLS;

    // 2. Industry experience (20% weight)
    const industryScore = this.calculateIndustryScore(va, requirements);
    totalScore += industryScore * this.WEIGHTS.INDUSTRY;

    // 3. Timezone compatibility (15% weight)
    const timezoneScore = this.calculateTimezoneScore(va, requirements);
    totalScore += timezoneScore * this.WEIGHTS.TIMEZONE;

    // 4. Language match (15% weight)
    const languageScore = this.calculateLanguageScore(va, requirements);
    totalScore += languageScore * this.WEIGHTS.LANGUAGE;

    // 5. Budget efficiency (10% weight)
    const budgetScore = this.calculateBudgetScore(va, requirements);
    totalScore += budgetScore * this.WEIGHTS.BUDGET;

    // Bonus factors (up to +10 points)
    const bonusScore = this.calculateBonusScore(va);
    totalScore += bonusScore;

    return Math.min(100, totalScore);
  }

  /**
   * Calculate skill match score (0-100)
   */
  static calculateSkillScore(va, requirements) {
    const { requiredSkills = [], preferredSkills = [] } = requirements;
    const vaSkills = va.skills || [];
    const toolProficiency = va.toolProficiency || {};

    if (requiredSkills.length === 0) return 100;

    // Check required skills (must have ALL)
    const hasAllRequired = requiredSkills.every(skill => 
      vaSkills.includes(skill) || Object.keys(toolProficiency).includes(skill)
    );

    if (!hasAllRequired) return 0; // Disqualified

    // Count preferred skills (nice to have)
    const matchedPreferred = preferredSkills.filter(skill =>
      vaSkills.includes(skill) || Object.keys(toolProficiency).includes(skill)
    ).length;

    const preferredScore = preferredSkills.length > 0 
      ? (matchedPreferred / preferredSkills.length) * 30 
      : 0;

    // Factor in proficiency level for matched skills
    const proficiencyScore = this.calculateProficiencyScore(
      [...requiredSkills, ...preferredSkills],
      toolProficiency
    );

    return 70 + preferredScore + Math.min(proficiencyScore, 30);
  }

  /**
   * Calculate proficiency score based on tool expertise
   */
  static calculateProficiencyScore(skills, toolProficiency) {
    if (skills.length === 0) return 0;

    const scores = skills
      .filter(skill => toolProficiency[skill])
      .map(skill => toolProficiency[skill]);

    if (scores.length === 0) return 0;

    const avgProficiency = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return (avgProficiency / 10) * 30; // Convert 0-10 scale to 0-30 bonus
  }

  /**
   * Calculate industry experience score (0-100)
   */
  static calculateIndustryScore(va, requirements) {
    if (!requirements.industry) return 100; // No preference

    const vaIndustries = va.industryExperience || [];
    
    if (vaIndustries.includes(requirements.industry)) {
      return 100; // Perfect match
    }

    // Check for related industries
    const relatedIndustries = this.getRelatedIndustries(requirements.industry);
    const hasRelated = relatedIndustries.some(ind => vaIndustries.includes(ind));

    if (hasRelated) {
      return 70; // Somewhat related
    }

    // Has some industry experience, just not matching
    if (vaIndustries.length > 0) {
      return 40;
    }

    return 0; // No industry experience
  }

  /**
   * Calculate timezone compatibility score (0-100)
   */
  static calculateTimezoneScore(va, requirements) {
    if (!requirements.timezone) return 100; // No preference

    const vaTimezone = va.timezone;
    const clientTimezone = requirements.timezone;

    // Same timezone = perfect
    if (vaTimezone === clientTimezone) return 100;

    // Calculate timezone offset difference
    const offsetDiff = Math.abs(this.getTimezoneOffset(vaTimezone) - this.getTimezoneOffset(clientTimezone));

    // Within 2 hours = excellent
    if (offsetDiff <= 2) return 90;

    // 3-4 hours = good
    if (offsetDiff <= 4) return 70;

    // 5-6 hours = acceptable
    if (offsetDiff <= 6) return 50;

    // 7+ hours = challenging
    return 30;
  }

  /**
   * Calculate language match score (0-100)
   */
  static calculateLanguageScore(va, requirements) {
    const requiredLanguages = requirements.languages || ['en'];
    const vaLanguages = va.languages || [];

    if (requiredLanguages.length === 0) return 100;

    // Check if VA speaks all required languages
    const matchedLanguages = requiredLanguages.filter(lang => 
      vaLanguages.some(vaLang => vaLang.code === lang && ['native', 'fluent', 'professional'].includes(vaLang.level))
    );

    const matchPercent = matchedLanguages.length / requiredLanguages.length;

    if (matchPercent === 1) return 100; // All languages
    if (matchPercent >= 0.75) return 85; // Most languages
    if (matchPercent >= 0.5) return 60; // Half the languages
    return matchPercent * 50; // Proportional
  }

  /**
   * Calculate budget efficiency score (0-100)
   */
  static calculateBudgetScore(va, requirements) {
    if (!requirements.budget) return 100; // No budget constraint

    const vaRate = parseFloat(va.hourlyRate);
    const budget = requirements.budget;

    if (vaRate > budget) return 0; // Over budget (shouldn't happen due to filter)

    // Within budget - score based on value
    const utilizationPercent = (vaRate / budget) * 100;

    // Best value is 70-90% of budget (not too cheap, not too expensive)
    if (utilizationPercent >= 70 && utilizationPercent <= 90) {
      return 100;
    }

    // Cheaper is good but might indicate less experience
    if (utilizationPercent < 70) {
      return 70 + (utilizationPercent / 70) * 20;
    }

    // Close to budget is still good
    if (utilizationPercent > 90) {
      return 100 - ((utilizationPercent - 90) * 2);
    }

    return 80;
  }

  /**
   * Calculate bonus score from additional factors
   */
  static calculateBonusScore(va) {
    let bonus = 0;

    // High rating (up to +5 points)
    if (va.rating >= 4.5) bonus += 5;
    else if (va.rating >= 4.0) bonus += 3;
    else if (va.rating >= 3.5) bonus += 1;

    // Fast response time (up to +3 points)
    if (va.responseTime <= 30) bonus += 3; // Under 30 minutes
    else if (va.responseTime <= 60) bonus += 2; // Under 1 hour
    else if (va.responseTime <= 120) bonus += 1; // Under 2 hours

    // Experience level (up to +2 points)
    if (va.yearsExperience >= 5) bonus += 2;
    else if (va.yearsExperience >= 3) bonus += 1;

    return bonus;
  }

  /**
   * Get detailed score breakdown for transparency
   */
  static getScoreBreakdown(va, requirements) {
    return {
      skills: Math.round(this.calculateSkillScore(va, requirements) * this.WEIGHTS.SKILLS),
      industry: Math.round(this.calculateIndustryScore(va, requirements) * this.WEIGHTS.INDUSTRY),
      timezone: Math.round(this.calculateTimezoneScore(va, requirements) * this.WEIGHTS.TIMEZONE),
      language: Math.round(this.calculateLanguageScore(va, requirements) * this.WEIGHTS.LANGUAGE),
      budget: Math.round(this.calculateBudgetScore(va, requirements) * this.WEIGHTS.BUDGET),
      bonus: this.calculateBonusScore(va),
    };
  }

  /**
   * Get tier range for filtering
   */
  static getTierRange(tier) {
    const tierOrder = ['general', 'specialized', 'executive', 'technical'];
    const index = tierOrder.indexOf(tier);
    
    if (index === -1) return tier;

    // Return tier and higher
    return { [Op.in]: tierOrder.slice(index) };
  }

  /**
   * Get related industries for matching
   */
  static getRelatedIndustries(industry) {
    const industryGroups = {
      'technology': ['saas', 'software', 'tech_startup', 'it_services'],
      'saas': ['technology', 'software', 'tech_startup'],
      'healthcare': ['medical', 'pharma', 'biotech', 'telemedicine'],
      'finance': ['fintech', 'banking', 'investment', 'insurance'],
      'real_estate': ['property_management', 'construction'],
      'ecommerce': ['retail', 'online_business'],
      'consulting': ['professional_services', 'business_services'],
    };

    return industryGroups[industry] || [];
  }

  /**
   * Get timezone offset in hours
   */
  static getTimezoneOffset(timezone) {
    const offsetMap = {
      'America/New_York': -5,
      'America/Chicago': -6,
      'America/Denver': -7,
      'America/Los_Angeles': -8,
      'Europe/London': 0,
      'Europe/Paris': 1,
      'Asia/Manila': 8,
      'Asia/Kolkata': 5.5,
      'Australia/Sydney': 11,
    };

    return offsetMap[timezone] || 0;
  }

  /**
   * Get human-readable availability description
   */
  static getAvailabilityDescription(va) {
    const availableHours = va.maxCapacity - va.currentCapacity;
    
    if (availableHours <= 0) return 'Fully booked';
    if (availableHours < 10) return `Limited availability (${availableHours} hrs/week)`;
    if (availableHours < 20) return `Part-time available (${availableHours} hrs/week)`;
    return `Full-time available (${availableHours} hrs/week)`;
  }

  /**
   * Estimate monthly cost
   */
  static estimateMonthlyCost(va, hoursPerWeek) {
    const hourlyRate = parseFloat(va.hourlyRate);
    const monthlyHours = hoursPerWeek * 4.33; // Average weeks per month
    return Math.round(hourlyRate * monthlyHours);
  }

  /**
   * Save match for future reference
   */
  static async saveMatch(clientId, vaId, matchScore, requirements) {
    try {
      const VAMatch = require('../models/VAMatch');
      
      await VAMatch.create({
        clientId,
        vaId,
        matchScore,
        requirements: JSON.stringify(requirements),
        status: 'pending',
      });
    } catch (error) {
      logger.error('Error saving VA match:', error);
    }
  }
}

module.exports = VAMatchingService;
