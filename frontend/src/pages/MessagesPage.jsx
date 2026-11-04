import React, { useState, useEffect, useRef } from 'react'
import { Send, MessageSquare, User, Search, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { messageService } from '../api/services'
import { useAuth } from '../hooks/useAuth'
import { useSocket } from '../hooks/useSocket'

export default function MessagesPage() {
  const { user } = useAuth()
  const socket = useSocket()
  const [conversations, setConversations] = useState([])
  const [activePartner, setActivePartner] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [loadingConv, setLoadingConv] = useState(true)
  const [loadingThread, setLoadingThread] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadConversations()
  }, [])

  // Listen for socket real-time messages
  useEffect(() => {
    if (!socket) return

    const handleIncomingMessage = (incoming) => {
      // If the incoming message belongs to current thread, append
      if (
        activePartner &&
        (incoming.sender._id === activePartner._id || incoming.receiver._id === activePartner._id)
      ) {
        setMessages((prev) => [...prev, incoming])
      }
      // Refresh conversations list to update previews
      loadConversations()
    }

    socket.on('receiveMessage', handleIncomingMessage)
    return () => {
      socket.off('receiveMessage', handleIncomingMessage)
    }
  }, [socket, activePartner])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = async () => {
    try {
      setLoadingConv(true)
      const res = await messageService.getConversations()
      setConversations(res.data.conversations || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingConv(false)
    }
  }

  const selectPartner = async (partner) => {
    setActivePartner(partner)
    try {
      setLoadingThread(true)
      const res = await messageService.getThread(partner._id)
      setMessages(res.data.messages || [])
      loadConversations()
    } catch (err) {
      toast.error('Failed to load message thread')
    } finally {
      setLoadingThread(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMsg.trim() || !activePartner) return

    setSending(true)
    const content = newMsg.trim()
    setNewMsg('')

    try {
      if (socket && socket.connected) {
        socket.emit('sendMessage', {
          receiverId: activePartner._id,
          content,
        })
      } else {
        const res = await messageService.send({
          receiverId: activePartner._id,
          content,
        })
        setMessages((prev) => [...prev, res.data.message])
      }
      loadConversations()
    } catch (err) {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Direct Messages & Inquiries</h1>
          <p className="text-sm text-gray-500">
            Real-time chat with event organizers, exhibitors, and attendees.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row h-[650px]">
          {/* Left: Conversations list */}
          <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 font-bold text-sm text-gray-800">
              Conversations ({conversations.length})
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {loadingConv ? (
                <div className="py-12 flex justify-center">
                  <LoadingSpinner size="sm" text="Loading chats..." />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                  No message history yet. Connect with exhibitors from expo pages.
                </div>
              ) : (
                conversations.map((c) => {
                  const partner = c.user
                  const isSelected = activePartner?._id === partner?._id

                  return (
                    <button
                      key={partner?._id || Math.random()}
                      type="button"
                      onClick={() => selectPartner(partner)}
                      className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                        isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {partner?.name ? partner.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-xs text-gray-900 truncate">
                            {partner?.name}
                          </span>
                          <span className="text-[10px] text-gray-400 capitalize">
                            {partner?.role}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {c.lastMessage?.content}
                        </p>
                      </div>
                      {c.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {c.unreadCount}
                        </span>
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Right: Active Chat Thread */}
          <div className="flex-1 flex flex-col justify-between bg-gray-50">
            {activePartner ? (
              <>
                {/* Header */}
                <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">
                    {activePartner.name ? activePartner.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{activePartner.name}</h3>
                    <span className="text-xs text-gray-500 capitalize">{activePartner.role}</span>
                  </div>
                </div>

                {/* Message bubbles */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {loadingThread ? (
                    <div className="py-20 flex justify-center">
                      <LoadingSpinner size="sm" text="Fetching messages..." />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-20 text-xs text-gray-400">
                      Say hello to start the conversation!
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe =
                        m.sender?._id === user?._id || m.sender === user?._id

                      return (
                        <div
                          key={m._id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs ${
                              isMe
                                ? 'bg-primary-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-xs'
                            }`}
                          >
                            {m.content}
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1 px-1">
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMsg.trim() || sending}
                    className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <MessageSquare size={48} className="text-gray-300 mb-3" />
                <h3 className="font-semibold text-sm text-gray-700">Select a Conversation</h3>
                <p className="text-xs text-gray-400 max-w-xs mt-1">
                  Choose a contact from the left list to start messaging in real-time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
