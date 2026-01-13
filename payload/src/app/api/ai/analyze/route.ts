import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/services/aiService'

export async function POST(request: NextRequest) {
  try {
    if (!aiService.isAvailable()) {
      return NextResponse.json(
        {
          error: 'AI service not configured',
          message: 'No AI providers are configured.',
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { text, analysisType, customPrompt } = body

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    if (!['sentiment', 'summary', 'keywords', 'custom'].includes(analysisType)) {
      return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 })
    }

    // Analyze text
    const response = await aiService.analyze(text, analysisType, customPrompt)

    return NextResponse.json({
      success: true,
      analysis: response.content,
      provider: response.provider,
      model: response.model,
      tokensUsed: response.tokensUsed,
    })
  } catch (error) {
    console.error('AI analysis error:', error)
    return NextResponse.json(
      {
        error: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
