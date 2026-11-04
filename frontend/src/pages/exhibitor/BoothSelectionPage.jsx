import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Grid, CheckCircle2, ShieldCheck, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { expoService, boothService } from '../../api/services'
import { useAuth } from '../../hooks/useAuth'

export default function BoothSelectionPage() {
  const { expoId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [expo, setExpo] = useState(null)
  const [booths, setBooths] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooth, setSelectedBooth] = useState(null)
  const [reserving, setReserving] = useState(false)

  useEffect(() => {
    loadBooths()
  }, [expoId])

  const loadBooths = async () => {
    try {
      setLoading(true)
      const [expoRes, boothRes] = await Promise.all([
        expoService.getOne(expoId),
        boothService.getByExpo(expoId),
      ])
      setExpo(expoRes.data.expo)
      setBooths(boothRes.data.booths || [])
    } catch (err) {
      toast.error('Failed to load floor plan')
    } finally {
      setLoading(false)
    }
  }

  const myBooth = booths.find(
    (b) => b.exhibitor?._id === user?._id || b.exhibitor === user?._id
  )

  const handleReserve = async () => {
    if (!selectedBooth) return
    setReserving(true)
    try {
      await boothService.reserve(selectedBooth._id)
      toast.success(`Booth ${selectedBooth.number} successfully reserved!`)
      setSelectedBooth(null)
      loadBooths()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reserve booth')
    } finally {
      setReserving(false)
    }
  }

  const handleRelease = async (boothId) => {
    if (!window.confirm('Release your current booth reservation?')) return
    try {
      await boothService.release(boothId)
      toast.success('Booth released. You can now choose another.')
      loadBooths()
    } catch (err) {
      toast.error('Failed to release booth')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex justify-center">
          <LoadingSpinner text="Loading booth allocation grid..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <button
            onClick={() => navigate('/exhibitor/applications')}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Applications
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Select Your Exhibition Booth</h1>
          <p className="text-sm text-gray-500">{expo?.title}</p>
        </div>

        {/* Current status banner */}
        {myBooth ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-900 text-sm">
                  You have reserved Booth {myBooth.number} ({myBooth.size})
                </p>
                <p className="text-xs text-emerald-700">
                  Status: <span className="capitalize">{myBooth.status}</span> · Price: ${myBooth.price || 0}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleRelease(myBooth._id)}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              Change / Release Booth
            </button>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-blue-900">
            <Sparkles size={18} className="text-blue-600" />
            <span>
              Click any green (Available) booth cell to view dimensions, amenities, and reserve your spot.
            </span>
          </div>
        )}

        {/* Visual Grid */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex gap-4 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Reserved
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-red-500"></span> Occupied
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-purple-600"></span> Your Booth
              </span>
            </div>
          </div>

          <div
            className="grid gap-3 p-4 bg-gray-100 rounded-xl overflow-x-auto"
            style={{
              gridTemplateColumns: `repeat(${expo?.boothColumns || 8}, minmax(80px, 1fr))`,
            }}
          >
            {booths.map((booth) => {
              const isMine =
                booth.exhibitor?._id === user?._id || booth.exhibitor === user?._id
              const isAvail = booth.status === 'available'

              let style = isAvail
                ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900 cursor-pointer'
                : booth.status === 'reserved'
                ? 'bg-amber-50 border-amber-300 text-amber-800 cursor-not-allowed opacity-80'
                : 'bg-red-50 border-red-300 text-red-800 cursor-not-allowed opacity-80'

              if (isMine) {
                style = 'bg-purple-100 border-purple-500 text-purple-900 ring-2 ring-purple-500'
              }

              return (
                <button
                  type="button"
                  key={booth._id}
                  disabled={!isAvail && !isMine}
                  onClick={() => isAvail && setSelectedBooth(booth)}
                  className={`h-20 border-2 rounded-lg p-2 flex flex-col justify-between items-center text-center transition-all ${style}`}
                >
                  <div className="flex justify-between w-full text-[10px] font-bold">
                    <span>{booth.number}</span>
                    <span className="capitalize">{booth.size}</span>
                  </div>
                  <div className="text-xs font-semibold truncate max-w-[70px]">
                    {isMine ? 'YOUR BOOTH' : booth.status}
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

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!selectedBooth}
        onClose={() => setSelectedBooth(null)}
        title={`Reserve Booth ${selectedBooth?.number}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Confirm your reservation for booth <strong className="text-gray-900">{selectedBooth?.number}</strong>.
          </p>

          <div className="p-3 bg-gray-50 rounded-lg space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Size:</span>
              <span className="font-semibold capitalize">{selectedBooth?.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Fee:</span>
              <span className="font-semibold">${selectedBooth?.price || 0} USD</span>
            </div>
            {selectedBooth?.notes && (
              <div className="flex justify-between">
                <span className="text-gray-500">Location note:</span>
                <span className="font-semibold">{selectedBooth.notes}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedBooth(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={reserving}
              onClick={handleReserve}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
            >
              {reserving && <Loader2 size={14} className="animate-spin" />}
              Confirm Reservation
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
