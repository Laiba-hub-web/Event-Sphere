import React, { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../hooks/useAuth'

export const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { token, user, isAuthenticated } = useAuth()
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
      return
    }

    const newSocket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })

    newSocket.on('connect', () => {
      if (user?._id) {
        newSocket.emit('joinRoom', user._id)
      }
    })

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, user?._id])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}
