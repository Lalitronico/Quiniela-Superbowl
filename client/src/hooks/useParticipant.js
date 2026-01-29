import { useState, useEffect, useCallback } from 'react'
import { getParticipant, registerParticipant } from '../services/api'
import { useBrand } from '../context/BrandContext'

// Generate brand-specific storage key
const getStorageKey = (brandSlug) => `sb_participant_${brandSlug}`

export default function useParticipant() {
  const { brandSlug } = useBrand()
  const [participant, setParticipant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const storageKey = getStorageKey(brandSlug)

  const loadParticipant = useCallback(async () => {
    if (!brandSlug) return

    const storedId = localStorage.getItem(storageKey)

    if (storedId) {
      try {
        const response = await getParticipant(brandSlug, storedId)
        setParticipant(response.data)
      } catch (err) {
        localStorage.removeItem(storageKey)
        console.error('Failed to load participant:', err)
      }
    }

    setLoading(false)
  }, [brandSlug, storageKey])

  useEffect(() => {
    loadParticipant()
  }, [loadParticipant])

  const register = async (data) => {
    setLoading(true)
    setError(null)

    try {
      const response = await registerParticipant(brandSlug, data)
      const newParticipant = response.data

      localStorage.setItem(storageKey, newParticipant.id)
      setParticipant(newParticipant)

      return newParticipant
    } catch (err) {
      const message = err.response?.data?.message || 'Error al registrarse'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    if (!participant?.id || !brandSlug) return

    try {
      const response = await getParticipant(brandSlug, participant.id)
      setParticipant(response.data)
    } catch (err) {
      console.error('Failed to refresh participant:', err)
    }
  }

  const logout = () => {
    localStorage.removeItem(storageKey)
    setParticipant(null)
  }

  return {
    participant,
    loading,
    error,
    register,
    refresh,
    logout,
    isRegistered: !!participant
  }
}
