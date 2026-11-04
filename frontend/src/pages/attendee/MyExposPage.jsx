import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, QrCode, XCircle, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { registrationService } from '../../api/services'

export default function MyExposPage() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Registered Expos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Your digital entry passes and event access credentials.
            </p>
          </div>
          <Link
            to="/expos"
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow transition-colors"
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
            description="Browse upcoming events and register for free admission."
            actionLabel="Discover Events"
            actionTo="/expos"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registrations.map((reg) => (
              <div
                key={reg._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={reg.status === 'confirmed' ? 'success' : 'neutral'}>
                      {reg.status}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      Registered: {new Date(reg.registeredAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{reg.expo?.title}</h3>
                    <p className="text-xs text-primary-600 font-medium mt-0.5">{reg.expo?.theme}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{new Date(reg.expo?.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{reg.expo?.location}</span>
                    </div>
                  </div>

                  {/* QR Code Pass Card */}
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4 border border-gray-100">
                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-xs">
                      <QrCode size={34} className="text-gray-800" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Official Entry Pass
                      </div>
                      <div className="text-xs font-mono font-bold text-gray-800 truncate">
                        {reg.qrCode || 'PASS-CONFIRMED-OK'}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-medium">Valid at Gate Entrance</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <Link
                    to={`/expos/${reg.expo?._id}`}
                    className="font-semibold text-primary-600 hover:text-primary-800 inline-flex items-center gap-1"
                  >
                    Event Details <ArrowRight size={14} />
                  </Link>

                  {reg.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(reg.expo?._id)}
                      className="text-red-600 hover:text-red-700 font-medium"
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
    </DashboardLayout>
  )
}

