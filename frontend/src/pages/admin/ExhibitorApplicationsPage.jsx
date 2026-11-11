import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  X,
  Building,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Grid,
} from 'lucide-react'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      toast.success('Application status updated to rejected')
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div>
            <button
              onClick={() => navigate('/admin/expos')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Expo Portfolio
            </button>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Exhibitor Partner Applications &amp; Vetting
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">{expo?.title}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  filter === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
            <Link
              to={`/admin/expos/${id}/floor-plan`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
            >
              <Grid size={14} /> Assign Booths
            </Link>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6">
          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner text="Loading exhibitor profiles..." />
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
            <div className="space-y-4">
              {filtered.map((app) => (
                <div
                  key={app._id}
                  className="p-5 border border-slate-200 rounded-2xl space-y-4 hover:border-blue-300 transition-all bg-slate-50/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {app.logo ? (
                        <img
                          src={app.logo}
                          alt={app.company}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shrink-0">
                          {app.company ? app.company[0].toUpperCase() : 'C'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">{app.company}</h3>
                        <p className="text-xs text-slate-500">
                          Representative: <strong className="text-slate-700">{app.user?.name}</strong> ({app.user?.email})
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
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

                      {app.applicationStatus !== 'approved' && (
                        <button
                          onClick={() => handleApprove(app._id)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                        >
                          <Check size={14} /> Approve
                        </button>
                      )}
                      {app.applicationStatus !== 'rejected' && (
                        <button
                          onClick={() => {
                            setRejectingApp(app)
                            setRejectionReason('')
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold rounded-xl transition-colors"
                        >
                          <X size={14} /> Reject
                        </button>
                      )}
                    </div>
                  </div>

                  {app.description && (
                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/70">
                      {app.description}
                    </p>
                  )}

                  {/* Details grid */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
                    {app.contactEmail && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} className="text-blue-600" /> {app.contactEmail}
                      </span>
                    )}
                    {app.contactPhone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} className="text-blue-600" /> {app.contactPhone}
                      </span>
                    )}
                    {app.website && (
                      <a
                        href={app.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-blue-600 font-bold hover:underline"
                      >
                        <Globe size={14} /> Official Website <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Products / Services */}
                  {((app.products && app.products.length > 0) ||
                    (app.services && app.services.length > 0)) && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {app.products?.map((p, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-bold rounded-lg"
                        >
                          Hardware/Product: {p}
                        </span>
                      ))}
                      {app.services?.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg"
                        >
                          Service: {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {app.rejectionReason && (
                    <div className="text-xs text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200">
                      <strong>Organizer Feedback:</strong> {app.rejectionReason}
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
        title={`Reject Application — ${rejectingApp?.company}`}
      >
        <form onSubmit={handleReject} className="space-y-4">
          <p className="text-xs text-slate-600">
            Provide a clear reason for rejecting this exhibitor application so the partner can update their submission.
          </p>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Reason for Rejection
            </label>
            <textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Category booth allocation is full, or additional product documentation is required."
              className="w-full p-3 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRejectingApp(null)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
