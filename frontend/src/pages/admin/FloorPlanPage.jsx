import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Compass,
  Coffee,
  Mic2,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { expoService, boothService, exhibitorService } from '../../api/services'

export default function FloorPlanPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expo, setExpo] = useState(null)
  const [booths, setBooths] = useState([])
  const [exhibitors, setExhibitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooth, setSelectedBooth] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  // Edit form state in modal
  const [size, setSize] = useState('medium')
  const [price, setPrice] = useState(0)
  const [notes, setNotes] = useState('')
  const [selectedExhibitorId, setSelectedExhibitorId] = useState('')

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [expoRes, boothRes, exhRes] = await Promise.all([
        expoService.getOne(id),
        boothService.getByExpo(id),
        exhibitorService.getByExpo(id, { all: true }).catch(() => ({ data: { exhibitors: [] } })),
      ])
      setExpo(expoRes.data.expo)
      setBooths(boothRes.data.booths || [])
      setExhibitors(exhRes.data.exhibitors || [])
    } catch (err) {
      toast.error('Failed to load floor plan data')
    } finally {
      setLoading(false)
    }
  }

  const openBoothModal = (booth) => {
    setSelectedBooth(booth)
    setSize(booth.size || 'medium')
    setPrice(booth.price || 0)
    setNotes(booth.notes || '')
    setSelectedExhibitorId(booth.exhibitor?._id || '')
  }

  const handleUpdateBooth = async (e) => {
    e.preventDefault()
    if (!selectedBooth) return
    setUpdating(true)
    try {
      await boothService.update(selectedBooth._id, { size, price: Number(price), notes })
      toast.success('Booth specifications updated')
      setSelectedBooth(null)
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update booth')
    } finally {
      setUpdating(false)
    }
  }

  const handleAssignExhibitor = async () => {
    if (!selectedBooth || !selectedExhibitorId) return
    setUpdating(true)
    try {
      await boothService.assign(selectedBooth._id, { exhibitorId: selectedExhibitorId })
      toast.success('Booth assigned to exhibitor')
      setSelectedBooth(null)
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign booth')
    } finally {
      setUpdating(false)
    }
  }

  const handleReleaseBooth = async () => {
    if (!selectedBooth) return
    setUpdating(true)
    try {
      await boothService.release(selectedBooth._id)
      toast.success('Booth released and marked available')
      setSelectedBooth(null)
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to release booth')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex justify-center">
          <LoadingSpinner text="Constructing 2D floor plan studio..." />
        </div>
      </DashboardLayout>
    )
  }

  const availableCount = booths.filter((b) => b.status === 'available').length
  const reservedCount = booths.filter((b) => b.status === 'reserved').length
  const occupiedCount = booths.filter((b) => b.status === 'occupied').length
  const occupancyPct =
    booths.length > 0 ? Math.round(((occupiedCount + reservedCount) / booths.length) * 100) : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="min-w-0">
            <button
              onClick={() => navigate('/admin/expos')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Expo Portfolio
            </button>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Interactive 2D Floor Plan &amp; Booth Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
              {expo?.title} &bull; {expo?.location}
            </p>
          </div>

          {/* Live Status Filter & Telemetry Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All Units (${booths.length})`, color: 'bg-slate-900 text-white' },
              {
                id: 'available',
                label: `${availableCount} Available`,
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              },
              {
                id: 'reserved',
                label: `${reservedCount} Reserved`,
                color: 'bg-amber-50 text-amber-700 border-amber-200',
              },
              {
                id: 'occupied',
                label: `${occupiedCount} Occupied`,
                color: 'bg-rose-50 text-rose-700 border-rose-200',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold border transition-all ${
                  statusFilter === tab.id
                    ? 'ring-2 ring-primary-500 shadow-xs ' + tab.color
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Occupancy Progress Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>
                Hall Space Utilization ({occupiedCount + reservedCount} of {booths.length} Booths)
              </span>
              <span className="text-primary-600">{occupancyPct}% Allocated</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-500 shrink-0">
            Tap any booth cell below to edit specs or assign an exhibitor.
          </div>
        </div>

        {/* Architectural 2D Floor Plan Blueprint */}
        <div className="bg-slate-900 p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-800 space-y-5">
          {/* Top Hall Landmarks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 text-xs font-bold text-slate-300">
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 flex items-center justify-center gap-2 text-center">
              <Compass size={16} className="text-primary-400 shrink-0" />
              <span>NORTH MAIN ENTRANCE &amp; QR FOYER</span>
            </div>
            <div className="bg-indigo-950/80 border border-indigo-800/70 rounded-xl p-3 flex items-center justify-center gap-2 text-indigo-200 text-center">
              <Mic2 size={16} className="text-indigo-400 shrink-0" />
              <span>MAIN KEYNOTE AUDITORIUM &amp; STAGE A</span>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 flex items-center justify-center gap-2 text-center">
              <Coffee size={16} className="text-amber-400 shrink-0" />
              <span>VIP B2B NETWORKING LOUNGE</span>
            </div>
          </div>

          {/* Dedicated Horizontal Scroll Wrapper so mobile/tablet scrolls smoothly */}
          <div className="w-full overflow-x-auto pb-2">
            <div
              className="grid gap-3 p-4 bg-slate-950/70 rounded-2xl border border-slate-800 min-w-[680px]"
              style={{
                gridTemplateColumns: `repeat(${expo?.boothColumns || 8}, minmax(95px, 1fr))`,
              }}
            >
              {booths.map((booth) => {
                const dimmed = statusFilter !== 'all' && booth.status !== statusFilter
                const statusStyle =
                  booth.status === 'occupied'
                    ? 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-500/50 text-rose-200'
                    : booth.status === 'reserved'
                    ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/50 text-amber-200'
                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/50 text-emerald-200'

                return (
                  <button
                    type="button"
                    key={booth._id}
                    onClick={() => openBoothModal(booth)}
                    className={`h-24 border-2 rounded-xl p-2.5 flex flex-col justify-between items-center text-center transition-all hover:scale-[1.03] cursor-pointer ${statusStyle} ${
                      dimmed ? 'opacity-25 scale-95' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center w-full text-[10px] font-extrabold">
                      <span className="px-1.5 py-0.5 rounded bg-black/30">{booth.number}</span>
                      <span className="uppercase tracking-wider opacity-75">{booth.size}</span>
                    </div>
                    <div className="text-xs font-bold truncate max-w-[85px] text-white">
                      {booth.exhibitorProfile?.company || (
                        <span className="text-[10px] uppercase tracking-wider opacity-80">
                          {booth.status}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-semibold opacity-80">
                      {booth.price ? `$${booth.price}` : 'Included'}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Booth Editing / Assignment */}
      <Modal
        isOpen={!!selectedBooth}
        onClose={() => setSelectedBooth(null)}
        title={`Configure Booth ${selectedBooth?.number}`}
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
            <div>
              <span className="text-slate-500">Current Status:</span>
              <span className="ml-2 font-bold capitalize text-slate-900">
                {selectedBooth?.status}
              </span>
            </div>
            {selectedBooth?.exhibitorProfile && (
              <div>
                <span className="text-slate-500">Assigned To:</span>
                <span className="ml-2 font-bold text-primary-700">
                  {selectedBooth.exhibitorProfile.company}
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleUpdateBooth} className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Booth Dimensions &amp; Pricing
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">Booth Size Tier</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white"
                >
                  <option value="small">Small (3x3m Standard)</option>
                  <option value="medium">Medium (6x3m Executive)</option>
                  <option value="large">Large (9x6m Island Pavilion)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Rate (USD)</label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                Power, Wi-Fi &amp; Location Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. High-traffic corner unit, 10Gbps fiber drop included"
                className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Save Booth Specs
              </button>
            </div>
          </form>

          {/* Allocation Actions */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Exhibitor Allocation &amp; Release
            </h4>

            {selectedBooth?.status !== 'available' ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                <span className="text-xs font-medium text-rose-900">
                  Booth is currently <strong>{selectedBooth?.status}</strong>. Releasing will make it available on the floor plan.
                </span>
                <button
                  type="button"
                  onClick={handleReleaseBooth}
                  disabled={updating}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shrink-0"
                >
                  Release Booth
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Assign Directly to an Exhibitor Partner:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedExhibitorId}
                    onChange={(e) => setSelectedExhibitorId(e.target.value)}
                    className="flex-1 px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    <option value="">Select an exhibitor company...</option>
                    {exhibitors.map((exh) => (
                      <option key={exh._id} value={exh.user?._id}>
                        {exh.company} ({exh.user?.name})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAssignExhibitor}
                    disabled={updating || !selectedExhibitorId}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                  >
                    Assign Booth
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
