import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Briefcase,
  ArrowRight,
  QrCode,
  MapPin,
  Printer,
  CheckCircle2,
  BellRing,
  Search,
  MessageSquare,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import WelcomeBanner from '../../components/ui/WelcomeBanner'
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
      <div className="space-y-6">
        {/* Personalized Welcome Banner */}
        <WelcomeBanner
          user={user}
          badgeText="Attendee Portal"
          subtitle="Access verified digital QR entry passes, personalize your conference schedule, and discover innovative exhibitors."
          actions={
            <>
              <Link
                to="/expos"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
              >
                <Briefcase size={17} />
                Browse Events
              </Link>
              <Link
                to="/attendee/schedule"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                My Schedule ({bookmarks.length})
              </Link>
            </>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Registered Events"
            value={activeRegistrations.length}
            icon={Calendar}
            variant="success"
            subtitle="Confirmed event tickets"
          />
          <StatCard
            label="Saved Sessions"
            value={bookmarks.length}
            icon={Clock}
            variant="primary"
            subtitle="Bookmarked with reminders"
          />
          <StatCard
            label="Entry Passes"
            value={registrations.length}
            icon={QrCode}
            variant="info"
            subtitle="Ready to view or print"
          />
        </div>

        {/* Quick Attendee Hub Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/expos"
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Search size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
                Exhibitor Search &amp; Floor Plans
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Filter exhibitors by product, view booth maps &amp; book appointments
              </p>
            </div>
          </Link>

          <Link
            to="/attendee/schedule"
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <BellRing size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600">
                Schedule &amp; Reminders
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Browse sessions, bookmark talks &amp; receive reminder alerts
              </p>
            </div>
          </Link>

          <Link
            to="/messages"
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600">
                Exhibitor Chat &amp; Inquiries
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Message exhibitors directly for inquiries or booth meetings
              </p>
            </div>
          </Link>
        </div>

        {/* Upcoming Bookmarked Session Reminders */}
        {bookmarks.length > 0 && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                <BellRing size={16} className="text-amber-600" />
                <span>Upcoming Session Reminders ({bookmarks.length})</span>
              </div>
              <Link
                to="/attendee/schedule"
                className="text-xs font-semibold text-amber-800 hover:underline"
              >
                Manage Reminders &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bookmarks.slice(0, 4).map((sess) => (
                <div
                  key={sess._id}
                  className="bg-white p-3.5 rounded-xl border border-amber-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{sess.title}</div>
                    <div className="text-slate-500 mt-0.5">
                      {sess.speaker} &bull; {sess.location || 'Main Hall'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      toast.success(
                        `Reminder: "${sess.title}" starts soon in ${
                          sess.location || 'Main Hall'
                        }!`
                      )
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold shrink-0 cursor-pointer"
                  >
                    Alert
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registered Events */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Your Event Tickets
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click &ldquo;View Ticket&rdquo; to open or print your event entry pass
              </p>
            </div>
            <Link
              to="/attendee/my-expos"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 bg-blue-50 px-3.5 py-2 rounded-xl"
            >
              All Tickets ({registrations.length}) <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-14 flex justify-center">
              <LoadingSpinner text="Loading your tickets..." />
            </div>
          ) : activeRegistrations.length === 0 ? (
            <div className="text-center py-14 px-4">
              <Calendar size={36} className="mx-auto text-slate-300 mb-3" />
              <p className="text-base font-bold text-slate-900">No registered events yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Browse upcoming events and register for a free ticket.
              </p>
              <Link
                to="/expos"
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeRegistrations.map((reg) => (
                <div
                  key={reg._id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                        Confirmed
                      </span>
                      <span className="text-xs text-slate-400">
                        Pass #{reg.qrCode || 'PASS-2026'}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{reg.expo?.title}</h3>
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
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <QrCode size={15} />
                      View Ticket
                    </button>
                    <Link
                      to={`/expos/${reg.expo?._id}`}
                      className="px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Event Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Printable Event Ticket Modal */}
      <Modal
        isOpen={!!selectedPass}
        onClose={() => setSelectedPass(null)}
        title="Event Entry Ticket"
      >
        {selectedPass && (
          <div className="space-y-5">
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
