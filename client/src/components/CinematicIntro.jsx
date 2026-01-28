import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TOTAL_FRAMES = 192
const FRAME_DURATION = 28 // ~36fps - faster playback
const FALLBACK_FRAME = '/animation/frame_095_delay-0.042s.jpg'

// Generate frame paths
const getFramePath = (index) => {
  const paddedIndex = String(index).padStart(3, '0')
  const delay = index % 2 === 0 ? '0.042s' : '0.041s'
  return `/animation/frame_${paddedIndex}_delay-${delay}.jpg`
}

export default function CinematicIntro({ onComplete }) {
  const canvasRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const framesRef = useRef([])
  const animationRef = useRef(null)

  // Preload all frames
  const preloadFrames = useCallback(async () => {
    const frames = []
    let loadedCount = 0

    const loadFrame = (index) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          loadedCount++
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100))
          resolve(img)
        }
        img.onerror = () => {
          // Try to continue even if some frames fail
          loadedCount++
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100))
          resolve(null)
        }
        img.src = getFramePath(index)
      })
    }

    try {
      // Load frames in batches for better performance
      const batchSize = 20
      for (let i = 0; i < TOTAL_FRAMES; i += batchSize) {
        const batch = []
        for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
          batch.push(loadFrame(j))
        }
        const batchResults = await Promise.all(batch)
        frames.push(...batchResults)
      }

      // Check if we have enough frames
      const validFrames = frames.filter(f => f !== null)
      if (validFrames.length < TOTAL_FRAMES * 0.5) {
        throw new Error('Not enough frames loaded')
      }

      framesRef.current = frames
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to load animation:', error)
      setLoadError(true)
      setIsLoading(false)
    }
  }, [])

  // Play animation on canvas
  const playAnimation = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || framesRef.current.length === 0) return

    const ctx = canvas.getContext('2d')
    let frameIndex = 0
    let lastTime = 0

    const animate = (currentTime) => {
      if (!lastTime) lastTime = currentTime
      const deltaTime = currentTime - lastTime

      if (deltaTime >= FRAME_DURATION) {
        const frame = framesRef.current[frameIndex]

        if (frame) {
          // Clear and draw frame
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // Calculate scaling to cover canvas while maintaining aspect ratio
          const scale = Math.max(
            canvas.width / frame.width,
            canvas.height / frame.height
          )
          // Offset X para centrar el balón visualmente (mover 10% a la izquierda)
          const x = (canvas.width - frame.width * scale) / 2 - (canvas.width * 0.1)
          const y = (canvas.height - frame.height * scale) / 2

          ctx.drawImage(frame, x, y, frame.width * scale, frame.height * scale)
        }

        frameIndex++
        lastTime = currentTime

        if (frameIndex >= TOTAL_FRAMES) {
          // Animation complete
          setAnimationComplete(true)
          if (onComplete) onComplete()
          return
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [onComplete])

  // Handle canvas resize
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
  }, [])

  // Initialize
  useEffect(() => {
    preloadFrames()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [preloadFrames])

  // Start animation when loading complete
  useEffect(() => {
    if (!isLoading && !loadError) {
      resizeCanvas()
      window.addEventListener('resize', resizeCanvas)

      // Small delay before starting animation
      const startDelay = setTimeout(() => {
        playAnimation()
      }, 300)

      return () => {
        window.removeEventListener('resize', resizeCanvas)
        clearTimeout(startDelay)
      }
    }
  }, [isLoading, loadError, resizeCanvas, playAnimation])

  // Skip animation handler
  const handleSkip = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setAnimationComplete(true)
    if (onComplete) onComplete()
  }

  return (
    <div className="cinematic-intro">
      {/* Canvas for animation */}
      <canvas
        ref={canvasRef}
        className="intro-canvas"
        style={{ display: loadError ? 'none' : 'block' }}
      />

      {/* Fallback image if animation fails */}
      {loadError && (
        <motion.div
          className="intro-fallback"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img src={FALLBACK_FRAME} alt="Super Bowl" className="fallback-image" />
        </motion.div>
      )}

      {/* Loading state */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="intro-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loader-content">
              <motion.div
                className="loader-football"
                animate={{
                  rotate: 360,
                  y: [0, -20, 0]
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                  y: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
                }}
              >
                🏈
              </motion.div>
              <div className="loader-bar">
                <motion.div
                  className="loader-progress"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <p className="loader-text">{loadProgress}%</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette overlay */}
      <div className="intro-vignette" />

      {/* Skip button (shows during animation) */}
      <AnimatePresence>
        {!isLoading && !animationComplete && !loadError && (
          <motion.button
            className="skip-button"
            onClick={handleSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            SALTAR →
          </motion.button>
        )}
      </AnimatePresence>

      {/* Show content after animation or on error */}
      <AnimatePresence>
        {(animationComplete || loadError) && (
          <motion.div
            className="intro-complete-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
