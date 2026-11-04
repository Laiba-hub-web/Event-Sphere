import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MessageSquare, Briefcase, ArrowRight, QrCode } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { registrationService, sessionService } from '../../api/services'

export default function AttendeeDashboard() {
  const [registrations, setRegistrations] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendee Portal</h1>
            <p className="text-sm text-gray-500 mt-1">
              Access your digital event passes, personal session schedules, and direct exhibitor chats.
            </p>
          </div>
          <Link
            to="/expos"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow transition-colors"
          >
            <Briefcase size={18} />
            Browse Expos
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            label="My Registered Expos"
            value={activeRegistrations.length}
            icon={Calendar}
            variant="primary"
          />
          <StatCard
            label="Bookmarked Sessions"
            value={bookmarks.length}
            icon={Clock}
            variant="success"
          />
          <StatCard
            label="Total Passes Issued"
            value={registrations.length}
            icon={QrCode}
            variant="info"
          />
        </div>

        {/* Registered Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-900">Your Upcoming Registered Expos</h2>
            <Link
              to="/attendee/my-expos"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
            >
              All Passes ({registrations.length}) <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner text="Loading your event passes..." />
            </div>
          ) : activeRegistrations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Calendar size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-semibold text-gray-900">No registered events yet</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Explore our catalog of trade shows and register for free attendee entry.
              </p>
              <Link
                to="/expos"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-medium"
              >
                Find Expos
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {activeRegistrations.slice(0, 3).map((reg) => (
                <div
                  key={reg._id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-gray-900">{reg.expo?.title}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(reg.expo?.date).toLocaleDateString()} · {reg.expo?.location}
                    </p>
                    <div className="inline-block pt-1">
                      <span className="text-[11px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        Pass Code: {reg.qrCode ? reg.qrCode.slice(0, 8).toUpperCase() : 'PASS-OK'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/expos/${reg.expo?._id}`}
                      className="px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-xs font-semibold transition-colors"
                    >
                      View Event & Schedule
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
