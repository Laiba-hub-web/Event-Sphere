import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, X, Building, Mail, Phone, Globe, ExternalLink } from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { expoService, exhibitorService } from '../../api/services'

export default function ExhibitorApplicationsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expo, setExpo] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // Reject modal
  const [rejectingApp, setRejectingApp] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadApplications()
  }, [id])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const [expoRes, appsRes] = await Promise.all([
        expoService.getOne(id),
        exhibitorService.getByExpo(id, { includeAll: true }),
      ])
      setExpo(expoRes.data.expo)
      setApplications(appsRes.data.applications || appsRes.data.exhibitors || [])
    } catch (err) {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (appId) => {
    try {
      await exhibitorService.approve(appId)
      toast.success('Exhibitor application approved!')
      loadApplications()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve')
    }
  }

  const handleReject = async (e) => {
    e.preventDefault()
    if (!rejectingApp) return
    setProcessing(true)
    try {
      await exhibitorService.reject(rejectingApp._id, { rejectionReason })
      toast.success('Application rejected')
      setRejectingApp(null)
      setRejectionReason('')
      loadApplications()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject application')
    } finally {
      setProcessing(false)
    }
  }

  const filtered = applications.filter((app) => {
    if (filter === 'all') return true
    return app.applicationStatus === filter
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/admin/expos')}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-2 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Expos
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Exhibitor Applications</h1>
            <p className="text-sm text-gray-500">{expo?.title}</p>
          </div>

          <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200">
            {['all', 'pending', 'approved', 'rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${
                  filter === st
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner text="Loading applications..." />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Building}
              title="No exhibitor applications found"
              description={
                filter === 'all'
                  ? 'No companies have applied to exhibit at this event yet.'
                  : `No applications with status "${filter}".`
              }
            />
          ) : (
            <div className="space-y-6">
              {filtered.map((app) => (
                <div
                  key={app._id}
                  className="p-5 border border-gray-200 rounded-xl space-y-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                        {app.company ? app.company[0].toUpperCase() : 'C'}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-gray-900">{app.company}</h3>
                        <p className="text-xs text-gray-500">Applicant: {app.user?.name} ({app.user?.email})</p>
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

                      {app.applicationStatus === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(app._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            onClick={() => {
                              setRejectingApp(app)
                              setRejectionReason('')
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {app.description && (
                    <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                      {app.description}
                    </p>
                  )}

                  {/* Details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
                    {app.contactEmail && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} className="text-gray-400" /> {app.contactEmail}
                      </span>
                    )}
                    {app.contactPhone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} className="text-gray-400" /> {app.contactPhone}
                      </span>
                    )}
                    {app.website && (
                      <a
                        href={app.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-primary-600 hover:underline"
                      >
                        <Globe size={14} /> Website <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Products / Services */}
                  {((app.products && app.products.length > 0) || (app.services && app.services.length > 0)) && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {app.products?.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] rounded">
                          Product: {p}
                        </span>
                      ))}
                      {app.services?.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[11px] rounded">
                          Service: {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {app.rejectionReason && (
                    <div className="text-xs text-red-700 bg-red-50 p-2.5 rounded border border-red-200">
                      <strong>Rejection Reason:</strong> {app.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectingApp}
        onClose={() => setRejectingApp(null)}
        title={`Reject Application from ${rejectingApp?.company}`}
      >
        <form onSubmit={handleReject} className="space-y-4">
          <p className="text-xs text-gray-600">
            Please provide a constructive reason for rejecting this exhibitor application.
          </p>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Reason for Rejection</label>
            <textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Products do not align with expo theme, or category capacity reached."
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRejectingApp(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

