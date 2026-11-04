import React, { createContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../api/services'
import toast from 'react-hot-toast'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('eventsphere_token'))
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('eventsphere_token')
      if (storedToken) {
        try {
          const { data } = await authService.getMe()
          setUser(data.user || data)
        } catch {
          localStorage.removeItem('eventsphere_token')
          localStorage.removeItem('eventsphere_user')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }
    restoreSession()
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials)
    const { token: newToken, user: newUser } = data
    localStorage.setItem('eventsphere_token', newToken)
    localStorage.setItem('eventsphere_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  const register = useCallback(async (formData) => {
    const { data } = await authService.register(formData)
    const { token: newToken, user: newUser } = data
    localStorage.setItem('eventsphere_token', newToken)
    localStorage.setItem('eventsphere_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('eventsphere_token')
    localStorage.removeItem('eventsphere_user')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData }
      localStorage.setItem('eventsphere_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isExhibitor: user?.role === 'exhibitor',
    isAttendee: user?.role === 'attendee',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
