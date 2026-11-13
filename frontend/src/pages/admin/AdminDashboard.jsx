import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Grid,
  Plus,
  ArrowRight,
  BarChart3,
  MapPin,
  Store,
  Mic2,
  Edit3,
  Layers,
  CheckCircle2,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { expoService } from '../../api/services'
import { useAuth } from '../../hooks/useAuth'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [expos, setExpos] = useState([])
  const [selectedExpoId, setSelectedExpoId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpos()
  }, [])

  const fetchExpos = async () => {
    try {
      setLoading(true)
      const res = await expoService.getAll()
      const list = res.data.expos || []
      setExpos(list)
      if (list.length > 0) {
        const flagship =
          list.find((e) => e.title?.includes('Global Tech & AI Summit')) || list[0]
        setSelectedExpoId(flagship._id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const publishedCount = expos.filter(
    (e) => e.status === 'published' || e.status === 'ongoing'
  ).length
  const upcomingCount = expos.filter((e) => new Date(e.date) >= new Date()).length
  const totalBoothCapacity = expos.reduce(
    (acc, e) => acc + (e.boothRows || 5) * (e.boothColumns || 8),
    0
  )
  const firstExpoId = selectedExpoId || expos[0]?._id
  const activeExpo = expos.find((e) => e._id === firstExpoId) || expos[0]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Clean Light Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-2">
              Organizer Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Organizer'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your events, floor plans, speaker schedules, and exhibitor applications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/admin/expos/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
            >
              <Plus size={17} />
              Create Event
            </Link>
            <Link
              to="/admin/expos"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
            >
              All Events ({expos.length})
            </Link>
          </div>
        </div>

        {/* Clean Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Events"
            value={expos.length}
            icon={Calendar}
            variant="primary"
            subtitle="All created events"
          />
          <StatCard
            label="Published Events"
            value={publishedCount}
            icon={CheckCircle2}
            variant="success"
            subtitle="Open for registration"
          />
          <StatCard
            label="Upcoming Dates"
            value={upcomingCount}
            icon={Layers}
            variant="info"
            subtitle="Scheduled events"
          />
          <StatCard
            label="Total Booth Spaces"
            value={totalBoothCapacity}
            icon={Grid}
            variant="warning"
            subtitle="Across all event halls"
          />
        </div>

        {/* Quick Shortcuts for Selected Event */}
        {firstExpoId && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-semibold text-slate-600">
                Quick Actions for Event:{' '}
                <span className="font-bold text-blue-600">{activeExpo?.title}</span>
              </div>
              <select
                value={firstExpoId}
                onChange={(e) => setSelectedExpoId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {expos.map((ex) => (
                  <option key={ex._id} value={ex._id}>
                    {ex.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to={`/admin/expos/${firstExpoId}/floor-plan`}
                className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Grid size={19} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
                    Floor Plan &amp; Booths
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {activeExpo?.title}
                  </p>
                </div>
              </Link>

              <Link
                to={`/admin/expos/${firstExpoId}/exhibitors`}
                className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Store size={19} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">
                    Exhibitor Management
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    Approve/reject &amp; assign booths
                  </p>
                </div>
              </Link>

              <Link
                to={`/admin/expos/${firstExpoId}/schedule`}
                className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Mic2 size={19} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600">
                    Event Schedule
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {activeExpo?.title}
                  </p>
                </div>
              </Link>

              <Link
                to={`/admin/analytics/${firstExpoId}`}
                className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <BarChart3 size={19} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600">
                    Reports &amp; Insights
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {activeExpo?.title}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Events Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Your Events</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quickly manage floor plans, schedules, and exhibitors for any event
              </p>
            </div>
            <Link
              to="/admin/expos"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 bg-blue-50 px-3.5 py-2 rounded-xl"
            >
              View All Events <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-14 flex justify-center">
              <LoadingSpinner text="Loading events..." />
            </div>
          ) : expos.length === 0 ? (
            <div className="text-center py-14 px-4">
              <Calendar size={36} className="mx-auto text-slate-300 mb-3" />
              <p className="text-base font-bold text-slate-900">No events created yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Get started by creating your first exhibition event.
              </p>
              <Link
                to="/admin/expos/create"
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                Create Event
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Event Name
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Date &amp; Location
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Booths
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500">
                      Manage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {expos.map((e) => {
                    const totalBooths = (e.boothRows || 5) * (e.boothColumns || 8)
                    return (
                      <tr key={e._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <Link
                            to={`/expos/${e._id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors block"
                          >
                            {e.title}
                          </Link>
                          <span className="text-xs text-slate-500 mt-0.5 block">
                            {e.theme || 'Exhibition Event'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs font-semibold text-slate-800">
                            {new Date(e.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} className="text-slate-400" />
                            <span className="truncate max-w-[180px]">{e.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                            <Grid size={12} className="text-blue-600" />
                            {totalBooths} Booths
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={e.status === 'published' ? 'success' : 'neutral'} dot>
                            {e.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              to={`/admin/expos/${e._id}/floor-plan`}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors"
                            >
                              Booths
                            </Link>
                            <Link
                              to={`/admin/expos/${e._id}/schedule`}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
                            >
                              Schedule
                            </Link>
                            <Link
                              to={`/admin/expos/${e._id}/exhibitors`}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
                            >
                              Exhibitors
                            </Link>
                            <Link
                              to={`/admin/analytics/${e._id}`}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
                            >
                              Reports
                            </Link>
                            <Link
                              to={`/admin/expos/${e._id}/edit`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Edit Event"
                            >
                              <Edit3 size={15} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
