import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Loader2, Sparkles, Image } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { expoService } from '../../api/services'

export default function EditExpoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    loadExpo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadExpo = async () => {
    try {
      setLoading(true)
      const res = await expoService.getOne(id)
      const e = res.data.expo
      reset({
        title: e.title,
        description: e.description || '',
        date: e.date ? e.date.split('T')[0] : '',
        endDate: e.endDate ? e.endDate.split('T')[0] : '',
        location: e.location,
        theme: e.theme || '',
        bannerImage: e.bannerImage || '',
        status: e.status || 'published',
        tags: e.tags ? e.tags.join(', ') : '',
      })
    } catch (err) {
      toast.error('Failed to load expo details')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
      }
      await expoService.update(id, payload)
      toast.success('Expo details updated successfully')
      navigate('/admin/expos')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update expo')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex justify-center">
          <LoadingSpinner text="Loading expo configuration..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/admin/expos')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Expo Portfolio
        </button>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/90">
          <div className="mb-6 pb-5 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-1">
              <Sparkles size={13} /> Event Configuration
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Edit Exhibition Parameters</h1>
            <p className="text-sm text-slate-500 mt-1">
              Update event dates, venue location, cover imagery, or publication status.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Official Expo Title
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.title && (
                <p className="mt-1 text-xs font-medium text-rose-600">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Opening Date
                </label>
                <input
                  type="date"
                  {...register('date', { required: 'Start date is required' })}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Closing Date
                </label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Convention Venue &amp; City
                </label>
                <input
                  type="text"
                  {...register('location', { required: 'Location is required' })}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Industry Vertical / Theme
                </label>
                <input
                  type="text"
                  {...register('theme')}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Executive Overview &amp; Highlights
              </label>
              <textarea
                rows={4}
                {...register('description')}
                className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                HD Cover Banner Image URL
              </label>
              <div className="relative">
                <Image
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="url"
                  {...register('bannerImage')}
                  placeholder="https://images.unsplash.com/..."
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Publication Status
                </label>
                <select
                  {...register('status')}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                >
                  <option value="published">Published (Visible to All)</option>
                  <option value="ongoing">Ongoing (Live Now)</option>
                  <option value="draft">Draft (Private)</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Search Tags (comma-separated)
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/admin/expos')}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm disabled:opacity-50 transition-all"
              >
                {submitting && <Loader2 size={15} className="animate-spin" />}
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
