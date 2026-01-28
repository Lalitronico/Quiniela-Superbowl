import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Team Logos - External URLs (placeholders that should be replaced with actual team logos)
const TEAM_LOGOS = {
  seahawks: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
  patriots: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png'
}

// Golden Gate Bridge SVG Line Art
function BridgeDecoration({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main cables */}
      <path
        d="M0 180 Q100 40 200 100 Q300 160 400 80"
        stroke="var(--cmyk-yellow)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Towers */}
      <line x1="100" y1="180" x2="100" y2="60" stroke="var(--cmyk-yellow)" strokeWidth="4" />
      <line x1="300" y1="180" x2="300" y2="80" stroke="var(--cmyk-yellow)" strokeWidth="4" />
      {/* Vertical cables */}
      {[120, 140, 160, 180, 220, 240, 260, 280].map((x, i) => (
        <line
          key={i}
          x1={x}
          y1="180"
          x2={x}
          y2={100 + Math.sin((x - 100) * 0.02) * 30}
          stroke="var(--cmyk-yellow)"
          strokeWidth="1.5"
          opacity="0.6"
        />
      ))}
      {/* Road deck */}
      <line x1="0" y1="180" x2="400" y2="180" stroke="var(--cmyk-yellow)" strokeWidth="2" />
    </svg>
  )
}

// Redwood Trees SVG Silhouette
function RedwoodTrees({ className, color = 'var(--cmyk-magenta)' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tree 1 - Tall */}
      <path
        d="M60 400 L60 200 L30 200 L60 150 L40 150 L60 100 L50 100 L70 40 L90 100 L80 100 L100 150 L80 150 L100 200 L70 200 L70 400 Z"
        fill={color}
        opacity="0.3"
      />
      {/* Tree 2 - Medium */}
      <path
        d="M130 400 L130 250 L110 250 L130 200 L120 200 L140 140 L160 200 L150 200 L170 250 L150 250 L150 400 Z"
        fill={color}
        opacity="0.2"
      />
      {/* Tree 3 - Small background */}
      <path
        d="M180 400 L180 300 L165 300 L180 260 L170 260 L190 220 L210 260 L200 260 L210 300 L195 300 L195 400 Z"
        fill={color}
        opacity="0.15"
      />
    </svg>
  )
}

// Team Card Component
function TeamCard({ team, logo, isSelected, onSelect, accentColor }) {
  const selectedClass = isSelected
    ? accentColor === 'cyan' ? 'selected' : 'selected-magenta'
    : ''

  return (
    <motion.div
      className={`card-team ${selectedClass}`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Team Logo */}
      <motion.img
        src={logo}
        alt={team.name}
        className="team-logo-lg mx-auto mb-4"
        animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      />

      {/* Team Name */}
      <h3 className="font-display text-2xl md:text-3xl mb-1" style={{ color: 'var(--ink)' }}>
        {team.city}
      </h3>
      <p className="font-heading text-lg" style={{ color: 'var(--ink-muted)' }}>
        {team.name}
      </p>

      {/* Select Button */}
      <motion.button
        className={`btn mt-6 w-full ${isSelected ? 'btn-neon' : 'btn-outline'}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSelected ? '✓ CAMPEON ELEGIDO' : 'ELEGIR CAMPEON'}
      </motion.button>
    </motion.div>
  )
}

// VS Badge Component
function VSBadge() {
  return (
    <motion.div
      className="vs-badge"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, type: 'spring' }}
    >
      VS
    </motion.div>
  )
}

// Feedback Message Component
function FeedbackMessage({ type, message }) {
  return (
    <motion.div
      className={`feedback ${type === 'success' ? 'feedback-success' : 'feedback-warning'}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {type === 'success' ? '✓' : '⚠'} {message}
    </motion.div>
  )
}

// Ranking Row Component
function RankingRow({ position, name, points, avatar }) {
  const positionClass = position <= 3 ? `ranking-position-${position}` : ''

  return (
    <motion.div
      className="ranking-row"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: position * 0.1 }}
    >
      <div className={`ranking-position ${positionClass}`}>
        {position}
      </div>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--cmyk-cyan)] to-[var(--cmyk-magenta)] flex items-center justify-center text-white font-bold">
        {avatar}
      </div>
      <div className="flex-1">
        <p className="font-heading text-base" style={{ color: 'var(--ink)' }}>{name}</p>
      </div>
      <div className="text-right">
        <p className="font-display text-xl" style={{ color: 'var(--ink)' }}>{points}</p>
        <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>pts</p>
      </div>
    </motion.div>
  )
}

// Pick Card Component
function PickCard({ question, status, teamLogo, teamName }) {
  const statusConfig = {
    saved: { class: 'badge-saved', label: 'Guardado' },
    pending: { class: 'badge-pending', label: 'Pendiente' },
    closed: { class: 'badge-closed', label: 'Cerrado' }
  }

  return (
    <motion.div
      className="card p-4"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`badge ${statusConfig[status].class}`}>
          {statusConfig[status].label}
        </span>
      </div>
      <p className="font-body text-sm mb-3" style={{ color: 'var(--ink-muted)' }}>
        {question}
      </p>
      {teamLogo && (
        <div className="flex items-center gap-3">
          <img src={teamLogo} alt={teamName} className="team-logo-sm" />
          <span className="font-heading" style={{ color: 'var(--ink)' }}>{teamName}</span>
        </div>
      )}
    </motion.div>
  )
}

// Main Home Component
export default function Home() {
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [tiebreaker, setTiebreaker] = useState('')
  const [saved, setSaved] = useState(false)
  const [theme, setTheme] = useState('light')

  const teams = {
    seahawks: { city: 'SEATTLE', name: 'SEAHAWKS', conference: 'NFC' },
    patriots: { city: 'NEW ENGLAND', name: 'PATRIOTS', conference: 'AFC' }
  }

  const dummyRanking = [
    { name: 'Carlos M.', points: 245, avatar: 'C' },
    { name: 'Maria G.', points: 230, avatar: 'M' },
    { name: 'Juan P.', points: 215, avatar: 'J' },
    { name: 'Ana R.', points: 200, avatar: 'A' },
    { name: 'Luis S.', points: 185, avatar: 'L' }
  ]

  const handleSave = () => {
    if (selectedTeam) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-cream)' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{ background: 'var(--bg-cream)', borderBottom: '1px solid var(--border)' }}>
        <div className="container flex items-center justify-between h-16">
          <div className="font-display text-xl" style={{ color: 'var(--ink)' }}>
            QUINIELA <span className="text-cmyk-magenta">2026</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn-ghost font-heading text-sm">TUS PICKS</button>
            <button className="btn-ghost font-heading text-sm">RANKING</button>
            <div className="theme-toggle" onClick={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Decorations */}
        <BridgeDecoration className="decoration-bridge absolute right-0 top-20 w-80 md:w-[500px] opacity-60" />
        <RedwoodTrees className="decoration-trees absolute left-0 bottom-0 h-80 md:h-[500px]" color="var(--cmyk-magenta)" />
        <RedwoodTrees className="decoration-trees absolute right-10 bottom-0 h-60 md:h-[400px]" color="var(--cmyk-cyan)" />

        <div className="container relative z-10">
          {/* Headline */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-4" style={{ color: 'var(--ink)' }}>
              ¿QUIEN GANARA
              <br />
              <span className="text-gradient-neon">EL SUPER BOWL?</span>
            </h1>
            <p className="font-body text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'var(--ink-muted)' }}>
              Elige a tu campeon, guarda tu prediccion y compite con tus amigos.
            </p>
          </motion.div>

          {/* Team Cards */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
            <div className="w-full md:w-auto">
              <TeamCard
                team={teams.seahawks}
                logo={TEAM_LOGOS.seahawks}
                isSelected={selectedTeam === 'seahawks'}
                onSelect={() => setSelectedTeam('seahawks')}
                accentColor="cyan"
              />
            </div>

            <VSBadge />

            <div className="w-full md:w-auto">
              <TeamCard
                team={teams.patriots}
                logo={TEAM_LOGOS.patriots}
                isSelected={selectedTeam === 'patriots'}
                onSelect={() => setSelectedTeam('patriots')}
                accentColor="magenta"
              />
            </div>
          </div>

          {/* Tiebreaker */}
          <motion.div
            className="max-w-md mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-center font-heading text-sm mb-3" style={{ color: 'var(--ink-muted)' }}>
              PUNTOS TOTALES DEL PARTIDO (DESEMPATE)
            </label>
            <div className="flex justify-center">
              <input
                type="number"
                className="input-score"
                value={tiebreaker}
                onChange={(e) => setTiebreaker(e.target.value)}
                placeholder="0"
              />
            </div>
          </motion.div>

          {/* CTA & Feedback */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="btn btn-neon text-lg px-12 py-4"
              onClick={handleSave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!selectedTeam}
              style={{ opacity: selectedTeam ? 1 : 0.5 }}
            >
              GUARDAR MI PREDICCION
            </motion.button>

            <div className="mt-6 flex justify-center">
              <AnimatePresence mode="wait">
                {saved ? (
                  <FeedbackMessage key="saved" type="success" message="Prediccion guardada exitosamente" />
                ) : !selectedTeam ? (
                  <FeedbackMessage key="pending" type="warning" message="Aun no has elegido campeon" />
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Event Info */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="font-body text-sm" style={{ color: 'var(--ink-muted)' }}>
              SUPER BOWL LX • 8 DE FEBRERO, 2026 • LEVI'S STADIUM, SANTA CLARA
            </p>
          </motion.div>
        </div>
      </section>

      {/* Your Picks Section */}
      <section className="py-16" style={{ background: 'var(--bg-cream-dark)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="font-display text-3xl md:text-4xl" style={{ color: 'var(--ink)' }}>TUS PICKS</h2>
            <div className="section-line" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <PickCard
              question="¿Quien ganara el Super Bowl?"
              status={selectedTeam ? 'saved' : 'pending'}
              teamLogo={selectedTeam ? TEAM_LOGOS[selectedTeam] : null}
              teamName={selectedTeam ? teams[selectedTeam].name : null}
            />
            <PickCard
              question="¿Quien sera el MVP?"
              status="pending"
            />
            <PickCard
              question="¿Primer equipo en anotar?"
              status="pending"
            />
            <PickCard
              question="¿Marcador final?"
              status="pending"
            />
            <PickCard
              question="¿Color del Gatorade?"
              status="pending"
            />
            <PickCard
              question="¿Duracion del himno?"
              status="pending"
            />
          </div>
        </div>
      </section>

      {/* Props Section */}
      <section className="py-16">
        <div className="container">
          <div className="section-header">
            <h2 className="font-display text-3xl md:text-4xl" style={{ color: 'var(--ink)' }}>PROPS</h2>
            <div className="section-line" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Halftime Show */}
            <div className="card p-6">
              <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--ink)' }}>MEDIO TIEMPO - BAD BUNNY</h3>
              <p className="font-body text-sm mb-4" style={{ color: 'var(--ink-muted)' }}>
                ¿Cual sera la primera cancion del show?
              </p>
              <input
                className="input"
                placeholder="Nombre de la cancion..."
              />
            </div>

            {/* Commercials */}
            <div className="card p-6">
              <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--ink)' }}>COMERCIALES</h3>
              <p className="font-body text-sm mb-4" style={{ color: 'var(--ink-muted)' }}>
                ¿Mejor comercial del partido?
              </p>
              <div className="flex flex-wrap gap-2">
                {['Budweiser', 'Doritos', 'Pepsi', 'Amazon', 'Otro'].map((brand) => (
                  <button key={brand} className="btn-select">
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ranking Section */}
      <section className="py-16" style={{ background: 'var(--bg-cream-dark)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="font-display text-3xl md:text-4xl" style={{ color: 'var(--ink)' }}>RANKING TOP 5</h2>
            <div className="section-line" />
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {dummyRanking.map((user, index) => (
              <RankingRow
                key={user.name}
                position={index + 1}
                name={user.name}
                points={user.points}
                avatar={user.avatar}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="btn btn-outline">
              VER RANKING COMPLETO
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <BridgeDecoration className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl opacity-20" />

        <div className="container relative z-10 text-center">
          <motion.h2
            className="font-display text-4xl md:text-5xl mb-6"
            style={{ color: 'var(--ink)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            ¿LISTO PARA COMPETIR?
          </motion.h2>
          <motion.p
            className="font-body text-lg mb-8 max-w-xl mx-auto"
            style={{ color: 'var(--ink-muted)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Completa todas tus predicciones antes del kickoff y demuestra quien sabe mas de futbol americano.
          </motion.p>
          <motion.button
            className="btn btn-neon text-lg px-12 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            ENVIAR MI QUINIELA
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--ink)', color: 'var(--bg-cream)' }} className="py-8">
        <div className="container text-center">
          <p className="font-heading text-sm opacity-60">
            SUPER BOWL LX • SEAHAWKS VS PATRIOTS • FEBRERO 8, 2026
          </p>
          <p className="font-body text-xs mt-2 opacity-40">
            Solo para entretenimiento. No afiliado con los equipos ni la liga.
          </p>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 z-50" style={{ background: 'var(--bg-cream)', borderTop: '1px solid var(--border)' }}>
        <button
          className="btn btn-neon w-full py-4"
          onClick={handleSave}
          disabled={!selectedTeam}
          style={{ opacity: selectedTeam ? 1 : 0.5 }}
        >
          GUARDAR PREDICCION
        </button>
      </div>
    </div>
  )
}
