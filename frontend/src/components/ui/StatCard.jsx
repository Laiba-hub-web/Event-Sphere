import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const variantStyles = {
  primary: {
    iconBg: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25',
    accent: 'border-t-4 border-t-blue-600',
  },
  success: {
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/25',
    accent: 'border-t-4 border-t-emerald-500',
  },
  warning: {
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25',
    accent: 'border-t-4 border-t-amber-500',
  },
  info: {
    iconBg: 'bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-md shadow-violet-600/25',
    accent: 'border-t-4 border-t-violet-600',
  },
  danger: {
    iconBg: 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md shadow-rose-600/25',
    accent: 'border-t-4 border-t-rose-500',
  },
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  trendLabel,
  variant = 'primary',
}) {
  const style = variantStyles[variant] || variantStyles.primary

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 ${style.accent} shadow-xs hover:shadow-lg transition-all duration-300 p-5 flex items-start justify-between gap-4`}
    >
      <div className="space-y-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value ?? '—'}
        </p>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
        {trend !== undefined && (
          <div
            className={`inline-flex items-center gap-1 pt-1 text-xs font-semibold ${
              trend >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{Math.abs(trend)}%</span>
            {trendLabel && <span className="text-slate-400 font-normal">{trendLabel}</span>}
          </div>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${style.iconBg}`}>
        {Icon && <Icon size={22} />}
      </div>
    </div>
  )
}
