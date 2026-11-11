import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Loader2, Sparkles, Grid, Image } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { expoService } from '../../api/services'

export default function CreateExpoPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      date: '',
      endDate: '',
      location: '',
      theme: 'Artificial Intelligence & Robotics',
      status: 'published',
      boothRows: 4,
      boothColumns: 6,
      bannerImage:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      tags: 'AI, Cloud, Robotics, Enterprise',
    },
  })

  const rows = Number(watch('boothRows') || 4)
  const cols = Number(watch('boothColumns') || 6)
  const totalUnits = rows * cols

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
      toast.success(`Expo created and ${totalUnits} floor booths synthesized!`)
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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Expo Portfolio
        </button>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/90">
          <div className="mb-6 pb-5 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-1">
              <Sparkles size={13} /> Event Synthesis Wizard
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Launch New Exhibition Event</h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure event parameters and automatically synthesize the interactive 2D booth floor plan.
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
                placeholder="e.g. Global Tech & AI Summit 2026"
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
                {errors.date && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{errors.date.message}</p>
                )}
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
                  placeholder="e.g. Moscone Center, Hall 4, San Francisco"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.location && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Industry Vertical / Theme
                </label>
                <input
                  type="text"
                  {...register('theme')}
                  placeholder="e.g. Artificial Intelligence, Biotech, Clean Energy"
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
                placeholder="Describe the keynote tracks, target B2B industries, and exhibition highlights..."
                className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Cover Banner URL */}
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

            {/* Automated 2D Floor Plan Configuration */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid size={18} className="text-blue-400" />
                  <h3 className="text-sm font-extrabold">
                    Automated 2D Floor Plan Grid Synthesis
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-extrabold">
                  {totalUnits} Booths ({rows} &times; {cols})
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Specify hall rows and columns. EventSphere will automatically generate numbered booths (A-1 through {String.fromCharCode(64 + Math.min(26, rows))}-{cols}) with tiered sizing.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Hall Rows (A, B, C...)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    {...register('boothRows')}
                    className="block w-full px-3.5 py-2 border border-slate-700 rounded-xl text-sm bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Units per Row (1, 2, 3...)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    {...register('boothColumns')}
                    className="block w-full px-3.5 py-2 border border-slate-700 rounded-xl text-sm bg-slate-800 text-white"
                  />
                </div>
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
                  <option value="published">Published (Live in Public Directory)</option>
                  <option value="ongoing">Ongoing (Live Now)</option>
                  <option value="draft">Draft (Internal Only)</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Search Tags (comma-separated)
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  placeholder="AI, Cloud, Robotics"
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
                Synthesize &amp; Launch Expo
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
