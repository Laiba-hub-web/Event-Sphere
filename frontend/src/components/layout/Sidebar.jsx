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
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Sidebar({ onNavigate }) {
  const { user, isAdmin, isExhibitor } = useAuth()

  const adminLinks = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'All Events', to: '/admin/expos', icon: Calendar },
    { label: 'Create Event', to: '/admin/expos/create', icon: PlusCircle },
    { label: 'Messages', to: '/messages', icon: MessageSquare },
    { label: 'Profile', to: '/profile', icon: User },
  ]

  const exhibitorLinks = [
    { label: 'Dashboard', to: '/exhibitor/dashboard', icon: LayoutDashboard },
    { label: 'My Applications', to: '/exhibitor/applications', icon: Layers },
    { label: 'Company Profile', to: '/exhibitor/profile', icon: Store },
    { label: 'Browse Events', to: '/expos', icon: Briefcase },
    { label: 'Messages', to: '/messages', icon: MessageSquare },
    { label: 'Profile', to: '/profile', icon: User },
  ]

  const attendeeLinks = [
    { label: 'Dashboard', to: '/attendee/dashboard', icon: LayoutDashboard },
    { label: 'My Tickets', to: '/attendee/my-expos', icon: Calendar },
    { label: 'My Schedule', to: '/attendee/schedule', icon: Clock },
    { label: 'Browse Events', to: '/expos', icon: Briefcase },
    { label: 'Messages', to: '/messages', icon: MessageSquare },
    { label: 'Profile', to: '/profile', icon: User },
  ]

  const links = isAdmin ? adminLinks : isExhibitor ? exhibitorLinks : attendeeLinks

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] h-full flex flex-col justify-between py-6 px-4 select-none no-print">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          )}
          <div className="overflow-hidden min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs font-medium text-blue-600 capitalize truncate">
              {user?.role === 'admin' ? 'Organizer' : user?.role}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Menu
          </p>
          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin/expos'}
                  onClick={() => onNavigate && onNavigate()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Link */}
      <div className="pt-6 border-t border-slate-100">
        <Link
          to="/expos"
          onClick={() => onNavigate && onNavigate()}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
        >
          <span>View Public Events</span>
          <ExternalLink size={14} className="text-slate-400" />
        </Link>
      </div>
    </aside>
  )
}
