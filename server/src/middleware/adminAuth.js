import crypto from 'crypto'

// Constant-time string comparison to prevent timing attacks
function safeCompare(a, b) {
  if (!a || !b || a.length !== b.length) {
    // Still do a comparison to maintain constant time
    const dummy = 'x'.repeat(32)
    crypto.timingSafeEqual(Buffer.from(dummy), Buffer.from(dummy))
    return false
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export function adminAuth(req, res, next) {
  const apiKey = req.headers['x-api-key']
  const validApiKey = process.env.ADMIN_API_KEY

  if (!validApiKey || validApiKey.length < 20) {
    console.error('[SECURITY] ADMIN_API_KEY not set or too short in environment variables')
    return res.status(500).json({ message: 'Error de configuracion' })
  }

  if (!apiKey) {
    console.warn(`[SECURITY] Admin access attempt without API key from IP: ${req.ip}`)
    return res.status(401).json({ message: 'Autenticacion requerida' })
  }

  if (!safeCompare(apiKey, validApiKey)) {
    console.warn(`[SECURITY] Invalid admin API key attempt from IP: ${req.ip}`)
    return res.status(403).json({ message: 'Autenticacion fallida' })
  }

  // Log successful admin access
  console.log(`[ADMIN] Authenticated access from IP: ${req.ip} to ${req.method} ${req.path}`)

  next()
}
