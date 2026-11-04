import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  Tag,
  Users,
  Grid,
  Clock,
  CheckCircle,
  MessageSquare,
  Star,
  ArrowRight,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Badge from '../components/ui/Badge'
import SessionCard from '../components/cards/SessionCard'
import ExhibitorCard from '../components/cards/ExhibitorCard'
import EmptyState from '../components/ui/EmptyState'
import {
  expoService,
  sessionService,
  exhibitorService,
  boothService,
  registrationService,
  feedbackService,
} from '../api/services'
import { useAuth } from '../hooks/useAuth'

export default function ExpoDetailPage() {
  const { id } = useParams()
  const { user, isAuthenticated, isAttendee, isExhibitor, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [expo, setExpo] = useState(null)
  const [sessions, setSessions] = useState([])
  const [exhibitors, setExhibitors] = useState([])
  const [booths, setBooths] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [rating, setRating] = useState(5)
  const [feedbackText, setFeedbackText] = useState('')

  useEffect(() => {
    loadAllData()
  }, [id, isAuthenticated])

  const loadAllData = async () => {
    try {
      setLoading(true)
      const expoRes = await expoService.getOne(id)
      setExpo(expoRes.data.expo)

      const [sessRes, exhRes, bthRes, fbRes] = await Promise.all([
        sessionService.getByExpo(id),
        exhibitorService.getByExpo(id),
        boothService.getByExpo(id),
        feedbackService.getByExpo(id).catch(() => ({ data: { feedback: [] } })),
      ])

      setSessions(sessRes.data.sessions || [])
      setExhibitors(exhRes.data.exhibitors || [])
      setBooths(bthRes.data.booths || [])
      setFeedbacks(fbRes.data?.feedback || [])

      if (isAuthenticated) {
        const regRes = await registrationService.checkRegistration(id).catch(() => ({ data: { isRegistered: false } }))
        setIsRegistered(regRes.data.isRegistered)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load expo details')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterExpo = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      if (isRegistered) {
        await registrationService.cancel(id)
        setIsRegistered(false)
        toast.success('Registration cancelled')
      } else {
        await registrationService.register(id)
        setIsRegistered(true)
        toast.success('Successfully registered for this expo!')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await feedbackService.submit({ expoId: id, rating, message: feedbackText })
      toast.success('Thank you for your feedback!')
      setFeedbackText('')
      const fbRes = await feedbackService.getByExpo(id)
      setFeedbacks(fbRes.data?.feedback || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner text="Loading expo..." />
        </div>
      </div>
    )
  }

  if (!expo) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto py-20 px-4">
          <EmptyState
            title="Expo not found"
            description="The requested expo could not be found or has been removed."
          />
        </div>
      </div>
    )
  }

  const occupiedCount = booths.filter((b) => b.status === 'occupied').length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-gray-900 via-primary-950 to-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <Badge variant="primary">{expo.theme || 'Trade Show'}</Badge>
              <Badge variant={expo.status === 'published' ? 'success' : 'neutral'}>
                {expo.status}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{expo.title}</h1>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-300">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} className="text-primary-400" />
                {new Date(expo.date).toLocaleDateString()}
                {expo.endDate && ` – ${new Date(expo.endDate).toLocaleDateString()}`}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-primary-400" />
                {expo.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Grid size={16} className="text-primary-400" />
                {occupiedCount} / {booths.length} Booths Booked
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <Link
                to={`/admin/expos/${expo._id}/floor-plan`}
                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur border border-white/20 transition-colors"
              >
                Manage Floor Plan
              </Link>
            )}

            {isExhibitor && (
              <Link
                to={`/exhibitor/apply/${expo._id}`}
                className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow transition-colors"
              >
                Apply as Exhibitor
              </Link>
            )}

            {(!isAuthenticated || isAttendee) && (
              <button
                onClick={handleRegisterExpo}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm shadow transition-colors ${
                  isRegistered
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {isRegistered ? '✓ Registered (Cancel)' : 'Register for Expo'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'schedule', label: `Schedule (${sessions.length})` },
              { id: 'exhibitors', label: `Exhibitors (${exhibitors.length})` },
              { id: 'floorplan', label: 'Floor Plan' },
              { id: 'feedback', label: `Reviews (${feedbacks.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About this Expo</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {expo.description || 'No description provided.'}
                </p>
              </div>

              {expo.tags && expo.tags.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Event Focus & Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {expo.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Event Highlights</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Date</span>
                    <span className="font-semibold">{new Date(expo.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Venue</span>
                    <span className="font-semibold text-right">{expo.location}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Total Booths</span>
                    <span className="font-semibold">{booths.length}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Sessions</span>
                    <span className="font-semibold">{sessions.length} scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div>
            {sessions.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No sessions scheduled yet"
                description="The schedule for this expo will be announced soon."
              />
            ) : (
              <div className="space-y-4 max-w-4xl">
                {sessions.map((s) => (
                  <SessionCard
                    key={s._id}
                    session={s}
                    isBookmarked={s.attendees?.some((a) => a.user?._id === user?._id || a.user === user?._id)}
                    onBookmarkToggle={loadAllData}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'exhibitors' && (
          <div>
            {exhibitors.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No approved exhibitors yet"
                description="Exhibitor applications are currently under review."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exhibitors.map((exh) => (
                  <ExhibitorCard key={exh._id} exhibitor={exh} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'floorplan' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Exhibition Floor Plan</h3>
                <p className="text-xs text-gray-500">Interactive overview of booths and occupancy</p>
              </div>
              <div className="flex gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500"></span> Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500"></span> Reserved
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-500"></span> Occupied
                </span>
              </div>
            </div>

            <div
              className="grid gap-3 p-4 bg-gray-50 rounded-lg overflow-x-auto max-w-full"
              style={{
                gridTemplateColumns: `repeat(${expo.boothColumns || 10}, minmax(70px, 1fr))`,
              }}
            >
              {booths.map((b) => {
                const color =
                  b.status === 'occupied'
                    ? 'bg-red-100 border-red-300 text-red-800'
                    : b.status === 'reserved'
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-emerald-100 border-emerald-300 text-emerald-800'

                return (
                  <div
                    key={b._id}
                    className={`h-16 border rounded flex flex-col items-center justify-center p-1 text-center font-semibold text-xs ${color}`}
                  >
                    <span>{b.number}</span>
                    <span className="text-[10px] font-normal truncate max-w-[60px]">
                      {b.exhibitorProfile?.company || b.status}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="max-w-3xl space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Leave Feedback</h3>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className={`p-2 rounded ${
                          rating >= s ? 'text-amber-400' : 'text-gray-300'
                        }`}
                      >
                        <Star size={24} fill={rating >= s ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Comments</label>
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Share your thoughts about the event, speakers, or organization..."
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Submit Feedback
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Attendee Reviews ({feedbacks.length})</h3>
              {feedbacks.length === 0 ? (
                <p className="text-sm text-gray-500">No reviews submitted yet.</p>
              ) : (
                feedbacks.map((f) => (
                  <div key={f._id} className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-gray-900">{f.user?.name || 'Attendee'}</span>
                      <div className="flex text-amber-400">
                        {[...Array(f.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    {f.message && <p className="text-sm text-gray-600">{f.message}</p>}
                    <span className="text-xs text-gray-400">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

