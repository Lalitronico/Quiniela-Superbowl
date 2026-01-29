import { Router } from 'express'
import storage from '../services/fileStorageService.js'
import scoring from '../services/scoringService.js'
import { adminAuth } from '../middleware/adminAuth.js'
import { validateResults } from '../middleware/validation.js'
import { emitLeaderboardUpdate } from '../websocket/leaderboardEvents.js'
import { strictRateLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// Audit logging for admin actions
function logAdminAction(action, ip, details = {}) {
  console.log(`[ADMIN AUDIT] ${new Date().toISOString()} | ${action} | IP: ${ip} | ${JSON.stringify(details)}`)
}

// Mask email for privacy (show only first 2 chars and domain)
function maskEmail(email) {
  if (!email || !email.includes('@')) return '***@***.***'
  const [user, domain] = email.split('@')
  const maskedUser = user.slice(0, 2) + '***'
  return `${maskedUser}@${domain}`
}

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

// Submit official results (protected + rate limited)
router.post('/results', strictRateLimiter, adminAuth, validateResults, async (req, res) => {
  try {
    const { results } = req.body

    logAdminAction('SUBMIT_RESULTS', req.ip, { questionsCount: Object.keys(results).length })

    await storage.saveResults(results)

    res.json({ message: 'Resultados guardados', results })
  } catch (err) {
    console.error('Error saving results:', err)
    res.status(500).json({ message: 'Error guardando resultados' })
  }
})

// Calculate all scores (protected + rate limited)
router.post('/calculate', strictRateLimiter, adminAuth, async (req, res) => {
  try {
    logAdminAction('CALCULATE_SCORES', req.ip)

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

// Get all predictions (admin view - emails masked)
router.get('/predictions', strictRateLimiter, adminAuth, async (req, res) => {
  try {
    logAdminAction('VIEW_PREDICTIONS', req.ip)

    const predictions = await storage.getPredictions()
    const participants = await storage.getParticipants()

    const combined = Object.entries(predictions).map(([userId, data]) => {
      const participant = participants.find(p => p.id === userId)
      return {
        userId,
        name: participant?.name || 'Unknown',
        email: maskEmail(participant?.email), // Masked for privacy
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
