import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useBrand } from '../context/BrandContext'

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

// Countdown component for desktop
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

// Compact countdown for mobile
const CountdownMobile = () => {
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
    <div className="mobile-countdown">
      <span className="mobile-countdown-label">KICKOFF EN</span>
      <div className="mobile-countdown-values">
        <span className="mobile-countdown-num">{timeLeft.days}d</span>
        <span className="mobile-countdown-sep">:</span>
        <span className="mobile-countdown-num">{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span className="mobile-countdown-sep">:</span>
        <span className="mobile-countdown-num">{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span className="mobile-countdown-sep">:</span>
        <span className="mobile-countdown-num">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  )
}

// Mobile Hero Layout - Stacked design with big logos
function MobileHero({ onStart, brandName }) {
  return (
    <div className="mobile-hero">
      {/* Background with split colors */}
      <div className="mobile-hero-bg">
        <div className="mobile-hero-bg-left" />
        <div className="mobile-hero-bg-right" />
        <div className="mobile-hero-bg-glow" />
      </div>

      {/* Compact Header */}
      <motion.header
        className="mobile-hero-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mobile-header-badge">
          <div className="mobile-header-glow" />
          <div className="mobile-header-lines">
            <span className="mobile-header-line" />
            <span className="mobile-header-line" />
          </div>
          <span className="mobile-brand">SUPER QUINIELA</span>
          <div className="mobile-year-container">
            <span className="mobile-year-dash" />
            <span className="mobile-year-large">2026</span>
            <span className="mobile-year-dash" />
          </div>
        </div>
      </motion.header>

      {/* Main Content - Big Logos with VS */}
      <div className="mobile-hero-main">
        {/* Teams Face-off */}
        <motion.div
          className="mobile-teams-faceoff"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* NFC Team */}
          <div className="mobile-team mobile-team-nfc">
            <div className="mobile-team-logo">
              <div className="mobile-logo-ring" />
              <img src={TEAMS.nfc.logo} alt={TEAMS.nfc.name} />
            </div>
            <span className="mobile-team-name">{TEAMS.nfc.name}</span>
          </div>

          {/* VS Badge with glow */}
          <div className="mobile-vs-container">
            <div className="mobile-vs-glow" />
            <motion.div
              className="mobile-vs-badge"
              animate={{
                boxShadow: [
                  '0 0 30px rgba(255,0,128,0.5), 0 0 60px rgba(0,212,255,0.3)',
                  '0 0 50px rgba(255,0,128,0.7), 0 0 80px rgba(0,212,255,0.5)',
                  '0 0 30px rgba(255,0,128,0.5), 0 0 60px rgba(0,212,255,0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>VS</span>
            </motion.div>
          </div>

          {/* AFC Team */}
          <div className="mobile-team mobile-team-afc">
            <div className="mobile-team-logo">
              <div className="mobile-logo-ring" />
              <img src={TEAMS.afc.logo} alt={TEAMS.afc.name} />
            </div>
            <span className="mobile-team-name">{TEAMS.afc.name}</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="mobile-hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ¿QUIÉN GANARÁ?
        </motion.h1>

        {/* Super Bowl badge */}
        <motion.div
          className="mobile-sb-badge"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <img src={NFL_LOGO} alt="NFL" className="mobile-nfl-logo" />
          <span>SUPER BOWL LX</span>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        className="mobile-hero-cta"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="mobile-cta-btn"
          onClick={onStart}
          whileTap={{ scale: 0.95 }}
        >
          <span>PARTICIPA AHORA</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>

        <div className="mobile-cta-info">
          <span>8 preguntas</span>
          <span className="mobile-dot">•</span>
          <span>2 minutos</span>
          <span className="mobile-dot">•</span>
          <span>Premios</span>
        </div>
      </motion.div>

      {/* Footer - Countdown & Details */}
      <motion.footer
        className="mobile-hero-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <CountdownMobile />
        <div className="mobile-event-details">
          <span>📍 Levi's Stadium</span>
          <span>📅 8 Feb 2026</span>
        </div>
      </motion.footer>
    </div>
  )
}

// Desktop Layout (original split design)
function DesktopHero({ onStart, brandName }) {
  return (
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
            onClick={onStart}
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
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const { brand, brandSlug, loading } = useBrand()

  const handleStart = () => {
    navigate(`/${brandSlug}/quiniela`)
  }

  // Show loading state while brand loads
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper-dark)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--cmyk-cyan)', borderTopColor: 'transparent' }} />
          <p className="font-heading" style={{ color: 'var(--ink-muted)' }}>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="landing-split">
      {/* Brand logo overlay if brand has custom logo */}
      {brand?.logoUrl && (
        <div className="brand-logo-overlay">
          <img src={brand.logoUrl} alt={brand.name} className="brand-custom-logo" />
        </div>
      )}

      {/* Mobile Layout - shown on small screens */}
      <div className="mobile-only">
        <MobileHero onStart={handleStart} brandName={brand?.name} />
      </div>

      {/* Desktop Layout - shown on larger screens */}
      <div className="desktop-only">
        <DesktopHero onStart={handleStart} brandName={brand?.name} />
      </div>
    </div>
  )
}
