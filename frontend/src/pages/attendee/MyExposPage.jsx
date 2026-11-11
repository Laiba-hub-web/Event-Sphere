import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  QrCode,
  ArrowRight,
  Printer,
  ShieldCheck,
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              My Registered Expos &amp; VIP Credentials
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Present your cryptographic QR conference badge at the venue entrance for instant check-in.
            </p>
          </div>
          <Link
            to="/expos"
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            Explore More Expos
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner text="Loading event passes..." />
          </div>
        ) : registrations.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No registered expos yet"
            description="Browse upcoming events and register for free VIP admission."
            actionLabel="Discover Events"
            actionTo="/expos"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registrations.map((reg) => (
              <div
                key={reg._id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={reg.status === 'confirmed' ? 'success' : 'neutral'} dot>
                      {reg.status}
                    </Badge>
                    <span className="text-xs font-medium text-slate-400">
                      Issued: {new Date(reg.registeredAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">{reg.expo?.title}</h3>
                    <p className="text-xs text-primary-600 font-bold mt-0.5">{reg.expo?.theme}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-primary-500" />
                      <span>
                        {new Date(reg.expo?.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-primary-500" />
                      <span>{reg.expo?.location}</span>
                    </div>
                  </div>

                  {/* Interactive QR Code Pass Card */}
                  <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shrink-0">
                        <QrCode size={36} className="text-slate-900" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">
                          Official VIP Gate Pass
                        </div>
                        <div className="text-xs font-mono font-bold text-white truncate mt-0.5">
                          {reg.qrCode || 'PASS-CONFIRMED-OK'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Delegate: {user?.name || 'Attendee'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedPass(reg)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white shrink-0 transition-colors"
                    >
                      Print Badge
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <Link
                    to={`/expos/${reg.expo?._id}`}
                    className="font-bold text-primary-600 hover:text-primary-800 inline-flex items-center gap-1"
                  >
                    Open Interactive Expo Hub <ArrowRight size={14} />
                  </Link>

                  {reg.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(reg.expo?._id)}
                      className="text-rose-600 hover:text-rose-700 font-bold"
                    >
                      Cancel Pass
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Printable Badge Modal */}
      <Modal
        isOpen={!!selectedPass}
        onClose={() => setSelectedPass(null)}
        title="Official EventSphere VIP Conference Pass"
      >
        {selectedPass && (
          <div className="space-y-5">
            <div className="rounded-3xl overflow-hidden border-2 border-slate-900 bg-white shadow-xl">
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest mb-2">
                  <ShieldCheck size={12} /> Verified All-Access Credential
                </div>
                <h3 className="text-lg font-black leading-snug">{selectedPass.expo?.title}</h3>
                <p className="text-xs text-slate-300 mt-1">{selectedPass.expo?.location}</p>
              </div>

              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300">
                  <QrCode size={110} className="text-slate-900" />
                </div>
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    Attendee Delegate
                  </div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">
                    {user?.name || 'VIP Attendee'}
                  </div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>

                <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 text-left text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Pass Reference
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedPass.qrCode || 'ESP-VIP-2026'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Access Tier
                    </span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Expo + Keynotes
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedPass(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md"
              >
                <Printer size={15} />
                Print Official Badge
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
