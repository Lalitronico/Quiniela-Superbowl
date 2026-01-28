export function adminAuth(req, res, next) {
  const apiKey = req.headers['x-api-key']
  const validApiKey = process.env.ADMIN_API_KEY

  if (!validApiKey) {
    console.warn('ADMIN_API_KEY not set in environment variables')
    return res.status(500).json({ message: 'Configuracion del servidor incorrecta' })
  }

  if (!apiKey) {
    return res.status(401).json({ message: 'API key requerida' })
  }

  if (apiKey !== validApiKey) {
    return res.status(403).json({ message: 'API key invalida' })
  }

  next()
}
