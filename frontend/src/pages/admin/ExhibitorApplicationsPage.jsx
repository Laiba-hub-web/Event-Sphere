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
  Search,
  CheckCircle2,
  Clock,
  Users,
  Settings2,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { expoService, exhibitorService, boothService } from '../../api/services'

export default function ExhibitorApplicationsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [expos, setExpos] = useState([])
  const [selectedExpoId, setSelectedExpoId] = useState(id || '')
  const [expo, setExpo] = useState(null)
  const [applications, setApplications] = useState([])
  const [booths, setBooths] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  // Reject modal state
  const [rejectingApp, setRejectingApp] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [processing, setProcessing] = useState(false)

  // Booth Assignment & Details modal state
  const [boothModalApp, setBoothModalApp] = useState(null)
  const [selectedBoothId, setSelectedBoothId] = useState('')
  const [boothSize, setBoothSize] = useState('medium')
  const [boothPrice, setBoothPrice] = useState(950)
  const [boothNotes, setBoothNotes] = useState('')
  const [savingBooth, setSavingBooth] = useState(false)

  // Load all events first so Event Switcher works both on /admin/exhibitors and /admin/expos/:id/exhibitors
  useEffect(() => {
    const initExpos = async () => {
      try {
        const res = await expoService.getAll()
        const list = res.data.expos || []
        setExpos(list)
        if (id) {
          setSelectedExpoId(id)
        } else if (list.length > 0) {
          const flagship =
            list.find((e) => e.title?.includes('Global Tech & AI Summit')) || list[0]
          setSelectedExpoId(flagship._id)
        } else {
          setLoading(false)
        }
      } catch (err) {
        setLoading(false)
      }
    }
    initExpos()
  }, [id])

  useEffect(() => {
    if (selectedExpoId) {
      loadData(selectedExpoId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExpoId])

  const loadData = async (expoIdToLoad = selectedExpoId) => {
    if (!expoIdToLoad) return
    try {
      setLoading(true)
      const [expoRes, appsRes, boothsRes] = await Promise.all([
        expoService.getOne(expoIdToLoad),
        exhibitorService.getByExpo(expoIdToLoad, { includeAll: true }),
        boothService.getByExpo(expoIdToLoad).catch(() => ({ data: { booths: [] } })),
      ])
      setExpo(expoRes.data.expo)
      setApplications(appsRes.data.applications || appsRes.data.exhibitors || [])
      setBooths(boothsRes.data.booths || [])
    } catch (err) {
      toast.error('Failed to load exhibitor management data')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (app) => {
    try {
      await exhibitorService.approve(app._id, { expoId: selectedExpoId })
      toast.success(`${app.company} application approved!`)
      loadData(selectedExpoId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve application')
    }
  }

  const handleSetPending = async (app) => {
    try {
      await exhibitorService.updateStatus(app._id, {
        applicationStatus: 'pending',
        expoId: selectedExpoId,
      })
      toast.success(`${app.company} moved to pending review`)
      loadData(selectedExpoId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleReject = async (e) => {
    e.preventDefault()
    if (!rejectingApp) return
    setProcessing(true)
    try {
      await exhibitorService.reject(rejectingApp._id, {
        rejectionReason,
        expoId: selectedExpoId,
      })
      toast.success(`${rejectingApp.company} application rejected`)
      setRejectingApp(null)
      setRejectionReason('')
      loadData(selectedExpoId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject application')
    } finally {
      setProcessing(false)
    }
  }

  // Open Assign Booth & Manage Booth Details modal for an exhibitor
  const openBoothManager = (app) => {
    setBoothModalApp(app)
    const currentBooth =
      booths.find((b) => b._id === app.booth?._id) ||
      booths.find((b) => b.status === 'available') ||
      booths[0]

    if (currentBooth) {
      setSelectedBoothId(currentBooth._id)
      setBoothSize(currentBooth.size || 'medium')
      setBoothPrice(currentBooth.price ?? 950)
      setBoothNotes(currentBooth.notes || '')
    } else {
      setSelectedBoothId('')
      setBoothSize('medium')
      setBoothPrice(950)
      setBoothNotes('')
    }
  }

  const handleSelectBoothInModal = (boothId) => {
    setSelectedBoothId(boothId)
    const target = booths.find((b) => b._id === boothId)
    if (target) {
      setBoothSize(target.size || 'medium')
      setBoothPrice(target.price ?? 950)
      setBoothNotes(target.notes || '')
    }
  }

  const handleSaveAndAssignBooth = async (e) => {
    e.preventDefault()
    if (!boothModalApp || !selectedBoothId) return
    setSavingBooth(true)
    try {
      // If exhibitor had a different booth assigned previously, release it first
      if (boothModalApp.booth?._id && boothModalApp.booth._id !== selectedBoothId) {
        await boothService.release(boothModalApp.booth._id).catch(() => {})
      }

      // 1. Update booth details (size, price, notes)
      await boothService.update(selectedBoothId, {
        size: boothSize,
        price: Number(boothPrice),
        notes: boothNotes,
      })

      // 2. Assign booth space to this exhibitor (also auto-approves their application)
      await boothService.assign(selectedBoothId, {
        exhibitorId: boothModalApp.user?._id || boothModalApp._id,
        exhibitorProfileId: boothModalApp._id,
        company: boothModalApp.company,
      })

      const targetBooth = booths.find((b) => b._id === selectedBoothId)
      toast.success(
        `Booth ${targetBooth?.number || ''} assigned to ${boothModalApp.company}!`
      )
      setBoothModalApp(null)
      loadData(selectedExpoId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign booth space')
    } finally {
      setSavingBooth(false)
    }
  }

  const handleReleaseExhibitorBooth = async (boothId, companyName) => {
    if (!boothId) return
    try {
      await boothService.release(boothId)
      toast.success(`Released booth from ${companyName}`)
      setBoothModalApp(null)
      loadData(selectedExpoId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to release booth')
    }
  }

  const approvedCount = applications.filter((a) => a.applicationStatus === 'approved').length
  const pendingCount = applications.filter((a) => a.applicationStatus === 'pending').length
  const assignedBoothCount = applications.filter((a) => a.booth).length

  const filtered = applications.filter((app) => {
    const matchesStatus = filter === 'all' || app.applicationStatus === filter
    const q = search.trim().toLowerCase()
    const matchesSearch =
      !q ||
      app.company?.toLowerCase().includes(q) ||
      app.user?.name?.toLowerCase().includes(q) ||
      app.user?.email?.toLowerCase().includes(q) ||
      (app.products || []).some((p) => p.toLowerCase().includes(q))
    return matchesStatus && matchesSearch
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Event Selector */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to Dashboard
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Exhibitor Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                View exhibitor registrations &amp; applications, approve or reject submissions, and assign booth spaces &amp; manage booth details.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {expos.length > 0 && (
                <select
                  value={selectedExpoId}
                  onChange={(e) => {
                    setSelectedExpoId(e.target.value)
                    if (id) navigate(`/admin/expos/${e.target.value}/exhibitors`)
                  }}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {expos.map((ex) => (
                    <option key={ex._id} value={ex._id}>
                      {ex.title}
                    </option>
                  ))}
                </select>
              )}

              {selectedExpoId && (
                <Link
                  to={`/admin/expos/${selectedExpoId}/floor-plan`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Grid size={14} /> Interactive Floor Plan
                </Link>
              )}
            </div>
          </div>

          {/* 3 Core Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-slate-700 font-medium">
              <Users size={15} className="text-blue-600 shrink-0" />
              <span>View exhibitor registrations &amp; applications</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-slate-700 font-medium">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>Approve or reject exhibitor applications</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-slate-700 font-medium">
              <Grid size={15} className="text-indigo-600 shrink-0" />
              <span>Assign booth spaces &amp; manage booth details</span>
            </div>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Exhibitors"
            value={applications.length}
            icon={Users}
            variant="primary"
            subtitle="Registered companies"
          />
          <StatCard
            label="Approved"
            value={approvedCount}
            icon={CheckCircle2}
            variant="success"
            subtitle="Eligible for floor booths"
          />
          <StatCard
            label="Pending Review"
            value={pendingCount}
            icon={Clock}
            variant="warning"
            subtitle="Awaiting approval"
          />
          <StatCard
            label="Assigned Booths"
            value={assignedBoothCount}
            icon={Grid}
            variant="info"
            subtitle={`Of ${booths.length} total booths`}
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by company, representative, email, or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All (${applications.length})` },
              { id: 'pending', label: `Pending (${pendingCount})` },
              { id: 'approved', label: `Approved (${approvedCount})` },
              {
                id: 'rejected',
                label: `Rejected (${
                  applications.filter((a) => a.applicationStatus === 'rejected').length
                })`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  filter === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exhibitor Registrations & Applications List */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4 sm:p-6">
          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner text="Loading exhibitor registrations and booths..." />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Building}
              title="No exhibitor applications found"
              description={
                filter === 'all'
                  ? 'No companies match your search criteria.'
                  : `No exhibitor applications with status "${filter}".`
              }
            />
          ) : (
            <div className="space-y-4">
              {filtered.map((app) => (
                <div
                  key={app._id}
                  className="p-5 border border-slate-200 rounded-2xl space-y-4 hover:border-blue-300 transition-colors bg-white"
                >
                  {/* Top Row: Company Info + Status & Booth Actions */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                      {app.logo ? (
                        <img
                          src={app.logo}
                          alt={app.company}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                          {app.company ? app.company[0].toUpperCase() : 'C'}
                        </div>
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900">{app.company}</h3>
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
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Representative:{' '}
                          <strong className="text-slate-800">{app.user?.name}</strong> (
                          {app.user?.email})
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons: Approve / Reject / Pending + Assign & Manage Booth */}
                    <div className="flex flex-wrap items-center gap-2">
                      {app.applicationStatus !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleApprove(app)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          <Check size={14} /> Approve
                        </button>
                      )}

                      {app.applicationStatus !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => {
                            setRejectingApp(app)
                            setRejectionReason(app.rejectionReason || '')
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          <X size={14} /> Reject
                        </button>
                      )}

                      {app.applicationStatus !== 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleSetPending(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                          title="Move back to Pending review"
                        >
                          <RotateCcw size={13} /> Set Pending
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => openBoothManager(app)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                      >
                        <Settings2 size={14} />
                        {app.booth
                          ? `Manage Booth (${app.booth.number})`
                          : 'Assign Booth Space'}
                      </button>
                    </div>
                  </div>

                  {/* Assigned Booth Space & Details Banner */}
                  <div
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      app.booth
                        ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                      <span className="inline-flex items-center gap-1.5 font-bold">
                        <Grid
                          size={14}
                          className={app.booth ? 'text-blue-600' : 'text-slate-400'}
                        />
                        {app.booth ? (
                          <span>Assigned Space: Booth {app.booth.number}</span>
                        ) : (
                          <span>Booth Space: Not Assigned Yet</span>
                        )}
                      </span>
                      {app.booth && (
                        <>
                          <span>
                            Size: <strong className="uppercase">{app.booth.size}</strong>
                          </span>
                          <span>
                            Price: <strong>${app.booth.price || 0}</strong>
                          </span>
                          {app.booth.notes && (
                            <span className="text-slate-600">
                              Notes: <strong>{app.booth.notes}</strong>
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openBoothManager(app)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                      >
                        {app.booth ? 'Edit Booth Details / Reassign' : 'Select Booth Now'}
                      </button>
                      {app.booth && (
                        <button
                          type="button"
                          onClick={() =>
                            handleReleaseExhibitorBooth(app.booth._id, app.company)
                          }
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 ml-2 cursor-pointer"
                        >
                          <Trash2 size={12} /> Release
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Company Description */}
                  {app.description && (
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70">
                      {app.description}
                    </p>
                  )}

                  {/* Contact Details */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
                    {(app.contactEmail || app.user?.email) && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} className="text-blue-600" />
                        {app.contactEmail || app.user?.email}
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
                        className="flex items-center gap-1.5 text-blue-600 font-semibold hover:underline"
                      >
                        <Globe size={14} /> Website <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Products & Services */}
                  {((app.products && app.products.length > 0) ||
                    (app.services && app.services.length > 0)) && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {app.products?.map((p, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-semibold rounded-lg"
                        >
                          Product: {p}
                        </span>
                      ))}
                      {app.services?.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-lg"
                        >
                          Service: {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {app.rejectionReason && (
                    <div className="text-xs text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200">
                      <strong>Rejection Reason:</strong> {app.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: Reject Exhibitor Application */}
      <Modal
        isOpen={!!rejectingApp}
        onClose={() => setRejectingApp(null)}
        title={`Reject Application — ${rejectingApp?.company}`}
      >
        <form onSubmit={handleReject} className="space-y-4">
          <p className="text-xs text-slate-600">
            Provide a reason for rejecting this exhibitor application so the company can review your feedback.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for Rejection
            </label>
            <textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Booth category is full, or additional company details are required."
              className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRejectingApp(null)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50 cursor-pointer"
            >
              {processing ? 'Saving...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Assign Booth Space & Manage Booth Details */}
      <Modal
        isOpen={!!boothModalApp}
        onClose={() => setBoothModalApp(null)}
        title={`Assign Booth & Manage Details — ${boothModalApp?.company}`}
      >
        {boothModalApp && (
          <form onSubmit={handleSaveAndAssignBooth} className="space-y-5">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Company:</span>{' '}
                <strong className="text-slate-900">{boothModalApp.company}</strong>
              </div>
              <div>
                <span className="text-slate-500">Current Booth:</span>{' '}
                <strong className="text-blue-600">
                  {boothModalApp.booth ? `Booth ${boothModalApp.booth.number}` : 'None'}
                </strong>
              </div>
            </div>

            {/* Step 1: Select Booth Space (Visual Grid + Dropdown) */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Select Booth Space ({expo?.title})
              </label>

              <select
                value={selectedBoothId}
                onChange={(e) => handleSelectBoothInModal(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white font-medium"
              >
                {booths.map((b) => {
                  const isCurrentCompany = b._id === boothModalApp.booth?._id
                  const isAvailable = b.status === 'available'
                  return (
                    <option
                      key={b._id}
                      value={b._id}
                      disabled={!isAvailable && !isCurrentCompany}
                    >
                      Booth {b.number} — {b.size.toUpperCase()} (${b.price || 0}){' '}
                      {isCurrentCompany
                        ? '(Currently Assigned to This Company)'
                        : isAvailable
                        ? '— Available'
                        : `— Occupied (${b.exhibitorProfile?.company || 'Booked'})`}
                    </option>
                  )
                })}
              </select>

              {/* Quick Mini Floor Grid */}
              <div className="grid grid-cols-6 gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-44 overflow-y-auto">
                {booths.map((b) => {
                  const isSelected = b._id === selectedBoothId
                  const isCurrentCompany = b._id === boothModalApp.booth?._id
                  const isAvailable = b.status === 'available'
                  const canPick = isAvailable || isCurrentCompany

                  return (
                    <button
                      key={b._id}
                      type="button"
                      disabled={!canPick}
                      onClick={() => handleSelectBoothInModal(b._id)}
                      className={`py-2 px-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : isCurrentCompany
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : isAvailable
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {b.number}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Manage Booth Details */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Manage Booth Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Booth Size
                  </label>
                  <select
                    value={boothSize}
                    onChange={(e) => setBoothSize(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option value="small">Small (3x3m)</option>
                    <option value="medium">Medium (6x3m)</option>
                    <option value="large">Large (9x6m)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Booth Price (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={boothPrice}
                    onChange={(e) => setBoothPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location &amp; Booth Notes
                </label>
                <input
                  type="text"
                  value={boothNotes}
                  onChange={(e) => setBoothNotes(e.target.value)}
                  placeholder="e.g. Front Entrance Island — Power & High-Speed Wi-Fi Included"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
              {boothModalApp.booth ? (
                <button
                  type="button"
                  onClick={() =>
                    handleReleaseExhibitorBooth(
                      boothModalApp.booth._id,
                      boothModalApp.company
                    )
                  }
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Release Current Booth
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBoothModalApp(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBooth || !selectedBoothId}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {savingBooth ? 'Saving...' : 'Assign Booth & Save Details'}
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  )
}
