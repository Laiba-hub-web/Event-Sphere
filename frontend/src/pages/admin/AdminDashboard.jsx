import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Users,
  Grid,
  Clock,
  Plus,
  ArrowRight,
  BarChart3,
  Sparkles,
  MapPin,
  Store,
  Mic2,
  Eye,
  Edit3,
  Layers,
} from 'lucide-react'
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
  const totalBoothCapacity = expos.reduce(
    (acc, e) => acc + (e.boothRows || 5) * (e.boothColumns || 8),
    0
  )
  const firstExpoId = expos[0]?._id

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Executive Organizer Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-7 sm:p-9 overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-primary-500/20 blur-3xl pointer-events-none" />
          <div className="absolute right-32 -bottom-20 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-primary-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={13} className="text-amber-400" />
                <span>Organizer &amp; Admin Command Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Global Trade Show &amp; Exhibition Control Center
              </h1>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Orchestrate multi-hall floor plans, approve enterprise exhibitor applications, manage keynote speaker tracks, and monitor live registration telemetry from one unified cockpit.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/admin/expos/create"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-600/30 transition-all"
              >
                <Plus size={18} />
                Launch New Expo
              </Link>
              <Link
                to="/admin/expos"
                className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-sm font-semibold transition-all"
              >
                Manage Portfolio ({expos.length})
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Managed Expos"
            value={expos.length}
            icon={Calendar}
            variant="primary"
            subtitle="Active global trade shows"
            trend="+100% synced"
          />
          <StatCard
            label="Published & Live"
            value={publishedCount}
            icon={Layers}
            variant="success"
            subtitle="Open for public registration"
            trend="Live on directory"
          />
          <StatCard
            label="Total Booth Inventory"
            value={totalBoothCapacity}
            icon={Grid}
            variant="purple"
            subtitle="Across all 2D floor plans"
            trend="Interactive 2D grids"
          />
          <StatCard
            label="Telemetry & Cloud"
            value="99.9%"
            icon={BarChart3}
            variant="info"
            subtitle="MongoDB Atlas + Socket.io"
            trend="Optimal"
          />
        </div>

        {/* Quick Command Launcher */}
        {firstExpoId && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                Rapid Operations Launcher (Flagship Expo)
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Target: <strong className="text-slate-800">{expos[0]?.title}</strong>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to={`/admin/expos/${firstExpoId}/floor-plan`}
                className="group bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-primary-300 transition-all flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <Grid size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    2D Floor Plan Studio
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Configure booth pricing, dimensions &amp; exhibitor assignments
                  </p>
                </div>
              </Link>

              <Link
                to={`/admin/expos/${firstExpoId}/exhibitors`}
                className="group bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Store size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    Exhibitor Approvals
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Review partner applications, catalogs &amp; booth requests
                  </p>
                </div>
              </Link>

              <Link
                to={`/admin/expos/${firstExpoId}/schedule`}
                className="group bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Mic2 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    Keynote &amp; Track Builder
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Schedule speakers, auditorium halls &amp; seat capacities
                  </p>
                </div>
              </Link>

              <Link
                to={`/admin/analytics/${firstExpoId}`}
                className="group bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Live Telemetry &amp; CSV
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Inspect registration velocity, booth occupancy &amp; ratings
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Expos Command Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
          <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Active Trade Shows &amp; Exhibition Portfolio
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct operational shortcuts for every event in your organization
              </p>
            </div>
            <Link
              to="/admin/expos"
              className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1.5 bg-primary-50 px-3.5 py-2 rounded-xl"
            >
              Open Full Expo Manager ({expos.length}) <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner text="Loading exhibition portfolio..." />
            </div>
          ) : expos.length === 0 ? (
            <div className="text-center py-14 px-4">
              <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-base font-bold text-slate-900">No expos created yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Get started by launching your first exhibition event.
              </p>
              <Link
                to="/admin/expos/create"
                className="px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold"
              >
                Create First Expo
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Exhibition Event
                    </th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Date &amp; Venue
                    </th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Hall Grid
                    </th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-right text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Command Operations
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {expos.map((e) => {
                    const totalBooths = (e.boothRows || 5) * (e.boothColumns || 8)
                    return (
                      <tr key={e._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={
                                e.coverImage ||
                                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80'
                              }
                              alt={e.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <Link
                                to={`/expos/${e._id}`}
                                className="font-bold text-slate-900 hover:text-primary-600 transition-colors line-clamp-1"
                              >
                                {e.title}
                              </Link>
                              <span className="text-xs text-slate-500 block mt-0.5">
                                {e.theme || 'Global Industry Summit'}
                              </span>
                            </div>
                          </div>
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
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                            <Grid size={12} className="text-primary-600" />
                            {totalBooths} Booths ({e.boothRows || 5}&times;{e.boothColumns || 8})
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
                              className="px-2.5 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs font-bold transition-colors"
                            >
                              Floor Plan
                            </Link>
                            <Link
                              to={`/admin/expos/${e._id}/schedule`}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold transition-colors"
                            >
                              Schedule
                            </Link>
                            <Link
                              to={`/admin/expos/${e._id}/exhibitors`}
                              className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors"
                            >
                              Exhibitors
                            </Link>
                            <Link
                              to={`/admin/analytics/${e._id}`}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
                            >
                              Analytics
                            </Link>
                            <Link
                              to={`/admin/expos/${e._id}/edit`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Edit Expo"
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
