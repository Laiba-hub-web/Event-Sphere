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
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [activeRole, setActiveRole] = useState(null)

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-extrabold text-slate-900">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Globe2 size={22} />
          </div>
          <span>EventSphere</span>
        </Link>
        <h2 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Create an account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-5">
        {/* Main Sign In Card */}
        <div className="bg-white py-8 px-6 shadow-xs border border-slate-200 rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                      message: 'Please enter a valid email',
                    },
                  })}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-rose-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
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
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-rose-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
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

          {/* Quick Role Switcher */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400 text-center mb-3">
              Quick Sign-In Accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillQuickLogin('admin')}
                className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  activeRole === 'admin'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <ShieldCheck size={16} className="text-blue-600 mb-1" />
                <span className="text-xs font-semibold">Organizer</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickLogin('exhibitor')}
                className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  activeRole === 'exhibitor'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Store size={16} className="text-blue-600 mb-1" />
                <span className="text-xs font-semibold">Exhibitor</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickLogin('attendee')}
                className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  activeRole === 'attendee'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Ticket size={16} className="text-blue-600 mb-1" />
                <span className="text-xs font-semibold">Attendee</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs font-medium text-slate-500 hover:text-slate-800">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
