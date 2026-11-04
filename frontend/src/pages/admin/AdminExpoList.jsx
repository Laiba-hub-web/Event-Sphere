import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Edit3, Grid, Clock, Users, BarChart3, Search } from 'lucide-react'
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

  const filtered = expos.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Expos</h1>
            <p className="text-sm text-gray-500 mt-1">
              View, edit, configure floor plans, manage sessions, and review applications.
            </p>
          </div>
          <Link
            to="/admin/expos/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow transition-colors"
          >
            <Plus size={18} />
            Create Expo
          </Link>
        </div>

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expos by title or venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <span className="text-xs text-gray-500">Showing {filtered.length} expos</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner text="Loading events..." />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 px-4">
              <p className="text-sm font-medium text-gray-900">No expos match your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date & Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Management Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((expo) => (
                    <tr key={expo._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/expos/${expo._id}`}
                          className="font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {expo.title}
                        </Link>
                        <div className="text-xs text-gray-500">{expo.theme}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        <div>{new Date(expo.date).toLocaleDateString()}</div>
                        <div className="text-xs">{expo.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={expo.status === 'published' ? 'success' : 'neutral'}>
                          {expo.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <Link
                          to={`/admin/expos/${expo._id}/floor-plan`}
                          title="Floor Plan"
                          className="inline-flex p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded"
                        >
                          <Grid size={16} />
                        </Link>
                        <Link
                          to={`/admin/expos/${expo._id}/schedule`}
                          title="Schedule"
                          className="inline-flex p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded"
                        >
                          <Clock size={16} />
                        </Link>
                        <Link
                          to={`/admin/expos/${expo._id}/exhibitors`}
                          title="Exhibitor Applications"
                          className="inline-flex p-1.5 text-gray-500 hover:text-purple-600 hover:bg-gray-100 rounded"
                        >
                          <Users size={16} />
                        </Link>
                        <Link
                          to={`/admin/analytics/${expo._id}`}
                          title="Analytics"
                          className="inline-flex p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-gray-100 rounded"
                        >
                          <BarChart3 size={16} />
                        </Link>
                        <Link
                          to={`/admin/expos/${expo._id}/edit`}
                          title="Edit"
                          className="inline-flex p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(expo._id)}
                          title="Delete"
                          className="inline-flex p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
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

