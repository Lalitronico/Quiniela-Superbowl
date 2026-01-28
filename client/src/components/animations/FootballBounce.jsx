import { motion } from 'framer-motion'

export default function FootballBounce({ size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  return (
    <motion.div
      className={`${sizes[size]} relative`}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 15, -15, 0]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      }}
    >
      <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-lg">
        <defs>
          <linearGradient id="footballGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CD853F"/>
            <stop offset="50%" stopColor="#8B4513"/>
            <stop offset="100%" stopColor="#654321"/>
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="30" rx="45" ry="25" fill="url(#footballGrad)"/>
        <line x1="50" y1="5" x2="50" y2="55" stroke="white" strokeWidth="3"/>
        <line x1="50" y1="12" x2="38" y2="12" stroke="white" strokeWidth="2"/>
        <line x1="50" y1="22" x2="38" y2="22" stroke="white" strokeWidth="2"/>
        <line x1="50" y1="32" x2="38" y2="32" stroke="white" strokeWidth="2"/>
        <line x1="50" y1="42" x2="38" y2="42" stroke="white" strokeWidth="2"/>
      </svg>
      <motion.div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/30 rounded-full blur-sm"
        animate={{
          scale: [1, 0.8, 1],
          opacity: [0.5, 0.3, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  )
}
