import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Layers,
  Store,
  Grid,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  PackageCheck,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { exhibitorService } from '../../api/services'
import { useAuth } from '../../hooks/useAuth'

export default function ExhibitorDashboard() {
  const { user } = useAuth()
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
      <div className="space-y-6">
        {/* Clean Light Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-2">
              Exhibitor Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Partner'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your event applications, reserve floor booths, and update your company profile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/expos"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
            >
              <Store size={17} />
              Browse Events
            </Link>
            <Link
              to="/exhibitor/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
            >
              Company Profile
            </Link>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Applications"
            value={applications.length}
            icon={Layers}
            variant="primary"
            subtitle="Total events applied"
          />
          <StatCard
            label="Approved"
            value={approved}
            icon={CheckCircle2}
            variant="success"
            subtitle="Ready for booth selection"
          />
          <StatCard
            label="Booked Booths"
            value={assignedBooths}
            icon={Grid}
            variant="info"
            subtitle="Assigned floor booths"
          />
          <StatCard
            label="Pending"
            value={pending}
            icon={Clock}
            variant="warning"
            subtitle="Awaiting organizer review"
          />
        </div>

        {/* Applications & Booths Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Your Event Applications &amp; Booths
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose a booth on the floor plan for any approved event
              </p>
            </div>
            <Link
              to="/exhibitor/applications"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 bg-blue-50 px-3.5 py-2 rounded-xl"
            >
              View All Applications <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-14 flex justify-center">
              <LoadingSpinner text="Loading applications..." />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-14 px-4">
              <Store size={36} className="mx-auto text-slate-300 mb-3" />
              <p className="text-base font-bold text-slate-900">No applications yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Browse upcoming events and submit your company profile to book a booth.
              </p>
              <Link
                to="/expos"
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Event
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Company
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Booth
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">
                          {app.expo?.title || 'Exhibition Event'}
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
                          <PackageCheck size={12} className="text-blue-600" />
                          <span>{(app.products || []).length} Products</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {app.booth ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                            <Grid size={12} />
                            Booth {app.booth.number || 'Assigned'}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Not selected</span>
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                          >
                            <Grid size={13} />
                            {app.booth ? 'View Booth' : 'Select Booth'}
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
