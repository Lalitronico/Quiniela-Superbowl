import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const TOTAL_FRAMES = 192
const FRAME_DURATION = 25 // Faster! ~40fps
const FALLBACK_FRAME = '/animation/frame_095_delay-0.042s.jpg'

const getFramePath = (index) => {
  const paddedIndex = String(index).padStart(3, '0')
  const delay = index % 2 === 0 ? '0.042s' : '0.041s'
  return `/animation/frame_${paddedIndex}_delay-${delay}.jpg`
}

export default function FootballAnimation({ onComplete, size = 400 }) {
  const canvasRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const framesRef = useRef([])
  const animationRef = useRef(null)

  const preloadFrames = useCallback(async () => {
    const frames = []
    let loadedCount = 0

    const loadFrame = (index) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          loadedCount++
          resolve(img)
        }
        img.onerror = () => {
          loadedCount++
          resolve(null)
        }
        img.src = getFramePath(index)
      })
    }

    try {
      // Load all frames in parallel batches
      const batchSize = 32
      for (let i = 0; i < TOTAL_FRAMES; i += batchSize) {
        const batch = []
        for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
          batch.push(loadFrame(j))
        }
        const batchResults = await Promise.all(batch)
        frames.push(...batchResults)
      }

      const validFrames = frames.filter(f => f !== null)
      if (validFrames.length < TOTAL_FRAMES * 0.5) {
        throw new Error('Not enough frames')
      }

      framesRef.current = frames
      setIsLoading(false)
    } catch (error) {
      setLoadError(true)
      setIsLoading(false)
    }
  }, [])

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
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // Draw frame centered and scaled
          const scale = Math.min(
            canvas.width / frame.width,
            canvas.height / frame.height
          )
          const x = (canvas.width - frame.width * scale) / 2
          const y = (canvas.height - frame.height * scale) / 2

          ctx.drawImage(frame, x, y, frame.width * scale, frame.height * scale)
        }

        frameIndex++
        lastTime = currentTime

        if (frameIndex >= TOTAL_FRAMES) {
          // Animation complete - notify parent
          if (onComplete) onComplete()
          return
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [onComplete])

  useEffect(() => {
    preloadFrames()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [preloadFrames])

  useEffect(() => {
    if (!isLoading && !loadError) {
      const canvas = canvasRef.current
      if (canvas) {
        const dpr = window.devicePixelRatio || 1
        canvas.width = size * dpr
        canvas.height = size * dpr
        const ctx = canvas.getContext('2d')
        ctx.scale(dpr, dpr)
      }

      const startDelay = setTimeout(() => {
        playAnimation()
      }, 100)

      return () => clearTimeout(startDelay)
    }
  }, [isLoading, loadError, playAnimation, size])

  if (loadError) {
    return (
      <motion.div
        className="football-animation-container"
        style={{ width: size, height: size }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <img src={FALLBACK_FRAME} alt="Football" className="football-fallback" />
      </motion.div>
    )
  }

  return (
    <motion.div
      className="football-animation-container"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading ? (
        <div className="football-loader">
          <motion.span
            className="loader-emoji"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            🏈
          </motion.span>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="football-canvas"
          style={{ width: size, height: size }}
        />
      )}
    </motion.div>
  )
}
