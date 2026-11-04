import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, trend, trendLabel, iconBg = 'bg-primary-100', iconColor = 'text-primary-600' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${iconBg} flex-shrink-0`}>
        {Icon && <Icon size={22} className={iconColor} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value ?? '—'}</p>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{Math.abs(trend)}%</span>
            {trendLabel && <span className="text-gray-400 font-normal">{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
