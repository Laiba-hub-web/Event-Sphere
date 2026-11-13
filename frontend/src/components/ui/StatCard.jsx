import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'

const variantStyles = {
  primary: { icon: 'bg-blue-50 text-blue-600', bar: 'bg-blue-600' },
  success: { icon: 'bg-emerald-50 text-emerald-600', bar: 'bg-emerald-500' },
  warning: { icon: 'bg-amber-50 text-amber-600', bar: 'bg-amber-500' },
  info: { icon: 'bg-indigo-50 text-indigo-600', bar: 'bg-indigo-600' },
  danger: { icon: 'bg-rose-50 text-rose-600', bar: 'bg-rose-500' },
}

// Animates the numeric part of values like 42, "45%", "$1500", "4.9 / 5", "12 Seats"
export function useCountUp(value, duration = 700) {
  const [display, setDisplay] = useState(value)
  const prevTarget = useRef(null)

  useEffect(() => {
    if (value === null || value === undefined) {
      setDisplay(value)
      return
    }
    const str = String(value)
    const match = str.match(/^(\D*?)(\d[\d,]*\.?\d*)(.*)$/)
    if (!match) {
      setDisplay(value)
      return
    }
    const [, prefix, numStr, suffix] = match
    const target = parseFloat(numStr.replace(/,/g, ''))
    const decimals = (numStr.split('.')[1] || '').length
    if (Number.isNaN(target) || prevTarget.current === str) {
      setDisplay(value)
      return
    }
    prevTarget.current = str

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || target === 0) {
      setDisplay(value)
      return
    }

    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      const current = (target * eased).toFixed(decimals)
      setDisplay(`${prefix}${Number(current).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`)
      if (p < 1) raf = requestAnimationFrame(tick)
      else setDisplay(value)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return display
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  trendLabel,
  variant = 'primary',
  to,
  onClick,
}) {
  const style = variantStyles[variant] || variantStyles.primary
  const animated = useCountUp(value)
  const interactive = Boolean(to || onClick)

  const content = (
    <>
      {/* Accent bar reveals on hover */}
      <span
        className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${style.bar} opacity-0 group-hover:opacity-100 transition-opacity`}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 truncate">{label}</p>
          <p className="text-2xl sm:text-[1.7rem] font-bold text-slate-900 tracking-tight tabular-nums">
            {animated ?? '—'}
          </p>
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${style.icon} group-hover:scale-110 transition-transform duration-200`}
        >
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
        {trend !== undefined && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold shrink-0 ${
              trend >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend)}%
            {trendLabel && <span className="text-slate-400 font-normal">{trendLabel}</span>}
          </span>
        )}
        {interactive && (
          <ArrowUpRight
            size={15}
            className="text-slate-300 group-hover:text-blue-600 shrink-0 transition-colors"
          />
        )}
      </div>
    </>
  )

  const cls =
    'group relative block bg-white rounded-2xl border border-slate-200 shadow-xs p-5 card-hover hover:border-slate-300 overflow-hidden text-left w-full'

  if (to) {
    return (
      <Link to={to} className={cls}>
        {content}
      </Link>
    )
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {content}
      </button>
    )
  }
  return <div className={cls}>{content}</div>
}
