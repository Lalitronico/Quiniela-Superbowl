import { Router } from 'express'
import db from '../services/databaseService.js'
import { validatePredictions } from '../middleware/validation.js'
import { strictRateLimiter } from '../middleware/rateLimiter.js'
import { arePredictionsLocked } from '../middleware/brandContext.js'

const router = Router({ mergeParams: true })

// Fallback Super Bowl LX date - used if brand doesn't have specific lock time
const SUPERBOWL_KICKOFF = new Date('2026-02-08T18:30:00-08:00')

// Server-side validation - checks brand-specific lock or fallback to Super Bowl date
function isPredictionLocked(brand) {
  // Use brand-specific lock time if available
  if (brand && arePredictionsLocked(brand)) {
    console.log(`[SECURITY] Prediction attempt blocked - brand lock passed. Brand: ${brand.slug}`)
    return true
  }

  // Fallback to Super Bowl kickoff
  const now = new Date()
  const locked = now >= SUPERBOWL_KICKOFF
  if (locked) {
    console.log(`[SECURITY] Prediction attempt blocked - kickoff passed. Server time: ${now.toISOString()}`)
  }
  return locked
}

// Get valid question IDs from database
async function getValidQuestionIds() {
  const questions = await db.getQuestions()
  return questions.map(q => q.id)
}

// Validate prediction values match expected question IDs
async function validatePredictionContent(predictions) {
  if (!predictions || typeof predictions !== 'object') return false

  const validIds = await getValidQuestionIds()
  const keys = Object.keys(predictions)

  // Check all keys are valid question IDs
  for (const key of keys) {
    if (!validIds.includes(key)) {
      console.log(`[SECURITY] Invalid prediction key rejected: ${key}`)
      return false
    }
    // Check values are not too long (prevent injection)
    // Allow strings and objects (for score type)
    const value = predictions[key]
    if (typeof value === 'string') {
      if (value.length > 100) {
        console.log(`[SECURITY] Invalid prediction value rejected for key: ${key}`)
        return false
      }
    } else if (typeof value === 'object' && value !== null) {
      // Score type: { team1: "24", team2: "21" }
      const json = JSON.stringify(value)
      if (json.length > 200) {
        console.log(`[SECURITY] Invalid prediction object rejected for key: ${key}`)
        return false
      }
    } else {
      console.log(`[SECURITY] Invalid prediction type rejected for key: ${key}`)
      return false
    }
  }
  return true
}

// Get predictions by user ID
router.get('/:userId', async (req, res) => {
  try {
    const data = await db.getPredictionsByUserId(req.brandId, req.params.userId)

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
    if (isPredictionLocked(req.brand)) {
      return res.status(403).json({ message: 'Las predicciones estan cerradas' })
    }

    const { userId, predictions } = req.body

    // Validate prediction content
    if (!(await validatePredictionContent(predictions))) {
      return res.status(400).json({ message: 'Formato de predicciones invalido' })
    }

    // Verify user exists for this brand (generic error to prevent enumeration)
    const participant = await db.getParticipantById(req.brandId, userId)
    if (!participant) {
      return res.status(400).json({ message: 'Error al guardar predicciones' })
    }

    // Check if user already has predictions
    const existing = await db.getPredictionsByUserId(req.brandId, userId)
    if (existing) {
      return res.status(400).json({ message: 'Ya tienes predicciones. Usa PUT para actualizar.' })
    }

    await db.savePredictions(req.brandId, userId, predictions)

    console.log(`[INFO] Predictions saved for user: ${userId.slice(0, 8)}... brand: ${req.brand.slug}`)
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
    if (isPredictionLocked(req.brand)) {
      return res.status(403).json({ message: 'Las predicciones estan cerradas' })
    }

    const { userId } = req.params
    const { predictions } = req.body

    // Validate prediction content
    if (!(await validatePredictionContent(predictions))) {
      return res.status(400).json({ message: 'Formato de predicciones invalido' })
    }

    // Verify user exists for this brand (generic error to prevent enumeration)
    const participant = await db.getParticipantById(req.brandId, userId)
    if (!participant) {
      return res.status(400).json({ message: 'Error al actualizar predicciones' })
    }

    await db.savePredictions(req.brandId, userId, predictions)

    console.log(`[INFO] Predictions updated for user: ${userId.slice(0, 8)}... brand: ${req.brand.slug}`)
    res.json({ message: 'Predicciones actualizadas' })
  } catch (err) {
    console.error('Error updating predictions:', err)
    res.status(500).json({ message: 'Error actualizando predicciones' })
  }
})

export default router
