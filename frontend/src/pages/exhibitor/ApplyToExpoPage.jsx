import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Store, Loader2, Sparkles } from 'lucide-react'
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
      toast.success('Exhibitor application submitted for review!')
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
          <LoadingSpinner text="Preparing application..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
              Exhibitor Application
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Apply to Exhibit</h1>
            <p className="text-sm text-gray-500">
              Event: <span className="font-semibold text-gray-800">{expo?.title}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Company / Organization Name</label>
              <input
                type="text"
                {...register('company', { required: 'Company name is required' })}
                placeholder="e.g. Apex Quantum Solutions"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              {errors.company && (
                <p className="text-xs text-red-600 mt-0.5">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Company Overview & Pitch</label>
              <textarea
                rows={3}
                {...register('description')}
                placeholder="Brief summary of what your company showcases at this trade show..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Products (comma-separated)</label>
                <input
                  type="text"
                  {...register('products')}
                  placeholder="Robotics, AI Core, Sensors"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Services (comma-separated)</label>
                <input
                  type="text"
                  {...register('services')}
                  placeholder="Consulting, Cloud Integration"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Website URL</label>
                <input
                  type="url"
                  {...register('website')}
                  placeholder="https://example.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Contact Email</label>
                <input
                  type="email"
                  {...register('contactEmail')}
                  placeholder="expo@company.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Contact Phone</label>
                <input
                  type="text"
                  {...register('contactPhone')}
                  placeholder="+1 (555) 000-0000"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow disabled:opacity-50"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
