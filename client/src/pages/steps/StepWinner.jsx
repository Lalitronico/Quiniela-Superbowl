import { motion } from 'framer-motion'
import { useWizard } from '../../context/WizardContext'
import StepLayout from '../../components/wizard/StepLayout'

const TEAM_LOGOS = {
  seahawks: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
  patriots: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png'
}

const teams = {
  seahawks: { city: 'SEATTLE', name: 'SEAHAWKS', conference: 'NFC', color: 'cyan' },
  patriots: { city: 'NEW ENGLAND', name: 'PATRIOTS', conference: 'AFC', color: 'magenta' }
}

function TeamCard({ teamId, team, logo, isSelected, onSelect }) {
  const accentColor = team.color === 'cyan' ? 'var(--cmyk-cyan)' : 'var(--cmyk-magenta)'
  const glowColor = team.color === 'cyan' ? 'var(--cmyk-cyan-glow)' : 'var(--cmyk-magenta-glow)'

  return (
    <motion.button
      className={`team-selection-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -8 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        '--team-accent': accentColor,
        '--team-glow': glowColor
      }}
    >
      {/* Glow Effect */}
      <div className="card-glow" />

      {/* Conference Badge */}
      <motion.div
        className="conference-badge"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {team.conference}
      </motion.div>

      {/* Logo */}
      <motion.div
        className="team-logo-wrapper"
        animate={isSelected ? {
          scale: [1, 1.1, 1.05],
          rotate: [0, -5, 5, 0]
        } : { scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src={logo} alt={team.name} className="team-logo-hero" />
      </motion.div>

      {/* Team Name */}
      <div className="team-identity">
        <h3 className="team-city">{team.city}</h3>
        <p className="team-name">{team.name}</p>
      </div>

      {/* Selection State */}
      <motion.div
        className={`selection-indicator ${isSelected ? 'active' : ''}`}
        animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
      >
        {isSelected ? (
          <>
            <span className="check-mark">✓</span>
            <span>CAMPEON ELEGIDO</span>
          </>
        ) : (
          <span>ELEGIR CAMPEON</span>
        )}
      </motion.div>
    </motion.button>
  )
}

function VSBadge() {
  return (
    <motion.div
      className="vs-divider"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
    >
      <div className="vs-line" />
      <div className="vs-circle">
        <span>VS</span>
      </div>
      <div className="vs-line" />
    </motion.div>
  )
}

export default function StepWinner() {
  const { predictions, updatePrediction } = useWizard()

  return (
    <StepLayout
      title="¿QUIEN SERA CAMPEON?"
      subtitle="Elige al equipo que crees ganara el Super Bowl LX"
    >
      <div className="winner-selection">
        <div className="teams-grid">
          <TeamCard
            teamId="seahawks"
            team={teams.seahawks}
            logo={TEAM_LOGOS.seahawks}
            isSelected={predictions.winner === 'seahawks'}
            onSelect={() => updatePrediction('winner', 'seahawks')}
          />

          <VSBadge />

          <TeamCard
            teamId="patriots"
            team={teams.patriots}
            logo={TEAM_LOGOS.patriots}
            isSelected={predictions.winner === 'patriots'}
            onSelect={() => updatePrediction('winner', 'patriots')}
          />
        </div>

        {/* Event Info */}
        <motion.div
          className="event-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="event-date">8 DE FEBRERO, 2026</span>
          <span className="event-divider">•</span>
          <span className="event-location">LEVI'S STADIUM</span>
        </motion.div>
      </div>
    </StepLayout>
  )
}
