import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  Users,
  Grid,
  Clock,
  CheckCircle2,
  MessageSquare,
  Star,
  Sparkles,
  QrCode,
  Search,
  Building2,
  Send,
  ShieldCheck,
  Wifi,
  Zap,
  Coffee,
  Mic,
  ArrowLeft,
  Printer,
  Globe,
  Loader2,
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

  // Exhibitor search
  const [exhSearch, setExhSearch] = useState('')

  // Modals
  const [inspectedBooth, setInspectedBooth] = useState(null)
  const [passModalOpen, setPassModalOpen] = useState(false)
  const [messageModalTarget, setMessageModalTarget] = useState(null)
  const [inquiryText, setInquiryText] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [reservingBooth, setReservingBooth] = useState(false)

  // Feedback state
  const [rating, setRating] = useState(5)
  const [feedbackCategory, setFeedbackCategory] = useState('general')
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
        const regRes = await registrationService
          .checkRegistration(id)
          .catch(() => ({ data: { isRegistered: false, registration: null } }))
        setIsRegistered(regRes.data.isRegistered)
        setRegistration(regRes.data.registration || null)
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
      toast.error('Please sign in to register for an event pass')
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
        toast.success('VIP Event Pass issued! Opening your QR badge...')
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
      toast.success('Thank you! Your review has been published.')
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
        <div className="flex-1 flex items-center justify-center py-24">
          <LoadingSpinner text="Loading exhibition hall, schedule & booth grid..." />
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
            title="Expo not found"
            description="The requested expo could not be found or has been removed."
            actionLabel="Browse All Expos"
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

  // Map exhibitor ID to booth number
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

  const bannerUrl =
    expo.bannerImage ||
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&auto=format&fit=crop&q=80'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* CINEMATIC HERO BANNER */}
      <div className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={bannerUrl}
            alt={expo.title}
            className="w-full h-full object-cover opacity-30 scale-105 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 relative z-10 space-y-8">
          <Link
            to="/expos"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to All Expos
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600/30 text-blue-300 border border-blue-400/30">
                  <Sparkles size={12} /> {expo.theme || 'International Trade Show'}
                </span>
                <Badge variant={expo.status || 'published'}>{expo.status || 'published'}</Badge>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                  <Star size={12} fill="currentColor" /> {avgRating} ({feedbacks.length} reviews)
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                {expo.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-300 pt-1">
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-400" />
                  <strong>
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
                  </strong>
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-rose-400" />
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
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
                  >
                    Configure Floor Plan
                  </Link>
                  <Link
                    to={`/admin/analytics/${expo._id}`}
                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    Live Analytics
                  </Link>
                </>
              )}

              {isExhibitor && (
                <>
                  <Link
                    to={`/exhibitor/apply/${expo._id}`}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    Apply as Exhibitor
                  </Link>
                  <Link
                    to={`/exhibitor/booth/${expo._id}`}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
                  >
                    Select Booth Space
                  </Link>
                </>
              )}

              {(!isAuthenticated || isAttendee) && (
                <div className="flex items-center gap-2.5">
                  {isRegistered ? (
                    <>
                      <button
                        onClick={() => setPassModalOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
                      >
                        <QrCode size={16} /> View My VIP QR Pass
                      </button>
                      <button
                        onClick={handleRegisterExpo}
                        className="px-4 py-3 rounded-xl bg-white/10 hover:bg-rose-600/80 text-slate-200 hover:text-white font-semibold text-xs border border-white/15 transition-all"
                      >
                        Cancel Pass
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleRegisterExpo}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all"
                    >
                      <QrCode size={18} /> Get Free Attendee VIP Pass
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-extrabold text-white">{booths.length}</div>
              <div className="text-xs text-slate-400 font-medium">
                Exhibition Booths ({availableCount} Available)
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-extrabold text-blue-400">{exhibitors.length}</div>
              <div className="text-xs text-slate-400 font-medium">Verified Exhibiting Brands</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-extrabold text-violet-400">{sessions.length}</div>
              <div className="text-xs text-slate-400 font-medium">Keynotes & Technical Labs</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-extrabold text-emerald-400">Free Entry</div>
              <div className="text-xs text-slate-400 font-medium">Instant Digital QR Badge</div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY TABS BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview & Venue' },
              { id: 'schedule', label: `Keynote Schedule (${sessions.length})` },
              { id: 'exhibitors', label: `Exhibitors Directory (${exhibitors.length})` },
              { id: 'floorplan', label: `2D Floor Plan (${booths.length} Booths)` },
              { id: 'feedback', label: `Reviews & Ratings (${feedbacks.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <h2 className="text-2xl font-extrabold text-slate-900">Executive Event Overview</h2>
                <p className="text-slate-600 text-sm sm:text-base whitespace-pre-line leading-relaxed">
                  {expo.description || 'No description provided.'}
                </p>

                {expo.tags && expo.tags.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Technology & Industry Tracks
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {expo.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-xs font-bold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Venue Amenities Grid */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Exhibition Hall Facilities & Infrastructure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: Wifi,
                      title: '10Gbps Dedicated Wi-Fi 6E',
                      desc: 'Symmetric high-density wireless mesh across all exhibition booths.',
                    },
                    {
                      icon: Zap,
                      title: '3-Phase Industrial Power Drops',
                      desc: 'Available at all Large & Island booths for live hardware rigs.',
                    },
                    {
                      icon: Mic,
                      title: 'Dolby Atmos Keynote Auditoriums',
                      desc: 'Multi-track stages with real-time AI captioning and Q&A.',
                    },
                    {
                      icon: Coffee,
                      title: 'Executive B2B Networking Lounge',
                      desc: 'Private meeting pods for exhibitor-attendee deal making.',
                    },
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3.5"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Venue & Logistics Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900">Event Logistics</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Opening Date</span>
                    <span className="font-bold text-slate-900">
                      {new Date(expo.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Venue Location</span>
                    <span className="font-bold text-slate-900 text-right max-w-[180px]">
                      {expo.location}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Floor Plan Grid</span>
                    <span className="font-bold text-slate-900">
                      {expo.boothRows || 4} Rows × {expo.boothColumns || 6} Columns
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500 font-medium">Booth Availability</span>
                    <span className="font-bold text-emerald-600">
                      {availableCount} of {booths.length} Open
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('floorplan')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Open Interactive 2D Floor Plan
                </button>
              </div>

              {/* Organizer Contact Card */}
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 rounded-2xl shadow-md space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-base">
                    {expo.organizer?.name ? expo.organizer.name[0] : 'O'}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                      Official Event Organizer
                    </p>
                    <h4 className="font-bold text-sm text-white">
                      {expo.organizer?.name || 'EventSphere Management'}
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Have questions about custom pavilion sponsorships, rigging, or group delegations?
                  Message the organizing desk directly.
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
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-white text-slate-950 hover:bg-blue-50 rounded-xl text-xs font-bold transition-colors"
                  >
                    <MessageSquare size={14} className="text-blue-600" /> Message Organizer Desk
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Keynote Presentations & Technical Workshops
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click “Reserve Seat” on any session to add it to your personal itinerary.
                </p>
              </div>
              <Link
                to="/attendee/schedule"
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                View My Bookmarked Itinerary →
              </Link>
            </div>

            {sessions.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No sessions scheduled yet"
                description="The keynote agenda for this expo is currently being finalized."
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
                <h2 className="text-xl font-extrabold text-slate-900">
                  Approved Exhibitors & Product Showcase
                </h2>
                <p className="text-xs text-slate-500">
                  Search companies by name, hardware product, or service vertical.
                </p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={exhSearch}
                  onChange={(e) => setExhSearch(e.target.value)}
                  placeholder="Filter by company or product..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {filteredExhibitors.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No matching exhibitors"
                description="Try clearing your search filter or check back soon."
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

        {/* TAB 4: INTERACTIVE 2D FLOOR PLAN */}
        {activeTab === 'floorplan' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Interactive 2D Exhibition Floor Plan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any booth unit below to inspect dimensions, pricing, or exhibiting company.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available (
                  {availableCount})
                </span>
                <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Reserved (
                  {reservedCount})
                </span>
                <span className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Occupied (
                  {occupiedCount})
                </span>
              </div>
            </div>

            {/* Hall Landmarks Top */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs font-bold">
              <div className="py-2.5 px-4 rounded-xl bg-slate-900 text-white">
                🚪 Main Registration & Security Gate
              </div>
              <div className="py-2.5 px-4 rounded-xl bg-indigo-950 text-indigo-200">
                🎤 Grand Keynote Stage Alpha
              </div>
              <div className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-200">
                ☕ VIP Networking Lounge & Media Hub
              </div>
            </div>

            {/* Booth Grid */}
            <div className="w-full overflow-x-auto pb-2">
              <div
                className="grid gap-3 p-4 sm:p-5 bg-slate-100 rounded-2xl min-w-[680px]"
                style={{
                  gridTemplateColumns: `repeat(${expo.boothColumns || 6}, minmax(105px, 1fr))`,
                }}
              >
                {booths.map((b) => {
                  const color =
                    b.status === 'occupied'
                      ? 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-900'
                      : b.status === 'reserved'
                      ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900'

                  return (
                    <button
                      key={b._id}
                      type="button"
                      onClick={() => setInspectedBooth(b)}
                      className={`h-24 border-2 rounded-xl flex flex-col justify-between p-2.5 text-left transition-all hover:scale-[1.03] shadow-2xs cursor-pointer ${color}`}
                    >
                      <div className="flex items-center justify-between w-full text-[11px] font-extrabold">
                        <span>{b.number}</span>
                        <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-white/70">
                          {b.size}
                        </span>
                      </div>
                      <div className="text-xs font-bold truncate w-full">
                        {b.exhibitorProfile?.company || (
                          <span className="uppercase text-[10px] tracking-wider opacity-80">
                            {b.status}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-semibold opacity-75">
                        ${b.price || 500} USD
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Submit Review */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 sticky top-36">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Rate & Review This Expo</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Share your experience with organizers and future attendees.
                  </p>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Overall Star Rating
                    </label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setRating(s)}
                          className={`p-2 rounded-xl border transition-all ${
                            rating >= s
                              ? 'text-amber-400 bg-amber-50 border-amber-200'
                              : 'text-slate-300 bg-slate-50 border-slate-200'
                          }`}
                        >
                          <Star size={22} fill={rating >= s ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Feedback Category
                    </label>
                    <select
                      value={feedbackCategory}
                      onChange={(e) => setFeedbackCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                    >
                      <option value="general">General Event Experience</option>
                      <option value="session">Keynotes & Speakers</option>
                      <option value="booth">Exhibitor Booths & Floor Plan</option>
                      <option value="logistics">Venue & Check-in Logistics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Written Review
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="What stood out about the speakers, booths, or organization?"
                      className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    Publish Verified Review
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Verified Attendee Reviews ({feedbacks.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Average Score: <strong className="text-slate-900">{avgRating} / 5.0</strong>
                  </p>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
              </div>

              {feedbacks.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  No reviews submitted yet. Be the first to rate this expo!
                </div>
              ) : (
                feedbacks.map((f) => (
                  <div
                    key={f._id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {f.user?.name ? f.user.name[0] : 'A'}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">
                            {f.user?.name || 'Verified Attendee'}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {f.category || 'general'} ·{' '}
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

      {/* MODAL 1: BOOTH INSPECTOR */}
      <Modal
        isOpen={!!inspectedBooth}
        onClose={() => setInspectedBooth(null)}
        title={`Booth ${inspectedBooth?.number} — Floor Plan Inspector`}
      >
        {inspectedBooth && (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Status: </span>
                <Badge variant={inspectedBooth.status}>{inspectedBooth.status}</Badge>
              </div>
              <div>
                <span className="text-slate-500">Size Tier: </span>
                <strong className="capitalize text-slate-900">{inspectedBooth.size}</strong>
              </div>
              <div>
                <span className="text-slate-500">Price: </span>
                <strong className="text-blue-600">${inspectedBooth.price || 500} USD</strong>
              </div>
            </div>

            {inspectedBooth.notes && (
              <div className="text-xs text-slate-600 bg-blue-50/60 border border-blue-100 p-3 rounded-xl">
                <strong className="text-slate-900">Placement & Amenities:</strong>{' '}
                {inspectedBooth.notes}
              </div>
            )}

            {inspectedBooth.exhibitorProfile ? (
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Assigned Exhibitor
                </p>
                <h4 className="text-base font-extrabold text-slate-900">
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
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    <MessageSquare size={13} /> Message Exhibitor
                  </button>
                )}
              </div>
            ) : inspectedBooth.status === 'available' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  This booth space is currently open for reservation. Exhibitors can reserve it
                  immediately.
                </p>
                {isExhibitor && (
                  <button
                    onClick={handleReserveBoothFromInspector}
                    disabled={reservingBooth}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow"
                  >
                    {reservingBooth
                      ? 'Reserving...'
                      : `Reserve Booth ${inspectedBooth.number} Now`}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}
      </Modal>

      {/* MODAL 2: DIRECT MESSAGE INQUIRY */}
      <Modal
        isOpen={!!messageModalTarget}
        onClose={() => setMessageModalTarget(null)}
        title={`Send Direct Message to ${messageModalTarget?.name}`}
      >
        <form onSubmit={handleSendDirectMessage} className="space-y-4">
          <p className="text-xs text-slate-500">
            Your message will be delivered in real-time via EventSphere Chat. You can continue the
            conversation anytime in your Messages tab.
          </p>
          <textarea
            rows={4}
            required
            value={inquiryText}
            onChange={(e) => setInquiryText(e.target.value)}
            placeholder={`Hi ${messageModalTarget?.name}, I would love to schedule a demo or inquire about...`}
            className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setMessageModalTarget(null)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sendingMsg}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
            >
              {sendingMsg ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Send Message
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: PRINTABLE VIP QR PASS */}
      <Modal
        isOpen={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        title="Your Official VIP Attendee Badge"
      >
        <div className="space-y-5">
          <div className="border-2 border-slate-900 rounded-2xl overflow-hidden bg-white shadow-lg">
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 text-center space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300">
                EventSphere Official Entry Credential
              </span>
              <h4 className="text-lg font-extrabold">{expo.title}</h4>
              <p className="text-xs text-slate-300">{expo.location}</p>
            </div>
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl">
                <QrCode size={96} className="text-slate-900 mx-auto" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                  VIP ALL-ACCESS ATTENDEE PASS
                </span>
              </div>
              <div className="w-full pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                PASS ID: {registration?.qrCode || 'EVS-VIP-VERIFIED-2026'}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 no-print">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              <Printer size={14} /> Print Badge
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}
