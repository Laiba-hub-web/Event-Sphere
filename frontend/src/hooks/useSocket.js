import { useContext } from 'react'
import { SocketContext } from '../context/SocketContext'

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) return null
  return context.socket !== undefined ? context.socket : context
}
