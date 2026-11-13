import React from 'react'
import { Sun, Moon, Sunrise, CalendarDays } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import {
  getFirstName,
  getGreeting,
  getTodayLabel,
  getInitials,
  getRoleTheme,
  getTitleFromName,
} from '../../utils/personalize'

/**
 * Personalized dashboard header:
 * time-aware greeting, first name, role identity, today's date,
 * a contextual insight line, and role-specific quick actions (children).
 */
export default function WelcomeBanner({ insight, children, highlights = [] }) {
  const { user } = useAuth()
  const theme = getRoleTheme(user?.role)
  const hour = new Date().getHours()
  const TimeIcon = hour < 12 ? Sunrise : hour < 18 ? Sun : Moon
  const jobTitle = getTitleFromName(user?.name)

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-xs">
      {/* Role accent strip */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.accentBar}`} />
      {/* Soft personalized wash (static, no blur — cheap to paint) */}
      <div
        className={`absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l ${theme.soft} to-transparent pointer-events-none`}
      />

      <div className="relative p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4 min-w-0">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name}
              className={`w-14 h-14 rounded-2xl object-cover shrink-0 ring-4 ${theme.ring} hidden sm:block`}
            />
          ) : (
            <div
              className={`w-14 h-14 rounded-2xl ${theme.avatar} text-white items-center justify-center font-bold text-lg shrink-0 ring-4 ${theme.ring} hidden sm:flex`}
            >
              {getInitials(user?.name)}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${theme.chip}`}
              >
                {theme.label} Workspace
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays size={13} className="text-slate-400" />
                {getTodayLabel()}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="truncate">
                {getGreeting()}, {getFirstName(user?.name)}
              </span>
              <TimeIcon size={22} className="text-amber-500 shrink-0" />
            </h1>

            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              {insight ||
                (jobTitle
                  ? `Signed in as ${jobTitle}. Here is what needs your attention today.`
                  : 'Here is what needs your attention today.')}
            </p>

            {highlights.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs"
                  >
                    {h.icon && <h.icon size={13} className={h.iconClass || 'text-blue-600'} />}
                    {h.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {children && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">{children}</div>
        )}
      </div>
    </div>
  )
}

