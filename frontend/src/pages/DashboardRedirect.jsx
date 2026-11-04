import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function DashboardRedirect() {
  const { user } = useAuth()

  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  if (user?.role === 'exhibitor') return <Navigate to="/exhibitor/dashboard" replace />
  if (user?.role === 'attendee') return <Navigate to="/attendee/dashboard" replace />

  return <Navigate to="/" replace />
}
