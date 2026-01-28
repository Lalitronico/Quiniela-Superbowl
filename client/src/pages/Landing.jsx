import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// Team Configuration
const TEAMS = {
  nfc: {
    logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
    name: 'SEAHAWKS',
    city: 'SEATTLE',
    conference: 'NFC',
    record: '14-3'
  },
  afc: {
    logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png',
    name: 'PATRIOTS',
    city: 'NEW ENGLAND',
    conference: 'AFC',
    record: '13-4'
  }
}

// NFL Shield Logo
const NFL_LOGO = 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nfl.png&transparent=true'

// Countdown component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const targetDate = new Date('2026-02-08T18:30:00-08:00')

    const updateCountdown = () => {
      const now = new Date()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="countdown-split">
      <span className="countdown-split-label">KICKOFF</span>
      <div className="countdown-split-values">
        <div className="countdown-split-unit">
          <span className="countdown-split-number">{timeLeft.days}</span>
          <span className="countdown-split-text">DÍAS</span>
        </div>
        <span className="countdown-split-sep">:</span>
        <div className="countdown-split-unit">
          <span className="countdown-split-number">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="countdown-split-text">HRS</span>
        </div>
        <span className="countdown-split-sep">:</span>
        <div className="countdown-split-unit">
          <span className="countdown-split-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="countdown-split-text">MIN</span>
        </div>
        <span className="countdown-split-sep">:</span>
        <div className="countdown-split-unit">
          <span className="countdown-split-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="countdown-split-text">SEG</span>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/quiniela')
  }

  return (
    <div className="landing-split">
      {/* Main Split Layout - Works on all screen sizes */}
      <div className="landing-split-container">
        {/* Left Side - NFC Team */}
        <motion.div
          className="team-half team-half-nfc"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, type: 'spring', damping: 20 }}
        >
          <div className="team-half-bg">
            <div className="team-half-gradient" />
            <div className="team-half-pattern" />
            <div className="team-half-glow" />
          </div>

          <div className="team-half-content">
            <motion.div
              className="team-conference-badge"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <span>{TEAMS.nfc.conference}</span>
              <span className="team-record-badge">{TEAMS.nfc.record}</span>
            </motion.div>

            <motion.div
              className="team-logo-large"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              <div className="team-logo-ring-outer" />
              <div className="team-logo-ring-inner" />
              <img src={TEAMS.nfc.logo} alt={TEAMS.nfc.name} />
            </motion.div>

            <motion.div
              className="team-name-large"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="team-city-large">{TEAMS.nfc.city}</span>
              <span className="team-title-large">{TEAMS.nfc.name}</span>
            </motion.div>

            <motion.div
              className="team-seed-badge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              #1 SEED NFC
            </motion.div>
          </div>
        </motion.div>

        {/* Center Overlay */}
        <div className="center-overlay">
          <motion.div
            className="center-top"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="brand-logo">
              <span className="brand-quiniela">SUPER QUINIELA</span>
              <span className="brand-year-badge">2026</span>
            </div>
          </motion.div>

          <motion.div
            className="center-middle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="nfl-logo-container">
              <div className="nfl-logo-glow" />
              <img src={NFL_LOGO} alt="NFL" className="nfl-logo" />
            </div>

            <div className="super-bowl-text">
              <span className="sb-label">SUPER BOWL</span>
              <span className="sb-numeral">LX</span>
            </div>

            <div className="vs-diamond">
              <div className="vs-diamond-inner">
                <span>VS</span>
              </div>
            </div>

            <div className="title-section">
              <h1 className="main-question">¿QUIÉN GANARÁ?</h1>
            </div>
          </motion.div>

          <motion.div
            className="center-bottom"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <CountdownTimer />

            <motion.button
              className="cta-btn-split"
              onClick={handleStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>PARTICIPA AHORA</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>

            <div className="cta-info">
              <span>8 preguntas</span>
              <span className="cta-dot">•</span>
              <span>2 minutos</span>
              <span className="cta-dot">•</span>
              <span>Premios</span>
            </div>

            <div className="event-details">
              <span>📍 Levi's Stadium, Santa Clara</span>
              <span>📅 8 de Febrero, 2026</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side - AFC Team */}
        <motion.div
          className="team-half team-half-afc"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, type: 'spring', damping: 20 }}
        >
          <div className="team-half-bg">
            <div className="team-half-gradient" />
            <div className="team-half-pattern" />
            <div className="team-half-glow" />
          </div>

          <div className="team-half-content">
            <motion.div
              className="team-conference-badge"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <span>{TEAMS.afc.conference}</span>
              <span className="team-record-badge">{TEAMS.afc.record}</span>
            </motion.div>

            <motion.div
              className="team-logo-large"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <div className="team-logo-ring-outer" />
              <div className="team-logo-ring-inner" />
              <img src={TEAMS.afc.logo} alt={TEAMS.afc.name} />
            </motion.div>

            <motion.div
              className="team-name-large"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="team-city-large">{TEAMS.afc.city}</span>
              <span className="team-title-large">{TEAMS.afc.name}</span>
            </motion.div>

            <motion.div
              className="team-seed-badge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              #1 SEED AFC
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
