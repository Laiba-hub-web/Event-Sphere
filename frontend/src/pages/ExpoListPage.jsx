import React, { useState, useEffect } from 'react'
import { Search, Filter, Calendar } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import ExpoCard from '../components/cards/ExpoCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import { expoService } from '../api/services'

export default function ExpoListPage() {
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')

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

  const filteredExpos = expos.filter((expo) => {
    const matchesSearch =
      expo.title?.toLowerCase().includes(search.toLowerCase()) ||
      expo.location?.toLowerCase().includes(search.toLowerCase()) ||
      expo.theme?.toLowerCase().includes(search.toLowerCase())

    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Trade Shows & Expos
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Browse world-class conventions, industrial expos, and technological exhibitions
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, city, or theme..."
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-primary-500 focus:border-primary-500 shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner text="Loading events..." />
          </div>
        ) : filteredExpos.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No expos found"
            description={
              search
                ? `No events match "${search}". Try another search term.`
                : 'There are currently no published expos available.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExpos.map((expo) => (
              <ExpoCard key={expo._id} expo={expo} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

