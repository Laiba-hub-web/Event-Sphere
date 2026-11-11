import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Briefcase,
  ArrowRight,
  QrCode,
  Sparkles,
  MapPin,
  Printer,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { registrationService, sessionService } from '../../api/services'
import { useAuth } from '../../hooks/useAuth'

export default function AttendeeDashboard() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPass, setSelectedPass] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [regRes, bmkRes] = await Promise.all([
        registrationService.getMyRegistrations(),
        sessionService.getMyBookmarks().catch(() => ({ data: { sessions: [] } })),
      ])
      setRegistrations(regRes.data.registrations || [])
      setBookmarks(bmkRes.data.sessions || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const activeRegistrations = registrations.filter((r) => r.status === 'confirmed')

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* VIP Attendee Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-7 sm:p-9 overflow-hidden shadow-xl border border-emerald-800/40">
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={13} className="text-amber-400" />
                <span>VIP Attendee Experience Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Your Digital Conference Passes &amp; Keynote Agenda
              </h1>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Access your cryptographic QR gate badges, manage your personal keynote speaker schedule, and connect directly with floor exhibitors.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/expos"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Briefcase size={18} />
                Discover Expos
              </Link>
              <Link
                to="/attendee/bookmarks"
                className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-sm font-semibold transition-all"
              >
                My Saved Agenda ({bookmarks.length})
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            label="Active VIP Passes"
            value={activeRegistrations.length}
            icon={Calendar}
            variant="success"
            subtitle="Confirmed expo registrations"
          />
          <StatCard
            label="Bookmarked Keynotes"
            value={bookmarks.length}
            icon={Clock}
            variant="primary"
            subtitle="Personal speaker schedule"
          />
          <StatCard
            label="QR Gate Credentials"
            value={registrations.length}
            icon={QrCode}
            variant="info"
            subtitle="Ready for instant print"
          />
        </div>

        {/* Registered Events with 1-Click VIP Pass Modal */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
          <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Your Upcoming Registered Expos &amp; QR Badges
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click &ldquo;View VIP Badge&rdquo; on any event to display or print your official conference pass
              </p>
            </div>
            <Link
              to="/attendee/my-expos"
              className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1.5 bg-primary-50 px-3.5 py-2 rounded-xl"
            >
              All Passes ({registrations.length}) <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner text="Loading your event passes..." />
            </div>
          ) : activeRegistrations.length === 0 ? (
            <div className="text-center py-14 px-4">
              <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-base font-bold text-slate-900">No registered events yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Explore our catalog of global trade shows and claim your free VIP attendee pass.
              </p>
              <Link
                to="/expos"
                className="px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Upcoming Expos
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeRegistrations.map((reg) => (
                <div
                  key={reg._id}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold uppercase">
                        VIP Confirmed
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        ID: {reg.qrCode || 'ESP-VIP-PASS'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">{reg.expo?.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span>
                        {new Date(reg.expo?.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>&bull;</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" />
                        {reg.expo?.location}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedPass(reg)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                    >
                      <QrCode size={15} />
                      View &amp; Print VIP Badge
                    </button>
                    <Link
                      to={`/expos/${reg.expo?._id}`}
                      className="px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-xl text-xs font-bold transition-colors"
                    >
                      Floor Plan &amp; Schedule
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Printable VIP Conference Badge Modal */}
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
