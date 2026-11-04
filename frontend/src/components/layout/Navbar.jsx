import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Globe2, Menu, X, ChevronDown, User, LogOut,
  MessageSquare, LayoutDashboard, Bell
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
    { label: 'Events', to: '/expos', always: true },
    ...(isAdmin ? [
      { label: 'Dashboard', to: '/admin/dashboard' },
      { label: 'Manage Expos', to: '/admin/expos' },
    ] : []),
    ...(isExhibitor ? [
      { label: 'Dashboard', to: '/exhibitor/dashboard' },
      { label: 'Applications', to: '/exhibitor/applications' },
    ] : []),
    ...(isAttendee ? [
      { label: 'Dashboard', to: '/attendee/dashboard' },
      { label: 'My Schedule', to: '/attendee/schedule' },
    ] : []),
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-700">
            <Globe2 size={26} className="text-primary-600" />
            <span>EventSphere</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-primary-700'
                    : 'text-gray-600 hover:text-primary-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/messages"
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Messages"
                >
                  <MessageSquare size={20} />
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown size={15} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          <span className="inline-block mt-1 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full capitalize">
                            {user?.role}
                          </span>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <LayoutDashboard size={15} /> Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <User size={15} /> Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut size={15} /> Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pb-4">
          <div className="flex flex-col gap-1 mt-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.to) ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/messages" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Messages</Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Profile</Link>
                <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 text-left">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
