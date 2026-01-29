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

/**
 * Legacy admin auth - validates against global ADMIN_API_KEY env var.
 * @deprecated Use brandAdminAuth for multi-tenant support
 */
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

/**
 * Brand-specific admin auth - validates against the brand's adminApiKey.
 * Requires brandContext middleware to be called first.
 */
export function brandAdminAuth(req, res, next) {
  const apiKey = req.headers['x-api-key']
  const brand = req.brand

  if (!brand) {
    console.error('[SECURITY] brandAdminAuth called without brand context')
    return res.status(500).json({ message: 'Error de configuracion' })
  }

  const validApiKey = brand.adminApiKey

  if (!validApiKey || validApiKey.length < 20) {
    console.error(`[SECURITY] Admin API key not set or too short for brand: ${brand.slug}`)
    return res.status(500).json({ message: 'Error de configuracion' })
  }

  if (!apiKey) {
    console.warn(`[SECURITY] Admin access attempt without API key from IP: ${req.ip} for brand: ${brand.slug}`)
    return res.status(401).json({ message: 'Autenticacion requerida' })
  }

  if (!safeCompare(apiKey, validApiKey)) {
    console.warn(`[SECURITY] Invalid admin API key attempt from IP: ${req.ip} for brand: ${brand.slug}`)
    return res.status(403).json({ message: 'Autenticacion fallida' })
  }

  // Log successful admin access
  console.log(`[ADMIN] Authenticated access from IP: ${req.ip} for brand: ${brand.slug} to ${req.method} ${req.path}`)

  next()
}
