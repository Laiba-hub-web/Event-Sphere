import React from 'react'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="p-4 bg-gray-100 rounded-full mb-4">
          <Icon size={36} className="text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          {action.icon && <action.icon size={16} />}
          {action.label}
        </button>
      )}
    </div>
  )
}
