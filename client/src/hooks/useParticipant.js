import { useState, useEffect } from 'react'
import { getParticipant, registerParticipant } from '../services/api'

const STORAGE_KEY = 'sb_participant_id'

export default function useParticipant() {
  const [participant, setParticipant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadParticipant = async () => {
      const storedId = localStorage.getItem(STORAGE_KEY)

      if (storedId) {
        try {
          const response = await getParticipant(storedId)
          setParticipant(response.data)
        } catch (err) {
          localStorage.removeItem(STORAGE_KEY)
          console.error('Failed to load participant:', err)
        }
      }

      setLoading(false)
    }

    loadParticipant()
  }, [])

  const register = async (data) => {
    setLoading(true)
    setError(null)

    try {
      const response = await registerParticipant(data)
      const newParticipant = response.data

      localStorage.setItem(STORAGE_KEY, newParticipant.id)
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
    if (!participant?.id) return

    try {
      const response = await getParticipant(participant.id)
      setParticipant(response.data)
    } catch (err) {
      console.error('Failed to refresh participant:', err)
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
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
