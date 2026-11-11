import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Search,
  Calendar,
  Sparkles,
  Filter,
  ArrowUpDown,
  MapPin,
  Grid,
  ArrowRight,
  RotateCcw,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ExpoCard from '../components/cards/ExpoCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import { expoService } from '../api/services'

export default function ExpoListPage() {
  const [searchParams] = useSearchParams()
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState('All')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const categories = [
    'All',
    'Artificial Intelligence',
    'Healthcare',
    'Clean Energy',
    'Cybersecurity',
    'Gaming',
    'FinTech',
  ]

  useEffect(() => {
    fetchExpos()
  }, [])

  const fetchExpos = async () => {
    try {
      setLoading(true)
      const res = await expoService.getAll()
      setExpos(res.data.expos || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredExpos = expos
    .filter((expo) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        expo.title?.toLowerCase().includes(q) ||
        expo.location?.toLowerCase().includes(q) ||
        expo.theme?.toLowerCase().includes(q) ||
        expo.tags?.some((t) => t.toLowerCase().includes(q))

      const matchesCategory =
        category === 'All' ||
        expo.theme?.toLowerCase().includes(category.toLowerCase()) ||
        expo.title?.toLowerCase().includes(category.toLowerCase())

      const matchesStatus = statusFilter === 'all' || expo.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '')
      if (sortBy === 'booths') {
        const bA = (a.boothRows || 4) * (a.boothColumns || 6)
        const bB = (b.boothRows || 4) * (b.boothColumns || 6)
        return bB - bA
      }
      return new Date(a.date || 0) - new Date(b.date || 0)
    })

  const resetFilters = () => {
    setSearch('')
    setCategory('All')
    setStatusFilter('all')
    setSortBy('date')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Dark Hero Header */}
      <div className="bg-slate-950 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-400">
                <Sparkles size={14} /> Global Trade Show Directory
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Explore World-Class Expos & Summits
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
                Browse international conventions, inspect live 2D booth floor plans, review keynote
                agendas, and register for instant QR attendee passes.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-2xl shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{expos.length} Active Global Events</span>
            </div>
          </div>

          {/* Search & Filter Control Bar */}
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-6 relative">
              <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by expo title, city, industry, or #tag..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Event Statuses</option>
                <option value="published">Published (Upcoming)</option>
                <option value="ongoing">Live / Ongoing Now</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="date">Sort by: Soonest Date</option>
                <option value="booths">Sort by: Largest Floor Plan</option>
                <option value="title">Sort by: Title (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Industry Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-semibold text-slate-600">
            Showing <span className="font-extrabold text-slate-900">{filteredExpos.length}</span>{' '}
            {filteredExpos.length === 1 ? 'expo' : 'expos'}
            {category !== 'All' && ` in ${category}`}
          </p>

          {(search || category !== 'All' || statusFilter !== 'all') && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <RotateCcw size={13} /> Reset Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-24 flex justify-center">
            <LoadingSpinner text="Loading global trade shows..." />
          </div>
        ) : filteredExpos.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No matching expos found"
            description="No trade shows match your current search or filter criteria."
            actionLabel="Reset All Filters"
            onAction={resetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredExpos.map((expo) => (
              <ExpoCard key={expo._id} expo={expo} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
