import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWizard, STEPS } from '../context/WizardContext'

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

  // Success State
  if (isSubmitted) {
    return (
      <div className="confirmation-success">
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <ConfettiParticle key={i} index={i} />
          ))}
        </div>

        <motion.div
          className="success-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="success-icon"
            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            🏈
          </motion.div>
          <h1 className="success-title">¡QUINIELA ENVIADA!</h1>
          <p className="success-message">
            Buena suerte, <span>{userName}</span>. Te avisaremos los resultados.
          </p>
          <div className="success-actions">
            <motion.button
              className="btn-success-primary"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              VOLVER AL INICIO
            </motion.button>
            <motion.button
              className="btn-success-secondary"
              onClick={() => navigate('/ranking')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              VER RANKING
            </motion.button>
          </div>
        </motion.div>
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
