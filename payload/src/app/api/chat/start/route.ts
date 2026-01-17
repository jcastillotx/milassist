import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { clientId, subject, priority = 'normal', channel = 'ai_chatbot', metadata } = body

    // TODO: Implement proper authentication with Payload 3.0
    const decoded = { id: clientId, role: 'client' }

    // Verify the user is the client or an admin
    if (decoded.id !== clientId && decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get client information
    const client = await payload.findByID({
      collection: 'users',
      id: clientId,
    })

    if (!client || client.role !== 'client') {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Try to find assigned assistant for this client
    let assignedAssistant = null
    try {
      // Look for tasks where this client has an assigned assistant
      const recentTasks = await payload.find({
        collection: 'tasks',
        where: {
          clientId: {
            equals: clientId,
          },
          assistantId: {
            exists: true,
          },
        },
        sort: '-createdAt',
        limit: 1,
      })

      if (recentTasks.docs.length > 0) {
        assignedAssistant = recentTasks.docs[0].assistantId
      }
    } catch (error) {
      console.warn('Could not find assigned assistant:', error)
    }

    // Check if assigned assistant is available
    let availableAssistant = null
    let onCallAssistant = null

    if (assignedAssistant) {
      // Check if assigned assistant is on-call and available
      const onCallStatus = await payload.find({
        collection: 'on-call-assistants',
        where: {
          assistant: {
            equals: assignedAssistant,
          },
          isOnCall: {
            equals: true,
          },
          isActive: {
            equals: true,
          },
        },
      })

      if (onCallStatus.docs.length > 0) {
        const assistantData = onCallStatus.docs[0]
        // Check if assistant has capacity
        if (assistantData.currentChatCount < assistantData.maxConcurrentChats) {
          availableAssistant = assignedAssistant
        }
      }
    }

    // If assigned assistant not available, find on-call assistant
    if (!availableAssistant) {
      const onCallAssistants = await payload.find({
        collection: 'on-call-assistants',
        where: {
          isOnCall: {
            equals: true,
          },
          isActive: {
            equals: true,
          },
        },
        sort: 'currentChatCount', // Prioritize least busy
      })

      // Find first available assistant
      for (const assistantData of onCallAssistants.docs) {
        if (assistantData.currentChatCount < assistantData.maxConcurrentChats) {
          onCallAssistant = assistantData.assistant
          availableAssistant = assistantData.assistant
          break
        }
      }
    }

    // Create the chat
    const chat = await payload.create({
      collection: 'live-chats',
      data: {
        client: clientId,
        assignedAssistant: assignedAssistant,
        onCallAssistant: onCallAssistant,
        status: availableAssistant ? 'in_progress' : 'waiting',
        priority,
        channel,
        subject,
        startedAt: new Date(),
        assignedAt: availableAssistant ? new Date() : null,
        metadata: metadata || {},
        messages: [
          {
            sender: clientId,
            senderType: 'client',
            content: subject || 'Chat started',
            timestamp: new Date(),
            isRead: false,
          },
        ],
      },
    })

    // Update assistant's chat count if assigned
    if (availableAssistant) {
      const assistantRecord = await payload.find({
        collection: 'on-call-assistants',
        where: {
          assistant: {
            equals: availableAssistant,
          },
        },
      })

      if (assistantRecord.docs.length > 0) {
        await payload.update({
          collection: 'on-call-assistants',
          id: assistantRecord.docs[0].id,
          data: {
            currentChatCount: assistantRecord.docs[0].currentChatCount + 1,
            lastActivity: new Date().toISOString(),
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      chat,
      assignedAssistant: availableAssistant,
      status: availableAssistant ? 'assigned' : 'waiting',
    })

  } catch (error) {
    console.error('Start chat error:', error)
    return NextResponse.json({
      error: 'Failed to start chat',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
