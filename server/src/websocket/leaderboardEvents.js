let ioInstance = null

export function initWebSocket(io) {
  ioInstance = io

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })

    // Join leaderboard room
    socket.on('leaderboard:subscribe', () => {
      socket.join('leaderboard')
    })

    // Leave leaderboard room
    socket.on('leaderboard:unsubscribe', () => {
      socket.leave('leaderboard')
    })
  })
}

export function emitLeaderboardUpdate(leaderboard) {
  if (ioInstance) {
    ioInstance.emit('leaderboard:update', leaderboard)
  }
}

export function emitResultUpdate(result) {
  if (ioInstance) {
    ioInstance.emit('results:update', result)
  }
}

export function emitCorrectPrediction(userId, questionId, points) {
  if (ioInstance) {
    ioInstance.emit('prediction:correct', {
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
