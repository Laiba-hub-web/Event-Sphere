import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { User, Lock, Mail, ShieldCheck, Loader2 } from 'lucide-react'
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
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings & Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your personal profile, credentials, and role privileges.
          </p>
        </div>

        {/* User Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-2xl">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-primary-50 text-primary-700 border border-primary-200">
              {user?.role} Account
            </span>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Personal Information</h3>
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                {...regProfile('name', { required: 'Name is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              {profileErrors.name && (
                <p className="text-xs text-red-600 mt-0.5">{profileErrors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                {...regProfile('email', { required: 'Email is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              {profileErrors.email && (
                <p className="text-xs text-red-600 mt-0.5">{profileErrors.email.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updatingProfile}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
              >
                {updatingProfile && <Loader2 size={14} className="animate-spin" />}
                Save Details
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Security & Password</h3>
          <form onSubmit={handlePassSubmit(onPassSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Current Password</label>
              <input
                type="password"
                {...regPass('currentPassword', { required: 'Current password is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              {passErrors.currentPassword && (
                <p className="text-xs text-red-600 mt-0.5">{passErrors.currentPassword.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">New Password</label>
                <input
                  type="password"
                  {...regPass('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {passErrors.newPassword && (
                  <p className="text-xs text-red-600 mt-0.5">{passErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  {...regPass('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === newPass || 'Passwords do not match',
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {passErrors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-0.5">{passErrors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updatingPassword}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
              >
                {updatingPassword && <Loader2 size={14} className="animate-spin" />}
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

