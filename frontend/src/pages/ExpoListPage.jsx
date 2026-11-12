import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  Calendar,
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

      {/* Clean Light Header */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Upcoming Events &amp; Exhibitions
              </h1>
              <p className="text-slate-500 text-sm sm:text-base mt-1">
                Browse events, view schedules and floor plans, or register to attend.
              </p>
            </div>
            <div className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl self-start md:self-auto">
              {expos.length} Events Available
            </div>
          </div>

          {/* Search & Filter Control Bar */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-6 relative">
              <Search size={17} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by event name, city, or topic..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="published">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="date">Sort by: Date</option>
                <option value="booths">Sort by: Hall Size</option>
                <option value="title">Sort by: Name (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredExpos.length}</span>{' '}
            {filteredExpos.length === 1 ? 'event' : 'events'}
            {category !== 'All' && ` in ${category}`}
          </p>

          {(search || category !== 'All' || statusFilter !== 'all') && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <RotateCcw size={13} /> Reset Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner text="Loading events..." />
          </div>
        ) : filteredExpos.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No events found"
            description="No events match your current search or filter criteria."
            actionLabel="Reset Filters"
            onAction={resetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
