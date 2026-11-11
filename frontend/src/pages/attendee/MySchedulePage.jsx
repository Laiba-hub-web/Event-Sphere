import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Calendar, Printer, Sparkles, Compass } from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import SessionCard from '../../components/cards/SessionCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { sessionService } from '../../api/services'

export default function MySchedulePage() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookmarks()
  }, [])

  const loadBookmarks = async () => {
    try {
      setLoading(true)
      const res = await sessionService.getMyBookmarks()
      setSessions(res.data.sessions || [])
    } catch (err) {
      toast.error('Failed to load bookmarked sessions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-1">
              <Sparkles size={13} /> Personal Conference Agenda
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              My Bookmarked Keynotes &amp; Itinerary ({sessions.length})
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Your personalized schedule of reserved keynote presentations, panels, and technical labs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {sessions.length > 0 && (
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors no-print"
              >
                <Printer size={15} />
                Print Agenda
              </button>
            )}
            <Link
              to="/expos"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors no-print"
            >
              <Compass size={15} />
              Discover More Sessions
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner text="Loading your personal itinerary..." />
          </div>
        ) : sessions.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No sessions bookmarked yet"
            description="Explore expo schedules and bookmark keynotes or workshops you want to attend."
            actionLabel="Browse Upcoming Expos"
            actionTo="/expos"
          />
        ) : (
          <div className="space-y-5 max-w-4xl">
            {sessions.map((sess) => (
              <div key={sess._id} className="space-y-2">
                {sess.expo && (
                  <Link
                    to={`/expos/${sess.expo._id || sess.expo}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <Calendar size={12} /> {sess.expo.title || 'View Expo Event'}
                  </Link>
                )}
                <SessionCard
                  session={sess}
                  isBookmarked={true}
                  onBookmarkToggle={loadBookmarks}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
