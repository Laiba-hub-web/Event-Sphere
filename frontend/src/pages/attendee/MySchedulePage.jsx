import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Calendar, ArrowRight } from 'lucide-react'
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Itinerary & Bookmarks</h1>
            <p className="text-sm text-gray-500 mt-1">
              Your personalized schedule of keynotes, workshops, and panel sessions.
            </p>
          </div>
          <Link
            to="/expos"
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow transition-colors"
          >
            Find More Sessions
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner text="Loading your schedule..." />
          </div>
        ) : sessions.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No sessions bookmarked yet"
            description="Explore expo schedules and bookmark keynotes or workshops you want to attend."
            actionLabel="Browse Events"
            actionTo="/expos"
          />
        ) : (
          <div className="space-y-4 max-w-4xl">
            {sessions.map((sess) => (
              <div key={sess._id} className="space-y-2">
                {sess.expo && (
                  <div className="text-xs font-semibold text-primary-700 flex items-center gap-1">
                    <Calendar size={13} /> {sess.expo.title}
                  </div>
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
