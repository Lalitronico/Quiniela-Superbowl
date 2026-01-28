import { useState, useEffect, useCallback } from 'react'
import { getLeaderboard } from '../services/api'
import { subscribeToLeaderboard } from '../services/socket'

export default function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadLeaderboard = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getLeaderboard()
      setLeaderboard(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error cargando leaderboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLeaderboard()

    const unsubscribe = subscribeToLeaderboard((data) => {
      setLeaderboard(data)
    })

    return () => {
      unsubscribe()
    }
  }, [loadLeaderboard])

  return {
    leaderboard,
    loading,
    error,
    refresh: loadLeaderboard
  }
}
