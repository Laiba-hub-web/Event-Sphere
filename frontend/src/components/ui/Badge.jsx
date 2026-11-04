import React from 'react'

const variants = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-700 border-gray-200',
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
  published: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-purple-100 text-purple-800 border-purple-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  available: 'bg-green-100 text-green-800 border-green-200',
  reserved: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  occupied: 'bg-red-100 text-red-800 border-red-200',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  const cls = variants[variant] || variants.default
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls} ${className}`}
    >
      {children}
    </span>
  )
}
