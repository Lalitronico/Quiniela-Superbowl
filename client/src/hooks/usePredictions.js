import { useState, useEffect, useCallback } from 'react'
import { getQuestions, getPredictions, submitPredictions, updatePredictions } from '../services/api'

export default function usePredictions(userId) {
  const [questions, setQuestions] = useState([])
  const [predictions, setPredictions] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const questionsResponse = await getQuestions()
      setQuestions(questionsResponse.data)

      if (userId) {
        try {
          const predictionsResponse = await getPredictions(userId)
          setPredictions(predictionsResponse.data.predictions || {})
        } catch (err) {
          if (err.response?.status !== 404) {
            throw err
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error cargando datos')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const savePredictions = async (newPredictions) => {
    if (!userId) {
      setError('Debes registrarte primero')
      return false
    }

    setSaving(true)
    setError(null)

    try {
      if (Object.keys(predictions).length === 0) {
        await submitPredictions(userId, newPredictions)
      } else {
        await updatePredictions(userId, newPredictions)
      }

      setPredictions(newPredictions)
      return true
    } catch (err) {
      const message = err.response?.data?.message || 'Error guardando predicciones'
      setError(message)
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    questions,
    predictions,
    loading,
    saving,
    error,
    savePredictions,
    refresh: loadData
  }
}
