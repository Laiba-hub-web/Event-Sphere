import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Store,
  BarChart3,
  MessageSquare,
  User,
  Clock,
  Ticket,
  Layers,
  Home,
  CornerDownLeft,
  CalendarDays,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { expoService } from '../../api/services'

export const openCommandPalette = () =>
  window.dispatchEvent(new CustomEvent('open-command-palette'))

const RECENT_KEY = 'eventsphere_recent_commands'

export default function CommandPalette() {
  const { user, isAuthenticated, isAdmin, isExhibitor, isAttendee } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [expos, setExpos] = useState([])
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Global shortcut: Ctrl/Cmd + K, plus custom event from navbar/sidebar buttons
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-command-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('open-command-palette', onOpen)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    setTimeout(() => inputRef.current?.focus(), 10)
    if (expos.length === 0) {
      expoService
        .getAll()
        .then((r) => setExpos(r.data.expos || []))
        .catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const pages = useMemo(() => {
    const common = [
      { label: 'Home', to: '/', icon: Home, group: 'Pages' },
      { label: 'Browse Events', to: '/expos', icon: Calendar, group: 'Pages' },
    ]
    if (!isAuthenticated) {
      return [
        ...common,
        { label: 'Sign In', to: '/login', icon: User, group: 'Account' },
        { label: 'Create Account', to: '/register', icon: User, group: 'Account' },
      ]
    }
    const shared = [
      { label: 'Messages', to: '/messages', icon: MessageSquare, group: 'Pages' },
      { label: 'Profile & Settings', to: '/profile', icon: User, group: 'Account' },
    ]
    if (isAdmin) {
      return [
        { label: 'Organizer Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, group: 'Pages' },
        { label: 'All Events', to: '/admin/expos', icon: Calendar, group: 'Pages' },
        { label: 'Create New Event', to: '/admin/expos/create', icon: PlusCircle, group: 'Actions' },
        { label: 'Exhibitor Management', to: '/admin/exhibitors', icon: Store, group: 'Pages' },
        { label: 'Analytics & Reports', to: '/admin/analytics', icon: BarChart3, group: 'Pages' },
        ...common,
        ...shared,
      ]
    }
    if (isExhibitor) {
      return [
        { label: 'Exhibitor Dashboard', to: '/exhibitor/dashboard', icon: LayoutDashboard, group: 'Pages' },
        { label: 'My Applications', to: '/exhibitor/applications', icon: Layers, group: 'Pages' },
        { label: 'Company Profile', to: '/exhibitor/profile', icon: Store, group: 'Pages' },
        ...common,
        ...shared,
      ]
    }
    return [
      { label: 'Attendee Dashboard', to: '/attendee/dashboard', icon: LayoutDashboard, group: 'Pages' },
      { label: 'My Tickets', to: '/attendee/my-expos', icon: Ticket, group: 'Pages' },
      { label: 'My Schedule & Reminders', to: '/attendee/schedule', icon: Clock, group: 'Pages' },
      ...common,
      ...shared,
    ]
  }, [isAuthenticated, isAdmin, isExhibitor, isAttendee])

  const eventItems = useMemo(
    () =>
      expos.flatMap((ex) => {
        const base = [
          {
            label: ex.title,
            hint: ex.location,
            to: `/expos/${ex._id}`,
            icon: CalendarDays,
            group: 'Events',
          },
        ]
        if (isAdmin) {
          base.push(
            { label: `${ex.title} — Floor Plan`, to: `/admin/expos/${ex._id}/floor-plan`, icon: Layers, group: 'Event Tools' },
            { label: `${ex.title} — Exhibitors`, to: `/admin/expos/${ex._id}/exhibitors`, icon: Store, group: 'Event Tools' },
            { label: `${ex.title} — Reports`, to: `/admin/analytics/${ex._id}`, icon: BarChart3, group: 'Event Tools' }
          )
        }
        return base
      }),
    [expos, isAdmin]
  )

  const recent = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
    } catch {
      return []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      const recentItems = recent
        .map((r) => [...pages, ...eventItems].find((p) => p.to === r))
        .filter(Boolean)
        .slice(0, 3)
        .map((r) => ({ ...r, group: 'Recent' }))
      const recentTos = new Set(recentItems.map((r) => r.to))
      return [...recentItems, ...pages.filter((p) => !recentTos.has(p.to))]
    }
    const terms = q.split(/\s+/)
    return [...pages, ...eventItems]
      .filter((item) => {
        const hay = `${item.label} ${item.hint || ''} ${item.group}`.toLowerCase()
        return terms.every((t) => hay.includes(t))
      })
      .slice(0, 12)
  }, [query, pages, eventItems, recent])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const go = (item) => {
    if (!item) return
    try {
      const prev = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').filter((t) => t !== item.to)
      localStorage.setItem(RECENT_KEY, JSON.stringify([item.to, ...prev].slice(0, 5)))
    } catch {
      /* ignore */
    }
    setOpen(false)
    navigate(item.to)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  if (!open) return null

  let lastGroup = null

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/40 animate-fade-in" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-pop border border-slate-200 overflow-hidden animate-scale-in">
        <div className="flex items-center gap-3 px-4 border-b border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={
              user ? `Search pages, events, or tools, ${user.name?.split(' ')[0]}...` : 'Search pages and events...'
            }
            className="flex-1 py-4 text-sm bg-transparent border-0 outline-none focus:shadow-none placeholder:text-slate-400"
            style={{ boxShadow: 'none' }}
          />
          <span className="kbd">Esc</span>
        </div>

        <div ref={listRef} className="max-h-[55vh] overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-slate-500">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((item, idx) => {
              const Icon = item.icon || Search
              const showGroup = item.group !== lastGroup
              lastGroup = item.group
              return (
                <React.Fragment key={`${item.group}-${item.to}-${idx}`}>
                  {showGroup && (
                    <div className="px-4 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {item.group}
                    </div>
                  )}
                  <button
                    type="button"
                    data-index={idx}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => go(item)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      idx === active ? 'bg-blue-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        idx === active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm font-medium truncate ${idx === active ? 'text-blue-700' : 'text-slate-800'}`}>
                        {item.label}
                      </span>
                      {item.hint && <span className="block text-xs text-slate-500 truncate">{item.hint}</span>}
                    </span>
                    {idx === active && <CornerDownLeft size={14} className="text-blue-500 shrink-0" />}
                  </button>
                </React.Fragment>
              )
            })
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="kbd">↑</span>
            <span className="kbd">↓</span> to navigate
            <span className="kbd ml-1.5">Enter</span> to open
          </span>
          <span className="flex items-center gap-1">
            <span className="kbd">Ctrl</span>
            <span className="kbd">K</span>
          </span>
        </div>
      </div>
    </div>
  )
}

