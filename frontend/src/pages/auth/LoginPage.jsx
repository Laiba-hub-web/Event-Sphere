import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  Globe2,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Store,
  Ticket,
  Sparkles,
  CheckCircle2,
  Map,
  QrCode,
  BarChart3,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [activeDemo, setActiveDemo] = useState(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await login(data)
      toast.success('Welcome back to EventSphere!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  const fillDemo = (role) => {
    setActiveDemo(role)
    if (role === 'admin') {
      setValue('email', 'admin@eventsphere.com')
      setValue('password', 'Admin123!')
      toast.success('Organizer / Admin demo credentials loaded')
    } else if (role === 'exhibitor') {
      setValue('email', 'exhibitor@techcorp.com')
      setValue('password', 'Exhibitor123!')
      toast.success('Exhibitor Partner demo credentials loaded')
    } else {
      setValue('email', 'attendee@eventsphere.com')
      setValue('password', 'Attendee123!')
      toast.success('VIP Attendee demo credentials loaded')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Brand Showcase Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 text-white overflow-hidden flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/95 to-primary-950/85" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <Globe2 size={24} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-none">
                Event<span className="text-primary-400">Sphere</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5 block">
                Enterprise Expo Cloud
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-primary-300 text-xs font-semibold mb-6">
            <Sparkles size={13} className="text-amber-400" />
            <span>Unified Multi-Portal Command Center</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">
            Run World-Class Expos, Booths & Keynote Stages in Real Time.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Sign in to access your role-specific workspace—whether you are orchestrating 100+ booth floor plans, showcasing B2B hardware, or printing your VIP QR conference badge.
          </p>

          <div className="space-y-3.5">
            {[
              {
                icon: Map,
                title: 'Interactive 2D Booth Floor Plan Engine',
                desc: 'Live grid telemetry with instant reservation & occupancy tracking.',
              },
              {
                icon: QrCode,
                title: 'Cryptographic VIP QR Passes & Session Bookmarking',
                desc: 'One-click expo check-in badges and conflict-aware keynote agendas.',
              },
              {
                icon: BarChart3,
                title: 'Executive Telemetry & CSV Reporting',
                desc: 'Real-time analytics across registrations, booth utilization, and sessions.',
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary-500/20 border border-primary-400/30 flex items-center justify-center text-primary-300 shrink-0 mt-0.5">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-6">
          <span>Trusted by 50+ International Trade Show Organizers</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Atlas Cloud Connected
          </span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-8">
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
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Don&apos;t have an EventSphere account yet?{' '}
              <Link
                to="/register"
                className="font-bold text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline"
              >
                Create a free account
              </Link>
            </p>
          </div>

          {/* 1-Click Fast Demo Account Selector */}
          <div className="mt-6 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                1-Click Demo Role Access
              </span>
              <span className="text-[11px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                Instant Auto-Fill
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all ${
                  activeDemo === 'admin'
                    ? 'border-rose-500 bg-rose-50/80 text-rose-900 shadow-sm ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-1.5">
                  <ShieldCheck size={17} />
                </div>
                <span className="text-xs font-bold">Admin</span>
                <span className="text-[10px] text-slate-500">Organizer</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('exhibitor')}
                className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all ${
                  activeDemo === 'exhibitor'
                    ? 'border-purple-500 bg-purple-50/80 text-purple-900 shadow-sm ring-2 ring-purple-500/20'
                    : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-1.5">
                  <Store size={17} />
                </div>
                <span className="text-xs font-bold">Exhibitor</span>
                <span className="text-[10px] text-slate-500">TechCorp</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('attendee')}
                className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all ${
                  activeDemo === 'attendee'
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5">
                  <Ticket size={17} />
                </div>
                <span className="text-xs font-bold">Attendee</span>
                <span className="text-[10px] text-slate-500">VIP Pass</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <div className="mt-6 bg-white py-7 px-6 shadow-sm border border-slate-200/90 rounded-2xl">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Work or Personal Email
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
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="you@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-primary-600 hover:text-primary-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={17} />
                  </div>
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md shadow-primary-600/20 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Authenticating Portal...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              &larr; Return to EventSphere Public Showcase
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
