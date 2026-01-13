import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/services/aiService'

export async function POST(request: NextRequest) {
  try {
    // Check if AI service is available
    if (!aiService.isAvailable()) {
      return NextResponse.json(
        {
          error: 'AI service not configured',
          message: 'No AI providers are configured. Please add API keys to environment variables.',
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { message, conversationHistory, context } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get AI response
    const response = await aiService.assistantResponse(message, conversationHistory, context)

    return NextResponse.json({
      success: true,
      response: response.content,
      provider: response.provider,
      model: response.model,
      tokensUsed: response.tokensUsed,
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      {
        error: 'AI request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Get available AI providers
export async function GET() {
  return NextResponse.json({
    available: aiService.isAvailable(),
    providers: aiService.getAvailableProviders(),
  })
}
