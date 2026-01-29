import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWizard, STEPS } from '../context/WizardContext'

// Social Media Icons
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)

const TEAM_LOGOS = {
  seahawks: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
  patriots: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png'
}

const TEAM_NAMES = {
  seahawks: 'Seattle Seahawks',
  patriots: 'New England Patriots'
}

const TEAM_SHORT = {
  seahawks: 'SEA',
  patriots: 'NE'
}

const MVP_NAMES = {
  geno_smith: 'Geno Smith',
  dk_metcalf: 'DK Metcalf',
  kenneth_walker: 'Kenneth Walker III',
  devon_witherspoon: 'Devon Witherspoon',
  drake_maye: 'Drake Maye',
  rhamondre_stevenson: 'Rhamondre Stevenson',
  otro: 'Otro Jugador'
}

const GATORADE_COLORS = {
  naranja: { name: 'Naranja', color: '#FF6B00' },
  azul: { name: 'Azul', color: '#0066FF' },
  amarillo: { name: 'Amarillo', color: '#FFD700' },
  verde: { name: 'Verde', color: '#00CC66' },
  rojo: { name: 'Rojo', color: '#FF0033' },
  morado: { name: 'Morado', color: '#9933FF' },
  transparente: { name: 'Transparente', color: '#CCCCCC' },
  ninguno: { name: 'Sin Gatorade', color: '#666666' }
}

const BRAND_NAMES = {
  budweiser: 'Budweiser',
  doritos: 'Doritos',
  pepsi: 'Pepsi',
  cocacola: 'Coca-Cola',
  amazon: 'Amazon',
  google: 'Google',
  apple: 'Apple',
  otro: 'Otro'
}

// Prediction Card Component
function PredictionCard({ title, icon, value, subValue, color, delay, onEdit, children }) {
  return (
    <motion.div
      className="prediction-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{ '--card-accent': color || 'var(--cmyk-cyan)' }}
    >
      <div className="prediction-card-header">
        <div className="prediction-card-icon">{icon}</div>
        <span className="prediction-card-title">{title}</span>
        <button className="prediction-edit-btn" onClick={onEdit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>
      <div className="prediction-card-content">
        {children || (
          <>
            <span className="prediction-card-value">{value || 'Sin seleccionar'}</span>
            {subValue && <span className="prediction-card-subvalue">{subValue}</span>}
          </>
        )}
      </div>
    </motion.div>
  )
}

// Champion Card (Special larger card)
function ChampionCard({ team, onEdit, delay }) {
  if (!team) {
    return (
      <motion.div
        className="champion-card champion-card-empty"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
      >
        <div className="champion-card-content">
          <span className="champion-label">CAMPEÓN ELEGIDO</span>
          <span className="champion-empty">Sin seleccionar</span>
        </div>
        <button className="champion-edit-btn" onClick={onEdit}>ELEGIR</button>
      </motion.div>
    )
  }

  const isSeahawks = team === 'seahawks'

  return (
    <motion.div
      className={`champion-card ${isSeahawks ? 'champion-seahawks' : 'champion-patriots'}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <div className="champion-bg-pattern" />
      <div className="champion-glow" />

      <div className="champion-card-content">
        <span className="champion-label">CAMPEÓN ELEGIDO</span>

        <div className="champion-team">
          <motion.img
            src={TEAM_LOGOS[team]}
            alt={TEAM_NAMES[team]}
            className="champion-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring' }}
          />
          <div className="champion-info">
            <span className="champion-city">{team === 'seahawks' ? 'SEATTLE' : 'NEW ENGLAND'}</span>
            <span className="champion-name">{team === 'seahawks' ? 'SEAHAWKS' : 'PATRIOTS'}</span>
          </div>
        </div>

        <div className="champion-trophy">
          <span>🏆</span>
        </div>
      </div>

      <button className="champion-edit-btn" onClick={onEdit}>CAMBIAR</button>
    </motion.div>
  )
}

// Score Display Card
function ScoreCard({ score, onEdit, delay }) {
  const hasScore = score.seahawks && score.patriots

  return (
    <motion.div
      className="score-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="score-card-header">
        <span className="score-card-title">MARCADOR FINAL</span>
        <button className="prediction-edit-btn" onClick={onEdit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>

      {hasScore ? (
        <div className="score-display">
          <div className="score-team">
            <img src={TEAM_LOGOS.seahawks} alt="Seahawks" />
            <span className="score-team-name">SEA</span>
          </div>
          <div className="score-numbers">
            <span className="score-value seahawks-score">{score.seahawks}</span>
            <span className="score-separator">-</span>
            <span className="score-value patriots-score">{score.patriots}</span>
          </div>
          <div className="score-team">
            <img src={TEAM_LOGOS.patriots} alt="Patriots" />
            <span className="score-team-name">NE</span>
          </div>
        </div>
      ) : (
        <div className="score-empty">Sin marcador</div>
      )}
    </motion.div>
  )
}

// Confetti Effect
function ConfettiParticle({ index }) {
  const colors = ['var(--cmyk-magenta)', 'var(--cmyk-cyan)', 'var(--cmyk-yellow)', '#00C853']
  const color = colors[index % colors.length]
  const left = Math.random() * 100
  const delay = Math.random() * 0.5
  const duration = 2 + Math.random() * 2

  return (
    <motion.div
      className="confetti"
      style={{
        left: `${left}%`,
        background: color,
        width: 8 + Math.random() * 8,
        height: 8 + Math.random() * 8
      }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: '100vh', opacity: 0, rotate: 360 + Math.random() * 360 }}
      transition={{ duration, delay, ease: 'linear' }}
    />
  )
}

export default function Confirmation() {
  const navigate = useNavigate()
  const { predictions, goToStep, getCompletedCount } = useWizard()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const completedCount = getCompletedCount()
  const totalSteps = STEPS.length

  const handleEdit = (stepIndex) => {
    goToStep(stepIndex)
    navigate('/quiniela')
  }

  const handleSubmit = async () => {
    if (!userName.trim()) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  // Share functions
  const SHARE_URL = 'https://quiniela.supergana.fun'
  const getShareText = () => {
    const teamName = predictions.winner ? TEAM_NAMES[predictions.winner] : 'mi equipo favorito'
    return `¡Ya hice mi quiniela del Super Bowl LX! 🏈\n\nMi predicción: ${teamName} 🏆\n\n¿Ya hiciste la tuya? 👉`
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${getShareText()}\n${SHARE_URL}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const shareTwitter = () => {
    const text = encodeURIComponent(getShareText())
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(SHARE_URL)}`, '_blank')
  }

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`, '_blank')
  }

  const [copiedToast, setCopiedToast] = useState(false)
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL)
      setCopiedToast(true)
      setTimeout(() => setCopiedToast(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = SHARE_URL
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedToast(true)
      setTimeout(() => setCopiedToast(false), 2000)
    }
  }

  // Success State - Share Screen
  if (isSubmitted) {
    return (
      <div className="share-success-screen">
        {/* Confetti Background */}
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <ConfettiParticle key={i} index={i} />
          ))}
        </div>

        {/* Celebration Hero */}
        <motion.div
          className="share-hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="share-hero-badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            🏈
          </motion.div>
          <motion.h1
            className="share-hero-title"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            ¡YA PARTICIPÉ!
          </motion.h1>
          <motion.p
            className="share-hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            SUPER BOWL LX · QUINIELA 2026
          </motion.p>
        </motion.div>

        {/* Prediction Card - Championship Style */}
        <motion.div
          className="share-card"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {/* Champion Section */}
          <div className="share-card-champion">
            <div className="share-card-label">MI CAMPEÓN</div>
            {predictions.winner && (
              <>
                <div className="champion-logo-container">
                  <div className="champion-logo-glow" />
                  <motion.img
                    src={TEAM_LOGOS[predictions.winner]}
                    alt={TEAM_NAMES[predictions.winner]}
                    className="champion-logo-large"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, type: 'spring', stiffness: 150 }}
                  />
                  <div className="champion-crown">👑</div>
                </div>
                <motion.div
                  className="champion-name"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  {TEAM_NAMES[predictions.winner]}
                </motion.div>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="share-card-divider">
            <span>MARCADOR FINAL</span>
          </div>

          {/* Score Section with both teams */}
          <div className="share-card-matchup">
            <div className="matchup-team">
              <img src={TEAM_LOGOS.seahawks} alt="Seahawks" />
              <span className="matchup-abbr">SEA</span>
              <span className="matchup-score seahawks-glow">{predictions.score.seahawks || '0'}</span>
            </div>
            <div className="matchup-vs">VS</div>
            <div className="matchup-team">
              <img src={TEAM_LOGOS.patriots} alt="Patriots" />
              <span className="matchup-abbr">NE</span>
              <span className="matchup-score patriots-glow">{predictions.score.patriots || '0'}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="share-card-footer">
            <span className="footer-user">{userName}</span>
            <span className="footer-url">quiniela.supergana.fun</span>
          </div>
        </motion.div>

        {/* Share Buttons */}
        <div className="share-buttons">
          <motion.button
            className="share-btn share-btn-whatsapp"
            onClick={shareWhatsApp}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <WhatsAppIcon /> Compartir en WhatsApp
          </motion.button>
          <motion.button
            className="share-btn share-btn-twitter"
            onClick={shareTwitter}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TwitterIcon /> Twitter / X
          </motion.button>
          <motion.button
            className="share-btn share-btn-facebook"
            onClick={shareFacebook}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FacebookIcon /> Facebook
          </motion.button>
          <motion.button
            className="share-btn share-btn-copy"
            onClick={copyLink}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {copiedToast ? <CheckIcon /> : <CopyIcon />}
            {copiedToast ? '¡Enlace copiado!' : 'Copiar enlace'}
          </motion.button>
        </div>

        {/* Call to Action */}
        <motion.div
          className="share-cta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <p className="share-cta-text">Invita a tus amigos a participar</p>
          <div className="share-cta-buttons">
            <motion.button
              className="btn-success-secondary"
              onClick={() => navigate('/ranking')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              VER RANKING
            </motion.button>
            <motion.button
              className="btn-success-primary"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              VOLVER AL INICIO
            </motion.button>
          </div>
        </motion.div>

        {/* Copied Toast */}
        <AnimatePresence>
          {copiedToast && (
            <motion.div
              className="share-toast"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              ✓ Enlace copiado al portapapeles
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="confirmation-page">
      {/* Background Effects */}
      <div className="confirmation-bg">
        <div className="confirmation-orb confirmation-orb-1" />
        <div className="confirmation-orb confirmation-orb-2" />
      </div>

      {/* Header */}
      <header className="confirmation-header">
        <button onClick={() => navigate('/')} className="confirmation-brand">
          QUINIELA <span>2026</span>
        </button>
        <div className="confirmation-badge">SUPER BOWL LX</div>
      </header>

      <main className="confirmation-main">
        {/* Title Section */}
        <motion.div
          className="confirmation-title-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="confirmation-title">CONFIRMAR QUINIELA</h1>
          <p className="confirmation-subtitle">Revisa tus predicciones antes de enviar</p>

          <div className={`completion-badge ${completedCount === totalSteps ? 'complete' : 'incomplete'}`}>
            <span className="completion-check">{completedCount === totalSteps ? '✓' : '!'}</span>
            <span>{completedCount}/{totalSteps} COMPLETADAS</span>
          </div>
        </motion.div>

        {/* Champion Section */}
        <ChampionCard
          team={predictions.winner}
          onEdit={() => handleEdit(0)}
          delay={0.1}
        />

        {/* Score Section */}
        <ScoreCard
          score={predictions.score}
          onEdit={() => handleEdit(1)}
          delay={0.15}
        />

        {/* Predictions Grid */}
        <div className="predictions-grid">
          <PredictionCard
            title="MVP"
            icon="🏆"
            value={predictions.mvp ? MVP_NAMES[predictions.mvp] : null}
            color="var(--cmyk-yellow)"
            delay={0.2}
            onEdit={() => handleEdit(2)}
          />

          <PredictionCard
            title="PRIMER ANOTADOR"
            icon="🏈"
            value={predictions.first_score ? TEAM_NAMES[predictions.first_score] : null}
            color={predictions.first_score === 'seahawks' ? 'var(--cmyk-cyan)' : 'var(--cmyk-magenta)'}
            delay={0.25}
            onEdit={() => handleEdit(3)}
          >
            {predictions.first_score && (
              <div className="prediction-team-display">
                <img src={TEAM_LOGOS[predictions.first_score]} alt="" />
                <span>{TEAM_SHORT[predictions.first_score]}</span>
              </div>
            )}
          </PredictionCard>

          <PredictionCard
            title="COLOR GATORADE"
            icon="🥤"
            value={predictions.gatorade ? GATORADE_COLORS[predictions.gatorade]?.name : null}
            color={predictions.gatorade ? GATORADE_COLORS[predictions.gatorade]?.color : null}
            delay={0.3}
            onEdit={() => handleEdit(4)}
          >
            {predictions.gatorade && (
              <div className="gatorade-display">
                <div
                  className="gatorade-color-dot"
                  style={{ background: GATORADE_COLORS[predictions.gatorade]?.color }}
                />
                <span>{GATORADE_COLORS[predictions.gatorade]?.name}</span>
              </div>
            )}
          </PredictionCard>

          <PredictionCard
            title="DURACION HIMNO"
            icon="🎤"
            value={predictions.anthem ? `${predictions.anthem} seg` : null}
            color="#9C27B0"
            delay={0.35}
            onEdit={() => handleEdit(5)}
          >
            {predictions.anthem && (
              <div className="anthem-display">
                <span className="anthem-time">{predictions.anthem}</span>
                <span className="anthem-unit">segundos</span>
              </div>
            )}
          </PredictionCard>

          <PredictionCard
            title="PRIMERA CANCION HALFTIME"
            icon="🎵"
            value={predictions.halftime || null}
            color="#E91E63"
            delay={0.4}
            onEdit={() => handleEdit(6)}
          />

          <PredictionCard
            title="MEJOR COMERCIAL"
            icon="📺"
            value={predictions.commercial ? BRAND_NAMES[predictions.commercial] : null}
            color="#2196F3"
            delay={0.45}
            onEdit={() => handleEdit(7)}
          />
        </div>

        {/* User Form */}
        <motion.div
          className="user-form-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="user-form-header">
            <span className="user-form-icon">👤</span>
            <h3>TUS DATOS</h3>
          </div>
          <div className="user-form-fields">
            <div className="form-field">
              <label>NOMBRE</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Tu nombre..."
              />
            </div>
            <div className="form-field">
              <label>EMAIL (OPCIONAL)</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>
        </motion.div>

        {/* Submit Section */}
        <motion.div
          className="submit-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!userName.trim() || isSubmitting || completedCount < totalSteps}
            whileHover={userName.trim() && completedCount === totalSteps ? { scale: 1.03 } : {}}
            whileTap={userName.trim() && completedCount === totalSteps ? { scale: 0.97 } : {}}
          >
            {isSubmitting ? (
              <span className="submit-loading">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  🏈
                </motion.span>
                ENVIANDO...
              </span>
            ) : (
              <>
                <span>ENVIAR MI QUINIELA</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </>
            )}
          </motion.button>

          {completedCount < totalSteps && (
            <p className="submit-warning">
              Completa todas las predicciones para enviar
            </p>
          )}

          <button className="back-link" onClick={() => navigate('/quiniela')}>
            ← VOLVER A EDITAR
          </button>
        </motion.div>
      </main>
    </div>
  )
}
