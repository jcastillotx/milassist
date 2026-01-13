import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../payload.config'
import chatService from '../../../services/chatService'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { chatId, content, attachments = [] } = body

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

    // Get the chat
    const chat = await payload.findByID({
      collection: 'live-chats',
      id: chatId,
    })

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    // Verify user has access to this chat
    const isClient = decoded.id === chat.client && decoded.role === 'client'
    const isAssignedAssistant = decoded.id === chat.assignedAssistant || decoded.id === chat.onCallAssistant
    const isAdmin = decoded.role === 'admin'

    if (!isClient && !isAssignedAssistant && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Determine sender type
    let senderType = 'client'
    if (isAssignedAssistant) {
      senderType = 'assistant'
    } else if (isAdmin) {
      senderType = 'assistant' // Admins count as assistants
    }

    // Create the message
    const message = {
      sender: decoded.id,
      senderType,
      content,
      timestamp: new Date(),
      isRead: false,
      attachments: attachments.map((att: any) => ({
        file: att.file,
        filename: att.filename,
      })),
    }

    // Update chat with new message
    const updatedMessages = [...(chat.messages || []), message]

    const updatedChat = await payload.update({
      collection: 'live-chats',
      id: chatId,
      data: {
        messages: updatedMessages,
        // Update first response time if this is the first assistant response
        firstResponseAt: !chat.firstResponseAt && senderType === 'assistant'
          ? new Date()
          : chat.firstResponseAt,
      },
    })

    // If this is from a client and no human assistant is assigned yet, handle with AI
    if (senderType === 'client' && !chat.assignedAssistant && !chat.onCallAssistant && chat.status !== 'in_progress') {
      try {
        // Get AI response
        const aiResponse = await chatService.handleAIChat(chatId, content, chat.client)

        // Add AI response to chat
        const aiMessage = {
          sender: null,
          senderType: 'ai_bot',
          content: aiResponse,
          timestamp: new Date(),
          isRead: false,
        }

        const finalMessages = [...updatedMessages, aiMessage]

        await payload.update({
          collection: 'live-chats',
          id: chatId,
          data: {
            messages: finalMessages,
          },
        })

        return NextResponse.json({
          success: true,
          message,
          aiResponse: aiMessage,
          chat: { ...updatedChat, messages: finalMessages },
        })

      } catch (aiError) {
        console.error('AI chat error:', aiError)
        // If AI fails, try to assign a human assistant
        await chatService.assignAvailableAssistant(chatId)
      }
    }

    // If this is from a client and chat is waiting, try to assign an assistant
    if (senderType === 'client' && chat.status === 'waiting') {
      await assignAvailableAssistant(payload, chatId, chat)
    }

    return NextResponse.json({
      success: true,
      message,
      chat: updatedChat,
    })

  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({
      error: 'Failed to send message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Helper function to assign an available assistant
async function assignAvailableAssistant(payload: any, chatId: string, chat: any) {
  try {
    // First try the assigned assistant
    let availableAssistant = null

    if (chat.assignedAssistant) {
      const onCallStatus = await payload.find({
        collection: 'on-call-assistants',
        where: {
          assistant: {
            equals: chat.assignedAssistant,
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
        if (assistantData.currentChatCount < assistantData.maxConcurrentChats) {
          availableAssistant = chat.assignedAssistant
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
        sort: 'currentChatCount',
      })

      for (const assistantData of onCallAssistants.docs) {
        if (assistantData.currentChatCount < assistantData.maxConcurrentChats) {
          availableAssistant = assistantData.assistant
          break
        }
      }
    }

    // If we found an assistant, assign them
    if (availableAssistant) {
      await payload.update({
        collection: 'live-chats',
        id: chatId,
        data: {
          onCallAssistant: availableAssistant,
          status: 'in_progress',
          assignedAt: new Date(),
        },
      })

      // Update assistant's chat count
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
            lastActivity: new Date(),
          },
        })
      }
    }
  } catch (error) {
    console.error('Error assigning assistant:', error)
  }
}
