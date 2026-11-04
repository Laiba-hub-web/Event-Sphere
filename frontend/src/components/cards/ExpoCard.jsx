import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users } from 'lucide-react'
import Badge from '../ui/Badge'

export default function ExpoCard({ expo, actionLabel, actionTo, onActionClick }) {
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
      {/* Banner */}
      <div className="relative h-44 bg-gradient-to-br from-primary-600 to-secondary-600 overflow-hidden">
        {expo.bannerImage ? (
          <img
            src={expo.bannerImage}
            alt={expo.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-30">🏢</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={expo.status}>{expo.status}</Badge>
        </div>
        {expo.theme && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
              {expo.theme}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-2">{expo.title}</h3>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={13} />
            <span>{formatDate(expo.date)} — {formatDate(expo.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={13} />
            <span className="truncate">{expo.location || 'Location TBD'}</span>
          </div>
          {expo.registrationCount !== undefined && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users size={13} />
              <span>{expo.registrationCount} registered</span>
            </div>
          )}
        </div>

        {(actionLabel || actionTo) && (
          actionTo ? (
            <Link
              to={actionTo}
              className="block w-full text-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {actionLabel || 'View'}
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {actionLabel}
            </button>
          )
        )}
      </div>
    </div>
  )
}
