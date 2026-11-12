import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Loader2, Compass, Mic2, Coffee } from 'lucide-react'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      toast.success(`Booth ${selectedBooth.number} reserved!`)
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
        <div className="py-16 flex justify-center">
          <LoadingSpinner text="Loading booth floor plan..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => navigate('/exhibitor/applications')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Applications
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Select Your Exhibition Booth
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{expo?.title}</p>
        </div>

        {/* Current status banner */}
        {myBooth ? (
          <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600 shrink-0" size={22} />
              <div>
                <h3 className="text-sm font-bold text-emerald-900">
                  You have booked Booth {myBooth.number} ({myBooth.size})
                </h3>
                <p className="text-xs text-emerald-700">
                  Status: <span className="capitalize font-semibold">{myBooth.status}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRelease(myBooth._id)}
              className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer"
            >
              Change / Release Booth
            </button>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs font-medium text-blue-800">
            Click any green <strong>Available</strong> booth below to view details and reserve it.
          </div>
        )}

        {/* Clean Light-Mode Floor Plan */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-5">
          {/* Landmarks */}
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

          <div className="w-full overflow-x-auto pb-2">
            <div
              className="grid gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 min-w-[680px]"
              style={{
                gridTemplateColumns: `repeat(${expo?.boothColumns || 8}, minmax(96px, 1fr))`,
              }}
            >
              {booths.map((booth) => {
                const isMine =
                  booth.exhibitor?._id === user?._id || booth.exhibitor === user?._id
                const isAvailable = booth.status === 'available'
                const canClick = isAvailable && !myBooth

                let style = 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                if (isMine) {
                  style = 'bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-500/20'
                } else if (isAvailable) {
                  style = canClick
                    ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900 cursor-pointer'
                    : 'bg-emerald-50/50 border-emerald-200/60 text-emerald-700/60 cursor-not-allowed'
                }

                return (
                  <button
                    key={booth._id}
                    type="button"
                    disabled={!canClick}
                    onClick={() => canClick && setSelectedBooth(booth)}
                    className={`h-24 border rounded-xl p-2.5 flex flex-col justify-between items-center text-center transition-all ${style}`}
                  >
                    <div className="flex justify-between items-center w-full text-[10px] font-bold">
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                        {booth.number}
                      </span>
                      <span className="uppercase">{booth.size}</span>
                    </div>
                    <div className="text-xs font-bold truncate max-w-[85px]">
                      {isMine
                        ? 'Your Booth'
                        : booth.exhibitorProfile?.company || booth.status}
                    </div>
                    <div className="text-[11px] font-semibold">
                      {booth.price ? `$${booth.price}` : 'Included'}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!selectedBooth}
        onClose={() => setSelectedBooth(null)}
        title={`Reserve Booth ${selectedBooth?.number}`}
      >
        {selectedBooth && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Booth Number:</span>
                <span className="font-bold text-slate-900">{selectedBooth.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Size:</span>
                <span className="font-bold capitalize text-slate-900">{selectedBooth.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Price:</span>
                <span className="font-bold text-emerald-700">
                  {selectedBooth.price ? `$${selectedBooth.price}` : 'Included'}
                </span>
              </div>
              {selectedBooth.notes && (
                <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                  <strong>Location Notes:</strong> {selectedBooth.notes}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBooth(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReserve}
                disabled={reserving}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50 cursor-pointer"
              >
                {reserving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Reserving...</span>
                  </>
                ) : (
                  <span>Confirm Reservation</span>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
