import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { onboardingId, moduleId, assessmentResults } = body

    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = await payload.auth.verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get the onboarding record
    const onboarding = await payload.findByID({
      collection: 'assistant-onboarding',
      id: onboardingId,
    })

    if (!onboarding) {
      return NextResponse.json({ error: 'Onboarding record not found' }, { status: 404 })
    }

    // Check if user is admin or the assistant
    if (decoded.role !== 'admin' && decoded.id !== onboarding.assistant) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if module is already completed
    const existingCompletion = onboarding.progress?.completedModules?.find(
      (completion: any) => completion.moduleId === moduleId
    )

    if (existingCompletion) {
      return NextResponse.json({
        error: 'Module already completed',
        completion: existingCompletion
      }, { status: 400 })
    }

    // Calculate score if assessment results provided
    let score = 100 // Default score for modules without assessment
    if (assessmentResults) {
      const totalQuestions = assessmentResults.length
      const correctAnswers = assessmentResults.filter((result: any) => result.correct).length
      score = Math.round((correctAnswers / totalQuestions) * 100)
    }

    // Add completion record
    const completedModules = [
      ...(onboarding.progress?.completedModules || []),
      {
        moduleId,
        completedAt: new Date(),
        score,
      },
    ]

    // Calculate overall progress
    const totalModules = onboarding.trainingModules?.length || 0
    const completedCount = completedModules.length
    const overallProgress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0

    // Update onboarding record
    const updatedOnboarding = await payload.update({
      collection: 'assistant-onboarding',
      id: onboardingId,
      data: {
        progress: {
          completedModules,
          overallProgress,
        },
        // Auto-update status based on progress
        status: overallProgress === 100 ? 'completed' : 'in_progress',
      },
    })

    // If assessment results provided, store them
    if (assessmentResults) {
      // Find the assessment for this module
      const trainingModule = onboarding.trainingModules?.find(
        (tm: any) => tm.module === moduleId
      )

      if (trainingModule?.assessment) {
        await payload.create({
          collection: 'assessment-results',
          data: {
            assessment: trainingModule.assessment,
            assistant: onboarding.assistant,
            onboarding: onboardingId,
            results: assessmentResults,
            score,
            passed: score >= 70, // Assuming 70% passing score
            completedAt: new Date(),
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      onboarding: updatedOnboarding,
      score,
      overallProgress,
    })

  } catch (error) {
    console.error('Complete module error:', error)
    return NextResponse.json({
      error: 'Failed to complete module',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
