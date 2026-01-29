import { useState, useEffect, useCallback } from 'react'
import { getLeaderboard } from '../services/api'
import { subscribeToLeaderboard, joinBrandRoom, leaveBrandRoom } from '../services/socket'
import { useBrand } from '../context/BrandContext'

export default function useLeaderboard() {
  const { brandSlug } = useBrand()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadLeaderboard = useCallback(async () => {
    if (!brandSlug) return

    setLoading(true)
    setError(null)

    try {
      const response = await getLeaderboard(brandSlug)
      setLeaderboard(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error cargando leaderboard')
    } finally {
      setLoading(false)
    }
  }, [brandSlug])

  useEffect(() => {
    if (!brandSlug) return

    loadLeaderboard()

    // Join the brand-specific WebSocket room
    joinBrandRoom(brandSlug)

    const unsubscribe = subscribeToLeaderboard((data) => {
      setLeaderboard(data)
    })

    return () => {
      unsubscribe()
      leaveBrandRoom()
    }
  }, [brandSlug, loadLeaderboard])

  return {
    leaderboard,
    loading,
    error,
    refresh: loadLeaderboard
  }
}
