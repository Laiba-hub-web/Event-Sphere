import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock,
  MapPin,
  Users,
  Bookmark,
  BookmarkCheck,
  Mic,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { sessionService } from '../../api/services'
import { useAuth } from '../../hooks/useAuth'

export default function SessionCard({
  session,
  isBookmarked: initialBookmarked,
  onBookmarkToggle,
  showBookmark = true,
}) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)

  const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      : ''

  const attendeeCount = session.attendees?.length || 0
  const capacity = session.capacity || 100
  const fillPercent = Math.min(100, Math.round((attendeeCount / capacity) * 100))

  const handleBookmarkClick = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to bookmark sessions to your itinerary')
      navigate('/login')
      return
    }
    setLoading(true)
    try {
      if (bookmarked) {
        await sessionService.unbookmark(session._id)
        setBookmarked(false)
        toast.success('Removed from your personal schedule')
      } else {
        await sessionService.bookmark(session._id)
        setBookmarked(true)
        toast.success('Session bookmarked to your schedule!')
      }
      if (onBookmarkToggle) onBookmarkToggle(session)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update bookmark')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 space-y-2.5">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {session.topic && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles size={11} /> {session.topic}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              <Clock size={12} className="text-blue-600" />
              {formatDate(session.startTime)} · {formatTime(session.startTime)}
              {session.endTime && ` – ${formatTime(session.endTime)}`}
            </span>
            {session.location && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                <MapPin size={12} className="text-rose-500" />
                {session.location}
              </span>
            )}
          </div>

          {/* Session Title */}
          <h4 className="font-extrabold text-slate-900 text-lg leading-snug">
            {session.title}
          </h4>

          {/* Description */}
          {session.description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {session.description}
            </p>
          )}

          {/* Speaker Box */}
          {session.speaker && (
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <Mic size={15} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{session.speaker}</p>
                {session.speakerBio && (
                  <p className="text-[11px] text-slate-500 line-clamp-1">{session.speakerBio}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Bookmark & Seat Bar */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
          {showBookmark && (
            <button
              onClick={handleBookmarkClick}
              disabled={loading}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                bookmarked
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200'
              }`}
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : bookmarked ? (
                <>
                  <BookmarkCheck size={15} /> Bookmarked
                </>
              ) : (
                <>
                  <Bookmark size={15} /> Reserve Seat
                </>
              )}
            </button>
          )}

          <div className="w-36 space-y-1 text-right">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Users size={12} /> Seats
              </span>
              <span className="font-bold text-slate-700">
                {attendeeCount} / {capacity}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full transition-all"
                style={{ width: `${Math.max(12, fillPercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
