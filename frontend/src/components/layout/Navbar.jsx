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
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

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
    { label: 'Explore Expos', to: '/expos' },
    ...(isAdmin
      ? [
          { label: 'Command Center', to: '/admin/dashboard' },
          { label: 'Manage Expos', to: '/admin/expos' },
        ]
      : []),
    ...(isExhibitor
      ? [
          { label: 'Exhibitor Hub', to: '/exhibitor/dashboard' },
          { label: 'Applications', to: '/exhibitor/applications' },
          { label: 'Showcase Profile', to: '/exhibitor/profile' },
        ]
      : []),
    ...(isAttendee
      ? [
          { label: 'Attendee Hub', to: '/attendee/dashboard' },
          { label: 'My VIP Passes', to: '/attendee/my-expos' },
          { label: 'My Itinerary', to: '/attendee/schedule' },
        ]
      : []),
  ]

  const roleBadgeColor = isAdmin
    ? 'bg-rose-500/10 text-rose-600 border-rose-200'
    : isExhibitor
    ? 'bg-violet-500/10 text-violet-600 border-violet-200'
    : 'bg-emerald-500/10 text-emerald-600 border-emerald-200'

  return (
    <nav className="bg-white/95 backdrop-blur-lg border-b border-slate-200/80 sticky top-0 z-40 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Globe2 size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                EventSphere
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-600 mt-0.5">
                Global Expos
              </span>
            </div>
          </Link>

          {/* Desktop nav links (lg and up so tablet never wraps/overflows) */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side (Desktop lg+) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <>
                <Link
                  to="/messages"
                  className={`relative p-2.5 rounded-xl transition-all ${
                    isActive('/messages')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                  title="Real-Time Messages"
                >
                  <MessageSquare size={19} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all shadow-2xs"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 max-w-[110px] truncate leading-tight">
                        {user?.name}
                      </p>
                      <p className="text-[10px] font-semibold text-blue-600 capitalize leading-tight">
                        {user?.role}
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
                      <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-20 overflow-hidden py-1">
                        <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100">
                          <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                          <span
                            className={`inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${roleBadgeColor}`}
                          >
                            {user?.role} Account
                          </span>
                        </div>
                        <div className="py-1.5 px-1.5 space-y-0.5">
                          <Link
                            to="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            <LayoutDashboard size={15} /> Role Dashboard
                          </Link>
                          <Link
                            to="/messages"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            <MessageSquare size={15} /> Direct Messages
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            <User size={15} /> Account Settings
                          </Link>
                        </div>
                        <div className="border-t border-slate-100 pt-1 px-1.5 pb-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
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
                  className="inline-flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 transition-all"
                >
                  <Sparkles size={14} /> Get Free Pass
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet right actions (< lg) */}
          <div className="flex lg:hidden items-center gap-1.5">
            {isAuthenticated && (
              <Link
                to="/messages"
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                title="Messages"
              >
                <MessageSquare size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
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
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pb-5 shadow-lg">
          {isAuthenticated && (
            <div className="flex items-center justify-between py-3 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${roleBadgeColor}`}
              >
                {user?.role}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1 mt-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-700'
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
                  Direct Messages
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Account Settings
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
                  Get Free Pass
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
