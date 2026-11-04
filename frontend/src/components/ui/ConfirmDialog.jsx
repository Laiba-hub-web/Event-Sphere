import React from 'react'
import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', confirmVariant = 'danger', loading = false }) {
  const confirmCls =
    confirmVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-primary-600 hover:bg-primary-700 text-white'

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`p-3 rounded-full ${confirmVariant === 'danger' ? 'bg-red-100' : 'bg-primary-100'}`}>
          <AlertTriangle size={28} className={confirmVariant === 'danger' ? 'text-red-600' : 'text-primary-600'} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {message && <p className="text-sm text-gray-500 mt-1">{message}</p>}
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-60 ${confirmCls}`}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
