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

const FALLBACK_EXHIBITORS = [
  { _id: 'fallback-techcorp', company: 'TechCorp Autonomous Systems', user: { _id: 'fallback-techcorp', name: 'David Vance' } },
  { _id: 'fallback-biogenix', company: 'BioGenix Precision Therapeutics', user: { _id: 'fallback-biogenix', name: 'Dr. Elena Rostova' } },
  { _id: 'fallback-voltdynamics', company: 'VoltDynamics Power Systems', user: { _id: 'fallback-voltdynamics', name: 'Marcus Chen' } },
  { _id: 'fallback-quantumleap', company: 'QuantumLeap Computing', user: { _id: 'fallback-quantumleap', name: 'Dr. Alistair Finch' } },
  { _id: 'fallback-apexrobotics', company: 'Apex Robotics International', user: { _id: 'fallback-apexrobotics', name: 'Camilla Hayes' } },
  { _id: 'fallback-cybershield', company: 'CyberShield Global Systems', user: { _id: 'fallback-cybershield', name: 'Vikram Patel' } },
]

export default function FloorPlanPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expo, setExpo] = useState(null)
  const [booths, setBooths] = useState([])
  const [exhibitors, setExhibitors] = useState(FALLBACK_EXHIBITORS)
  const [loading, setLoading] = useState(true)
  const [selectedBooth, setSelectedBooth] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

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
      const fetchedExhibitors = exhRes.data.exhibitors || []
      setExhibitors(fetchedExhibitors.length > 0 ? fetchedExhibitors : FALLBACK_EXHIBITORS)
    } catch (err) {
      toast.error('Failed to load floor plan')
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
    if (!exhibitors || exhibitors.length === 0) {
      exhibitorService
        .getByExpo(id, { all: true })
        .then((res) => {
          if (res.data?.exhibitors?.length > 0) {
            setExhibitors(res.data.exhibitors)
          }
        })
        .catch(() => {})
    }
  }

  const handleUpdateBooth = async (e) => {
    e.preventDefault()
    if (!selectedBooth) return
    setUpdating(true)
    try {
      await boothService.update(selectedBooth._id, { size, price: Number(price), notes })
      toast.success('Booth details updated')
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
      const chosen = exhibitors.find(
        (exh) => (exh.user?._id || exh._id) === selectedExhibitorId
      )
      await boothService.assign(selectedBooth._id, {
        exhibitorId: chosen?.user?._id || selectedExhibitorId,
        exhibitorProfileId: chosen?._id,
        company: chosen?.company,
      })
      toast.success('Booth assigned to company')
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
      toast.success('Booth marked as available')
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
        <div className="py-16 flex justify-center">
          <LoadingSpinner text="Loading floor plan..." />
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="min-w-0">
            <button
              onClick={() => navigate('/admin/expos')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Events
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Floor Plan &amp; Booth Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
              {expo?.title} &bull; {expo?.location}
            </p>
          </div>

          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All (${booths.length})`, activeCls: 'bg-blue-600 text-white border-blue-600' },
              {
                id: 'available',
                label: `${availableCount} Available`,
                activeCls: 'bg-emerald-600 text-white border-emerald-600',
              },
              {
                id: 'reserved',
                label: `${reservedCount} Reserved`,
                activeCls: 'bg-amber-500 text-white border-amber-500',
              },
              {
                id: 'occupied',
                label: `${occupiedCount} Occupied`,
                activeCls: 'bg-blue-600 text-white border-blue-600',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? tab.activeCls
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Occupancy Progress Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>
                Booths Booked ({occupiedCount + reservedCount} of {booths.length})
              </span>
              <span className="text-blue-600 font-bold">{occupancyPct}% Booked</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-500 shrink-0">
            Click any booth below to edit price or assign a company.
          </div>
        </div>

        {/* Clean Light-Mode Floor Map */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-5">
          {/* Top Hall Landmarks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs font-semibold text-slate-600">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-center gap-2 text-center">
              <Compass size={15} className="text-blue-600 shrink-0" />
              <span>Main Entrance</span>
            </div>
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 flex items-center justify-center gap-2 text-blue-800 text-center">
              <Mic2 size={15} className="text-blue-600 shrink-0" />
              <span>Main Speaker Stage</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-center gap-2 text-center">
              <Coffee size={15} className="text-amber-600 shrink-0" />
              <span>Networking Lounge</span>
            </div>
          </div>

          {/* Horizontal Scroll Wrapper */}
          <div className="w-full overflow-x-auto pb-2">
            <div
              className="grid gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 min-w-[680px]"
              style={{
                gridTemplateColumns: `repeat(${expo?.boothColumns || 8}, minmax(96px, 1fr))`,
              }}
            >
              {booths.map((booth) => {
                const dimmed = statusFilter !== 'all' && booth.status !== statusFilter
                const statusStyle =
                  booth.status === 'occupied'
                    ? 'bg-blue-50 hover:bg-blue-100/80 border-blue-200 text-blue-900'
                    : booth.status === 'reserved'
                    ? 'bg-amber-50 hover:bg-amber-100/80 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 text-emerald-900'

                const badgeDot =
                  booth.status === 'occupied'
                    ? 'bg-blue-600 text-white'
                    : booth.status === 'reserved'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-600 text-white'

                return (
                  <button
                    type="button"
                    key={booth._id}
                    onClick={() => openBoothModal(booth)}
                    className={`h-24 border rounded-xl p-2.5 flex flex-col justify-between items-center text-center transition-all cursor-pointer shadow-2xs ${statusStyle} ${
                      dimmed ? 'opacity-25' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center w-full text-[10px] font-bold">
                      <span className={`px-1.5 py-0.5 rounded-md ${badgeDot}`}>{booth.number}</span>
                      <span className="uppercase text-slate-500">{booth.size}</span>
                    </div>
                    <div className="text-xs font-bold truncate max-w-[85px] text-slate-900">
                      {booth.exhibitorProfile?.company || (
                        <span className="text-[11px] capitalize font-semibold opacity-75">
                          {booth.status}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600">
                      {booth.price ? `$${booth.price}` : 'Free'}
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
        title={`Booth ${selectedBooth?.number}`}
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
            <div>
              <span className="text-slate-500">Status:</span>
              <span className="ml-2 font-bold capitalize text-slate-900">
                {selectedBooth?.status}
              </span>
            </div>
            {selectedBooth?.exhibitorProfile && (
              <div>
                <span className="text-slate-500">Company:</span>
                <span className="ml-2 font-bold text-blue-600">
                  {selectedBooth.exhibitorProfile.company}
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleUpdateBooth} className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Booth Size &amp; Price
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Booth Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="small">Small (3x3m)</option>
                  <option value="medium">Medium (6x3m)</option>
                  <option value="large">Large (9x6m)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Price (USD)</label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Location Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Near main entrance"
                className="mt-1 block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>

          {/* Allocation Actions */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Company Assignment
            </h4>

            {selectedBooth?.status !== 'available' ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                <span className="text-xs font-medium text-rose-900">
                  This booth is currently <strong>{selectedBooth?.status}</strong>. Releasing it will make it available again.
                </span>
                <button
                  type="button"
                  onClick={handleReleaseBooth}
                  disabled={updating}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
                >
                  Release Booth
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Assign to an Exhibitor Company:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedExhibitorId}
                    onChange={(e) => setSelectedExhibitorId(e.target.value)}
                    className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option value="">Select a company...</option>
                    {exhibitors.map((exh) => (
                      <option key={exh._id} value={exh.user?._id || exh._id}>
                        {exh.company}{exh.user?.name ? ` (${exh.user.name})` : ''}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAssignExhibitor}
                    disabled={updating || !selectedExhibitorId}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50 cursor-pointer"
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
