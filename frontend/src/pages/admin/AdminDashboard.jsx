import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, Grid, Clock, Plus, ArrowRight, BarChart3, Settings } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { expoService } from '../../api/services'

export default function AdminDashboard() {
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpos()
  }, [])

  const fetchExpos = async () => {
    try {
      setLoading(true)
      const res = await expoService.getAll()
      setExpos(res.data.expos || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const publishedCount = expos.filter((e) => e.status === 'published').length
  const draftCount = expos.filter((e) => e.status === 'draft').length

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organizer & Admin Hub</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage large-scale trade shows, floor plans, sessions, and exhibitor applications.
            </p>
          </div>
          <Link
            to="/admin/expos/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow transition-colors"
          >
            <Plus size={18} />
            Create New Expo
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Expos"
            value={expos.length}
            icon={Calendar}
            variant="primary"
          />
          <StatCard
            label="Published Expos"
            value={publishedCount}
            icon={Grid}
            variant="success"
          />
          <StatCard
            label="Draft Expos"
            value={draftCount}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            label="System Health"
            value="Optimal"
            icon={BarChart3}
            variant="info"
          />
        </div>

        {/* Expos Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-900">Your Trade Shows & Expos</h2>
            <Link
              to="/admin/expos"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
            >
              View All ({expos.length}) <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner text="Loading your expos..." />
            </div>
          ) : expos.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Calendar size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-semibold text-gray-900">No expos created yet</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Get started by creating your first exhibition event.
              </p>
              <Link
                to="/admin/expos/create"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-medium"
              >
                Create Expo
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Event Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date & Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Quick Operations
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expos.slice(0, 5).map((e) => (
                    <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {e.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(e.date).toLocaleDateString()} · {e.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={e.status === 'published' ? 'success' : 'neutral'}>
                          {e.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs space-x-3 font-medium">
                        <Link
                          to={`/admin/expos/${e._id}/floor-plan`}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          Floor Plan
                        </Link>
                        <Link
                          to={`/admin/expos/${e._id}/schedule`}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          Schedule
                        </Link>
                        <Link
                          to={`/admin/expos/${e._id}/exhibitors`}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          Exhibitors
                        </Link>
                        <Link
                          to={`/admin/analytics/${e._id}`}
                          className="text-emerald-600 hover:text-emerald-800"
                        >
                          Analytics
                        </Link>
                        <Link
                          to={`/admin/expos/${e._id}/edit`}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
