import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

import brandRouter from './routes/brand.js'
import participantsRouter from './routes/participants.js'
import predictionsRouter from './routes/predictions.js'
import questionsRouter from './routes/questions.js'
import leaderboardRouter from './routes/leaderboard.js'
import adminRouter from './routes/admin.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import { brandContext } from './middleware/brandContext.js'
import { initWebSocket } from './websocket/leaderboardEvents.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)

// Allow frontend origins (local dev + production Vercel URL)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean)

// Validate FRONTEND_URL is set in production
if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
  console.error('WARNING: FRONTEND_URL not set in production environment')
}

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
})

// Security Middleware - Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// CORS with explicit configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('No permitido por CORS'), false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}))

// Body parser with size limits
app.use(express.json({ limit: '10kb' }))

// Rate limiting
app.use(rateLimiter)

// Health check (no brand required)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Questions are global (no brand required)
app.use('/api/questions', questionsRouter)

// Brand-scoped routes - all require :brand parameter
// The brandContext middleware validates and loads the brand
app.use('/api/:brand', brandContext, brandRouter)
app.use('/api/:brand/participants', brandContext, participantsRouter)
app.use('/api/:brand/predictions', brandContext, predictionsRouter)
app.use('/api/:brand/leaderboard', brandContext, leaderboardRouter)
app.use('/api/:brand/admin', brandContext, adminRouter)

// Initialize WebSocket
initWebSocket(io)

// Error handler - Don't leak error details in production
app.use((err, req, res, next) => {
  // Log error details server-side only
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })

  // Send generic error to client
  res.status(err.status || 500).json({
    message: 'Error interno del servidor'
  })
})

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Multi-tenant API ready at /api/:brand/*`)
})

export { io }
