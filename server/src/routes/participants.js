import { Router } from 'express'
import db from '../services/databaseService.js'
import { validateParticipant } from '../middleware/validation.js'
import { registrationRateLimiter, strictRateLimiter } from '../middleware/rateLimiter.js'

const router = Router({ mergeParams: true })

// Get all participants (limited info, rate limited)
router.get('/', strictRateLimiter, async (req, res) => {
  try {
    const participants = await db.getParticipants(req.brandId)
    // Only return public info (no emails)
    res.json(participants.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: p.score || 0,
      createdAt: p.createdAt
    })))
  } catch (err) {
    console.error('Error getting participants:', err)
    res.status(500).json({ message: 'Error obteniendo participantes' })
  }
})

// Get participant by ID (own profile only)
router.get('/:id', async (req, res) => {
  try {
    const participant = await db.getParticipantById(req.brandId, req.params.id)

    if (!participant) {
      // Generic error to prevent ID enumeration
      return res.status(400).json({ message: 'Error obteniendo participante' })
    }

    res.json({
      id: participant.id,
      name: participant.name,
      email: participant.email,
      avatar: participant.avatar,
      score: participant.score || 0,
      correctPredictions: participant.correctPredictions || 0,
      categoryScores: participant.categoryScores || {},
      createdAt: participant.createdAt
    })
  } catch (err) {
    console.error('Error getting participant:', err)
    res.status(500).json({ message: 'Error obteniendo participante' })
  }
})

// Register new participant (rate limited to prevent spam)
router.post('/', registrationRateLimiter, validateParticipant, async (req, res) => {
  try {
    const { name, email, avatar } = req.body

    // Check if email already exists for this brand
    const existing = await db.getParticipantByEmail(req.brandId, email)
    if (existing) {
      // Return existing user ID so they can continue (no enumeration risk since we return it)
      console.log(`[INFO] Existing user login: ${email} for brand: ${req.brand.slug}`)
      return res.status(200).json({
        id: existing.id,
        name: existing.name,
        email: existing.email,
        avatar: existing.avatar,
        score: existing.score || 0,
        message: 'Bienvenido de vuelta'
      })
    }

    const participant = await db.saveParticipant(req.brandId, {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar: avatar || '🏈',
      score: 0,
      correctPredictions: 0,
      categoryScores: {},
    })

    console.log(`[INFO] New participant registered: ${participant.id.slice(0, 8)}... for brand: ${req.brand.slug}`)
    res.status(201).json(participant)
  } catch (err) {
    console.error('Error creating participant:', err)
    res.status(500).json({ message: 'Error registrando participante' })
  }
})

export default router
