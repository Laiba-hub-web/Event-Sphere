import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Grid,
  Users,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Search,
  MapPin,
  Mic,
  Store,
  Ticket,
  BarChart3,
  Globe2,
  ChevronDown,
  Star,
  Cpu,
  HeartPulse,
  Zap,
  Shield,
  Gamepad2,
  Landmark,
  Clock,
  Award,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ExpoCard from '../components/cards/ExpoCard'
import { expoService } from '../api/services'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [expos, setExpos] = useState([])
  const [loadingExpos, setLoadingExpos] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [heroSearch, setHeroSearch] = useState('')
  const [activeRoleTab, setActiveRoleTab] = useState('organizer')
  const [selectedDemoBooth, setSelectedDemoBooth] = useState('A-1')
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    expoService
      .getAll()
      .then((res) => setExpos(res.data.expos || []))
      .catch(() => {})
      .finally(() => setLoadingExpos(false))
  }, [])

  const handleHeroSearch = (e) => {
    e.preventDefault()
    navigate(heroSearch.trim() ? `/expos?search=${encodeURIComponent(heroSearch.trim())}` : '/expos')
  }

  const categories = [
    'All',
    'Artificial Intelligence',
    'Healthcare',
    'Clean Energy',
    'Cybersecurity',
    'Gaming',
    'FinTech',
  ]

  const filteredExpos = expos.filter((e) => {
    if (activeCategory === 'All') return true
    return (
      e.theme?.toLowerCase().includes(activeCategory.toLowerCase()) ||
      e.title?.toLowerCase().includes(activeCategory.toLowerCase())
    )
  })

  const industries = [
    {
      icon: Cpu,
      name: 'AI & Robotics',
      count: '140+ Global Summits',
      desc: 'Autonomous systems, neural compute clusters, and humanoid robotics.',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      icon: HeartPulse,
      name: 'Biotech & MedTech',
      count: '95+ Exhibitions',
      desc: 'Genomic sequencing, mRNA therapeutics, and surgical diagnostics.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Zap,
      name: 'CleanTech & EV',
      count: '110+ Trade Shows',
      desc: 'Solid-state batteries, megawatt charging, and smart renewable grids.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Shield,
      name: 'Cyber & Cloud',
      count: '85+ Conferences',
      desc: 'Zero-trust defense, post-quantum cryptography, and cloud mesh.',
      color: 'from-violet-600 to-purple-600',
    },
    {
      icon: Gamepad2,
      name: 'Gaming & Spatial XR',
      count: '70+ Interactive Expos',
      desc: 'Spatial computing headsets, game engines, and esports arenas.',
      color: 'from-pink-600 to-rose-600',
    },
    {
      icon: Landmark,
      name: 'Global FinTech',
      count: '90+ Banking Forums',
      desc: 'Institutional settlement rails, algorithmic clearing, and DeFi.',
      color: 'from-cyan-600 to-blue-600',
    },
  ]

  const roleShowcases = {
    organizer: {
      badge: 'Admin & Organizer Command Center',
      title: 'Orchestrate Entire Trade Shows From One Unified Cockpit',
      desc: 'Eliminate spreadsheets and fragmented tools. Create multi-day conventions, auto-generate 2D booth floor plans, vet exhibitor applications, and monitor live registration telemetry.',
      metrics: [
        { label: 'Setup Speed', val: '10x Faster' },
        { label: 'Booth Utilization', val: '96.4% Avg' },
        { label: 'Live Telemetry', val: 'Real-Time' },
      ],
      bullets: [
        'Automated 2D Floor Plan Grid synthesis (Rows × Columns with A-1, B-1 numbering)',
        'One-click Exhibitor Application approval & custom rejection feedback workflows',
        'Multi-stage Keynote & Workshop scheduler with live seat capacity enforcement',
        'Recharts visual analytics for registration velocity, booth occupancy, and ratings',
      ],
      ctaText: 'Launch Organizer Portal',
      ctaLink: '/admin/dashboard',
    },
    exhibitor: {
      badge: 'Exhibitor B2B Showcase Hub',
      title: 'Reserve Prime Floor Booths & Capture High-Intent Leads',
      desc: 'Apply to world-class trade shows in minutes, inspect live 2D venue layouts to reserve high-traffic island booths, showcase your product catalog, and chat directly with attendees.',
      metrics: [
        { label: 'Lead Conversion', val: '+340% ROI' },
        { label: 'Booth Selection', val: 'Interactive 2D' },
        { label: 'B2B Networking', val: 'Instant Chat' },
      ],
      bullets: [
        'Interactive visual floor map — click any green booth to inspect size, price & reserve',
        'Rich Company Showcase profile with logos, product tags, services & web links',
        'Neighboring Exhibitor collaboration via real-time Socket.io messaging',
        'Real-time application status tracking and instant booth switching',
      ],
      ctaText: 'Open Exhibitor Portal',
      ctaLink: '/exhibitor/dashboard',
    },
    attendee: {
      badge: 'Attendee VIP Experience',
      title: 'Discover Global Expos, Build Your Agenda & Get Instant QR Passes',
      desc: 'Browse upcoming conventions across industries, register with one click for a verifiable QR entry badge, bookmark high-demand keynotes, and message exhibitors before arriving.',
      metrics: [
        { label: 'Entry Check-in', val: '< 3 Seconds' },
        { label: 'Digital QR Pass', val: 'Printable VIP' },
        { label: 'Direct Inquiries', val: '24/7 Live Chat' },
      ],
      bullets: [
        'Instant Digital Conference Badge with unique QR passcode & printable ticket view',
        'Personal Itinerary builder — bookmark keynotes & track remaining seat capacities',
        'Searchable Exhibitor Directory with booth locators and 1-on-1 inquiry chat',
        'Verified post-event star ratings and category feedback system',
      ],
      ctaText: 'Explore Attendee Hub',
      ctaLink: '/attendee/dashboard',
    },
  }

  const demoBooths = [
    {
      id: 'A-1',
      status: 'occupied',
      size: 'Large (9x6m)',
      price: '$1,500',
      company: 'TechCorp Autonomous Systems',
      product: 'LiDAR-X9 Vision Sensor & NeuralEdge Node',
      notes: 'Main Entrance Corner Island — Highest Foot Traffic',
    },
    {
      id: 'A-2',
      status: 'occupied',
      size: 'Large (9x6m)',
      price: '$1,500',
      company: 'QuantumLeap Computing',
      product: 'Leap-1024 Cryogenic QPU Chip',
      notes: 'Front Row Center Pavilion',
    },
    {
      id: 'A-3',
      status: 'occupied',
      size: 'Large (9x6m)',
      price: '$1,500',
      company: 'Apex Robotics International',
      product: 'ApexHumanoid Model 2 & TactileHand 5D',
      notes: 'Live Robotics Demonstration Zone',
    },
    {
      id: 'A-4',
      status: 'available',
      size: 'Large (9x6m)',
      price: '$1,500',
      company: 'Available for Immediate Reservation',
      product: 'Includes 3-Phase Power & Rigging Points',
      notes: 'Near Keynote Auditorium Entrance',
    },
    {
      id: 'B-1',
      status: 'occupied',
      size: 'Medium (6x3m)',
      price: '$950',
      company: 'CyberShield Global Systems',
      product: 'Sentinel AI & PostQuantum Encryption',
      notes: 'Security Pavilion Aisle',
    },
    {
      id: 'B-2',
      status: 'reserved',
      size: 'Medium (6x3m)',
      price: '$950',
      company: 'Reserved — Pending Final Approval',
      product: 'BioGenix Precision Therapeutics',
      notes: 'Standard Exhibition Unit',
    },
    {
      id: 'B-3',
      status: 'available',
      size: 'Medium (6x3m)',
      price: '$950',
      company: 'Available for Immediate Reservation',
      product: 'High-speed Fiber + 2 Display Counters',
      notes: 'Central Aisle Location',
    },
    {
      id: 'B-4',
      status: 'available',
      size: 'Small (3x3m)',
      price: '$600',
      company: 'Available for Startup Showcase',
      product: 'Turnkey Startup Pod Package',
      notes: 'Innovation Alley',
    },
  ]

  const speakers = [
    {
      name: 'Dr. Evelyn Martinez',
      role: 'Director of Machine Intelligence, Quantum AI Labs',
      topic: 'The Sovereign Frontier of Agentic AI',
      expo: 'Global Tech & AI Summit 2026',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dr. Alistair Finch',
      role: 'Chief Quantum Scientist, QuantumLeap',
      topic: 'Fault-Tolerant Cryogenic QPUs at Scale',
      expo: 'Global Tech & AI Summit 2026',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dr. Elena Rostova',
      role: 'Chief Scientific Officer, BioGenix',
      topic: 'mRNA 2.0 & Programmable Nanomedicine',
      expo: 'BioHealth Innovation Expo 2026',
      image: 'https://images.unsplash.com/photo-1594824813576-95b6c23b2c6e?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Marcus Chen',
      role: 'CTO, VoltDynamics Power Systems',
      topic: '800kW Megawatt Charging & Solid-State EVs',
      expo: 'CleanEnergy Mobility World 2026',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
  ]

  const testimonials = [
    {
      quote:
        'EventSphere transformed our 15,000-attendee AI Summit in San Francisco. Auto-generating the 2D booth layout and approving 120 exhibitors took hours instead of weeks.',
      author: 'Sarah Jenkins',
      title: 'VP of Global Conferences, TechSummit Group',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    {
      quote:
        'Being able to visually inspect the floor plan, reserve Booth A-1 right at the entrance, and chat with attendees before the doors even opened doubled our qualified pipeline.',
      author: 'David Vance',
      title: 'Head of Global Exhibitions, TechCorp Autonomous',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    },
    {
      quote:
        'The digital QR pass and live session seat tracker made attending a breeze. I bookmarked all my keynotes and scheduled 4 booth demos directly through EventSphere chat.',
      author: 'Sophia Martinez',
      title: 'Principal Systems Architect, InnovaTech',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  ]

  const faqs = [
    {
      q: 'How does the interactive 2D floor plan and booth reservation work?',
      a: 'When an organizer creates an expo with specified rows and columns, EventSphere automatically synthesizes an interactive booth grid (A-1, A-2, B-1...). Approved exhibitors can view live availability, inspect booth dimensions and pricing, and reserve their preferred space in one click.',
    },
    {
      q: 'How are user roles differentiated on EventSphere?',
      a: 'EventSphere supports three dedicated role portals: Organizers/Admins (who manage expos, floor plans, schedules, and analytics), Exhibitors (who submit company applications, manage showcase profiles, and reserve booths), and Attendees (who register for QR passes, bookmark sessions, and message exhibitors).',
    },
    {
      q: 'Do attendees receive a verifiable pass for event entry?',
      a: 'Yes! Upon registering for any expo, attendees are immediately issued a unique cryptographic QR Passcode and a printable VIP Conference Badge accessible from their Attendee Hub.',
    },
    {
      q: 'Can exhibitors communicate with organizers and neighboring exhibitors?',
      a: 'Absolutely. EventSphere features a built-in real-time messaging engine powered by Socket.io, allowing instant communication between attendees, exhibitors, neighboring booth teams, and event organizers.',
    },
    {
      q: 'What analytics and reporting are available to organizers?',
      a: 'Organizers have access to a live Recharts telemetry dashboard showing daily registration velocity, booth occupancy percentages, session popularity bar charts, and verified attendee star ratings.',
    },
  ]

  const currentRoleData = roleShowcases[activeRoleTab]
  const currentBoothObj = demoBooths.find((b) => b.id === selectedDemoBooth) || demoBooths[0]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-24 lg:py-28 px-4 sm:px-6 lg:px-8">
        {/* Glowing ambient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-violet-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Search & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} className="text-blue-400" />
              <span>Enterprise Expo & Trade Show Operating System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Where the World’s Largest{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">
                Expos & Summits
              </span>{' '}
              Come Alive.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              From interactive 2D booth floor plans and real-time B2B exhibitor networking to
              multi-track keynote agendas and instant QR conference passes — engineered in one
              seamless platform.
            </p>

            {/* Interactive Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15 max-w-2xl mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2 shadow-2xl"
            >
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <Search size={20} className="text-blue-400 shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search expos by industry (AI, Biotech, EV), city, or title..."
                  className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>Explore Expos</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Quick Role Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-blue-50 font-bold text-xs shadow-md transition-all"
              >
                <Ticket size={15} className="text-blue-600" />
                {isAuthenticated ? 'Open My Dashboard' : 'Get Free Attendee Pass'}
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-bold text-xs transition-all"
              >
                <Store size={15} className="text-violet-400" />
                Exhibit Your Company
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-semibold text-xs transition-all"
              >
                Demo Accounts (1-Click)
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Live Event Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none animate-float">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl blur-lg opacity-40" />
              <div className="relative bg-slate-900/95 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80"
                    alt="Global Tech & AI Summit"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500 text-white shadow-md flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      FEATURED SUMMIT
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-5 right-5">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Artificial Intelligence & Robotics
                    </p>
                    <h3 className="text-xl font-extrabold text-white leading-tight">
                      Global Tech & AI Summit 2026
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-800/90 border border-slate-700/70 text-center">
                    <div>
                      <div className="text-lg font-extrabold text-white">24</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Smart Booths
                      </div>
                    </div>
                    <div className="border-x border-slate-700">
                      <div className="text-lg font-extrabold text-blue-400">15,000+</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Expected Visitors
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-emerald-400">San Francisco</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Hall 4 Venue
                      </div>
                    </div>
                  </div>

                  {/* Mini Floor Plan Status Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Floor Plan Booth Allocation</span>
                      <span className="text-emerald-400 font-bold">18 Booths Available</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="bg-rose-500 h-full w-1/4" title="Occupied" />
                      <div className="bg-amber-400 h-full w-1/12" title="Reserved" />
                      <div className="bg-emerald-500 h-full flex-1" title="Available" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                      <img
                        className="w-8 h-8 rounded-full ring-2 ring-slate-900 object-cover"
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                        alt=""
                      />
                      <img
                        className="w-8 h-8 rounded-full ring-2 ring-slate-900 object-cover"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                        alt=""
                      />
                      <img
                        className="w-8 h-8 rounded-full ring-2 ring-slate-900 object-cover"
                        src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100"
                        alt=""
                      />
                      <div className="w-8 h-8 rounded-full ring-2 ring-slate-900 bg-blue-600 text-[10px] font-bold flex items-center justify-center">
                        +2.4k
                      </div>
                    </div>

                    <Link
                      to={expos[0] ? `/expos/${expos[0]._id}` : '/expos'}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                    >
                      Inspect Floor Plan <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED ENTERPRISE EXHIBITORS & METRICS STRIP */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">500+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                International Expos Hosted
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600">12,400+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Interactive Booths Allocated
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-violet-600">250K+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Verified QR Passes Issued
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">99.98%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Real-Time Socket Uptime
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs font-extrabold uppercase tracking-widest text-slate-400">
            <span className="text-slate-400 font-semibold">Featured Exhibiting Innovators:</span>
            <span className="text-slate-700">TECHCORP AUTONOMOUS</span>
            <span className="text-slate-700">BIOGENIX THERAPEUTICS</span>
            <span className="text-slate-700">QUANTUMLEAP QPU</span>
            <span className="text-slate-700">VOLTDYNAMICS EV</span>
            <span className="text-slate-700">APEX ROBOTICS</span>
            <span className="text-slate-700">CYBERSHIELD AI</span>
          </div>
        </div>
      </section>

      {/* 3. LIVE UPCOMING EXPOS CATALOG SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              <Calendar size={14} /> Live Trade Show Directory
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Upcoming Global Expos & Conventions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Explore real-time floor plans, keynote schedules, and exhibiting companies. Filter by
              industry vertical below.
            </p>
          </div>
          <Link
            to="/expos"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors self-start md:self-auto"
          >
            View Complete Directory ({expos.length}) <ArrowRight size={15} />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expos Grid */}
        {loadingExpos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl bg-white border border-slate-200 p-4 animate-pulse space-y-4"
              >
                <div className="h-48 bg-slate-200 rounded-xl" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredExpos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <p className="text-base font-bold text-slate-800">
              No expos found in "{activeCategory}"
            </p>
            <button
              onClick={() => setActiveCategory('All')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Show All Expos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredExpos.slice(0, 6).map((expo) => (
              <ExpoCard key={expo._id} expo={expo} />
            ))}
          </div>
        )}
      </section>

      {/* 4. INTERACTIVE 3-ROLE PLATFORM TOUR */}
      <section className="py-20 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Three Purpose-Built Portals
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              One Unified Ecosystem. Tailored for Every Role.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Switch between our three dedicated workspaces below to see how EventSphere empowers
              organizers, exhibiting companies, and attendees.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex justify-center">
            <div className="flex flex-wrap sm:inline-flex justify-center p-1.5 rounded-2xl bg-slate-800 border border-slate-700 gap-2 w-full sm:w-auto">
              {[
                { id: 'organizer', label: '🛡️ Organizer & Admin Hub' },
                { id: 'exhibitor', label: '🏪 Exhibitor B2B Portal' },
                { id: 'attendee', label: '🎟️ Attendee VIP Interface' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRoleTab(tab.id)}
                  className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeRoleTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Role Content Card */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/20">
                {currentRoleData.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                {currentRoleData.title}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {currentRoleData.desc}
              </p>

              <ul className="space-y-3">
                {currentRoleData.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to={currentRoleData.ctaLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all"
                >
                  <span>{currentRoleData.ctaText}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm transition-all"
                >
                  Test with 1-Click Demo Login
                </Link>
              </div>
            </div>

            {/* Right Metrics Box */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              {currentRoleData.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {m.label}
                    </p>
                    <p className="text-2xl font-extrabold text-white mt-1">{m.val}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <TrendingUp size={22} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE 2D FLOOR PLAN ENGINE DEMO */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Interactive Booth Grid */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
                  Interactive Demo — Click Any Booth Cell
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Silicon Valley Hall 4 — Live Booth Grid
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available
                </span>
                <span className="flex items-center gap-1.5 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Reserved
                </span>
                <span className="flex items-center gap-1.5 text-rose-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Occupied
                </span>
              </div>
            </div>

            {/* Stage Landmark */}
            <div className="bg-slate-900 text-white text-center py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
              🎤 Main Keynote Stage & Grand Entrance
            </div>

            {/* Booth Cells */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {demoBooths.map((b) => {
                const isSelected = selectedDemoBooth === b.id
                const colorCls =
                  b.status === 'occupied'
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : b.status === 'reserved'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'

                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedDemoBooth(b.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all ${colorCls} ${
                      isSelected ? 'ring-4 ring-blue-500/30 scale-[1.03] shadow-md' : 'hover:scale-[1.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span>{b.id}</span>
                      <span className="text-[10px] font-bold">{b.price}</span>
                    </div>
                    <p className="text-xs font-bold truncate mt-2">{b.company}</p>
                    <p className="text-[10px] opacity-75 capitalize mt-0.5">{b.status}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Selected Booth Inspector */}
          <div className="lg:col-span-5 space-y-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-600">
              <Grid size={14} /> Real-Time Spatial Booth Allocation
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Visual Floor Plans Built for High-Traffic Exhibitions
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Click any booth on the left to test our live inspector. Organizers can customize booth
              dimensions and pricing, while exhibitors can reserve available spaces in real time.
            </p>

            {/* Inspector Card */}
            <div className="bg-white p-6 rounded-2xl border-2 border-blue-600/20 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold text-slate-900">
                  Booth {currentBoothObj.id} Inspector
                </span>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold capitalize ${
                    currentBoothObj.status === 'occupied'
                      ? 'bg-rose-100 text-rose-800'
                      : currentBoothObj.status === 'reserved'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentBoothObj.status}
                </span>
              </div>
              <div className="text-xs space-y-1.5 text-slate-600 pt-1">
                <div>
                  <strong className="text-slate-900">Exhibitor:</strong> {currentBoothObj.company}
                </div>
                <div>
                  <strong className="text-slate-900">Dimensions & Tier:</strong>{' '}
                  {currentBoothObj.size} · {currentBoothObj.price}
                </div>
                <div>
                  <strong className="text-slate-900">Showcased Tech:</strong>{' '}
                  {currentBoothObj.product}
                </div>
                <div>
                  <strong className="text-slate-900">Location Note:</strong> {currentBoothObj.notes}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INDUSTRY VERTICALS */}
      <section className="py-20 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Cross-Industry Scale
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Powering Trade Shows Across Every Major Sector
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, i) => {
              const Icon = ind.icon
              return (
                <Link
                  to="/expos"
                  key={i}
                  className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${ind.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {ind.count}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{ind.desc}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 7. KEYNOTE SPEAKERS SPOTLIGHT */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            World-Renowned Thought Leaders
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Featured Keynote Speakers & Visionaries
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Reserve your seat at upcoming keynotes and technical workshops led by global pioneers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {speakers.map((sp, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all group"
            >
              <div className="h-56 overflow-hidden relative bg-slate-900">
                <img
                  src={sp.image}
                  alt={sp.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-[11px] font-bold text-blue-300 truncate">
                  {sp.expo}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-base">{sp.name}</h4>
                <p className="text-xs text-blue-600 font-semibold line-clamp-1">{sp.role}</p>
                <p className="text-xs text-slate-600 pt-2 border-t border-slate-100 line-clamp-2">
                  “{sp.topic}”
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-20 bg-slate-100/80 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Verified Reviews
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Loved by Organizers, Exhibitors & Attendees
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed italic">“{t.quote}”</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t.author}</p>
                    <p className="text-[11px] text-slate-500">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. INTERACTIVE FAQ ACCORDION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Everything You Need to Know About EventSphere
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = openFaq === i
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <Footer />
    </div>
  )
}
