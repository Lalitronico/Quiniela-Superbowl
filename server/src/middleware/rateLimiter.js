import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: {
    message: 'Demasiadas solicitudes, intenta de nuevo mas tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
})

export const strictRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    message: 'Demasiadas solicitudes, intenta de nuevo en un minuto'
  }
})
