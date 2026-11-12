import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Trash2,
  Edit3,
  Grid,
  Clock,
  Users,
  BarChart3,
  Search,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { expoService } from '../../api/services'

export default function AdminExpoList() {
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

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
      toast.error('Failed to load expos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      await expoService.delete(deleteId)
      toast.success('Expo deleted successfully')
      setDeleteId(null)
      fetchExpos()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete expo')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = expos.filter((e) => {
    const matchesSearch =
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase()) ||
      e.theme?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Executive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-1">
              <Sparkles size={13} /> Portfolio Management
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Manage Trade Shows &amp; Exhibitions
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage floor plans, speaker schedules, exhibitor approvals, and event reports.
            </p>
          </div>
          <Link
            to="/admin/expos/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all shrink-0 self-start sm:self-auto"
          >
            <Plus size={18} />
            Launch New Expo
          </Link>
        </div>

        {/* Search & Status Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search expos by title, industry theme, or venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['all', 'published', 'ongoing', 'draft'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner text="Loading exhibition portfolio..." />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Calendar size={38} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-900">No expos match your criteria</p>
              <p className="text-xs text-slate-500 mt-1">
                Try clearing your search or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50/90">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Exhibition Event
                    </th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Date &amp; Location
                    </th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Booth Grid
                    </th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-right text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Operations
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filtered.map((expo) => {
                    const totalBooths = (expo.boothRows || 4) * (expo.boothColumns || 6)
                    return (
                      <tr key={expo._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={
                                expo.bannerImage ||
                                expo.coverImage ||
                                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=80'
                              }
                              alt={expo.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <Link
                                to={`/expos/${expo._id}`}
                                className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                              >
                                {expo.title}
                              </Link>
                              <div className="text-xs text-slate-500 truncate mt-0.5">
                                {expo.theme || 'Industry Exhibition'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs font-bold text-slate-800">
                            {new Date(expo.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} className="text-slate-400" />
                            <span className="truncate max-w-[180px]">{expo.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                            <Grid size={12} className="text-blue-600" />
                            {totalBooths} Units
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              expo.status === 'published' || expo.status === 'ongoing'
                                ? 'success'
                                : 'neutral'
                            }
                            dot
                          >
                            {expo.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              to={`/admin/expos/${expo._id}/floor-plan`}
                              title="2D Floor Plan Studio"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Grid size={13} /> Booths
                            </Link>
                            <Link
                              to={`/admin/expos/${expo._id}/schedule`}
                              title="Keynote Schedule"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              <Clock size={13} /> Schedule
                            </Link>
                            <Link
                              to={`/admin/expos/${expo._id}/exhibitors`}
                              title="Exhibitor Applications"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                              <Users size={13} /> Partners
                            </Link>
                            <Link
                              to={`/admin/analytics/${expo._id}`}
                              title="Event Reports"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                            >
                              <BarChart3 size={13} /> Reports
                            </Link>
                            <Link
                              to={`/admin/expos/${expo._id}/edit`}
                              title="Edit Expo"
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Edit3 size={15} />
                            </Link>
                            <button
                              onClick={() => setDeleteId(expo._id)}
                              title="Delete Expo"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Expo Event?"
        message="Are you sure you want to permanently delete this expo? All allocated booths, sessions, and registrations will be removed."
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        variant="danger"
      />
    </DashboardLayout>
  )
}
