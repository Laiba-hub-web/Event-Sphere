import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Store,
  Grid,
  Calendar,
  MapPin,
  Sparkles,
  PackageCheck,
  ExternalLink,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { exhibitorService } from '../../api/services'

export default function MyApplicationsPage() {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-1">
              <Sparkles size={13} /> Exhibitor Applications
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              My Trade Show Applications &amp; Booth Eligibility
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Track approval statuses, organizer feedback, and reserve 2D floor booths for approved events.
            </p>
          </div>
          <Link
            to="/expos"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all shrink-0 self-start sm:self-auto"
          >
            <Store size={16} />
            Apply to More Expos
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner text="Loading your applications..." />
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            icon={Store}
            title="No applications found"
            description="You have not submitted an application to exhibit at any expo yet."
            actionLabel="Explore Upcoming Expos"
            actionTo="/expos"
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <Link
                      to={`/expos/${app.expo?._id}`}
                      className="text-lg font-extrabold text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{app.expo?.title || 'Exhibition Event'}</span>
                      <ExternalLink size={14} className="text-slate-400" />
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                      {app.expo?.date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-blue-600" />
                          {new Date(app.expo.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      {app.expo?.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-blue-600" /> {app.expo.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {app.booth && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                        <Grid size={13} /> Booth {app.booth.number}
                      </span>
                    )}
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

                    {app.applicationStatus === 'approved' && app.expo?._id && (
                      <Link
                        to={`/exhibitor/booth/${app.expo._id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      >
                        <Grid size={14} /> {app.booth ? 'View / Change Booth' : 'Select Booth'}
                      </Link>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <PackageCheck size={15} className="text-blue-600" />
                    <span>Showcased Company: {app.company}</span>
                  </div>
                  {app.description && (
                    <p className="text-slate-600 leading-relaxed">{app.description}</p>
                  )}
                  {app.products && app.products.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {app.products.map((p, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {app.rejectionReason && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                    <strong>Organizer Feedback:</strong> {app.rejectionReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
