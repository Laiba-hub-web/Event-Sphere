import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Globe2,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  MessageSquare,
  LayoutDashboard,
  Search,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getUserInitials, getRoleTheme } from '../../utils/personalize'

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin, isExhibitor, isAttendee } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Events', to: '/expos' },
    ...(isAdmin
      ? [
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'Manage Events', to: '/admin/expos' },
        ]
      : []),
    ...(isExhibitor
      ? [
          { label: 'Dashboard', to: '/exhibitor/dashboard' },
          { label: 'Applications', to: '/exhibitor/applications' },
          { label: 'Company Profile', to: '/exhibitor/profile' },
        ]
      : []),
    ...(isAttendee
      ? [
          { label: 'Dashboard', to: '/attendee/dashboard' },
          { label: 'My Tickets', to: '/attendee/my-expos' },
          { label: 'My Schedule', to: '/attendee/schedule' },
        ]
      : []),
  ]

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Globe2 size={20} />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              EventSphere
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side (Desktop) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('eventsphere:open-palette'))}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Search EventSphere (Ctrl+K or ⌘K)"
            >
              <Search size={14} className="text-slate-400" />
              <span>Search...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded text-slate-500 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/messages"
                  className={`relative p-2 rounded-xl transition-colors ${
                    isActive('/messages')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                  title="Messages"
                >
                  <MessageSquare size={19} />
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                    ) : (
                      <div className={`w-7 h-7 rounded-lg ${getRoleTheme(user?.role).bgClass} text-white flex items-center justify-center text-xs font-bold`}>
                        {getUserInitials(user?.name)}
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 max-w-[120px] truncate leading-tight">
                        {user?.name}
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 capitalize leading-tight">
                        {user?.role === 'admin' ? 'Organizer' : user?.role}
                      </p>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-slate-200 z-20 overflow-hidden py-1">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                          <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1 px-1.5 space-y-0.5">
                          <Link
                            to="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <LayoutDashboard size={15} /> Dashboard
                          </Link>
                          <Link
                            to="/messages"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <MessageSquare size={15} /> Messages
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <User size={15} /> Profile
                          </Link>
                        </div>
                        <div className="border-t border-slate-100 pt-1 px-1.5 pb-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet right actions (< lg) */}
          <div className="flex lg:hidden items-center gap-1.5">
            {isAuthenticated && (
              <Link
                to="/messages"
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                title="Messages"
              >
                <MessageSquare size={20} />
              </Link>
            )}
            <button
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet menu (< lg) */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pb-5 shadow-md">
          <div className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/messages"
                  onClick={() => setMobileOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
