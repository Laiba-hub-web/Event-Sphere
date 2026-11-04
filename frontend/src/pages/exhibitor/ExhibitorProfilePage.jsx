import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Store, Loader2, Save } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { exhibitorService } from '../../api/services'

export default function ExhibitorProfilePage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const res = await exhibitorService.getProfile()
      const p = res.data?.profile
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
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const payload = {
        ...data,
        products: data.products ? data.products.split(',').map((p) => p.trim()) : [],
        services: data.services ? data.services.split(',').map((s) => s.trim()) : [],
      }
      await exhibitorService.updateProfile(payload)
      toast.success('Company profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex justify-center">
          <LoadingSpinner text="Loading company profile..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Showcase Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Maintain your official brand identity, showcased products, and contact channels.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Company Name</label>
              <input
                type="text"
                {...register('company', { required: 'Company name is required' })}
                placeholder="Tech Innovators Inc."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              {errors.company && (
                <p className="text-xs text-red-600 mt-0.5">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Company Bio</label>
              <textarea
                rows={4}
                {...register('description')}
                placeholder="Describe your organization, history, mission, and exhibits..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Products (comma-separated)</label>
                <input
                  type="text"
                  {...register('products')}
                  placeholder="Smart Hardware, IoT, AI Sensors"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Services (comma-separated)</label>
                <input
                  type="text"
                  {...register('services')}
                  placeholder="Custom Robotics, Consulting"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Website</label>
                <input
                  type="url"
                  {...register('website')}
                  placeholder="https://..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Contact Email</label>
                <input
                  type="email"
                  {...register('contactEmail')}
                  placeholder="info@company.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Phone</label>
                <input
                  type="text"
                  {...register('contactPhone')}
                  placeholder="+1 234 567 890"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow disabled:opacity-50"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save Company Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

