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
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT BRANDING HERO (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-12 flex-col justify-between overflow-hidden">
        {/* Subtle decorative glowing background blurs */}
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
            <span>The Modern Standard for Global Trade Shows</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Seamless Event Management, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">from Floor to Stage</span>.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Join thousands of event organizers, exhibiting companies, and attendees who use EventSphere to orchestrate multi-day summits with zero friction.
          </p>

          {/* Feature Highlights Grid */}
          <div className="space-y-3 pt-2">
            {[
              {
                title: 'Interactive 2D Floor Plans',
                desc: 'Real-time booth reservation, dimensions, and tier pricing',
                icon: MapPin,
              },
              {
                title: 'Multi-Track Speaker Schedules',
                desc: 'Room capacities, track bookmarks, and automated reminders',
                icon: Calendar,
              },
              {
                title: 'Direct B2B Exhibitor Messaging',
                desc: 'Inquiries, booth appointments, and real-time networking',
                icon: Store,
              },
            ].map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={i}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{f.title}</p>
                    <p className="text-[11px] text-slate-400">{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Social Proof / Trust */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" /> Enterprise-grade 256-bit SSL Security
          </span>
          <span>&copy; 2026 EventSphere Inc.</span>
        </div>
      </div>

      {/* RIGHT AUTH FORM PANE */}
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
              Create your account
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign in here &rarr;
              </Link>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                I am joining as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('role', 'attendee')}
                  className={`flex flex-col items-start p-3.5 border rounded-2xl cursor-pointer text-left transition-all ${
                    selectedRole === 'attendee'
                      ? 'border-blue-600 bg-blue-50/70 text-slate-900 shadow-2xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                      selectedRole === 'attendee'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Ticket size={16} />
                  </div>
                  <span className="text-sm font-bold block">Expo Attendee</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight">
                    Browse sessions, print badges &amp; connect
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('role', 'exhibitor')}
                  className={`flex flex-col items-start p-3.5 border rounded-2xl cursor-pointer text-left transition-all ${
                    selectedRole === 'exhibitor'
                      ? 'border-emerald-600 bg-emerald-50/70 text-slate-900 shadow-2xs ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                      selectedRole === 'exhibitor'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Store size={16} />
                  </div>
                  <span className="text-sm font-bold block">Exhibitor Partner</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight">
                    Book booth spaces &amp; showcase products
                  </span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  {...register('name', { required: 'Full name is required' })}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Alex Morgan"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-rose-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
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
                      message: 'Please enter a valid email address',
                    },
                  })}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-rose-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'At least 6 characters' },
                    })}
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm password',
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                    className="block w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
              <span>By signing up, you agree to our Terms of Service &amp; Privacy Policy.</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer mt-3"
            >
              {submitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
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
