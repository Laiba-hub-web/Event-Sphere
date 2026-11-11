import React, { useState, useEffect, useRef } from 'react'
import {
  Send,
  MessageSquare,
  Search,
  Sparkles,
  CheckCheck,
  Circle,
  ShieldCheck,
  Store,
  Ticket,
  ArrowLeft,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { messageService } from '../api/services'
import { useAuth } from '../hooks/useAuth'
import { useSocket } from '../hooks/useSocket'

const QUICK_REPLIES = [
  'Hi! Could you share your B2B product brochure and booth schedule?',
  'We would love to book a 15-minute live hardware demo at your booth.',
  'Are there still corner booths available on the main exhibition floor?',
  'Thank you! Looking forward to meeting at the keynote hall.',
]

export default function MessagesPage() {
  const { user } = useAuth()
  const rawSocket = useSocket()
  const socket = rawSocket?.socket !== undefined ? rawSocket.socket : rawSocket

  const [conversations, setConversations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activePartner, setActivePartner] = useState(null)
  const [mobileShowChat, setMobileShowChat] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [loadingConv, setLoadingConv] = useState(true)
  const [loadingThread, setLoadingThread] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadConversations(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listen for socket real-time messages safely
  useEffect(() => {
    if (!socket || typeof socket.on !== 'function') return

    const handleIncomingMessage = (incoming) => {
      const senderId = incoming?.sender?._id || incoming?.sender
      const receiverId = incoming?.receiver?._id || incoming?.receiver

      if (
        activePartner &&
        (senderId === activePartner._id || receiverId === activePartner._id)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === incoming._id)) return prev
          return [...prev, incoming]
        })
      }
      loadConversations(false)
    }

    socket.on('receiveMessage', handleIncomingMessage)
    return () => {
      if (typeof socket.off === 'function') {
        socket.off('receiveMessage', handleIncomingMessage)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, activePartner])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = async (autoSelectFirst = false) => {
    try {
      if (autoSelectFirst) setLoadingConv(true)
      const res = await messageService.getConversations()
      const convList = res.data.conversations || []
      setConversations(convList)

      if (autoSelectFirst && convList.length > 0 && !activePartner) {
        selectPartner(convList[0].user, false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      if (autoSelectFirst) setLoadingConv(false)
    }
  }

  const selectPartner = async (partner, openMobileView = true) => {
    if (!partner?._id) return
    setActivePartner(partner)
    if (openMobileView) setMobileShowChat(true)
    try {
      setLoadingThread(true)
      const res = await messageService.getThread(partner._id)
      setMessages(res.data.messages || [])
      loadConversations(false)
    } catch (err) {
      toast.error('Failed to load message thread')
    } finally {
      setLoadingThread(false)
    }
  }

  const handleSendMessage = async (e, customText) => {
    if (e) e.preventDefault()
    const content = (customText ?? newMsg).trim()
    if (!content || !activePartner) return

    setSending(true)
    if (!customText) setNewMsg('')

    try {
      const res = await messageService.send({
        receiverId: activePartner._id,
        content,
      })
      const savedMsg = res.data.message
      setMessages((prev) => {
        if (prev.some((m) => m._id === savedMsg._id)) return prev
        return [...prev, savedMsg]
      })
      loadConversations(false)
    } catch (err) {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter((c) => {
    if (!searchTerm.trim()) return true
    const q = searchTerm.toLowerCase()
    return (
      c.user?.name?.toLowerCase().includes(q) ||
      c.user?.role?.toLowerCase().includes(q) ||
      c.lastMessage?.content?.toLowerCase().includes(q)
    )
  })

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase shrink-0">
          <ShieldCheck size={10} /> Organizer
        </span>
      )
    }
    if (role === 'exhibitor') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase shrink-0">
          <Store size={10} /> Exhibitor
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase shrink-0">
        <Ticket size={10} /> Attendee
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-primary-600 mb-1">
              <Sparkles size={13} /> Real-Time B2B &amp; Support Inbox
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
              Direct Messages &amp; Exhibitor Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Communicate directly with trade show organizers, booth exhibitors, and VIP delegates.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto shrink-0">
            <Circle size={8} className="fill-emerald-500 text-emerald-500 animate-pulse" />
            <span>Live Messaging Active</span>
          </div>
        </div>

        {/* Main Split Chat Container — Responsive for Mobile (< lg) and Desktop (lg+) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-14rem)] min-h-[520px] max-h-[740px]">
          {/* Left: Conversations List (Hidden on mobile when chat thread is open) */}
          <div
            className={`w-full lg:w-80 xl:w-96 border-r border-slate-200 flex-col bg-slate-50/50 h-full ${
              mobileShowChat ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div className="p-4 border-b border-slate-200 space-y-3 bg-white shrink-0">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">
                  Active Threads ({conversations.length})
                </span>
              </div>
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search contacts or messages..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loadingConv ? (
                <div className="py-16 flex justify-center">
                  <LoadingSpinner size="sm" text="Loading conversations..." />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  <MessageSquare size={36} className="mx-auto mb-2.5 text-slate-300" />
                  <p className="font-bold text-slate-700 text-sm">No conversations found</p>
                  <p className="mt-1">
                    Open any Expo page and click &ldquo;Message&rdquo; on an Exhibitor card to start a B2B inquiry.
                  </p>
                </div>
              ) : (
                filteredConversations.map((c) => {
                  const partner = c.user
                  const isSelected = activePartner?._id === partner?._id

                  return (
                    <button
                      key={partner?._id || Math.random()}
                      type="button"
                      onClick={() => selectPartner(partner, true)}
                      className={`w-full p-4 flex items-start gap-3 text-left transition-all ${
                        isSelected
                          ? 'bg-primary-50/90 border-l-4 border-l-primary-600'
                          : 'hover:bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
                        {partner?.name ? partner.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="overflow-hidden flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900 truncate">
                            {partner?.name}
                          </span>
                          {getRoleBadge(partner?.role)}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-1">
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

          {/* Right: Active Chat Thread (Full screen inside box on mobile when selected) */}
          <div
            className={`flex-1 min-w-0 flex-col justify-between bg-slate-50/60 h-full ${
              mobileShowChat ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {activePartner ? (
              <>
                {/* Partner Header with Mobile Back Button */}
                <div className="p-3.5 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileShowChat(false)}
                      className="lg:hidden p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0"
                      title="Back to Conversations"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
                      {activePartner.name ? activePartner.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-sm text-slate-900 truncate">
                          {activePartner.name}
                        </h3>
                        {getRoleBadge(activePartner.role)}
                      </div>
                      <span className="text-xs text-slate-500 truncate block">
                        {activePartner.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Bubbles */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5">
                  {loadingThread ? (
                    <div className="py-20 flex justify-center">
                      <LoadingSpinner size="sm" text="Fetching message history..." />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-16 text-xs text-slate-400">
                      Send a message or click a quick inquiry pill below to start the conversation!
                    </div>
                  ) : (
                    messages.map((m) => {
                      const senderId = m.sender?._id || m.sender
                      const isMe = senderId === user?._id

                      return (
                        <div
                          key={m._id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-md lg:max-w-lg px-4 py-2.5 sm:py-3 rounded-2xl text-xs leading-relaxed break-words ${
                              isMe
                                ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-br-xs shadow-sm'
                                : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
                            }`}
                          >
                            {m.content}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                            <span>
                              {new Date(m.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isMe && <CheckCheck size={12} className="text-primary-500" />}
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Reply Templates + Input Bar */}
                <div className="bg-white border-t border-slate-200 p-3 sm:p-4 space-y-2.5 shrink-0">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0">
                      Quick Prompts:
                    </span>
                    {QUICK_REPLIES.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(null, prompt)}
                        disabled={sending}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-600 text-[11px] font-medium whitespace-nowrap transition-colors shrink-0"
                      >
                        {prompt.length > 44 ? prompt.slice(0, 44) + '...' : prompt}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={(e) => handleSendMessage(e)} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      placeholder={`Message ${activePartner.name}...`}
                      className="flex-1 min-w-0 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!newMsg.trim() || sending}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors shadow-xs shrink-0"
                    >
                      <span className="hidden sm:inline">Send</span>
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  <MessageSquare size={32} />
                </div>
                <h3 className="font-extrabold text-base text-slate-800">
                  Select a Conversation Thread
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                  Choose a contact from the left panel to view your message history and chat in real time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
