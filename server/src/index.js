import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

import participantsRouter from './routes/participants.js'
import predictionsRouter from './routes/predictions.js'
import questionsRouter from './routes/questions.js'
import leaderboardRouter from './routes/leaderboard.js'
import adminRouter from './routes/admin.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import { initWebSocket } from './websocket/leaderboardEvents.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
// Allow frontend origins (local dev + production Vercel URL)
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL // Set this in Railway to your Vercel URL
].filter(Boolean)

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(express.json())
app.use(rateLimiter)

// Routes
app.use('/api/participants', participantsRouter)
app.use('/api/predictions', predictionsRouter)
app.use('/api/questions', questionsRouter)
app.use('/api/leaderboard', leaderboardRouter)
app.use('/api/admin', adminRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Initialize WebSocket
initWebSocket(io)

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Error interno del servidor' })
})

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { io }
