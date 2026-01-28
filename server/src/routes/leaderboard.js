import { Router } from 'express'
import storage from '../services/fileStorageService.js'

const router = Router()

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const leaderboard = await storage.getLeaderboard()
    res.json(leaderboard)
  } catch (err) {
    console.error('Error getting leaderboard:', err)
    res.status(500).json({ message: 'Error obteniendo tabla de posiciones' })
  }
})

export default router
