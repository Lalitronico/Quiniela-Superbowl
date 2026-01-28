import { motion } from 'framer-motion'

export default function TrophyReveal({ show = true, size = 'md' }) {
  const sizes = {
    sm: 'w-16 h-20',
    md: 'w-24 h-32',
    lg: 'w-32 h-40',
    xl: 'w-48 h-56'
  }

  if (!show) return null

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }}
      className={`${sizes[size]} relative`}
    >
      <motion.div
        animate={{
          boxShadow: [
            '0 0 20px rgba(255, 182, 18, 0.3)',
            '0 0 40px rgba(255, 182, 18, 0.6)',
            '0 0 20px rgba(255, 182, 18, 0.3)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full"
      />
      <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700"/>
            <stop offset="30%" stopColor="#FFB612"/>
            <stop offset="70%" stopColor="#DAA520"/>
            <stop offset="100%" stopColor="#B8860B"/>
          </linearGradient>
          <linearGradient id="trophyShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)"/>
            <stop offset="50%" stopColor="rgba(255,255,255,0.5)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </linearGradient>
        </defs>

        {/* Trophy Cup */}
        <path
          d="M25 10 L75 10 L70 50 Q50 70 30 50 L25 10"
          fill="url(#trophyGold)"
          stroke="#B8860B"
          strokeWidth="2"
        />

        {/* Handles */}
        <path
          d="M25 20 Q5 20 10 40 Q15 55 25 45"
          fill="none"
          stroke="url(#trophyGold)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M75 20 Q95 20 90 40 Q85 55 75 45"
          fill="none"
          stroke="url(#trophyGold)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Stem */}
        <rect x="42" y="65" width="16" height="25" fill="url(#trophyGold)"/>

        {/* Base */}
        <ellipse cx="50" cy="95" rx="25" ry="8" fill="url(#trophyGold)"/>
        <rect x="25" y="95" width="50" height="15" fill="url(#trophyGold)"/>
        <ellipse cx="50" cy="110" rx="30" ry="10" fill="url(#trophyGold)"/>
        <rect x="20" y="110" width="60" height="10" fill="url(#trophyGold)"/>
        <ellipse cx="50" cy="120" rx="35" ry="8" fill="url(#trophyGold)"/>

        {/* Shine effect */}
        <motion.ellipse
          cx="40"
          cy="30"
          rx="8"
          ry="15"
          fill="rgba(255,255,255,0.3)"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Football on top */}
        <ellipse cx="50" cy="5" rx="12" ry="7" fill="#8B4513"/>
        <line x1="50" y1="-2" x2="50" y2="12" stroke="white" strokeWidth="1"/>
      </svg>

      {/* Floating sparkles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-superbowl-gold rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + (i % 3) * 20}%`
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [-10, -30]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3
          }}
        />
      ))}
    </motion.div>
  )
}
