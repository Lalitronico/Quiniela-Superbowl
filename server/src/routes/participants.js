import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import storage from '../services/fileStorageService.js'
import { validateParticipant } from '../middleware/validation.js'

const router = Router()

// Get all participants
router.get('/', async (req, res) => {
  try {
    const participants = await storage.getParticipants()
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

// Get participant by ID
router.get('/:id', async (req, res) => {
  try {
    const participant = await storage.getParticipantById(req.params.id)

    if (!participant) {
      return res.status(404).json({ message: 'Participante no encontrado' })
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

// Register new participant
router.post('/', validateParticipant, async (req, res) => {
  try {
    const { name, email, avatar } = req.body

    // Check if email already exists
    const existing = await storage.getParticipantByEmail(email)
    if (existing) {
      return res.status(400).json({ message: 'Este email ya esta registrado' })
    }

    const participant = {
      id: uuidv4(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar: avatar || '🏈',
      score: 0,
      correctPredictions: 0,
      categoryScores: {},
      createdAt: new Date().toISOString()
    }

    await storage.saveParticipant(participant)

    res.status(201).json(participant)
  } catch (err) {
    console.error('Error creating participant:', err)
    res.status(500).json({ message: 'Error registrando participante' })
  }
})

export default router
