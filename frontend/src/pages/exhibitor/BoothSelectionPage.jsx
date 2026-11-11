import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Sparkles, Loader2, Compass, Mic2, Coffee } from 'lucide-react'
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
          <LoadingSpinner text="Loading interactive 2D booth grid..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <button
            onClick={() => navigate('/exhibitor/applications')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Applications
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Select Your Exhibition Floor Booth
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{expo?.title}</p>
        </div>

        {/* Current status banner */}
        {myBooth ? (
          <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
              <div>
                <p className="font-extrabold text-emerald-950 text-sm">
                  You have reserved Booth {myBooth.number} ({myBooth.size})
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Status: <span className="capitalize font-bold">{myBooth.status}</span> &bull; Rate: ${myBooth.price || 0} USD
                </p>
              </div>
            </div>
            <button
              onClick={() => handleRelease(myBooth._id)}
              className="px-4 py-2 text-xs font-bold bg-white text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50 shrink-0 self-start sm:self-auto"
            >
              Change / Release Booth
            </button>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-xs font-medium text-blue-900">
            <Sparkles size={18} className="text-blue-600 shrink-0" />
            <span>
              Tap any green (Available) booth cell below to inspect dimensions, amenities, and reserve your company showcase unit.
            </span>
          </div>
        )}

        {/* Visual Grid */}
        <div className="bg-slate-900 p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-800 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex flex-wrap gap-3 sm:gap-5 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Reserved
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Occupied
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Your Booth
              </span>
            </div>
          </div>

          {/* Hall Landmarks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs font-bold text-slate-300">
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-2.5 flex items-center justify-center gap-2">
              <Compass size={15} className="text-blue-400" />
              <span>NORTH MAIN ENTRANCE</span>
            </div>
            <div className="bg-indigo-950/80 border border-indigo-800/70 rounded-xl p-2.5 flex items-center justify-center gap-2 text-indigo-200">
              <Mic2 size={15} className="text-indigo-400" />
              <span>KEYNOTE AUDITORIUM</span>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-2.5 flex items-center justify-center gap-2">
              <Coffee size={15} className="text-amber-400" />
              <span>VIP B2B LOUNGE</span>
            </div>
          </div>

          <div className="w-full overflow-x-auto pb-2">
            <div
              className="grid gap-3 p-4 bg-slate-950/70 rounded-2xl border border-slate-800 min-w-[680px]"
              style={{
                gridTemplateColumns: `repeat(${expo?.boothColumns || 8}, minmax(95px, 1fr))`,
              }}
            >
              {booths.map((booth) => {
                const isMine =
                  booth.exhibitor?._id === user?._id || booth.exhibitor === user?._id
                const isAvail = booth.status === 'available'

                let style = isAvail
                  ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/50 text-emerald-200 cursor-pointer'
                  : booth.status === 'reserved'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 cursor-not-allowed opacity-75'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-200 cursor-not-allowed opacity-75'

                if (isMine) {
                  style =
                    'bg-purple-600/30 border-purple-400 text-white ring-2 ring-purple-400 shadow-lg'
                }

                return (
                  <button
                    type="button"
                    key={booth._id}
                    disabled={!isAvail && !isMine}
                    onClick={() => isAvail && setSelectedBooth(booth)}
                    className={`h-24 border-2 rounded-xl p-2.5 flex flex-col justify-between items-center text-center transition-all ${style}`}
                  >
                    <div className="flex justify-between w-full text-[10px] font-extrabold">
                      <span className="px-1.5 py-0.5 rounded bg-black/30">{booth.number}</span>
                      <span className="uppercase">{booth.size}</span>
                    </div>
                    <div className="text-xs font-bold truncate max-w-[85px]">
                      {isMine ? 'YOUR BOOTH' : booth.exhibitorProfile?.company || booth.status}
                    </div>
                    <div className="text-[10px] opacity-80">
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
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Confirm your reservation for booth{' '}
            <strong className="text-slate-900">{selectedBooth?.number}</strong>.
          </p>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Dimensions Tier:</span>
              <span className="font-bold capitalize text-slate-900">{selectedBooth?.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Exhibition Rate:</span>
              <span className="font-bold text-emerald-700">${selectedBooth?.price || 0} USD</span>
            </div>
            {selectedBooth?.notes && (
              <div className="flex justify-between">
                <span className="text-slate-500">Location Note:</span>
                <span className="font-semibold text-slate-800">{selectedBooth.notes}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedBooth(null)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={reserving}
              onClick={handleReserve}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
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
