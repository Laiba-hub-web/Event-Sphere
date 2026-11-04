import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Users,
  BarChart3,
  MessageSquare,
  User,
  Clock,
  Briefcase,
  Store,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Sidebar() {
  const { user, isAdmin, isExhibitor, isAttendee } = useAuth()

  const adminLinks = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Expos & Events', to: '/admin/expos', icon: Calendar },
    { label: 'Messages', to: '/messages', icon: MessageSquare },
    { label: 'My Profile', to: '/profile', icon: User },
  ]

  const exhibitorLinks = [
    { label: 'Dashboard', to: '/exhibitor/dashboard', icon: LayoutDashboard },
    { label: 'My Applications', to: '/exhibitor/applications', icon: Layers },
    { label: 'Company Profile', to: '/exhibitor/profile', icon: Store },
    { label: 'Messages', to: '/messages', icon: MessageSquare },
    { label: 'My Profile', to: '/profile', icon: User },
  ]

  const attendeeLinks = [
    { label: 'Dashboard', to: '/attendee/dashboard', icon: LayoutDashboard },
    { label: 'My Expos', to: '/attendee/my-expos', icon: Calendar },
    { label: 'My Schedule', to: '/attendee/schedule', icon: Clock },
    { label: 'Browse Expos', to: '/expos', icon: Briefcase },
    { label: 'Messages', to: '/messages', icon: MessageSquare },
    { label: 'My Profile', to: '/profile', icon: User },
  ]

  const links = isAdmin ? adminLinks : isExhibitor ? exhibitorLinks : attendeeLinks

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 px-4">
      <div className="space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded capitalize bg-primary-100 text-primary-800">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div className="text-xs text-gray-400 px-3">
        EventSphere Platform v1.0
      </div>
    </aside>
  )
}
