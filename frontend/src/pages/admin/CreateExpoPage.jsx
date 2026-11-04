import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { expoService } from '../../api/services'

export default function CreateExpoPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      date: '',
      endDate: '',
      location: '',
      theme: 'Technology & Innovation',
      status: 'draft',
      boothRows: 4,
      boothColumns: 8,
      tags: 'Tech, AI, Robotics',
    },
  })

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const payload = {
        ...data,
        boothRows: Number(data.boothRows),
        boothColumns: Number(data.boothColumns),
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
      }
      await expoService.create(payload)
      toast.success('Expo created and booths auto-generated!')
      navigate('/admin/expos')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create expo')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/admin/expos')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Expos
        </button>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Expo</h1>
            <p className="text-sm text-gray-500 mt-1">
              Configure event parameters and automatically synthesize the booth layout grid.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Expo Title</label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                placeholder="e.g. Global Tech & Innovation Expo 2026"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Start Date</label>
                <input
                  type="date"
                  {...register('date', { required: 'Start date is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">End Date</label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Venue / Location</label>
                <input
                  type="text"
                  {...register('location', { required: 'Location is required' })}
                  placeholder="e.g. Silicon Convention Center, Hall 4"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Theme / Industry</label>
                <input
                  type="text"
                  {...register('theme')}
                  placeholder="e.g. Artificial Intelligence, Healthcare"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                rows={4}
                {...register('description')}
                placeholder="Comprehensive description of the event..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Booth Floor Plan Configuration */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-primary-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Automated Floor Plan Generation
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                Specify rows and columns. EventSphere will automatically generate all booth numbers
                (A-1, A-2... B-1...) upon creation.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600">Booth Rows</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    {...register('boothRows')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600">Booth Columns</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    {...register('boothColumns')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Status</label>
                <select
                  {...register('status')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="published">Published (Visible to All)</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Tags (comma-separated)</label>
                <input
                  type="text"
                  {...register('tags')}
                  placeholder="AI, Cloud, Robotics"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/admin/expos')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Create Expo Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

