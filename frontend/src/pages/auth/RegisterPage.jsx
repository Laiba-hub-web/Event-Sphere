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
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-extrabold text-slate-900">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Globe2 size={22} />
          </div>
          <span>EventSphere</span>
        </Link>
        <h2 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Create your account
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg space-y-5">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xs border border-slate-200 rounded-2xl">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Account Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Join EventSphere as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex flex-col items-start p-3.5 border rounded-xl cursor-pointer transition-all ${
                    selectedRole === 'attendee'
                      ? 'border-blue-600 bg-blue-50/60 text-slate-900 ring-2 ring-blue-500/15'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    value="attendee"
                    {...register('role')}
                    className="sr-only"
                  />
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5">
                    <Ticket size={17} />
                  </div>
                  <span className="text-sm font-bold">Attendee</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Attend events &amp; book sessions
                  </span>
                </label>

                <label
                  className={`flex flex-col items-start p-3.5 border rounded-xl cursor-pointer transition-all ${
                    selectedRole === 'exhibitor'
                      ? 'border-blue-600 bg-blue-50/60 text-slate-900 ring-2 ring-blue-500/15'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    value="exhibitor"
                    {...register('role')}
                    className="sr-only"
                  />
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5">
                    <Store size={17} />
                  </div>
                  <span className="text-sm font-bold">Exhibitor</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Book booths &amp; showcase products
                  </span>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={17} />
                </div>
                <input
                  type="text"
                  {...register('name', { required: 'Full name is required' })}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  placeholder="Alex Morgan"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-rose-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
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
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-rose-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                      minLength: { value: 6, message: 'At least 6 characters' },
                    })}
                    className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                    className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
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
