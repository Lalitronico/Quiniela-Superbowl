import rateLimit from 'express-rate-limit'

// General API rate limiter
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // 60 requests per 15 min (reduced from 100)
  message: {
    message: 'Demasiadas solicitudes, intenta de nuevo mas tarde'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/api/health'
})

// Strict rate limiter for sensitive endpoints (predictions, admin)
export const strictRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute (reduced from 10)
  message: {
    message: 'Demasiadas solicitudes, intenta de nuevo en un minuto'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Very strict limiter for registration (prevent spam)
export const registrationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 registrations per hour per IP
  message: {
    message: 'Demasiados intentos de registro, intenta de nuevo mas tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
})
