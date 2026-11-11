import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { User, Lock, Mail, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { authService } from '../api/services'
import { useAuth } from '../hooks/useAuth'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  // Profile Form
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  // Password Form
  const {
    register: regPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    watch: watchPass,
    formState: { errors: passErrors },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const newPass = watchPass('newPassword')

  const onProfileSubmit = async (data) => {
    setUpdatingProfile(true)
    try {
      const res = await authService.updateProfile(data)
      updateUser(res.data.user)
      toast.success('Profile details updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setUpdatingProfile(false)
    }
  }

  const onPassSubmit = async (data) => {
    setUpdatingPassword(true)
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success('Password changed successfully!')
      resetPass()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setUpdatingPassword(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Identity Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-1.5">
                <ShieldCheck size={12} /> Verified {user?.role} Account
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{user?.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl self-start sm:self-auto">
            <CheckCircle2 size={15} />
            <span>JWT &amp; Socket.io Authenticated</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Profile Form */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/90 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <User size={18} className="text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">Personal Information</h3>
              </div>

              <form
                id="profile-form"
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...regProfile('name', { required: 'Name is required' })}
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {profileErrors.name && (
                    <p className="text-xs text-rose-600 mt-1">{profileErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      {...regProfile('email', { required: 'Email is required' })}
                      className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  {profileErrors.email && (
                    <p className="text-xs text-rose-600 mt-1">{profileErrors.email.message}</p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 transition-all"
                  >
                    {updatingProfile && <Loader2 size={14} className="animate-spin" />}
                    Save Profile Details
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Lock size={18} className="text-blue-600" />
              <h3 className="text-base font-extrabold text-slate-900">Security &amp; Password</h3>
            </div>

            <form onSubmit={handlePassSubmit(onPassSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  {...regPass('currentPassword', { required: 'Current password is required' })}
                  placeholder="••••••••"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {passErrors.currentPassword && (
                  <p className="text-xs text-rose-600 mt-1">
                    {passErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...regPass('newPassword', {
                      required: 'New password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                    placeholder="••••••••"
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {passErrors.newPassword && (
                    <p className="text-xs text-rose-600 mt-1">{passErrors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...regPass('confirmPassword', {
                      required: 'Please confirm password',
                      validate: (val) => val === newPass || 'Passwords do not match',
                    })}
                    placeholder="••••••••"
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {passErrors.confirmPassword && (
                    <p className="text-xs text-rose-600 mt-1">
                      {passErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 transition-all"
                >
                  {updatingPassword && <Loader2 size={14} className="animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
