import { useState, useEffect, useRef } from 'react'
import payloadClient from '../lib/payloadClient'
import Icon from './Icon'

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatId, setChatId] = useState(null)
  const [chatStatus, setChatStatus] = useState('disconnected') // disconnected, connecting, waiting, active
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check for existing active chat on mount
  useEffect(() => {
    checkExistingChat()
  }, [])

  const checkExistingChat = async () => {
    try {
      const user = payloadClient.getCurrentUser()
      if (!user || user.role !== 'client') return

      const chats = await payloadClient.getCollection('live-chats', {
        where: {
          client: {
            equals: user.id,
          },
          status: {
            in: ['waiting', 'in_progress'],
          },
        },
        sort: '-startedAt',
        limit: 1,
      })

      if (chats.docs.length > 0) {
        const activeChat = chats.docs[0]
        setChatId(activeChat.id)
        setMessages(activeChat.messages || [])
        setChatStatus(activeChat.status === 'waiting' ? 'waiting' : 'active')

        // Start polling for new messages
        startMessagePolling(activeChat.id)
      }
    } catch (error) {
      console.error('Error checking existing chat:', error)
    }
  }

  const startMessagePolling = (chatId) => {
    // Poll for new messages every 3 seconds
    const interval = setInterval(async () => {
      try {
        const chat = await payloadClient.getDocument('live-chats', chatId)
        if (chat && chat.messages) {
          setMessages(chat.messages)
          setChatStatus(chat.status === 'waiting' ? 'waiting' : 'active')
        }
      } catch (error) {
        console.error('Error polling messages:', error)
      }
    }, 3000)

    return () => clearInterval(interval)
  }

  const startChat = async () => {
    setIsLoading(true)
    try {
      const user = payloadClient.getCurrentUser()
      if (!user) {
        alert('Please log in to start a chat')
        return
      }

      const response = await payloadClient.request('/chat/start', {
        method: 'POST',
        body: JSON.stringify({
          clientId: user.id,
          subject: 'Live Chat Support',
          channel: 'ai_chatbot',
          metadata: {
            userAgent: navigator.userAgent,
            url: window.location.href,
          },
        }),
      })

      if (response.success) {
        setChatId(response.chat.id)
        setMessages(response.chat.messages || [])
        setChatStatus(response.status === 'assigned' ? 'active' : 'waiting')
        setIsOpen(true)

        // Start polling for messages
        startMessagePolling(response.chat.id)
      }
    } catch (error) {
      console.error('Error starting chat:', error)
      alert('Failed to start chat. Please try again.')
    }
    setIsLoading(false)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return

    const messageContent = newMessage.trim()
    setNewMessage('')

    // Add message to local state immediately
    const tempMessage = {
      sender: payloadClient.getCurrentUser()?.id,
      senderType: 'client',
      content: messageContent,
      timestamp: new Date(),
      isRead: false,
    }
    setMessages(prev => [...prev, tempMessage])

    try {
      const response = await payloadClient.request('/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          chatId,
          content: messageContent,
        }),
      })

      // If there's an AI response, add it to the messages
      if (response.aiResponse) {
        setMessages(prev => [...prev, response.aiResponse])
      }

      // Update chat status if it changed
      if (response.chat) {
        setChatStatus(response.chat.status === 'waiting' ? 'waiting' : 'active')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Could add error handling here
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStatusMessage = () => {
    switch (chatStatus) {
      case 'connecting':
        return 'Connecting to assistant...'
      case 'waiting':
        return 'Waiting for an assistant...'
      case 'active':
        return 'Connected to assistant'
      default:
        return 'Click to start chat'
    }
  }

  const getStatusColor = () => {
    switch (chatStatus) {
      case 'waiting':
        return 'bg-yellow-500'
      case 'active':
        return 'bg-green-500'
      default:
        return 'bg-blue-500'
    }
  }

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen && (
          <button
            onClick={chatId ? () => setIsOpen(true) : startChat}
            disabled={isLoading}
            className={`w-14 h-14 rounded-full ${getStatusColor()} text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Icon name="chat" size={24} color="currentColor" />
            )}
          </button>
        )}

        {/* Status indicator */}
        {chatId && !isOpen && (
          <div className="absolute -top-2 -left-2">
            <div className={`w-4 h-4 ${getStatusColor()} rounded-full border-2 border-white`}></div>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Live Support</h3>
              <p className="text-sm opacity-90">{getStatusMessage()}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 rounded-full p-1"
            >
              <Icon name="close" size={20} color="currentColor" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>How can we help you today?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.senderType === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.senderType === 'client'
                        ? 'bg-blue-600 text-white'
                        : message.senderType === 'ai_bot'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!chatId || chatStatus === 'connecting'}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !chatId || chatStatus === 'connecting'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Icon name="send" size={20} color="currentColor" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
