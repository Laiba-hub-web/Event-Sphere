import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Grid, ArrowRight, Sparkles, Clock } from 'lucide-react'
import Badge from '../ui/Badge'

const fallbackBanners = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900&auto=format&fit=crop&q=80',
]

export default function ExpoCard({ expo, actionLabel, actionTo, onActionClick }) {
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'TBD'

  const getDaysBadge = () => {
    if (!expo.date) return null
    const diffDays = Math.ceil((new Date(expo.date) - new Date()) / (1000 * 60 * 60 * 24))
    if (expo.status === 'ongoing' || (diffDays <= 0 && diffDays >= -4)) {
      return { text: 'Live Now', cls: 'bg-rose-600 text-white animate-pulse' }
    }
    if (diffDays > 0) {
      return { text: `In ${diffDays} Days`, cls: 'bg-blue-600/90 text-white backdrop-blur-xs' }
    }
    return { text: 'Completed', cls: 'bg-slate-800/80 text-slate-200' }
  }

  const daysBadge = getDaysBadge()
  const totalBooths = (expo.boothRows || 4) * (expo.boothColumns || 6)
  const bannerSrc =
    expo.bannerImage ||
    fallbackBanners[(expo.title?.length || 0) % fallbackBanners.length]

  const targetLink = actionTo || `/expos/${expo._id}`

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Banner Image */}
      <Link to={targetLink} className="relative h-52 overflow-hidden bg-slate-900 block">
        <img
          src={bannerSrc}
          alt={expo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          {daysBadge && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${daysBadge.cls}`}
            >
              <Clock size={11} /> {daysBadge.text}
            </span>
          )}
          <Badge variant={expo.status || 'published'}>{expo.status || 'published'}</Badge>
        </div>

        {/* Bottom Theme & Title Overlay */}
        <div className="absolute bottom-3.5 left-4 right-4">
          {expo.theme && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-300 mb-1">
              <Sparkles size={11} /> {expo.theme}
            </span>
          )}
          <h3 className="font-bold text-white text-lg leading-snug line-clamp-2 group-hover:text-blue-200 transition-colors">
            {expo.title}
          </h3>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {expo.description && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {expo.description}
            </p>
          )}

          <div className="space-y-2 pt-1 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-blue-600 shrink-0" />
              <span className="font-medium text-slate-800">
                {formatDate(expo.date)}
                {expo.endDate && ` – ${formatDate(expo.endDate)}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-rose-500 shrink-0" />
              <span className="truncate">{expo.location || 'Venue TBD'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Grid size={14} className="text-violet-600 shrink-0" />
              <span>{totalBooths} Exhibition Booth Spaces · Interactive Map</span>
            </div>
          </div>

          {/* Tags */}
          {expo.tags && expo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {expo.tags.slice(0, 4).map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {onActionClick ? (
            <button
              onClick={onActionClick}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <span>{actionLabel || 'Explore Event & Floor Plan'}</span>
              <ArrowRight size={15} />
            </button>
          ) : (
            <Link
              to={targetLink}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all group/btn"
            >
              <span>{actionLabel || 'Explore Event & Floor Plan'}</span>
              <ArrowRight
                size={15}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
