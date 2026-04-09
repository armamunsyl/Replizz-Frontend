import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/**
 * Returns a stable socket.io socket instance.
 * The socket connects once and stays alive for the component lifetime.
 */
export function useSocket() {
  const socketRef = useRef(null)

  if (!socketRef.current) {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    })
  }

  useEffect(() => {
    const socket = socketRef.current
    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  return socketRef.current
}
