import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Grid, CheckCircle2, UserCheck, ShieldAlert, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Badge from '../../components/ui/Badge'
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

  // Edit form state in modal
  const [size, setSize] = useState('medium')
  const [price, setPrice] = useState(0)
  const [notes, setNotes] = useState('')
  const [selectedExhibitorId, setSelectedExhibitorId] = useState('')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [expoRes, boothRes, exhRes] = await Promise.all([
        expoService.getOne(id),
        boothService.getByExpo(id),
        exhibitorService.getByExpo(id).catch(() => ({ data: { exhibitors: [] } })),
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
          <LoadingSpinner text="Constructing floor plan grid..." />
        </div>
      </DashboardLayout>
    )
  }

  const availableCount = booths.filter((b) => b.status === 'available').length
  const reservedCount = booths.filter((b) => b.status === 'reserved').length
  const occupiedCount = booths.filter((b) => b.status === 'occupied').length

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
            <h1 className="text-2xl font-bold text-gray-900">Floor Plan & Booth Allocations</h1>
            <p className="text-sm text-gray-500">{expo?.title}</p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-gray-200 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> {availableCount} Available
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {reservedCount} Reserved
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-red-700 bg-red-50 px-2 py-1 rounded">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> {occupiedCount} Occupied
            </span>
          </div>
        </div>

        {/* Visual Grid Container */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Click any booth cell to modify sizing, assign exhibitors, or release reservations.</span>
            <span>Total Units: {booths.length}</span>
          </div>

          <div
            className="grid gap-3 p-4 bg-gray-100 rounded-xl overflow-x-auto min-h-[300px]"
            style={{
              gridTemplateColumns: `repeat(${expo?.boothColumns || 8}, minmax(80px, 1fr))`,
            }}
          >
            {booths.map((booth) => {
              const statusStyle =
                booth.status === 'occupied'
                  ? 'bg-red-50 hover:bg-red-100 border-red-300 text-red-900'
                  : booth.status === 'reserved'
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900'

              return (
                <button
                  type="button"
                  key={booth._id}
                  onClick={() => openBoothModal(booth)}
                  className={`h-20 border-2 rounded-lg p-2 flex flex-col justify-between items-center text-center transition-all shadow-xs hover:scale-[1.02] cursor-pointer ${statusStyle}`}
                >
                  <div className="flex justify-between w-full text-[10px] font-bold">
                    <span>{booth.number}</span>
                    <span className="capitalize opacity-80">{booth.size}</span>
                  </div>
                  <div className="text-xs font-semibold truncate max-w-[70px]">
                    {booth.exhibitorProfile?.company || (
                      <span className="text-[10px] uppercase tracking-wider">{booth.status}</span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {booth.price ? `$${booth.price}` : 'Free'}
                  </div>
                </button>
              )
            })}
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
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
            <div>
              <span className="text-gray-500">Current Status:</span>
              <span className="ml-2 font-bold capitalize">{selectedBooth?.status}</span>
            </div>
            {selectedBooth?.exhibitorProfile && (
              <div>
                <span className="text-gray-500">Exhibitor:</span>
                <span className="ml-2 font-bold">{selectedBooth.exhibitorProfile.company}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleUpdateBooth} className="space-y-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Specifications</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="small">Small (3x3m)</option>
                  <option value="medium">Medium (6x3m)</option>
                  <option value="large">Large (9x6m)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Price (USD)</label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Notes / Amenities</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Near main hall entrance, includes 2 chairs"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold"
              >
                Update Specs
              </button>
            </div>
          </form>

          {/* Allocation Actions */}
          <div className="border-t border-gray-200 pt-5 space-y-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Allocation & Assignment</h4>

            {selectedBooth?.status !== 'available' ? (
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-xs text-red-800">
                  Booth is currently {selectedBooth?.status}. Release to make available again.
                </span>
                <button
                  type="button"
                  onClick={handleReleaseBooth}
                  disabled={updating}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                >
                  Release Booth
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-700">
                  Assign directly to an Approved Exhibitor:
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedExhibitorId}
                    onChange={(e) => setSelectedExhibitorId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value="">Select an exhibitor...</option>
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
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                  >
                    Assign
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
