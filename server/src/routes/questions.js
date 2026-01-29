import { Router } from 'express'
import db from '../services/databaseService.js'

const router = Router({ mergeParams: true })

// Get all questions (global, shared across all brands)
router.get('/', async (req, res) => {
  try {
    const questions = await db.getQuestions()

    if (!questions || questions.length === 0) {
      // Questions should be seeded during database setup
      console.warn('[WARN] No questions found in database. Run: npm run db:seed')
      return res.json([])
    }

    res.json(questions)
  } catch (err) {
    console.error('Error getting questions:', err)
    res.status(500).json({ message: 'Error obteniendo preguntas' })
  }
})

export default router
