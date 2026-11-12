import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Store, Loader2, Save, Globe, Mail, Phone, Sparkles } from 'lucide-react'
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
    watch,
    formState: { errors },
  } = useForm()

  const watchedCompany = watch('company')
  const watchedDesc = watch('description')
  const watchedProducts = watch('products')

  useEffect(() => {
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      toast.success('Company showcase profile updated!')
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
          <LoadingSpinner text="Loading company showcase profile..." />
        </div>
      </DashboardLayout>
    )
  }

  const previewProducts = watchedProducts
    ? watchedProducts
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
    : []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-1">
            <Sparkles size={13} /> Digital Exhibitor Identity
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Company Showcase &amp; Product Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Maintain your official brand identity, hardware/software catalog, and B2B contact channels across all expos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Column */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/90">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Official Company Name
                </label>
                <input
                  type="text"
                  {...register('company', { required: 'Company name is required' })}
                  placeholder="TechCorp Autonomous Systems"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.company && (
                  <p className="text-xs text-rose-600 mt-1">{errors.company.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Company Bio &amp; Exhibition Pitch
                </label>
                <textarea
                  rows={4}
                  {...register('description')}
                  placeholder="Describe your organization, flagship innovations, and booth showcase..."
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Products (comma-separated)
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
                    Services (comma-separated)
                  </label>
                  <input
                    type="text"
                    {...register('services')}
                    placeholder="Autonomous Consulting, Edge Calibration"
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="url"
                    {...register('website')}
                    placeholder="https://..."
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    {...register('contactEmail')}
                    placeholder="info@company.com"
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    {...register('contactPhone')}
                    placeholder="+1 (415) 555-0199"
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm disabled:opacity-50 transition-all"
                >
                  {submitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  Save Showcase Profile
                </button>
              </div>
            </form>
          </div>

          {/* Live Directory Card Preview */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-4 flex items-end">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300">
                Live Public Directory Preview
              </span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                  {watchedCompany ? watchedCompany[0].toUpperCase() : <Store size={20} />}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-base text-slate-900 truncate">
                    {watchedCompany || 'Your Company Name'}
                  </h3>
                  <span className="text-xs text-emerald-600 font-bold">
                    Verified Exhibitor Partner
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                {watchedDesc ||
                  'Your company description and showcased products will appear here in the public Expo Directory.'}
              </p>

              {previewProducts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  {previewProducts.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
