import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { assistantId } = body

    // Verify the user is an admin or the assistant themselves
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = await payload.auth.verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user is admin or the assistant
    if (decoded.role !== 'admin' && decoded.id !== assistantId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get the assistant user
    const assistant = await payload.findByID({
      collection: 'users',
      id: assistantId,
    })

    if (!assistant || assistant.role !== 'assistant') {
      return NextResponse.json({ error: 'Assistant not found' }, { status: 404 })
    }

    // Check if onboarding already exists
    const existingOnboarding = await payload.find({
      collection: 'assistant-onboarding',
      where: {
        assistant: {
          equals: assistantId,
        },
      },
    })

    if (existingOnboarding.docs.length > 0) {
      return NextResponse.json({
        error: 'Onboarding already exists for this assistant',
        onboarding: existingOnboarding.docs[0]
      }, { status: 400 })
    }

    // Get all active training modules
    const trainingModules = await payload.find({
      collection: 'training-modules',
      where: {
        isActive: {
          equals: true,
        },
      },
      sort: 'order',
    })

    // Create onboarding record
    const onboarding = await payload.create({
      collection: 'assistant-onboarding',
      data: {
        assistant: assistantId,
        status: 'not_started',
        progress: {
          completedModules: [],
          overallProgress: 0,
        },
        trainingModules: trainingModules.docs.map((module, index) => ({
          module: module.id,
          required: module.required,
          order: index + 1,
        })),
      },
    })

    return NextResponse.json({
      success: true,
      onboarding,
      trainingModules: trainingModules.docs,
    })

  } catch (error) {
    console.error('Start onboarding error:', error)
    return NextResponse.json({
      error: 'Failed to start onboarding',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
