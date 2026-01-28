import { motion, AnimatePresence } from 'framer-motion'
import { useLeaderboard, useParticipant } from '../hooks'
import { useEffect, useState } from 'react'
import { initSocket } from '../services/socket'

function PositionBadge({ position }) {
  if (position === 1) {
    return (
      <motion.div
        className="position-badge position-1"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🏆
      </motion.div>
    )
  }

  if (position === 2) {
    return (
      <div className="position-badge position-2">
        🥈
      </div>
    )
  }

  if (position === 3) {
    return (
      <div className="position-badge position-3">
        🥉
      </div>
    )
  }

  return (
    <div className="position-badge position-default">
      {position}
    </div>
  )
}

function LeaderboardRow({ participant, position, isCurrentUser, index }) {
  const rowClass = position === 1 ? 'top-1' : position === 2 ? 'top-2' : position === 3 ? 'top-3' : ''

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{
        layout: { type: 'spring', stiffness: 500, damping: 40 },
        opacity: { duration: 0.3 },
        delay: index * 0.05
      }}
      className={`
        leaderboard-row
        ${rowClass}
        ${isCurrentUser ? 'ring-2 ring-[#D50A0A] bg-[#D50A0A]/10' : ''}
      `}
    >
      <div className="flex items-center gap-4 flex-1">
        <PositionBadge position={position} />

        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#013369] to-[#D50A0A] flex items-center justify-center text-2xl shadow-lg">
          {participant.avatar || participant.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-heading text-lg text-white truncate">
              {participant.name}
            </p>
            {isCurrentUser && (
              <span className="px-2 py-0.5 rounded-full bg-[#D50A0A] text-white text-xs font-bold">
                TU
              </span>
            )}
          </div>
          <p className="font-body text-sm text-white/50">
            {participant.correctPredictions || 0} aciertos
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Category scores - hidden on mobile */}
        {participant.categoryScores && Object.keys(participant.categoryScores).length > 0 && (
          <div className="hidden lg:flex gap-2">
            {Object.entries(participant.categoryScores).map(([category, score]) => (
              <div
                key={category}
                className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60"
                title={category}
              >
                {score}pts
              </div>
            ))}
          </div>
        )}

        <motion.div
          className="text-right"
          key={participant.score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        >
          <p className="font-display text-3xl text-white">
            {participant.score}
          </p>
          <p className="font-body text-xs text-white/40 uppercase tracking-wider">
            puntos
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

function TopThreePodium({ participants }) {
  const [first, second, third] = participants

  const podiumOrder = [second, first, third].filter(Boolean)

  return (
    <div className="flex items-end justify-center gap-4 mb-12">
      {podiumOrder.map((p, index) => {
        const position = index === 0 ? 2 : index === 1 ? 1 : 3
        const height = position === 1 ? 'h-32' : position === 2 ? 'h-24' : 'h-20'
        const avatarSize = position === 1 ? 'w-20 h-20 text-4xl' : 'w-16 h-16 text-3xl'

        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex flex-col items-center"
          >
            {/* Avatar */}
            <motion.div
              className={`
                ${avatarSize} rounded-2xl bg-gradient-to-br from-[#013369] to-[#D50A0A]
                flex items-center justify-center shadow-xl mb-3
                ${position === 1 ? 'ring-4 ring-white shadow-white/20' : ''}
              `}
              animate={position === 1 ? { y: [0, -5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {p.avatar || p.name.charAt(0).toUpperCase()}
            </motion.div>

            {/* Name */}
            <p className="font-heading text-white text-center mb-1 max-w-[100px] truncate">
              {p.name}
            </p>

            {/* Score */}
            <p className={`font-display ${position === 1 ? 'text-2xl text-white' : 'text-xl text-white/80'}`}>
              {p.score}
            </p>

            {/* Podium */}
            <div className={`
              ${height} w-24 mt-3 rounded-t-xl
              ${position === 1 ? 'bg-gradient-to-t from-white/20 to-white/5 border-t-2 border-x-2 border-white/30' :
                position === 2 ? 'bg-gradient-to-t from-gray-400/20 to-gray-400/5 border-t-2 border-x-2 border-gray-400/30' :
                'bg-gradient-to-t from-amber-700/20 to-amber-700/5 border-t-2 border-x-2 border-amber-700/30'}
              flex items-center justify-center
            `}>
              <span className={`font-display text-4xl ${position === 1 ? 'text-white' : 'text-white/60'}`}>
                {position === 1 ? '🏆' : position === 2 ? '🥈' : '🥉'}
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function Leaderboard() {
  const { leaderboard, loading, error, refresh } = useLeaderboard()
  const { participant } = useParticipant()
  const [showPodium, setShowPodium] = useState(true)

  useEffect(() => {
    initSocket()
  }, [])

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score)
  const topThree = sortedLeaderboard.slice(0, 3)
  const restOfLeaderboard = sortedLeaderboard.slice(3)

  const totalParticipants = leaderboard.length
  const hasScores = sortedLeaderboard.some(p => p.score > 0)

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-[#D50A0A]/30 border-t-[#D50A0A]"
        />
        <p className="mt-6 font-body text-white/50">Cargando ranking...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-4xl md:text-5xl text-white mb-2">
          RANKING
        </h1>
        <p className="font-body text-white/60">
          {totalParticipants} participante{totalParticipants !== 1 ? 's' : ''} en la quiniela
        </p>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-center"
        >
          {error}
          <button
            onClick={refresh}
            className="ml-4 underline hover:no-underline"
          >
            Reintentar
          </button>
        </motion.div>
      )}

      {/* Top 3 Podium - only show if there are scores */}
      {hasScores && topThree.length >= 3 && showPodium && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TopThreePodium participants={topThree} />
        </motion.div>
      )}

      {/* Toggle podium button */}
      {hasScores && topThree.length >= 3 && (
        <div className="text-center mb-6">
          <button
            onClick={() => setShowPodium(!showPodium)}
            className="font-body text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            {showPodium ? 'Ocultar podio' : 'Mostrar podio'}
          </button>
        </div>
      )}

      {/* Leaderboard list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {(showPodium && hasScores ? restOfLeaderboard : sortedLeaderboard).map((p, index) => {
            const actualPosition = showPodium && hasScores ? index + 4 : index + 1
            const isCurrentUser = participant?.id === p.id

            return (
              <LeaderboardRow
                key={p.id}
                participant={p}
                position={actualPosition}
                isCurrentUser={isCurrentUser}
                index={index}
              />
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {sortedLeaderboard.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🏈</div>
          <h3 className="font-heading text-xl text-white/80 mb-2">
            No hay participantes aun
          </h3>
          <p className="font-body text-white/50">
            Se el primero en registrarte!
          </p>
        </motion.div>
      )}

      {/* Live indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center justify-center gap-3"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="font-body text-sm text-white/40">
          Actualizacion en tiempo real
        </span>
      </motion.div>

      {/* Refresh button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 text-center"
      >
        <motion.button
          onClick={refresh}
          className="btn-ghost"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </motion.button>
      </motion.div>
    </div>
  )
}
