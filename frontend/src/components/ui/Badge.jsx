import React from 'react'

const variants = {
  primary: 'bg-blue-50 text-blue-700 border-blue-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  error: 'bg-rose-50 text-rose-700 border-rose-200',
  info: 'bg-violet-50 text-violet-700 border-violet-200',
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
  completed: 'bg-violet-50 text-violet-700 border-violet-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  reserved: 'bg-amber-50 text-amber-700 border-amber-200',
  occupied: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  const cls = variants[variant] || variants.default
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${cls} ${className}`}
    >
      {children}
    </span>
  )
}
