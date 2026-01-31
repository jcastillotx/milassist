/**
 * AI Productivity Service
 * Integrates OpenAI and Anthropic for VA productivity enhancement
 */

const { logger } = require('../config/logger');

class AIProductivityService {
  constructor() {
    // Initialize API clients
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.anthropicKey = process.env.ANTHROPIC_API_KEY;
    
    if (!this.anthropicKey && !this.openaiKey) {
      logger.warn('No AI API keys configured. AI features will be disabled.');
    }
  }

  /**
   * Generate email draft using AI
   */
  async generateEmailDraft(context) {
    const {
      recipient,
      purpose,
      tone = 'professional',
      keyPoints = [],
      previousContext = null,
    } = context;

    try {
      const prompt = `Draft a ${tone} email to ${recipient} for the purpose of ${purpose}.

Key points to include:
${keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

${previousContext ? `Previous context:\n${previousContext}\n` : ''}

Keep it concise, actionable, and professional. Include a clear call-to-action if applicable.`;

      // Use Anthropic Claude (preferred for writing)
      if (this.anthropicKey) {
        const Anthropic = require('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey: this.anthropicKey });

        const message = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: prompt,
          }],
        });

        return {
          draft: message.content[0].text,
          provider: 'anthropic',
          model: 'claude-3-5-sonnet',
        };
      }

      // Fallback to OpenAI
      if (this.openaiKey) {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: this.openaiKey });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{
            role: 'user',
            content: prompt,
          }],
          max_tokens: 1000,
        });

        return {
          draft: completion.choices[0].message.content,
          provider: 'openai',
          model: 'gpt-4-turbo',
        };
      }

      throw new Error('No AI provider configured');
    } catch (error) {
      logger.error('Email draft generation failed:', error);
      throw error;
    }
  }

  /**
   * Summarize document or long text
   */
  async summarizeDocument(text, style = 'bullet-points') {
    try {
      let prompt;
      
      if (style === 'bullet-points') {
        prompt = `Summarize this document in 3-5 concise bullet points:\n\n${text}`;
      } else if (style === 'executive') {
        prompt = `Provide an executive summary (2-3 sentences) of this document:\n\n${text}`;
      } else {
        prompt = `Summarize this document:\n\n${text}`;
      }

      if (this.anthropicKey) {
        const Anthropic = require('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey: this.anthropicKey });

        const message = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: prompt,
          }],
        });

        return message.content[0].text;
      }

      if (this.openaiKey) {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: this.openaiKey });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{
            role: 'user',
            content: prompt,
          }],
          max_tokens: 500,
        });

        return completion.choices[0].message.content;
      }

      throw new Error('No AI provider configured');
    } catch (error) {
      logger.error('Document summarization failed:', error);
      throw error;
    }
  }

  /**
   * Extract action items from meeting notes or email
   */
  async extractActionItems(text) {
    try {
      const prompt = `Extract all action items from this text. For each action item, identify:
1. The task description
2. The person responsible (if mentioned)
3. The deadline (if mentioned)

Format as JSON array with structure: [{ task, assignee, deadline }]

Text:
${text}`;

      if (this.anthropicKey) {
        const Anthropic = require('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey: this.anthropicKey });

        const message = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: prompt,
          }],
        });

        const responseText = message.content[0].text;
        // Parse JSON from response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }

        return [];
      }

      if (this.openaiKey) {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: this.openaiKey });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{
            role: 'user',
            content: prompt,
          }],
          max_tokens: 1000,
          response_format: { type: 'json_object' },
        });

        const response = JSON.parse(completion.choices[0].message.content);
        return response.actionItems || [];
      }

      throw new Error('No AI provider configured');
    } catch (error) {
      logger.error('Action item extraction failed:', error);
      return [];
    }
  }

  /**
   * Generate meeting agenda based on topic
   */
  async generateMeetingAgenda(topic, duration, attendees, goals = []) {
    try {
      const prompt = `Generate a meeting agenda for a ${duration}-minute meeting about "${topic}".

Attendees: ${attendees.join(', ')}
${goals.length > 0 ? `Goals:\n${goals.map(g => `- ${g}`).join('\n')}` : ''}

Include:
1. Welcome & introductions (if applicable)
2. Main discussion topics with time allocations
3. Key questions to address
4. Next steps & action items section

Format as a structured agenda.`;

      if (this.anthropicKey) {
        const Anthropic = require('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey: this.anthropicKey });

        const message = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: prompt,
          }],
        });

        return message.content[0].text;
      }

      if (this.openaiKey) {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: this.openaiKey });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{
            role: 'user',
            content: prompt,
          }],
          max_tokens: 1500,
        });

        return completion.choices[0].message.content;
      }

      throw new Error('No AI provider configured');
    } catch (error) {
      logger.error('Meeting agenda generation failed:', error);
      throw error;
    }
  }

  /**
   * Estimate task duration based on description and historical data
   */
  async estimateTaskDuration(taskDescription, vaSkillLevel = 5, historicalTasks = []) {
    try {
      let historicalContext = '';
      if (historicalTasks.length > 0) {
        historicalContext = `\nSimilar historical tasks:\n${historicalTasks.map(t => 
          `- "${t.description}": ${t.actualDuration} hours`
        ).join('\n')}`;
      }

      const prompt = `Estimate how long this task will take for a virtual assistant with skill level ${vaSkillLevel}/10:

Task: "${taskDescription}"
${historicalContext}

Respond with ONLY a number representing hours (can be decimal). Consider:
- Task complexity
- Skill level of the VA
- Historical data if provided

Example responses: "2.5", "4", "0.5"`;

      if (this.openaiKey) {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: this.openaiKey });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{
            role: 'user',
            content: prompt,
          }],
          max_tokens: 50,
        });

        const response = completion.choices[0].message.content.trim();
        const hours = parseFloat(response);

        return isNaN(hours) ? null : hours;
      }

      if (this.anthropicKey) {
        const Anthropic = require('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey: this.anthropicKey });

        const message = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 50,
          messages: [{
            role: 'user',
            content: prompt,
          }],
        });

        const response = message.content[0].text.trim();
        const hours = parseFloat(response);

        return isNaN(hours) ? null : hours;
      }

      return null;
    } catch (error) {
      logger.error('Task duration estimation failed:', error);
      return null;
    }
  }

  /**
   * Generate social media post from topic/article
   */
  async generateSocialPost(content, platform, tone = 'professional', hashtags = true) {
    try {
      const platformGuidelines = {
        twitter: '280 characters max, concise and engaging',
        linkedin: 'Professional, 1-2 paragraphs, thought leadership',
        facebook: 'Conversational, 2-3 paragraphs, encourage engagement',
        instagram: 'Visual-focused, use emojis, 2200 character limit',
      };

      const prompt = `Create a ${platform} post based on this content:

${content}

Platform: ${platform}
Guidelines: ${platformGuidelines[platform] || 'Standard social media post'}
Tone: ${tone}
${hashtags ? 'Include relevant hashtags' : 'No hashtags'}

${platform === 'twitter' ? 'Make it fit in 280 characters.' : ''}`;

      if (this.anthropicKey) {
        const Anthropic = require('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey: this.anthropicKey });

        const message = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: prompt,
          }],
        });

        return message.content[0].text;
      }

      if (this.openaiKey) {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: this.openaiKey });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{
            role: 'user',
            content: prompt,
          }],
          max_tokens: 500,
        });

        return completion.choices[0].message.content;
      }

      throw new Error('No AI provider configured');
    } catch (error) {
      logger.error('Social post generation failed:', error);
      throw error;
    }
  }

  /**
   * Improve/rewrite text for clarity and professionalism
   */
  async improveText(text, instructions = 'Make it more professional and clear') {
    try {
      const prompt = `Improve this text based on these instructions: "${instructions}"

Original text:
${text}

Provide the improved version without explanations.`;

      if (this.anthropicKey) {
        const Anthropic = require('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey: this.anthropicKey });

        const message = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: prompt,
          }],
        });

        return message.content[0].text;
      }

      if (this.openaiKey) {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: this.openaiKey });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{
            role: 'user',
            content: prompt,
          }],
          max_tokens: 1000,
        });

        return completion.choices[0].message.content;
      }

      throw new Error('No AI provider configured');
    } catch (error) {
      logger.error('Text improvement failed:', error);
      throw error;
    }
  }

  /**
   * Check if AI services are available
   */
  isAvailable() {
    return !!(this.openaiKey || this.anthropicKey);
  }

  /**
   * Get usage stats (for billing/monitoring)
   */
  async getUsageStats(userId, startDate, endDate) {
    // This would track AI API calls per user
    // For now, return placeholder
    return {
      totalRequests: 0,
      emailDrafts: 0,
      summaries: 0,
      estimations: 0,
    };
  }
}

module.exports = new AIProductivityService();
