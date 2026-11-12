import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  QrCode,
  ArrowRight,
  Printer,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { registrationService } from '../../api/services'
import { useAuth } from '../../hooks/useAuth'

export default function MyExposPage() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPass, setSelectedPass] = useState(null)

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      setLoading(true)
      const res = await registrationService.getMyRegistrations()
      setRegistrations(res.data.registrations || [])
    } catch (err) {
      toast.error('Failed to load registered events')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (expoId) => {
    if (!window.confirm('Cancel your registration for this event?')) return
    try {
      await registrationService.cancel(expoId)
      toast.success('Registration cancelled')
      loadRegistrations()
    } catch (err) {
      toast.error('Failed to cancel registration')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              My Event Tickets
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              View or print your QR tickets for all registered events.
            </p>
          </div>
          <Link
            to="/expos"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            Browse Events
          </Link>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner text="Loading event tickets..." />
          </div>
        ) : registrations.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No registered events yet"
            description="Browse upcoming events and register for a free ticket."
            actionLabel="Browse Events"
            actionTo="/expos"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registrations.map((reg) => (
              <div
                key={reg._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={reg.status === 'confirmed' ? 'success' : 'neutral'} dot>
                      {reg.status}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      Registered: {new Date(reg.registeredAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {reg.expo?.title || 'Exhibition Event'}
                    </h3>
                    <div className="mt-2 space-y-1 text-xs text-slate-500">
                      {reg.expo?.date && (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-blue-600" />
                          <span>
                            {new Date(reg.expo.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                      {reg.expo?.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-blue-600" />
                          <span>{reg.expo.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {reg.qrCode && (
                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <QrCode size={22} className="text-blue-600" />
                        <div>
                          <div className="text-[10px] font-semibold uppercase text-slate-400">
                            Ticket ID
                          </div>
                          <div className="text-xs font-bold text-slate-800">{reg.qrCode}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedPass(reg)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        View Ticket
                      </button>
                    </div>
                  )}
                </div>

                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/expos/${reg.expo?._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Event Details <ArrowRight size={13} />
                  </Link>

                  {reg.status === 'confirmed' && reg.expo?._id && (
                    <button
                      type="button"
                      onClick={() => handleCancel(reg.expo._id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      Cancel Ticket
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Printable Ticket Modal */}
      <Modal
        isOpen={!!selectedPass}
        onClose={() => setSelectedPass(null)}
        title="Event Entry Ticket"
      >
        {selectedPass && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
              <div className="bg-blue-600 text-white p-5 text-center">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-100 mb-1">
                  Event Admission Pass
                </div>
                <h3 className="text-lg font-bold leading-snug">{selectedPass.expo?.title}</h3>
                <p className="text-xs text-blue-100 mt-1">{selectedPass.expo?.location}</p>
              </div>

              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <QrCode size={100} className="text-slate-900" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Attendee
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {user?.name || 'Attendee'}
                  </div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>

                <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-left text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                      Ticket ID
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedPass.qrCode || 'PASS-2026'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                      Status
                    </span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Confirmed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedPass(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
              >
                <Printer size={14} />
                Print Ticket
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
