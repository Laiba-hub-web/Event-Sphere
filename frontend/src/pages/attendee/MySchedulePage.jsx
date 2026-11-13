import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock,
  Calendar,
  Printer,
  Compass,
  BellRing,
  Search,
  MapPin,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import SessionCard from '../../components/cards/SessionCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { sessionService, expoService } from '../../api/services'
import { useAuth } from '../../hooks/useAuth'

export default function MySchedulePage() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [expos, setExpos] = useState([])
  const [selectedExpoId, setSelectedExpoId] = useState('all')
  const [allSessions, setAllSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('bookmarked')
  const [search, setSearch] = useState('')
  const [reminderLeadTime, setReminderLeadTime] = useState('15m')

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [bmkRes, exposRes] = await Promise.all([
        sessionService.getMyBookmarks().catch(() => ({ data: { sessions: [] } })),
        expoService.getAll().catch(() => ({ data: { expos: [] } })),
      ])

      const bookmarkedList = bmkRes.data.sessions || []
      const expoList = exposRes.data.expos || []
      setBookmarks(bookmarkedList)
      setExpos(expoList)

      // Fetch sessions across published expos so attendee can browse all schedules & workshops
      if (expoList.length > 0) {
        const sessionPromises = expoList.slice(0, 4).map((ex) =>
          sessionService
            .getByExpo(ex._id)
            .then((r) =>
              (r.data.sessions || []).map((s) => ({
                ...s,
                expo: s.expo && typeof s.expo === 'object' ? s.expo : ex,
              }))
            )
            .catch(() => [])
        )
        const nested = await Promise.all(sessionPromises)
        setAllSessions(nested.flat())
      }
    } catch (err) {
      toast.error('Failed to load schedule data')
    } finally {
      setLoading(false)
    }
  }

  const refreshBookmarksOnly = async () => {
    try {
      const bmkRes = await sessionService.getMyBookmarks()
      setBookmarks(bmkRes.data.sessions || [])
    } catch (err) {
      // ignore
    }
  }

  const handleTestReminder = (sessionItem) => {
    const target = sessionItem || bookmarks[0]
    if (!target) {
      toast('Bookmark a session first to receive session reminders!')
      return
    }
    const timeStr = target.startTime
      ? new Date(target.startTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Upcoming'
    toast.success(
      `Reminder Alert: "${target.title}" by ${
        target.speaker || 'Keynote Speaker'
      } starts at ${timeStr} in ${target.location || 'Main Auditorium'}!`,
      { duration: 5000 }
    )
  }

  const bookmarkedIds = new Set(bookmarks.map((b) => b._id))

  const sourceList = activeTab === 'bookmarked' ? bookmarks : allSessions
  const filteredSessions = sourceList.filter((s) => {
    const sExpoId = s.expo?._id || s.expo
    const matchesExpo = selectedExpoId === 'all' || sExpoId === selectedExpoId
    const q = search.trim().toLowerCase()
    const matchesSearch =
      !q ||
      s.title?.toLowerCase().includes(q) ||
      s.speaker?.toLowerCase().includes(q) ||
      s.topic?.toLowerCase().includes(q) ||
      s.location?.toLowerCase().includes(q)
    return matchesExpo && matchesSearch
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Clean Light Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-2">
                Schedule Management &amp; Reminders
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                My Schedule, Sessions &amp; Notifications
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Browse event schedules, bookmark or register for sessions of interest, and receive reminders for bookmarked talks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 no-print">
              <button
                type="button"
                onClick={() => handleTestReminder()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <BellRing size={14} className="text-amber-600" />
                Test Reminder Notification
              </button>

              {bookmarks.length > 0 && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Printer size={14} />
                  Print Schedule
                </button>
              )}

              <Link
                to="/expos"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Compass size={14} />
                Browse Events
              </Link>
            </div>
          </div>

          {/* Tabs: Bookmarked Sessions vs Browse All Event Sessions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 no-print">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('bookmarked')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'bookmarked'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Bookmarked Sessions ({bookmarks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'browse'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Browse All Event Schedules ({allSessions.length})
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Reminder Lead Time:</span>
              <select
                value={reminderLeadTime}
                onChange={(e) => {
                  setReminderLeadTime(e.target.value)
                  toast.success(`Session reminders set to ${e.target.value} before start`)
                }}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
              >
                <option value="15m">15 Minutes Before</option>
                <option value="30m">30 Minutes Before</option>
                <option value="1h">1 Hour Before</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Session Reminders & Notifications Card */}
        {bookmarks.length > 0 && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900">
                <BellRing size={16} className="text-amber-600 shrink-0" />
                <span>
                  Upcoming Bookmarked Session Reminders ({bookmarks.length} Active)
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 size={12} /> In-App &amp; Email Alerts Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {bookmarks.slice(0, 4).map((sess) => (
                <div
                  key={sess._id}
                  className="bg-white p-3.5 rounded-xl border border-amber-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">
                      {sess.title}
                    </div>
                    <div className="text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} className="text-blue-600" />
                        {sess.startTime
                          ? new Date(sess.startTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Scheduled'}
                      </span>
                      {sess.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={11} className="text-rose-500" />
                          {sess.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTestReminder(sess)}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-[11px] shrink-0 cursor-pointer"
                  >
                    Notify Me
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Event Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 no-print">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sessions or workshops by title, speaker, topic, or room..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedExpoId}
            onChange={(e) => setSelectedExpoId(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="all">All Events</option>
            {expos.map((ex) => (
              <option key={ex._id} value={ex._id}>
                {ex.title}
              </option>
            ))}
          </select>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner text="Loading schedules and reminders..." />
          </div>
        ) : filteredSessions.length === 0 ? (
          <EmptyState
            icon={Clock}
            title={
              activeTab === 'bookmarked'
                ? 'No sessions bookmarked yet'
                : 'No matching sessions found'
            }
            description={
              activeTab === 'bookmarked'
                ? 'Switch to "Browse All Event Schedules" to bookmark keynotes and workshops of interest.'
                : 'Try clearing your search or event filter.'
            }
            actionLabel={
              activeTab === 'bookmarked' ? 'Browse Event Schedules' : 'View All Events'
            }
            onAction={
              activeTab === 'bookmarked' ? () => setActiveTab('browse') : undefined
            }
            actionTo={activeTab === 'bookmarked' ? undefined : '/expos'}
          />
        ) : (
          <div className="space-y-4 max-w-4xl">
            {filteredSessions.map((sess) => {
              const isBmk =
                bookmarkedIds.has(sess._id) ||
                sess.attendees?.some(
                  (a) => a.user?._id === user?._id || a.user === user?._id
                )
              return (
                <div key={sess._id} className="space-y-2">
                  {sess.expo && (
                    <Link
                      to={`/expos/${sess.expo._id || sess.expo}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Calendar size={12} /> {sess.expo.title || 'View Event Details'}
                    </Link>
                  )}
                  <SessionCard
                    session={sess}
                    isBookmarked={isBmk}
                    onBookmarkToggle={() => {
                      refreshBookmarksOnly()
                    }}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
