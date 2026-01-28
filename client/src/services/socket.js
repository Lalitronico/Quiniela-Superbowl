import { io } from 'socket.io-client'

// Use environment variable for production, fallback to same origin for dev
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '/'

let socket = null

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    })

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })
  }

  return socket
}

export const getSocket = () => {
  if (!socket) {
    return initSocket()
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const subscribeToLeaderboard = (callback) => {
  const sock = getSocket()
  sock.on('leaderboard:update', callback)
  return () => sock.off('leaderboard:update', callback)
}

export const subscribeToResults = (callback) => {
  const sock = getSocket()
  sock.on('results:update', callback)
  return () => sock.off('results:update', callback)
}

export const subscribeToCorrectPrediction = (callback) => {
  const sock = getSocket()
  sock.on('prediction:correct', callback)
  return () => sock.off('prediction:correct', callback)
}
