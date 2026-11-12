import React, { createContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../api/services'
import { clearClientCache } from '../api/axios'
import toast from 'react-hot-toast'

export const AuthContext = createContext(null)

const getInitialUser = () => {
  try {
    const raw = localStorage.getItem('eventsphere_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser)
  const [token, setToken] = useState(() => localStorage.getItem('eventsphere_token'))
  const [loading, setLoading] = useState(() => {
    const hasToken = !!localStorage.getItem('eventsphere_token')
    const hasUser = !!getInitialUser()
    return hasToken && !hasUser
  })

  // Verify session in the background without blocking initial render
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('eventsphere_token')
      if (storedToken) {
        try {
          const { data } = await authService.getMe()
          const freshUser = data.user || data
          setUser(freshUser)
          localStorage.setItem('eventsphere_user', JSON.stringify(freshUser))
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
    clearClientCache()
    const { data } = await authService.login(credentials)
    const { token: newToken, user: newUser } = data
    localStorage.setItem('eventsphere_token', newToken)
    localStorage.setItem('eventsphere_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  const register = useCallback(async (formData) => {
    clearClientCache()
    const { data } = await authService.register(formData)
    const { token: newToken, user: newUser } = data
    localStorage.setItem('eventsphere_token', newToken)
    localStorage.setItem('eventsphere_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    clearClientCache()
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
