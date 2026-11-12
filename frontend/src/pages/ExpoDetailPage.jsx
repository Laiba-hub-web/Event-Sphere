import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  MessageSquare,
  Star,
  QrCode,
  Search,
  Send,
  ArrowLeft,
  Printer,
  Loader2,
  Compass,
  Mic2,
  Coffee,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
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
  messageService,
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
  const [registration, setRegistration] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const [exhSearch, setExhSearch] = useState('')
  const [inspectedBooth, setInspectedBooth] = useState(null)
  const [passModalOpen, setPassModalOpen] = useState(false)
  const [messageModalTarget, setMessageModalTarget] = useState(null)
  const [inquiryText, setInquiryText] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [reservingBooth, setReservingBooth] = useState(false)

  const [rating, setRating] = useState(5)
  const [feedbackCategory, setFeedbackCategory] = useState('general')
  const [feedbackText, setFeedbackText] = useState('')

  useEffect(() => {
    loadAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated])

  const loadAllData = async () => {
    try {
      setLoading(true)
      const [expoRes, sessRes, exhRes, bthRes, fbRes, regRes] = await Promise.all([
        expoService.getOne(id),
        sessionService.getByExpo(id).catch(() => ({ data: { sessions: [] } })),
        exhibitorService.getByExpo(id).catch(() => ({ data: { exhibitors: [] } })),
        boothService.getByExpo(id).catch(() => ({ data: { booths: [] } })),
        feedbackService.getByExpo(id).catch(() => ({ data: { feedback: [] } })),
        isAuthenticated
          ? registrationService
              .checkRegistration(id)
              .catch(() => ({ data: { isRegistered: false, registration: null } }))
          : Promise.resolve({ data: { isRegistered: false, registration: null } }),
      ])

      setExpo(expoRes.data.expo)
      setSessions(sessRes.data.sessions || [])
      setExhibitors(exhRes.data.exhibitors || [])
      setBooths(bthRes.data.booths || [])
      setFeedbacks(fbRes.data?.feedback || [])
      setIsRegistered(regRes.data.isRegistered)
      setRegistration(regRes.data.registration || null)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterExpo = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to register for this event')
      navigate('/login')
      return
    }
    try {
      if (isRegistered) {
        await registrationService.cancel(id)
        setIsRegistered(false)
        setRegistration(null)
        toast.success('Registration cancelled')
      } else {
        const res = await registrationService.register(id)
        setIsRegistered(true)
        setRegistration(res.data.registration)
        toast.success('Registered! Your ticket is ready.')
        setPassModalOpen(true)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration action failed')
    }
  }

  const handleSendDirectMessage = async (e) => {
    e.preventDefault()
    if (!inquiryText.trim() || !messageModalTarget) return
    setSendingMsg(true)
    try {
      await messageService.send({
        receiverId: messageModalTarget.userId,
        expoId: id,
        content: inquiryText.trim(),
      })
      toast.success(`Message sent to ${messageModalTarget.name}!`)
      setInquiryText('')
      setMessageModalTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send message')
    } finally {
      setSendingMsg(false)
    }
  }

  const handleReserveBoothFromInspector = async () => {
    if (!inspectedBooth) return
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setReservingBooth(true)
    try {
      await boothService.reserve(inspectedBooth._id)
      toast.success(`Booth ${inspectedBooth.number} reserved!`)
      setInspectedBooth(null)
      loadAllData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not reserve booth')
    } finally {
      setReservingBooth(false)
    }
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await feedbackService.submit({
        expoId: id,
        rating,
        category: feedbackCategory,
        message: feedbackText,
      })
      toast.success('Thank you! Your review has been posted.')
      setFeedbackText('')
      const fbRes = await feedbackService.getByExpo(id).catch(() => ({ data: { feedback: [] } }))
      setFeedbacks(fbRes.data?.feedback || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <LoadingSpinner text="Loading event details..." />
        </div>
      </div>
    )
  }

  if (!expo) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto py-20 px-4">
          <EmptyState
            title="Event not found"
            description="The requested event could not be found."
            actionLabel="Browse Events"
            actionTo="/expos"
          />
        </div>
        <Footer />
      </div>
    )
  }

  const occupiedCount = booths.filter((b) => b.status === 'occupied').length
  const reservedCount = booths.filter((b) => b.status === 'reserved').length
  const availableCount = booths.filter((b) => b.status === 'available').length
  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : '5.0'

  const exhibitorBoothMap = {}
  booths.forEach((b) => {
    if (b.exhibitorProfile?._id) {
      exhibitorBoothMap[b.exhibitorProfile._id] = b.number
    }
  })

  const filteredExhibitors = exhibitors.filter((ex) => {
    const q = exhSearch.toLowerCase()
    if (!q) return true
    return (
      ex.company?.toLowerCase().includes(q) ||
      ex.description?.toLowerCase().includes(q) ||
      ex.products?.some((p) => p.toLowerCase().includes(q)) ||
      ex.services?.some((s) => s.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* CLEAN LIGHT EVENT HEADER */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Link
            to="/expos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Events
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                  {expo.theme || 'Conference & Exhibition'}
                </span>
                <Badge variant={expo.status === 'published' ? 'success' : 'neutral'}>
                  {expo.status || 'published'}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  <Star size={12} fill="currentColor" /> {avgRating} ({feedbacks.length} reviews)
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                {expo.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-600" />
                  <span>
                    {new Date(expo.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {expo.endDate &&
                      ` – ${new Date(expo.endDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}`}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" />
                  <span>{expo.location}</span>
                </span>
              </div>
            </div>

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {isAdmin && (
                <>
                  <Link
                    to={`/admin/expos/${expo._id}/floor-plan`}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                  >
                    Manage Booths
                  </Link>
                  <Link
                    to={`/admin/analytics/${expo._id}`}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
                  >
                    View Reports
                  </Link>
                </>
              )}

              {isExhibitor && (
                <>
                  <Link
                    to={`/exhibitor/apply/${expo._id}`}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
                  >
                    Apply as Exhibitor
                  </Link>
                  <Link
                    to={`/exhibitor/booth/${expo._id}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                  >
                    Select Booth
                  </Link>
                </>
              )}

              {(!isAuthenticated || isAttendee) && (
                <div className="flex items-center gap-2.5">
                  {isRegistered ? (
                    <>
                      <button
                        onClick={() => setPassModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        <QrCode size={16} /> View Ticket
                      </button>
                      <button
                        onClick={handleRegisterExpo}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Cancel Registration
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleRegisterExpo}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
                    >
                      <QrCode size={17} /> Register for Free Ticket
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
              <div className="text-xl font-bold text-slate-900">{booths.length}</div>
              <div className="text-xs text-slate-500">
                Booths ({availableCount} Open)
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
              <div className="text-xl font-bold text-blue-600">{exhibitors.length}</div>
              <div className="text-xs text-slate-500">Exhibiting Companies</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
              <div className="text-xl font-bold text-slate-900">{sessions.length}</div>
              <div className="text-xs text-slate-500">Speaker Sessions</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
              <div className="text-xl font-bold text-emerald-600">Free Entry</div>
              <div className="text-xs text-slate-500">Instant Event Ticket</div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'About Event' },
              { id: 'schedule', label: `Schedule (${sessions.length})` },
              { id: 'exhibitors', label: `Exhibitors (${exhibitors.length})` },
              { id: 'floorplan', label: `Floor Plan (${booths.length})` },
              { id: 'feedback', label: `Reviews (${feedbacks.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-2 border-b-2 font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-xl font-bold text-slate-900">About This Event</h2>
                <p className="text-slate-600 text-sm sm:text-base whitespace-pre-line leading-relaxed">
                  {expo.description || 'No description provided.'}
                </p>

                {expo.tags && expo.tags.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                      Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {expo.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Event Details</h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Date</span>
                    <span className="font-semibold text-slate-900">
                      {new Date(expo.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Location</span>
                    <span className="font-semibold text-slate-900 text-right max-w-[180px]">
                      {expo.location}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">Available Booths</span>
                    <span className="font-semibold text-emerald-600">
                      {availableCount} of {booths.length} Open
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('floorplan')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  View Floor Plan
                </button>
              </div>

              {/* Organizer Contact Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {expo.organizer?.name ? expo.organizer.name[0] : 'O'}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Event Organizer
                    </p>
                    <h4 className="font-bold text-sm text-slate-900">
                      {expo.organizer?.name || 'EventSphere Organizer'}
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Have questions about attending or exhibiting at this event? Send a message to the organizer.
                </p>
                {expo.organizer?._id && (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login')
                        return
                      }
                      setMessageModalTarget({
                        userId: expo.organizer._id,
                        name: expo.organizer.name,
                      })
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <MessageSquare size={14} className="text-blue-600" /> Contact Organizer
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-5 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Speaker Sessions &amp; Schedule
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Save sessions to build your personal event schedule.
                </p>
              </div>
              <Link
                to="/attendee/schedule"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                View My Schedule &rarr;
              </Link>
            </div>

            {sessions.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No sessions scheduled yet"
                description="The schedule for this event will be posted soon."
              />
            ) : (
              <div className="space-y-4">
                {sessions.map((s) => (
                  <SessionCard
                    key={s._id}
                    session={s}
                    isBookmarked={s.attendees?.some(
                      (a) => a.user?._id === user?._id || a.user === user?._id
                    )}
                    onBookmarkToggle={loadAllData}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EXHIBITORS DIRECTORY */}
        {activeTab === 'exhibitors' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Exhibiting Companies
                </h2>
                <p className="text-xs text-slate-500">
                  Search companies by name, product, or service.
                </p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={exhSearch}
                  onChange={(e) => setExhSearch(e.target.value)}
                  placeholder="Search companies..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {filteredExhibitors.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No matching exhibitors"
                description="Try clearing your search filter."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExhibitors.map((exh) => (
                  <ExhibitorCard
                    key={exh._id}
                    exhibitor={exh}
                    boothNumber={exhibitorBoothMap[exh._id]}
                    onContact={(target) => {
                      if (!isAuthenticated) {
                        toast.error('Please sign in to message exhibitors')
                        navigate('/login')
                        return
                      }
                      setMessageModalTarget({
                        userId: target.user?._id || target.user,
                        name: target.company,
                      })
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CLEAN LIGHT-MODE FLOOR PLAN */}
        {activeTab === 'floorplan' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Exhibition Floor Plan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any booth below to view details or exhibiting company.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available ({availableCount})
                </span>
                <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Reserved ({reservedCount})
                </span>
                <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Occupied ({occupiedCount})
                </span>
              </div>
            </div>

            {/* Hall Landmarks Top */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-xs font-semibold text-slate-600">
              <div className="py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-2">
                <Compass size={15} className="text-blue-600" /> Main Entrance
              </div>
              <div className="py-2.5 px-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-800 flex items-center justify-center gap-2">
                <Mic2 size={15} className="text-blue-600" /> Main Speaker Stage
              </div>
              <div className="py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-2">
                <Coffee size={15} className="text-amber-600" /> Networking Lounge
              </div>
            </div>

            {/* Booth Grid */}
            <div className="w-full overflow-x-auto pb-2">
              <div
                className="grid gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl min-w-[680px]"
                style={{
                  gridTemplateColumns: `repeat(${expo.boothColumns || 6}, minmax(100px, 1fr))`,
                }}
              >
                {booths.map((b) => {
                  const color =
                    b.status === 'occupied'
                      ? 'bg-blue-50 hover:bg-blue-100/80 border-blue-200 text-blue-900'
                      : b.status === 'reserved'
                      ? 'bg-amber-50 hover:bg-amber-100/80 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 text-emerald-900'

                  return (
                    <button
                      key={b._id}
                      type="button"
                      onClick={() => setInspectedBooth(b)}
                      className={`h-24 border rounded-xl flex flex-col justify-between p-2.5 text-left transition-all shadow-2xs cursor-pointer ${color}`}
                    >
                      <div className="flex items-center justify-between w-full text-[11px] font-bold">
                        <span>{b.number}</span>
                        <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                          {b.size}
                        </span>
                      </div>
                      <div className="text-xs font-bold truncate w-full text-slate-900">
                        {b.exhibitorProfile?.company || (
                          <span className="capitalize text-[11px] font-medium opacity-75">
                            {b.status}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-600">
                        ${b.price || 500}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FEEDBACK & REVIEWS */}
        {activeTab === 'feedback' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Leave a Review</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Share your feedback about this event.
                  </p>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Rating
                    </label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setRating(s)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            rating >= s
                              ? 'text-amber-400 bg-amber-50 border-amber-200'
                              : 'text-slate-300 bg-slate-50 border-slate-200'
                          }`}
                        >
                          <Star size={20} fill={rating >= s ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={feedbackCategory}
                      onChange={(e) => setFeedbackCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                    >
                      <option value="general">General Experience</option>
                      <option value="session">Speakers &amp; Sessions</option>
                      <option value="booth">Booths &amp; Exhibitors</option>
                      <option value="logistics">Venue &amp; Organization</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Review
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Write your thoughts about the event..."
                      className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Attendee Reviews ({feedbacks.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Average Rating: <strong className="text-slate-900">{avgRating} / 5.0</strong>
                  </p>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={17} fill="currentColor" />
                  ))}
                </div>
              </div>

              {feedbacks.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  No reviews yet. Be the first to review this event!
                </div>
              ) : (
                feedbacks.map((f) => (
                  <div
                    key={f._id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {f.user?.name ? f.user.name[0] : 'A'}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">
                            {f.user?.name || 'Attendee'}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {f.category || 'general'} &bull;{' '}
                            {new Date(f.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(f.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    {f.message && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                        {f.message}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: BOOTH DETAILS */}
      <Modal
        isOpen={!!inspectedBooth}
        onClose={() => setInspectedBooth(null)}
        title={`Booth ${inspectedBooth?.number}`}
      >
        {inspectedBooth && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Status: </span>
                <span className="font-bold capitalize text-slate-900">{inspectedBooth.status}</span>
              </div>
              <div>
                <span className="text-slate-500">Size: </span>
                <strong className="capitalize text-slate-900">{inspectedBooth.size}</strong>
              </div>
              <div>
                <span className="text-slate-500">Price: </span>
                <strong className="text-blue-600">${inspectedBooth.price || 500}</strong>
              </div>
            </div>

            {inspectedBooth.notes && (
              <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <strong className="text-slate-900">Notes:</strong> {inspectedBooth.notes}
              </div>
            )}

            {inspectedBooth.exhibitorProfile ? (
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Exhibitor
                </p>
                <h4 className="text-base font-bold text-slate-900">
                  {inspectedBooth.exhibitorProfile.company}
                </h4>
                {inspectedBooth.exhibitorProfile.description && (
                  <p className="text-xs text-slate-600">
                    {inspectedBooth.exhibitorProfile.description}
                  </p>
                )}
                {inspectedBooth.exhibitor && (
                  <button
                    onClick={() => {
                      const targetId =
                        inspectedBooth.exhibitor._id || inspectedBooth.exhibitor
                      setInspectedBooth(null)
                      setMessageModalTarget({
                        userId: targetId,
                        name: inspectedBooth.exhibitorProfile.company,
                      })
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <MessageSquare size={13} /> Message Company
                  </button>
                )}
              </div>
            ) : inspectedBooth.status === 'available' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  This booth is currently available for booking.
                </p>
                {isExhibitor && (
                  <button
                    onClick={handleReserveBoothFromInspector}
                    disabled={reservingBooth}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    {reservingBooth
                      ? 'Reserving...'
                      : `Reserve Booth ${inspectedBooth.number}`}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}
      </Modal>

      {/* MODAL 2: SEND MESSAGE */}
      <Modal
        isOpen={!!messageModalTarget}
        onClose={() => setMessageModalTarget(null)}
        title={`Message ${messageModalTarget?.name}`}
      >
        <form onSubmit={handleSendDirectMessage} className="space-y-4">
          <textarea
            rows={4}
            required
            value={inquiryText}
            onChange={(e) => setInquiryText(e.target.value)}
            placeholder={`Write your message to ${messageModalTarget?.name}...`}
            className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setMessageModalTarget(null)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sendingMsg}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              {sendingMsg ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Send Message
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: EVENT TICKET */}
      <Modal
        isOpen={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        title="Event Entry Ticket"
      >
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
            <div className="bg-blue-600 text-white p-5 text-center space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-100">
                Event Admission Pass
              </span>
              <h4 className="text-lg font-bold">{expo.title}</h4>
              <p className="text-xs text-blue-100">{expo.location}</p>
            </div>
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <QrCode size={96} className="text-slate-900 mx-auto" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Confirmed Ticket
                </span>
              </div>
              <div className="w-full pt-3 border-t border-slate-100 text-xs text-slate-500">
                Ticket ID: {registration?.qrCode || 'PASS-2026'}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 no-print">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Printer size={14} /> Print Ticket
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}
