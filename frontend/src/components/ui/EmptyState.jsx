import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Inbox } from 'lucide-react'

// Supports both prop styles used across pages:
//   action={{ label, onClick, icon }}   or   actionLabel + actionTo / onAction
export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  actionLabel,
  actionTo,
  onAction,
}) {
  const label = action?.label || actionLabel
  const handleClick = action?.onClick || onAction
  const ActionIcon = action?.icon || ArrowRight

  const btnCls =
    'inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors'

  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center animate-fade-up">
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-2xl bg-blue-100 rotate-6" />
        <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
          <Icon size={28} className="text-blue-600" />
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      )}
      {label && actionTo && !handleClick && (
        <Link to={actionTo} className={btnCls}>
          {label} <ActionIcon size={15} />
        </Link>
      )}
      {label && handleClick && (
        <button type="button" onClick={handleClick} className={btnCls}>
          {label} <ActionIcon size={15} />
        </button>
      )}
    </div>
  )
}
