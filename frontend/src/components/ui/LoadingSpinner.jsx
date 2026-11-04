import React from 'react'

export default function LoadingSpinner({ fullScreen = false, text = '' }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin" />
      </div>
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        {spinner}
      </div>
    )
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>
}
