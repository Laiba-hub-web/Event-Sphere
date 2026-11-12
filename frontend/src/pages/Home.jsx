import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Grid,
  Users,
  ArrowRight,
  CheckCircle2,
  Search,
  Store,
  Ticket,
  ChevronDown,
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
    navigate(
      heroSearch.trim()
        ? `/expos?search=${encodeURIComponent(heroSearch.trim())}`
        : '/expos'
    )
  }

  const categories = [
    'All',
    'Artificial Intelligence',
    'Healthcare',
    'Clean Energy',
    'Cybersecurity',
    'FinTech',
  ]

  const filteredExpos = expos.filter((e) => {
    if (activeCategory === 'All') return true
    return (
      e.theme?.toLowerCase().includes(activeCategory.toLowerCase()) ||
      e.title?.toLowerCase().includes(activeCategory.toLowerCase())
    )
  })

  const roleCards = [
    {
      icon: Calendar,
      role: 'For Event Organizers',
      title: 'Plan & Manage Exhibitions Easily',
      desc: 'Create multi-day events, customize booth floor plans, review exhibitor applications, and manage speaker schedules in one place.',
      points: [
        'Visual floor plan & booth management',
        'One-click exhibitor application approvals',
        'Speaker session scheduling & room capacity',
        'Registration and attendance reports',
      ],
      link: isAuthenticated ? '/dashboard' : '/login',
      cta: 'Organizer Dashboard',
    },
    {
      icon: Store,
      role: 'For Exhibitors',
      title: 'Book Booths & Showcase Products',
      desc: 'Apply to upcoming trade shows, choose your preferred booth location on the floor map, and present your company to attendees.',
      points: [
        'Interactive floor map booth selection',
        'Company profile with products & services',
        'Direct messaging with attendees & organizers',
        'Track application and booth status easily',
      ],
      link: isAuthenticated ? '/dashboard' : '/register',
      cta: 'Become an Exhibitor',
    },
    {
      icon: Ticket,
      role: 'For Attendees',
      title: 'Attend Events & Build Your Schedule',
      desc: 'Browse upcoming exhibitions, register for instant digital event tickets, bookmark speaker sessions, and connect with exhibitors.',
      points: [
        'Instant printable QR event ticket',
        'Personal speaker session schedule',
        'Searchable exhibitor & booth directory',
        'Direct chat with exhibiting companies',
      ],
      link: '/expos',
      cta: 'Browse Events',
    },
  ]

  const faqs = [
    {
      q: 'How do I register to attend an event?',
      a: 'Simply create a free Attendee account, open any upcoming event from the Events page, and click "Register Now" to receive your event ticket immediately.',
    },
    {
      q: 'How can my company book an exhibition booth?',
      a: 'Sign up as an Exhibitor, apply to your chosen event with your company details, and once approved by the organizer, select your booth directly on the interactive floor map.',
    },
    {
      q: 'Can I bookmark speaker sessions in advance?',
      a: 'Yes! On any event page, open the Schedule tab and click "Save Session" to add talks and workshops to your personal schedule.',
    },
    {
      q: 'How can attendees contact exhibitors?',
      a: 'You can message any exhibitor or event organizer directly through the built-in Messages page.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* 1. CLEAN LIGHT HERO SECTION */}
      <section className="bg-white border-b border-slate-200 py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold">
            <span>Global Exhibitions, Conferences &amp; Trade Shows</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Discover, Exhibit &amp; Connect at{' '}
            <span className="text-blue-600">World-Class Events</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore upcoming conferences and exhibitions, reserve exhibition booths on interactive floor plans, and build your personal speaker schedule.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="bg-white p-2 rounded-2xl border border-slate-200 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 shadow-sm"
          >
            <div className="flex-1 flex items-center gap-3 px-3.5 py-2">
              <Search size={19} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search events by name, industry, or city..."
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Search Events</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/expos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              <Calendar size={15} />
              Browse All Events
            </Link>
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              <Users size={15} />
              {isAuthenticated ? 'Go to My Dashboard' : 'Create Free Account'}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. UPCOMING EVENTS DIRECTORY */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Upcoming Events &amp; Exhibitions
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              View event details, speaker schedules, and available exhibition booths.
            </p>
          </div>
          <Link
            to="/expos"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View All ({expos.length}) <ArrowRight size={15} />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expos Grid */}
        {loadingExpos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-white border border-slate-200 p-4 animate-pulse space-y-4"
              >
                <div className="h-44 bg-slate-100 rounded-xl" />
                <div className="h-5 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredExpos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <p className="text-base font-bold text-slate-800">
              No events found in &ldquo;{activeCategory}&rdquo;
            </p>
            <button
              onClick={() => setActiveCategory('All')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Show All Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExpos.slice(0, 6).map((expo) => (
              <ExpoCard key={expo._id} expo={expo} />
            ))}
          </div>
        )}
      </section>

      {/* 3. HOW IT WORKS FOR EVERY ROLE */}
      <section className="py-14 sm:py-16 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Everything You Need for Successful Events
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Designed for organizers, exhibiting companies, and event attendees.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {roleCards.map((card, idx) => {
              const Icon = card.icon
              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {card.role}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {card.desc}
                    </p>

                    <ul className="space-y-2 pt-1">
                      {card.points.map((pt, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={card.link}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-blue-600 text-slate-800 hover:text-white border border-slate-200 hover:border-blue-600 text-xs font-semibold transition-colors"
                  >
                    <span>{card.cta}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500 mt-1">
            Common questions about attending and exhibiting at EventSphere events.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={17}
                    className={`text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
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
