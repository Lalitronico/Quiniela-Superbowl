let ioInstance = null

export function initWebSocket(io) {
  ioInstance = io

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })

    // Join brand-specific leaderboard room
    socket.on('leaderboard:subscribe', (brandSlug) => {
      // Validate brand slug format
      if (!brandSlug || typeof brandSlug !== 'string' || !/^[a-z0-9-]+$/.test(brandSlug)) {
        console.warn(`[WS] Invalid brand slug for subscription: ${brandSlug}`)
        return
      }

      const room = `leaderboard:${brandSlug}`
      socket.join(room)
      console.log(`[WS] Client ${socket.id} joined room: ${room}`)
    })

    // Leave brand-specific leaderboard room
    socket.on('leaderboard:unsubscribe', (brandSlug) => {
      if (!brandSlug || typeof brandSlug !== 'string') return

      const room = `leaderboard:${brandSlug}`
      socket.leave(room)
      console.log(`[WS] Client ${socket.id} left room: ${room}`)
    })
  })
}

// Emit leaderboard update to a specific brand's room
export function emitLeaderboardUpdate(brandSlug, leaderboard) {
  if (ioInstance && brandSlug) {
    const room = `leaderboard:${brandSlug}`
    ioInstance.to(room).emit('leaderboard:update', leaderboard)
    console.log(`[WS] Emitted leaderboard:update to room: ${room}`)
  }
}

// Emit result update to a specific brand's room
export function emitResultUpdate(brandSlug, result) {
  if (ioInstance && brandSlug) {
    const room = `leaderboard:${brandSlug}`
    ioInstance.to(room).emit('results:update', result)
  }
}

// Emit correct prediction notification to a specific brand's room
export function emitCorrectPrediction(brandSlug, userId, questionId, points) {
  if (ioInstance && brandSlug) {
    const room = `leaderboard:${brandSlug}`
    ioInstance.to(room).emit('prediction:correct', {
      userId,
      questionId,
      points
    })
  }
}

export default {
  initWebSocket,
  emitLeaderboardUpdate,
  emitResultUpdate,
  emitCorrectPrediction
}
