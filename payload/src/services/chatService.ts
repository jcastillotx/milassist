import { getPayload } from 'payload'
import config from '../payload.config'
import aiService from './aiService'

class ChatService {
  private payload: any

  constructor() {
    this.initializePayload()
  }

  private async initializePayload() {
    this.payload = await getPayload({ config })
  }

  /**
   * Handle AI chatbot conversation
   */
  async handleAIChat(chatId: string, message: string, clientId: string): Promise<string> {
    try {
      // Get chat context
      const chat = await this.payload.findByID({
        collection: 'live-chats',
        id: chatId,
      })

      if (!chat) {
        throw new Error('Chat not found')
      }

      // Get recent messages for context (last 10 messages)
      const recentMessages = chat.messages?.slice(-10) || []

      // Create context string
      const context = recentMessages
        .map((msg: any) => `${msg.senderType}: ${msg.content}`)
        .join('\n')

      // Check if user wants to speak to human
      const transferKeywords = [
        'speak to human',
        'talk to assistant',
        'human help',
        'real person',
        'transfer',
        'escalate',
        'supervisor',
        'manager'
      ]

      const lowerMessage = message.toLowerCase()
      const wantsTransfer = transferKeywords.some(keyword =>
        lowerMessage.includes(keyword)
      )

      if (wantsTransfer) {
        // Transfer to human assistant
        await this.transferToHuman(chatId, clientId, message)
        return "I'll connect you with one of our assistants right away. Please hold on for just a moment."
      }

      // Generate AI response
      const aiResponse = await aiService.generateChatResponse(message, context, clientId)

      // Check if AI suggests transfer
      if (aiResponse.toLowerCase().includes('transfer') ||
          aiResponse.toLowerCase().includes('escalate') ||
          aiResponse.toLowerCase().includes('speak to assistant')) {
        await this.transferToHuman(chatId, clientId, message)
        return aiResponse + "\n\nI'll connect you with a human assistant now."
      }

      return aiResponse

    } catch (error) {
      console.error('AI chat error:', error)
      return "I'm sorry, I'm having trouble responding right now. Let me connect you with a human assistant."
    }
  }

  /**
   * Transfer chat to human assistant
   */
  private async transferToHuman(chatId: string, clientId: string, lastMessage: string) {
    try {
      // Update chat status
      await this.payload.update({
        collection: 'live-chats',
        id: chatId,
        data: {
          status: 'transferred',
          channel: 'transferred_from_ai',
        },
      })

      // Try to assign an assistant
      await this.assignAvailableAssistant(chatId)

    } catch (error) {
      console.error('Transfer to human error:', error)
    }
  }

  /**
   * Assign available assistant to chat
   */
  async assignAvailableAssistant(chatId: string) {
    try {
      const chat = await this.payload.findByID({
        collection: 'live-chats',
        id: chatId,
      })

      if (!chat) return

      // First try the assigned assistant
      let availableAssistant = null

      if (chat.assignedAssistant) {
        const onCallStatus = await this.payload.find({
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
        const onCallAssistants = await this.payload.find({
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
        await this.payload.update({
          collection: 'live-chats',
          id: chatId,
          data: {
            onCallAssistant: availableAssistant,
            status: 'in_progress',
            assignedAt: new Date(),
          },
        })

        // Update assistant's chat count
        const assistantRecord = await this.payload.find({
          collection: 'on-call-assistants',
          where: {
            assistant: {
              equals: availableAssistant,
            },
          },
        })

        if (assistantRecord.docs.length > 0) {
          await this.payload.update({
            collection: 'on-call-assistants',
            id: assistantRecord.docs[0].id,
            data: {
              currentChatCount: assistantRecord.docs[0].currentChatCount + 1,
              lastActivity: new Date(),
            },
          })
        }

        // Add system message about assignment
        const systemMessage = {
          sender: null,
          senderType: 'system',
          content: 'You have been connected to an assistant.',
          timestamp: new Date(),
          isRead: false,
        }

        await this.payload.update({
          collection: 'live-chats',
          id: chatId,
          data: {
            messages: [...(chat.messages || []), systemMessage],
          },
        })
      }

    } catch (error) {
      console.error('Error assigning assistant:', error)
    }
  }

  /**
   * Handle chat completion and cleanup
   */
  async completeChat(chatId: string, rating?: { score: number, feedback?: string }) {
    try {
      const updateData: any = {
        status: 'resolved',
        resolvedAt: new Date(),
      }

      if (rating) {
        updateData.rating = {
          score: rating.score,
          feedback: rating.feedback || '',
          ratedAt: new Date(),
        }
      }

      await this.payload.update({
        collection: 'live-chats',
        id: chatId,
        data: updateData,
      })

      // Update assistant stats if assigned
      const chat = await this.payload.findByID({
        collection: 'live-chats',
        id: chatId,
      })

      if (chat.onCallAssistant) {
        const assistantRecord = await this.payload.find({
          collection: 'on-call-assistants',
          where: {
            assistant: {
              equals: chat.onCallAssistant,
            },
          },
        })

        if (assistantRecord.docs.length > 0) {
          const current = assistantRecord.docs[0]
          await this.payload.update({
            collection: 'on-call-assistants',
            id: current.id,
            data: {
              currentChatCount: Math.max(0, current.currentChatCount - 1),
              totalChatsHandled: current.totalChatsHandled + 1,
            },
          })
        }
      }

    } catch (error) {
      console.error('Complete chat error:', error)
    }
  }

  /**
   * Get chat statistics for dashboard
   */
  async getChatStats(timeframe: 'day' | 'week' | 'month' = 'week') {
    try {
      const now = new Date()
      const startDate = new Date()

      switch (timeframe) {
        case 'day':
          startDate.setDate(now.getDate() - 1)
          break
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
      }

      const chats = await this.payload.find({
        collection: 'live-chats',
        where: {
          startedAt: {
            greater_than_equal: startDate,
          },
        },
      })

      const stats = {
        totalChats: chats.docs.length,
        resolvedChats: chats.docs.filter(c => c.status === 'resolved').length,
        averageResponseTime: 0,
        averageResolutionTime: 0,
        satisfactionScore: 0,
      }

      // Calculate averages
      const chatsWithFirstResponse = chats.docs.filter(c => c.firstResponseAt)
      const chatsWithResolution = chats.docs.filter(c => c.resolvedAt)
      const chatsWithRating = chats.docs.filter(c => c.rating?.score)

      if (chatsWithFirstResponse.length > 0) {
        const totalResponseTime = chatsWithFirstResponse.reduce((sum, c) => {
          return sum + (new Date(c.firstResponseAt).getTime() - new Date(c.startedAt).getTime())
        }, 0)
        stats.averageResponseTime = totalResponseTime / chatsWithFirstResponse.length / 1000 / 60 // minutes
      }

      if (chatsWithResolution.length > 0) {
        const totalResolutionTime = chatsWithResolution.reduce((sum, c) => {
          return sum + (new Date(c.resolvedAt).getTime() - new Date(c.startedAt).getTime())
        }, 0)
        stats.averageResolutionTime = totalResolutionTime / chatsWithResolution.length / 1000 / 60 / 60 // hours
      }

      if (chatsWithRating.length > 0) {
        const totalRating = chatsWithRating.reduce((sum, c) => sum + c.rating.score, 0)
        stats.satisfactionScore = totalRating / chatsWithRating.length
      }

      return stats

    } catch (error) {
      console.error('Get chat stats error:', error)
      return null
    }
  }
}

export default new ChatService()
