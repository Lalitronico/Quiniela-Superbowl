import { motion } from 'framer-motion'

export default function PositionBadge({ position }) {
  const getBadgeStyles = () => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-stadium-dark shadow-lg shadow-yellow-500/30'
      case 2:
        return 'bg-gradient-to-br from-gray-300 to-gray-500 text-stadium-dark shadow-lg shadow-gray-400/30'
      case 3:
        return 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-lg shadow-amber-600/30'
      default:
        return 'bg-white/10 text-white/70'
    }
  }

  const getIcon = () => {
    switch (position) {
      case 1:
        return '🏆'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return position
    }
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getBadgeStyles()}`}
    >
      {position <= 3 ? (
        <motion.span
          animate={position === 1 ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {getIcon()}
        </motion.span>
      ) : (
        position
      )}
    </motion.div>
  )
}
