import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { User, Lock, Loader2, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { authService } from '../api/services'
import { useAuth } from '../hooks/useAuth'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

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
      toast.success('Profile updated!')
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
        {/* Clean Light Header Card */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 capitalize mb-1">
                {user?.role === 'admin' ? 'Organizer' : user?.role} Account
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user?.name}</h1>
              <p className="text-xs sm:text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <CheckCircle2 size={14} />
            <span>Active Account</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Profile Form */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <User size={18} className="text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Personal Details</h3>
              </div>

              <form
                id="profile-form"
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...regProfile('name', { required: 'Name is required' })}
                    className="block w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                  {profileErrors.name && (
                    <p className="text-xs text-rose-600 mt-1">{profileErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...regProfile('email', {
                      required: 'Email is required',
                      pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                    })}
                    className="block w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                  {profileErrors.email && (
                    <p className="text-xs text-rose-600 mt-1">{profileErrors.email.message}</p>
                  )}
                </div>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                form="profile-form"
                disabled={updatingProfile}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
              >
                {updatingProfile && <Loader2 size={14} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Lock size={18} className="text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Change Password</h3>
              </div>

              <form
                id="pass-form"
                onSubmit={handlePassSubmit(onPassSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    {...regPass('currentPassword', { required: 'Current password is required' })}
                    className="block w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                  {passErrors.currentPassword && (
                    <p className="text-xs text-rose-600 mt-1">
                      {passErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...regPass('newPassword', {
                      required: 'New password is required',
                      minLength: { value: 6, message: 'At least 6 characters' },
                    })}
                    className="block w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                  {passErrors.newPassword && (
                    <p className="text-xs text-rose-600 mt-1">{passErrors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    {...regPass('confirmPassword', {
                      required: 'Please confirm password',
                      validate: (val) => val === newPass || 'Passwords do not match',
                    })}
                    className="block w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                  {passErrors.confirmPassword && (
                    <p className="text-xs text-rose-600 mt-1">
                      {passErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                form="pass-form"
                disabled={updatingPassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
              >
                {updatingPassword && <Loader2 size={14} className="animate-spin" />}
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
