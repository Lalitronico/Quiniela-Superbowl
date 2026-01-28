import { Router } from 'express'
import storage from '../services/fileStorageService.js'
import { validatePredictions } from '../middleware/validation.js'

const router = Router()

// Super Bowl date - predictions lock at kickoff
const SUPERBOWL_KICKOFF = new Date('2025-02-09T18:30:00-05:00')

function isPredictionLocked() {
  return new Date() >= SUPERBOWL_KICKOFF
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

// Submit new predictions
router.post('/', validatePredictions, async (req, res) => {
  try {
    if (isPredictionLocked()) {
      return res.status(403).json({ message: 'Las predicciones estan cerradas' })
    }

    const { userId, predictions } = req.body

    // Verify user exists
    const participant = await storage.getParticipantById(userId)
    if (!participant) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Check if user already has predictions
    const existing = await storage.getPredictionsByUserId(userId)
    if (existing) {
      return res.status(400).json({ message: 'Ya tienes predicciones. Usa PUT para actualizar.' })
    }

    await storage.savePredictions(userId, predictions)

    res.status(201).json({ message: 'Predicciones guardadas', predictions })
  } catch (err) {
    console.error('Error saving predictions:', err)
    res.status(500).json({ message: 'Error guardando predicciones' })
  }
})

// Update predictions
router.put('/:userId', async (req, res) => {
  try {
    if (isPredictionLocked()) {
      return res.status(403).json({ message: 'Las predicciones estan cerradas' })
    }

    const { userId } = req.params
    const { predictions } = req.body

    if (!predictions || typeof predictions !== 'object') {
      return res.status(400).json({ message: 'Predicciones invalidas' })
    }

    // Verify user exists
    const participant = await storage.getParticipantById(userId)
    if (!participant) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    await storage.savePredictions(userId, predictions)

    res.json({ message: 'Predicciones actualizadas', predictions })
  } catch (err) {
    console.error('Error updating predictions:', err)
    res.status(500).json({ message: 'Error actualizando predicciones' })
  }
})

export default router
