import { motion, AnimatePresence } from 'framer-motion'
import PositionBadge from './PositionBadge'

export default function LeaderboardTable({ participants, currentUserId }) {
  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {sortedParticipants.map((participant, index) => {
          const position = index + 1
          const isCurrentUser = participant.id === currentUserId

          return (
            <motion.div
              key={participant.id}
              layout
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{
                layout: { type: 'spring', stiffness: 500, damping: 40 },
                opacity: { duration: 0.2 }
              }}
              className={`
                leaderboard-row
                ${isCurrentUser ? 'border-superbowl-gold border-2 bg-superbowl-gold/10' : ''}
                ${position <= 3 ? 'bg-white/10' : ''}
              `}
            >
              <div className="flex items-center gap-4">
                <PositionBadge position={position} />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nfl-blue to-nfl-red flex items-center justify-center text-white font-bold">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white flex items-center gap-2">
                      {participant.name}
                      {isCurrentUser && (
                        <span className="text-xs bg-superbowl-gold text-stadium-dark px-2 py-0.5 rounded-full">
                          Tu
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-white/50">
                      {participant.correctPredictions || 0} aciertos
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {participant.categoryScores && (
                  <div className="hidden md:flex gap-2">
                    {Object.entries(participant.categoryScores).map(([category, score]) => (
                      <div
                        key={category}
                        className="text-xs bg-white/5 px-2 py-1 rounded"
                        title={category}
                      >
                        {score}pts
                      </div>
                    ))}
                  </div>
                )}

                <motion.div
                  className="text-right"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                  key={participant.score}
                >
                  <p className="text-2xl font-display text-superbowl-gold">
                    {participant.score}
                  </p>
                  <p className="text-xs text-white/50">puntos</p>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {sortedParticipants.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-white/50"
        >
          <p className="text-lg">No hay participantes aun</p>
          <p className="text-sm mt-2">Se el primero en registrarte!</p>
        </motion.div>
      )}
    </div>
  )
}
