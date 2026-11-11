import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Layers,
  Store,
  Grid,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  PackageCheck,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { exhibitorService } from '../../api/services'

export default function ExhibitorDashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await exhibitorService.getMyApplications()
      setApplications(res.data.applications || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const approved = applications.filter((a) => a.applicationStatus === 'approved').length
  const pending = applications.filter((a) => a.applicationStatus === 'pending').length
  const assignedBooths = applications.filter((a) => a.booth).length

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* B2B Exhibitor Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white p-7 sm:p-9 overflow-hidden shadow-xl border border-purple-800/40">
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-purple-500/25 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={13} className="text-amber-400" />
                <span>B2B Exhibitor Showcase Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Manage Your Exhibition Booths &amp; Product Showcases
              </h1>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Reserve prime 2D floor plan booths, publish your hardware and software catalog for attendees, and respond to B2B inquiries in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/expos"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/30 transition-all"
              >
                <Store size={18} />
                Apply to More Expos
              </Link>
              <Link
                to="/exhibitor/profile"
                className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-sm font-semibold transition-all"
              >
                Company Showcase Profile
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Applications"
            value={applications.length}
            icon={Layers}
            variant="primary"
            subtitle="Submitted expo profiles"
          />
          <StatCard
            label="Approved Showcases"
            value={approved}
            icon={CheckCircle2}
            variant="success"
            subtitle="Cleared for booth booking"
          />
          <StatCard
            label="Assigned Floor Booths"
            value={assignedBooths}
            icon={Grid}
            variant="purple"
            subtitle="Active 2D hall units"
          />
          <StatCard
            label="Pending Reviews"
            value={pending}
            icon={Clock}
            variant="warning"
            subtitle="Awaiting organizer approval"
          />
        </div>

        {/* Applications & Booth Allocations Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
          <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Your Trade Show Applications &amp; Booth Assignments
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select or change your booth directly on the interactive 2D floor plan for any approved event
              </p>
            </div>
            <Link
              to="/exhibitor/applications"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1.5 bg-purple-50 px-3.5 py-2 rounded-xl"
            >
              View All Applications <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner text="Loading exhibitor applications..." />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-14 px-4">
              <Store size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-base font-bold text-slate-900">No applications submitted yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Explore upcoming expos and submit your company profile to reserve a booth.
              </p>
              <Link
                to="/expos"
                className="px-4 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Upcoming Expos
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Expo Event
                    </th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Company &amp; Catalog
                    </th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Assigned Booth
                    </th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-right text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Booth Operations
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">
                          {app.expo?.title || 'Global Trade Show'}
                        </div>
                        {app.expo?.location && (
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} className="text-slate-400" />
                            <span>{app.expo.location}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{app.company}</div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <PackageCheck size={12} className="text-purple-500" />
                          <span>{(app.products || []).length} Products Listed</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {app.booth ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-extrabold">
                            <Grid size={12} />
                            Booth {app.booth.number || 'Assigned'}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No booth selected</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            app.applicationStatus === 'approved'
                              ? 'success'
                              : app.applicationStatus === 'rejected'
                              ? 'danger'
                              : 'warning'
                          }
                          dot
                        >
                          {app.applicationStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {app.applicationStatus === 'approved' && app.expo?._id && (
                          <Link
                            to={`/exhibitor/booth/${app.expo._id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors"
                          >
                            <Grid size={13} />
                            {app.booth ? 'Manage Booth' : 'Reserve 2D Booth'}
                          </Link>
                        )}
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
