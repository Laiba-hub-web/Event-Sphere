import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layers, Store, Grid, MessageSquare, ArrowRight, CheckCircle2, Clock } from 'lucide-react'
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exhibitor Portal</h1>
            <p className="text-sm text-gray-500 mt-1">
              Track your expo applications, select floor booths, and configure your showcase profile.
            </p>
          </div>
          <Link
            to="/expos"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow transition-colors"
          >
            <Store size={18} />
            Explore Expos
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            label="Total Applications"
            value={applications.length}
            icon={Layers}
            variant="primary"
          />
          <StatCard
            label="Approved Participations"
            value={approved}
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            label="Pending Review"
            value={pending}
            icon={Clock}
            variant="warning"
          />
        </div>

        {/* Applications table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-900">Your Trade Show Applications</h2>
            <Link
              to="/exhibitor/applications"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
            >
              All Applications <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner text="Loading applications..." />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Store size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-semibold text-gray-900">No applications submitted</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Explore upcoming expos and submit your company profile to exhibit.
              </p>
              <Link
                to="/expos"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-medium"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Expo Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {app.expo?.title || 'Trade Show'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {app.company}
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
                        >
                          {app.applicationStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                        {app.applicationStatus === 'approved' && app.expo?._id && (
                          <Link
                            to={`/exhibitor/booth/${app.expo._id}`}
                            className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-800"
                          >
                            <Grid size={14} /> Select Booth
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
