import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, subtitle, children, size = 'md' }) {
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCloseRef.current?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Move focus into the dialog for keyboard users
    const t = setTimeout(() => {
      const first = panelRef.current?.querySelector(
        'input, select, textarea, button:not([data-close])'
      )
      first?.focus({ preventScroll: true })
    }, 30)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-slate-900/40 animate-fade-in"
        onClick={onClose}
      />
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div
          ref={panelRef}
          className={`relative bg-white w-full ${sizeClasses[size] || sizeClasses.md} rounded-t-2xl sm:rounded-2xl shadow-pop border border-slate-200 animate-scale-in max-h-[92vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 truncate">{title}</h3>
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                type="button"
                data-close
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 -mr-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          )}
          <div className="p-6 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}
