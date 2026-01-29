import { Router } from 'express'
import storage from '../services/fileStorageService.js'
import { strictRateLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// Get leaderboard (public, rate limited to prevent scraping)
router.get('/', strictRateLimiter, async (req, res) => {
  try {
    const leaderboard = await storage.getLeaderboard()
    // Only return necessary public info
    res.json(leaderboard.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: p.score || 0,
      correctPredictions: p.correctPredictions || 0
    })))
  } catch (err) {
    console.error('Error getting leaderboard:', err)
    res.status(500).json({ message: 'Error obteniendo tabla de posiciones' })
  }
})

export default router
