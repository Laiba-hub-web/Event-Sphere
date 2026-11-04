import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layers, Store, Grid, ExternalLink, Calendar, MapPin } from 'lucide-react'
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Expo Applications</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review review feedback, booth booking eligibility, and approval statuses.
            </p>
          </div>
          <Link
            to="/expos"
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow transition-colors"
          >
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
            actionLabel="Explore Expos"
            actionTo="/expos"
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {app.expo?.title || 'Exhibition Event'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 text-xs text-gray-500 mt-1">
                      {app.expo?.date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={13} /> {new Date(app.expo.date).toLocaleDateString()}
                        </span>
                      )}
                      {app.expo?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} /> {app.expo.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        app.applicationStatus === 'approved'
                          ? 'success'
                          : app.applicationStatus === 'rejected'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {app.applicationStatus}
                    </Badge>

                    {app.applicationStatus === 'approved' && app.expo?._id && (
                      <Link
                        to={`/exhibitor/booth/${app.expo._id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                      >
                        <Grid size={14} /> Reserve Booth
                      </Link>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-xs">
                  <div className="font-semibold text-gray-800">Company: {app.company}</div>
                  {app.description && <p className="text-gray-600">{app.description}</p>}
                  {app.products && app.products.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {app.products.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-700">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {app.rejectionReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
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
