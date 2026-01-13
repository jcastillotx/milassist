import { useState, useEffect } from 'react'
import payloadClient from '../../lib/payloadClient'

export default function LiveChatDashboard() {
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadChats()
    // Set up polling for new messages
    const interval = setInterval(loadChats, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadChats = async () => {
    try {
      const user = payloadClient.getCurrentUser()
      if (!user) return

      // Get chats assigned to this assistant
      const response = await payloadClient.getCollection('live-chats', {
        where: {
          or: [
            { assignedAssistant: { equals: user.id } },
            { onCallAssistant: { equals: user.id } }
          ],
          status: {
            in: ['waiting', 'in_progress']
          }
        },
        sort: '-updatedAt',
      })

      setChats(response.docs || [])
    } catch (error) {
      console.error('Error loading chats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectChat = (chat) => {
    setSelectedChat(chat)
    // Mark messages as read
    markMessagesAsRead(chat.id)
  }

  const markMessagesAsRead = async (chatId) => {
    try {
      // In a real implementation, you'd have an endpoint to mark messages as read
      // For now, we'll just update the local state
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages?.map(msg => ({ ...msg, isRead: true })) || []
              }
            : chat
        )
      )
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return

    const messageContent = newMessage.trim()
    setNewMessage('')

    try {
      await payloadClient.request('/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          chatId: selectedChat.id,
          content: messageContent,
        }),
      })

      // Reload chats to get updated messages
      await loadChats()

      // Re-select the chat to show updated messages
      const updatedChat = chats.find(c => c.id === selectedChat.id)
      if (updatedChat) {
        setSelectedChat(updatedChat)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const completeChat = async (chatId) => {
    try {
      // In a real implementation, you'd have an endpoint to complete chats
      // For now, we'll just update the status locally
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId))
      if (selectedChat?.id === chatId) {
        setSelectedChat(null)
      }
    } catch (error) {
      console.error('Error completing chat:', error)
    }
  }

  const transferChat = async (chatId) => {
    try {
      // Find another available assistant
      const availableAssistants = await payloadClient.getCollection('on-call-assistants', {
        where: {
          isOnCall: { equals: true },
          isActive: { equals: true },
          currentChatCount: { less_than: 3 } // Assuming max 3 chats per assistant
        },
        limit: 5,
      })

      if (availableAssistants.docs.length > 0) {
        const targetAssistant = availableAssistants.docs[0]
        // Transfer logic would go here
        alert(`Chat transferred to ${targetAssistant.assistant.name || 'another assistant'}`)
        completeChat(chatId)
      } else {
        alert('No available assistants to transfer to')
      }
    } catch (error) {
      console.error('Error transferring chat:', error)
      alert('Failed to transfer chat')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      {/* Chat List Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Live Chats</h2>
          <p className="text-sm text-gray-600">{chats.length} active conversations</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No active chats
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => selectChat(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sm">
                    {chat.client?.name || 'Unknown Client'}
                  </h3>
                  <div className="flex space-x-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(chat.status)}`}>
                      {chat.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(chat.priority)}`}>
                      {chat.priority}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 truncate">
                  {chat.subject || chat.messages?.[chat.messages.length - 1]?.content || 'No messages yet'}
                </p>

                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>{new Date(chat.startedAt).toLocaleTimeString()}</span>
                  {chat.messages?.filter(m => !m.isRead && m.senderType === 'client').length > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-1">
                      {chat.messages.filter(m => !m.isRead && m.senderType === 'client').length}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{selectedChat.client?.name || 'Unknown Client'}</h3>
                <p className="text-sm text-gray-600">
                  Started {new Date(selectedChat.startedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => transferChat(selectedChat.id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                >
                  Transfer
                </button>
                <button
                  onClick={() => completeChat(selectedChat.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Complete
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedChat.messages?.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.senderType === 'client' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.senderType === 'client'
                        ? 'bg-gray-200 text-gray-800'
                        : message.senderType === 'ai_bot'
                        ? 'bg-green-200 text-gray-800'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7 8-3.866 3.582-7-8-3.134-8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
