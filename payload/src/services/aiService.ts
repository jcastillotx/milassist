/**
 * AI Service - Multi-provider AI integration with automatic fallback
 * Supports: OpenRouter, Claude, GitHub Copilot, OpenAI, Grok, Gemini
 */

interface AIProvider {
  name: string
  apiKey: string | undefined
  endpoint: string
  model: string
  enabled: boolean
}

interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AIResponse {
  content: string
  provider: string
  model: string
  tokensUsed?: number
}

export class AIService {
  private providers: AIProvider[]
  private currentProviderIndex: number = 0

  constructor() {
    // Initialize all AI providers in priority order
    this.providers = [
      {
        name: 'OpenRouter',
        apiKey: process.env.OPENROUTER_API_KEY,
        endpoint: 'https://openrouter.ai/api/v1/chat/completions',
        model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
        enabled: !!process.env.OPENROUTER_API_KEY,
      },
      {
        name: 'Claude',
        apiKey: process.env.ANTHROPIC_API_KEY,
        endpoint: 'https://api.anthropic.com/v1/messages',
        model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
        enabled: !!process.env.ANTHROPIC_API_KEY,
      },
      {
        name: 'OpenAI',
        apiKey: process.env.OPENAI_API_KEY,
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        enabled: !!process.env.OPENAI_API_KEY,
      },
      {
        name: 'GitHub Copilot',
        apiKey: process.env.GITHUB_COPILOT_API_KEY,
        endpoint: 'https://api.githubcopilot.com/chat/completions',
        model: process.env.COPILOT_MODEL || 'gpt-4',
        enabled: !!process.env.GITHUB_COPILOT_API_KEY,
      },
      {
        name: 'Grok',
        apiKey: process.env.XAI_API_KEY,
        endpoint: 'https://api.x.ai/v1/chat/completions',
        model: process.env.GROK_MODEL || 'grok-beta',
        enabled: !!process.env.XAI_API_KEY,
      },
      {
        name: 'Gemini',
        apiKey: process.env.GOOGLE_AI_API_KEY,
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
        model: process.env.GEMINI_MODEL || 'gemini-pro',
        enabled: !!process.env.GOOGLE_AI_API_KEY,
      },
    ].filter((provider) => provider.enabled)

    if (this.providers.length === 0) {
      console.warn('⚠️  No AI providers configured. AI features will be disabled.')
    } else {
      console.log(
        `✅ AI Service initialized with ${this.providers.length} provider(s): ${this.providers.map((p) => p.name).join(', ')}`
      )
    }
  }

  /**
   * Check if any AI provider is available
   */
  isAvailable(): boolean {
    return this.providers.length > 0
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): string[] {
    return this.providers.map((p) => p.name)
  }

  /**
   * Send a chat completion request with automatic fallback
   */
  async chat(
    messages: AIMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
    }
  ): Promise<AIResponse> {
    if (!this.isAvailable()) {
      throw new Error('No AI providers configured')
    }

    // Add system prompt if provided
    if (options?.systemPrompt) {
      messages = [
        { role: 'system', content: options.systemPrompt },
        ...messages.filter((m) => m.role !== 'system'),
      ]
    }

    // Try each provider in order until one succeeds
    const errors: Array<{ provider: string; error: string }> = []

    for (let i = 0; i < this.providers.length; i++) {
      const providerIndex = (this.currentProviderIndex + i) % this.providers.length
      const provider = this.providers[providerIndex]

      try {
        console.log(`🤖 Attempting AI request with ${provider.name}...`)
        const response = await this.callProvider(provider, messages, options)

        // Success! Update current provider index for next request
        this.currentProviderIndex = providerIndex
        console.log(`✅ AI request successful with ${provider.name}`)

        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`❌ ${provider.name} failed:`, errorMessage)
        errors.push({ provider: provider.name, error: errorMessage })

        // Continue to next provider
        continue
      }
    }

    // All providers failed
    throw new Error(
      `All AI providers failed:\n${errors.map((e) => `- ${e.provider}: ${e.error}`).join('\n')}`
    )
  }

  /**
   * Call a specific AI provider
   */
  private async callProvider(
    provider: AIProvider,
    messages: AIMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
    }
  ): Promise<AIResponse> {
    switch (provider.name) {
      case 'Claude':
        return this.callClaude(provider, messages, options)
      case 'Gemini':
        return this.callGemini(provider, messages, options)
      default:
        // OpenRouter, OpenAI, Copilot, Grok use OpenAI-compatible API
        return this.callOpenAICompatible(provider, messages, options)
    }
  }

  /**
   * Call OpenAI-compatible API (OpenRouter, OpenAI, Copilot, Grok)
   */
  private async callOpenAICompatible(
    provider: AIProvider,
    messages: AIMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
    }
  ): Promise<AIResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.apiKey}`,
    }

    // OpenRouter specific headers
    if (provider.name === 'OpenRouter') {
      headers['HTTP-Referer'] = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
      headers['X-Title'] = 'MilAssist Platform'
    }

    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: provider.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`${provider.name} API error: ${response.status} - ${error}`)
    }

    const data = await response.json()

    return {
      content: data.choices[0].message.content,
      provider: provider.name,
      model: provider.model,
      tokensUsed: data.usage?.total_tokens,
    }
  }

  /**
   * Call Claude API (Anthropic)
   */
  private async callClaude(
    provider: AIProvider,
    messages: AIMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
    }
  ): Promise<AIResponse> {
    // Extract system message
    const systemMessage = messages.find((m) => m.role === 'system')?.content
    const conversationMessages = messages.filter((m) => m.role !== 'system')

    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': provider.apiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: provider.model,
        messages: conversationMessages,
        system: systemMessage,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Claude API error: ${response.status} - ${error}`)
    }

    const data = await response.json()

    return {
      content: data.content[0].text,
      provider: provider.name,
      model: provider.model,
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
    }
  }

  /**
   * Call Gemini API (Google)
   */
  private async callGemini(
    provider: AIProvider,
    messages: AIMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
    }
  ): Promise<AIResponse> {
    // Convert messages to Gemini format
    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

    const systemInstruction = messages.find((m) => m.role === 'system')?.content

    const endpoint = `${provider.endpoint}/${provider.model}:generateContent?key=${provider.apiKey}`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 2000,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gemini API error: ${response.status} - ${error}`)
    }

    const data = await response.json()

    return {
      content: data.candidates[0].content.parts[0].text,
      provider: provider.name,
      model: provider.model,
      tokensUsed: data.usageMetadata?.totalTokenCount,
    }
  }

  /**
   * Generate a completion for a single prompt
   */
  async complete(
    prompt: string,
    options?: {
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
    }
  ): Promise<AIResponse> {
    return this.chat([{ role: 'user', content: prompt }], options)
  }

  /**
   * Analyze text and return insights
   */
  async analyze(
    text: string,
    analysisType: 'sentiment' | 'summary' | 'keywords' | 'custom',
    customPrompt?: string
  ): Promise<AIResponse> {
    const prompts = {
      sentiment: `Analyze the sentiment of the following text and provide a brief analysis:\n\n${text}`,
      summary: `Provide a concise summary of the following text:\n\n${text}`,
      keywords: `Extract the main keywords and topics from the following text:\n\n${text}`,
      custom: customPrompt || text,
    }

    return this.complete(prompts[analysisType])
  }

  /**
   * Generate a response for the AI assistant feature
   */
  async assistantResponse(
    userMessage: string,
    conversationHistory: AIMessage[] = [],
    context?: {
      userName?: string
      userRole?: string
      taskContext?: string
    }
  ): Promise<AIResponse> {
    const systemPrompt = `You are an AI assistant for MilAssist, a platform that helps military personnel and their families with administrative tasks, travel planning, and document management.

${context?.userName ? `You are assisting ${context.userName}` : 'You are assisting a user'}.
${context?.userRole ? `User role: ${context.userRole}` : ''}
${context?.taskContext ? `Current context: ${context.taskContext}` : ''}

Be helpful, professional, and concise. Provide actionable advice when possible.`

    const messages: AIMessage[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ]

    return this.chat(messages, { systemPrompt, temperature: 0.7, maxTokens: 1000 })
  }
}

// Export singleton instance
export const aiService = new AIService()
