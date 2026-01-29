import { Router } from 'express'
import storage from '../services/fileStorageService.js'
import { validatePredictions } from '../middleware/validation.js'
import { strictRateLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// Super Bowl LX date - predictions lock at kickoff (Feb 8, 2026)
const SUPERBOWL_KICKOFF = new Date('2026-02-08T18:30:00-08:00')

// Server-side validation - this is the authoritative check
function isPredictionLocked() {
  const now = new Date()
  const locked = now >= SUPERBOWL_KICKOFF
  if (locked) {
    console.log(`[SECURITY] Prediction attempt blocked - kickoff passed. Server time: ${now.toISOString()}`)
  }
  return locked
}

// Validate prediction values match expected question IDs
const VALID_QUESTION_IDS = ['winner', 'score', 'mvp', 'first_td', 'total_points', 'halftime', 'coin_toss', 'first_score']

function validatePredictionContent(predictions) {
  if (!predictions || typeof predictions !== 'object') return false

  const keys = Object.keys(predictions)
  // Check all keys are valid question IDs
  for (const key of keys) {
    if (!VALID_QUESTION_IDS.includes(key)) {
      console.log(`[SECURITY] Invalid prediction key rejected: ${key}`)
      return false
    }
    // Check values are strings and not too long (prevent injection)
    if (typeof predictions[key] !== 'string' || predictions[key].length > 100) {
      console.log(`[SECURITY] Invalid prediction value rejected for key: ${key}`)
      return false
    }
  }
  return true
}

// Get predictions by user ID
router.get('/:userId', async (req, res) => {
  try {
    const data = await storage.getPredictionsByUserId(req.params.userId)

    if (!data) {
      return res.status(404).json({ message: 'No hay predicciones para este usuario' })
    }

    res.json(data)
  } catch (err) {
    console.error('Error getting predictions:', err)
    res.status(500).json({ message: 'Error obteniendo predicciones' })
  }
})

// Submit new predictions (rate limited)
router.post('/', strictRateLimiter, validatePredictions, async (req, res) => {
  try {
    // Server-side lock check (authoritative)
    if (isPredictionLocked()) {
      return res.status(403).json({ message: 'Las predicciones estan cerradas' })
    }

    const { userId, predictions } = req.body

    // Validate prediction content
    if (!validatePredictionContent(predictions)) {
      return res.status(400).json({ message: 'Formato de predicciones invalido' })
    }

    // Verify user exists (generic error to prevent enumeration)
    const participant = await storage.getParticipantById(userId)
    if (!participant) {
      return res.status(400).json({ message: 'Error al guardar predicciones' })
    }

    // Check if user already has predictions
    const existing = await storage.getPredictionsByUserId(userId)
    if (existing) {
      return res.status(400).json({ message: 'Ya tienes predicciones. Usa PUT para actualizar.' })
    }

    await storage.savePredictions(userId, predictions)

    console.log(`[INFO] Predictions saved for user: ${userId.slice(0, 8)}...`)
    res.status(201).json({ message: 'Predicciones guardadas' })
  } catch (err) {
    console.error('Error saving predictions:', err)
    res.status(500).json({ message: 'Error guardando predicciones' })
  }
})

// Update predictions (rate limited)
router.put('/:userId', strictRateLimiter, async (req, res) => {
  try {
    // Server-side lock check (authoritative)
    if (isPredictionLocked()) {
      return res.status(403).json({ message: 'Las predicciones estan cerradas' })
    }

    const { userId } = req.params
    const { predictions } = req.body

    // Validate prediction content
    if (!validatePredictionContent(predictions)) {
      return res.status(400).json({ message: 'Formato de predicciones invalido' })
    }

    // Verify user exists (generic error to prevent enumeration)
    const participant = await storage.getParticipantById(userId)
    if (!participant) {
      return res.status(400).json({ message: 'Error al actualizar predicciones' })
    }

    await storage.savePredictions(userId, predictions)

    console.log(`[INFO] Predictions updated for user: ${userId.slice(0, 8)}...`)
    res.json({ message: 'Predicciones actualizadas' })
  } catch (err) {
    console.error('Error updating predictions:', err)
    res.status(500).json({ message: 'Error actualizando predicciones' })
  }
})

export default router
