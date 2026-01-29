import { Router } from 'express'
import db from '../services/databaseService.js'
import scoring from '../services/scoringService.js'
import { brandAdminAuth } from '../middleware/adminAuth.js'
import { validateResults } from '../middleware/validation.js'
import { emitLeaderboardUpdate } from '../websocket/leaderboardEvents.js'
import { strictRateLimiter } from '../middleware/rateLimiter.js'

const router = Router({ mergeParams: true })

// Audit logging for admin actions
function logAdminAction(action, ip, brand, details = {}) {
  console.log(`[ADMIN AUDIT] ${new Date().toISOString()} | ${action} | Brand: ${brand} | IP: ${ip} | ${JSON.stringify(details)}`)
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
    const results = await db.getResults(req.brandId)
    res.json(results)
  } catch (err) {
    console.error('Error getting results:', err)
    res.status(500).json({ message: 'Error obteniendo resultados' })
  }
})

// Submit official results (protected + rate limited)
router.post('/results', strictRateLimiter, brandAdminAuth, validateResults, async (req, res) => {
  try {
    const { results } = req.body

    logAdminAction('SUBMIT_RESULTS', req.ip, req.brand.slug, { questionsCount: Object.keys(results).length })

    await db.saveResults(req.brandId, results)

    res.json({ message: 'Resultados guardados', results })
  } catch (err) {
    console.error('Error saving results:', err)
    res.status(500).json({ message: 'Error guardando resultados' })
  }
})

// Calculate all scores (protected + rate limited)
router.post('/calculate', strictRateLimiter, brandAdminAuth, async (req, res) => {
  try {
    logAdminAction('CALCULATE_SCORES', req.ip, req.brand.slug)

    const result = await scoring.calculateAllScores(req.brandId)

    // Emit updated leaderboard via WebSocket (brand-specific room)
    const leaderboard = await db.getLeaderboard(req.brandId)
    emitLeaderboardUpdate(req.brand.slug, leaderboard)

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
router.get('/predictions', strictRateLimiter, brandAdminAuth, async (req, res) => {
  try {
    logAdminAction('VIEW_PREDICTIONS', req.ip, req.brand.slug)

    const predictions = await db.getPredictions(req.brandId)
    const participants = await db.getParticipants(req.brandId)

    const combined = Object.entries(predictions).map(([participantId, data]) => {
      const participant = participants.find(p => p.id === participantId)
      return {
        participantId,
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
