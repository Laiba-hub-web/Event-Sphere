import React from 'react'

// Content-shaped skeleton (feels faster than a spinner) with optional caption
export function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export default function LoadingSpinner({ fullScreen = false, text = '', variant = 'skeleton' }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-blue-100 border-t-blue-600 animate-spin" />
          {text && <p className="text-sm text-slate-500 font-medium">{text}</p>}
        </div>
      </div>
    )
  }

  if (variant === 'spinner') {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-blue-100 border-t-blue-600 animate-spin" />
          {text && <p className="text-sm text-slate-500 font-medium">{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-3 animate-fade-in" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-10 h-10 shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-3.5 w-1/3" />
          <SkeletonBlock className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonBlock className="h-12" />
      <SkeletonBlock className="h-12" />
      <SkeletonBlock className="h-12 w-11/12" />
      {text && <p className="text-xs text-center text-slate-400 font-medium pt-1">{text}</p>}
    </div>
  )
}
