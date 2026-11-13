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
  Eye,
  EyeOff,
  Sparkles,
  UserCheck,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [activeRole, setActiveRole] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

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
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  const fillQuickLogin = (role) => {
    setActiveRole(role)
    if (role === 'admin') {
      setValue('email', 'admin@eventsphere.com')
      setValue('password', 'Admin123!')
    } else if (role === 'exhibitor') {
      setValue('email', 'exhibitor@techcorp.com')
      setValue('password', 'Exhibitor123!')
    } else {
      setValue('email', 'attendee@eventsphere.com')
      setValue('password', 'Attendee123!')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT BRANDING HERO (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-12 flex-col justify-between overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Globe2 size={24} />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block">
                EventSphere
              </span>
              <span className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider block">
                Enterprise Expo OS
              </span>
            </div>
          </Link>
        </div>

        {/* Center Hero Content */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-blue-200">
            <Sparkles size={13} className="text-blue-400" />
            <span>Welcome to EventSphere Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Manage, Exhibit &amp; Attend <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">World-Class Trade Shows</span>.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Sign in to access your customized dashboard, floor plan booth management, verified QR tickets, and live B2B networking.
          </p>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2.5">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Quick One-Click Test Accounts:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'admin', label: 'Organizer', icon: ShieldCheck, color: 'text-indigo-400' },
                { role: 'exhibitor', label: 'Exhibitor', icon: Store, color: 'text-emerald-400' },
                { role: 'attendee', label: 'Attendee', icon: Ticket, color: 'text-blue-400' },
              ].map((btn) => {
                const Icon = btn.icon
                return (
                  <button
                    key={btn.role}
                    type="button"
                    onClick={() => fillQuickLogin(btn.role)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeRole === btn.role
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                    }`}
                  >
                    <Icon size={14} className={btn.color} />
                    <span>{btn.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Security Trust */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" /> End-to-End Encrypted Session
          </span>
          <span>&copy; 2026 EventSphere Inc.</span>
        </div>
      </div>

      {/* RIGHT LOGIN FORM PANE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden text-center pb-2">
            <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-extrabold text-slate-900">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Globe2 size={22} />
              </div>
              <span>EventSphere</span>
            </Link>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign in to EventSphere
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              New here?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                Create a free account &rarr;
              </Link>
            </p>
          </div>

          {/* Quick Demo Fill Buttons on Mobile */}
          <div className="lg:hidden space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Fill Demo Login:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillQuickLogin('admin')}
                className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
              >
                Organizer
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('exhibitor')}
                className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
              >
                Exhibitor
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('attendee')}
                className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
              >
                Attendee
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Please enter a valid email',
                    },
                  })}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="you@company.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-rose-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="block w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer mt-3"
            >
              {submitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center">
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
              &larr; Back to EventSphere Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
