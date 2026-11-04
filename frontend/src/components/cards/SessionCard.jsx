import React from 'react'
import { Clock, MapPin, Users, Bookmark, BookmarkCheck } from 'lucide-react'

export default function SessionCard({ session, isBookmarked, onBookmarkToggle, showBookmark = true }) {
  const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : ''

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-base line-clamp-2 mb-1">{session.title}</h4>
          {session.speaker && (
            <p className="text-sm text-primary-600 font-medium mb-2">
              {session.speaker}
              {session.topic && <span className="text-gray-400 font-normal"> · {session.topic}</span>}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={13} />
              <span>
                {formatDate(session.startTime)} {formatTime(session.startTime)}
                {session.endTime && ` — ${formatTime(session.endTime)}`}
              </span>
            </div>
            {session.location && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin size={13} />
                <span>{session.location}</span>
              </div>
            )}
            {session.capacity && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Users size={13} />
                <span>Capacity: {session.capacity}</span>
              </div>
            )}
          </div>
        </div>

        {showBookmark && onBookmarkToggle && (
          <button
            onClick={() => onBookmarkToggle(session)}
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
              isBookmarked
                ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark session'}
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        )}
      </div>

      {session.speakerBio && (
        <p className="mt-3 text-xs text-gray-500 line-clamp-2 border-t border-gray-100 pt-3">
          {session.speakerBio}
        </p>
      )}
    </div>
  )
}
