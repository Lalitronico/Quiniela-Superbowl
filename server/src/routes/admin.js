import { Router } from 'express'
import storage from '../services/fileStorageService.js'
import scoring from '../services/scoringService.js'
import { adminAuth } from '../middleware/adminAuth.js'
import { validateResults } from '../middleware/validation.js'
import { emitLeaderboardUpdate } from '../websocket/leaderboardEvents.js'

const router = Router()

// Get current results (public)
router.get('/results', async (req, res) => {
  try {
    const results = await storage.getResults()
    res.json(results)
  } catch (err) {
    console.error('Error getting results:', err)
    res.status(500).json({ message: 'Error obteniendo resultados' })
  }
})

// Submit official results (protected)
router.post('/results', adminAuth, validateResults, async (req, res) => {
  try {
    const { results } = req.body

    await storage.saveResults(results)

    res.json({ message: 'Resultados guardados', results })
  } catch (err) {
    console.error('Error saving results:', err)
    res.status(500).json({ message: 'Error guardando resultados' })
  }
})

// Calculate all scores (protected)
router.post('/calculate', adminAuth, async (req, res) => {
  try {
    const result = await scoring.calculateAllScores()

    // Emit updated leaderboard via WebSocket
    const leaderboard = await storage.getLeaderboard()
    emitLeaderboardUpdate(leaderboard)

    res.json({
      message: 'Puntuaciones calculadas',
      updated: result.updated
    })
  } catch (err) {
    console.error('Error calculating scores:', err)
    res.status(500).json({ message: 'Error calculando puntuaciones' })
  }
})

// Get all predictions (admin view)
router.get('/predictions', adminAuth, async (req, res) => {
  try {
    const predictions = await storage.getPredictions()
    const participants = await storage.getParticipants()

    const combined = Object.entries(predictions).map(([userId, data]) => {
      const participant = participants.find(p => p.id === userId)
      return {
        userId,
        name: participant?.name || 'Unknown',
        email: participant?.email || '',
        predictions: data.predictions,
        updatedAt: data.updatedAt
      }
    })

    res.json(combined)
  } catch (err) {
    console.error('Error getting all predictions:', err)
    res.status(500).json({ message: 'Error obteniendo predicciones' })
  }
})

export default router
