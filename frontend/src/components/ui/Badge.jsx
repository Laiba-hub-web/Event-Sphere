import React from 'react'

const variants = {
  primary: 'bg-blue-50 text-blue-700 border-blue-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  error: 'bg-rose-50 text-rose-700 border-rose-200',
  info: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ongoing: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  reserved: 'bg-amber-50 text-amber-700 border-amber-200',
  occupied: 'bg-blue-50 text-blue-700 border-blue-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const dotColors = {
  primary: 'bg-blue-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  error: 'bg-rose-500',
  info: 'bg-indigo-500',
  pending: 'bg-amber-500',
  approved: 'bg-emerald-500',
  rejected: 'bg-rose-500',
  active: 'bg-emerald-500',
  published: 'bg-emerald-500',
  ongoing: 'bg-blue-500',
  available: 'bg-emerald-500',
  reserved: 'bg-amber-500',
  occupied: 'bg-blue-500',
  confirmed: 'bg-emerald-500',
}

export default function Badge({ children, variant = 'default', dot = false, className = '' }) {
  const cls = variants[variant] || variants.default
  const dotCls = dotColors[variant] || 'bg-slate-400'
  const isLive = variant === 'ongoing'

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border whitespace-nowrap ${cls} ${className}`}
    >
      {(dot || isLive) && (
        <span className="relative flex w-1.5 h-1.5">
          {isLive && (
            <span className={`absolute inline-flex h-full w-full rounded-full ${dotCls} opacity-60 animate-ping`} />
          )}
          <span className={`relative inline-flex w-1.5 h-1.5 rounded-full ${dotCls}`} />
        </span>
      )}
      {children}
    </span>
  )
}
