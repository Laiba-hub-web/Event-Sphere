import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  Globe2,
  Lock,
  Mail,
  User,
  ArrowRight,
  Loader2,
  Store,
  Ticket,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'attendee',
    },
  })

  const selectedRole = watch('role')
  const password = watch('password')

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      })
      toast.success('Welcome to EventSphere! Your workspace is ready.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Brand Showcase Panel */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-slate-950 text-white overflow-hidden flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/95 to-purple-950/85" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <Globe2 size={24} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-none">
                Event<span className="text-primary-400">Sphere</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5 block">
                Global Trade Show OS
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-primary-300 text-xs font-semibold mb-6">
            <Sparkles size={13} className="text-amber-400" />
            <span>Instant Role-Based Onboarding</span>
          </div>
          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight mb-4">
            Join the World&apos;s Leading Expo & Convention Network.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Choose your account type to unlock tailored tools—from VIP attendee passes and personal session schedules to interactive B2B booth reservations.
          </p>

          <div className="space-y-3">
            {[
              'Instant QR Conference Pass generation for all registered expos',
              'Direct B2B messaging between attendees, exhibitors & organizers',
              'Live 2D floor plan booth booking & digital product catalogs',
              'Conflict-free keynote & workshop agenda builder',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 size={17} className="text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 border-t border-white/10 pt-6">
          © {new Date().getFullYear()} EventSphere Management Platform. All rights reserved.
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-lg">
          <div className="lg:hidden mb-6">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Globe2 size={22} />
              </div>
              <span className="text-xl font-black text-slate-900">
                Event<span className="text-primary-600">Sphere</span>
              </span>
            </Link>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Create your EventSphere account
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Already registered?{' '}
              <Link
                to="/login"
                className="font-bold text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-6 bg-white py-7 px-6 sm:px-8 shadow-sm border border-slate-200/90 rounded-2xl">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Role selector cards */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Select Your Portal Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex flex-col items-start p-3.5 border rounded-xl cursor-pointer transition-all ${
                      selectedRole === 'attendee'
                        ? 'border-primary-600 bg-primary-50/70 text-primary-900 ring-2 ring-primary-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      value="attendee"
                      {...register('role')}
                      className="sr-only"
                    />
                    <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mb-2">
                      <Ticket size={18} />
                    </div>
                    <span className="text-sm font-bold">VIP Attendee</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Get QR passes, bookmark keynotes & network
                    </span>
                  </label>

                  <label
                    className={`flex flex-col items-start p-3.5 border rounded-xl cursor-pointer transition-all ${
                      selectedRole === 'exhibitor'
                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      value="exhibitor"
                      {...register('role')}
                      className="sr-only"
                    />
                    <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                      <Store size={18} />
                    </div>
                    <span className="text-sm font-bold">Exhibitor Partner</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Reserve floor booths & showcase B2B products
                    </span>
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={17} />
                  </div>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Alex Morgan"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs font-medium text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={17} />
                  </div>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Invalid email address',
                      },
                    })}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="you@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs font-medium text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password & Confirm Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={17} />
                    </div>
                    <input
                      type="password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Min 6 characters',
                        },
                      })}
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={17} />
                    </div>
                    <input
                      type="password"
                      {...register('confirmPassword', {
                        required: 'Please confirm password',
                        validate: (value) => value === password || 'Passwords do not match',
                      })}
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md shadow-primary-600/20 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all mt-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Creating Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Continue</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
