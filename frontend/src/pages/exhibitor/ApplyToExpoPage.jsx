import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { expoService, exhibitorService } from '../../api/services'

export default function ApplyToExpoPage() {
  const { expoId } = useParams()
  const navigate = useNavigate()
  const [expo, setExpo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company: '',
      description: '',
      products: '',
      services: '',
      website: '',
      contactEmail: '',
      contactPhone: '',
    },
  })

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expoId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [expoRes, profRes] = await Promise.all([
        expoService.getOne(expoId),
        exhibitorService.getProfile().catch(() => ({ data: { profile: null } })),
      ])
      setExpo(expoRes.data.expo)

      const p = profRes.data?.profile
      if (p) {
        reset({
          company: p.company || '',
          description: p.description || '',
          products: p.products ? p.products.join(', ') : '',
          services: p.services ? p.services.join(', ') : '',
          website: p.website || '',
          contactEmail: p.contactEmail || '',
          contactPhone: p.contactPhone || '',
        })
      }
    } catch (err) {
      toast.error('Failed to load application form')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const payload = {
        ...data,
        expoId,
        products: data.products ? data.products.split(',').map((p) => p.trim()) : [],
        services: data.services ? data.services.split(',').map((s) => s.trim()) : [],
      }
      await exhibitorService.apply(expoId, payload)
      toast.success('Exhibitor application submitted for organizer review!')
      navigate('/exhibitor/applications')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex justify-center">
          <LoadingSpinner text="Preparing exhibitor application..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/90">
          <div className="mb-6 pb-5 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-1">
              <Sparkles size={13} /> Official B2B Exhibitor Application
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Apply to Exhibit at {expo?.title}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your existing company profile has been pre-filled below. Once approved, you can reserve your booth on the 2D floor plan.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Company / Brand Name
              </label>
              <input
                type="text"
                {...register('company', { required: 'Company name is required' })}
                placeholder="e.g. Apex Quantum Solutions"
                className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.company && (
                <p className="text-xs text-rose-600 mt-1">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Executive Company Overview &amp; Booth Showcase Pitch
              </label>
              <textarea
                rows={4}
                {...register('description')}
                placeholder="Describe what hardware, software, or live demos your team will showcase..."
                className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Showcased Products (comma-separated)
                </label>
                <input
                  type="text"
                  {...register('products')}
                  placeholder="LiDAR-X9 Sensor, NeuralEdge Node"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  B2B Services (comma-separated)
                </label>
                <input
                  type="text"
                  {...register('services')}
                  placeholder="Enterprise Integration, Custom Robotics"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Official Website URL
                </label>
                <input
                  type="url"
                  {...register('website')}
                  placeholder="https://company.com"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  B2B Contact Email
                </label>
                <input
                  type="email"
                  {...register('contactEmail')}
                  placeholder="expo@company.com"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Contact Phone
                </label>
                <input
                  type="text"
                  {...register('contactPhone')}
                  placeholder="+1 (555) 000-0000"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={15} />
                )}
                Submit Official Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
