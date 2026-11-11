import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Layers,
  MessageSquare,
  User,
  Clock,
  Briefcase,
  Store,
  PlusCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Sidebar() {
  const { user, isAdmin, isExhibitor, isAttendee } = useAuth()

  const adminLinks = [
    { label: 'Command Center', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage All Expos', to: '/admin/expos', icon: Calendar },
    { label: 'Launch New Expo', to: '/admin/expos/create', icon: PlusCircle },
    { label: 'B2B Messages', to: '/messages', icon: MessageSquare },
    { label: 'Account Settings', to: '/profile', icon: User },
  ]

  const exhibitorLinks = [
    { label: 'Exhibitor Hub', to: '/exhibitor/dashboard', icon: LayoutDashboard },
    { label: 'My Applications', to: '/exhibitor/applications', icon: Layers },
    { label: 'Company Showcase', to: '/exhibitor/profile', icon: Store },
    { label: 'Discover Expos', to: '/expos', icon: Briefcase },
    { label: 'B2B Messages', to: '/messages', icon: MessageSquare },
    { label: 'Account Settings', to: '/profile', icon: User },
  ]

  const attendeeLinks = [
    { label: 'Attendee Hub', to: '/attendee/dashboard', icon: LayoutDashboard },
    { label: 'My VIP Passes', to: '/attendee/my-expos', icon: Calendar },
    { label: 'My Itinerary', to: '/attendee/schedule', icon: Clock },
    { label: 'Explore Expos', to: '/expos', icon: Briefcase },
    { label: 'Direct Messages', to: '/messages', icon: MessageSquare },
    { label: 'Account Settings', to: '/profile', icon: User },
  ]

  const links = isAdmin ? adminLinks : isExhibitor ? exhibitorLinks : attendeeLinks

  const roleColor = isAdmin
    ? 'from-rose-600 to-orange-600'
    : isExhibitor
    ? 'from-violet-600 to-indigo-600'
    : 'from-blue-600 to-emerald-600'

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 px-4 select-none no-print">
      <div className="space-y-6">
        {/* Role Identity Card */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 space-y-3">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/40"
              />
            ) : (
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${roleColor} text-white flex items-center justify-center font-extrabold text-base shadow-md`}
              >
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
              <ShieldCheck size={12} /> {user?.role} Portal
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Workspace Navigation
          </p>
          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin/expos'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Quick Promo Card */}
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/90 to-indigo-950/90 border border-blue-800/40 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
            <Sparkles size={14} /> Live Expo Catalog
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Browse interactive 2D booth maps, speaker lineups, and keynote schedules.
          </p>
          <Link
            to="/expos"
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-white hover:text-blue-300 transition-colors"
          >
            Open Public Directory <ExternalLink size={12} />
          </Link>
        </div>

        <div className="text-[11px] text-slate-500 px-2 flex items-center justify-between">
          <span>EventSphere Enterprise</span>
          <span className="font-mono text-slate-400">v2.5</span>
        </div>
      </div>
    </aside>
  )
}
