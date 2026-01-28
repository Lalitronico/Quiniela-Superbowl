import { motion } from 'framer-motion'
import { useWizard } from '../../context/WizardContext'
import StepLayout from '../../components/wizard/StepLayout'

const TEAM_LOGOS = {
  seahawks: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
  patriots: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png'
}

const teams = [
  { id: 'seahawks', city: 'Seattle', name: 'Seahawks', conference: 'NFC' },
  { id: 'patriots', city: 'New England', name: 'Patriots', conference: 'AFC' }
]

function TeamOption({ team, logo, isSelected, onSelect, accentColor }) {
  return (
    <motion.button
      className={`team-option ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        '--accent': accentColor === 'cyan' ? 'var(--cmyk-cyan)' : 'var(--cmyk-magenta)',
        '--accent-glow': accentColor === 'cyan' ? 'var(--cmyk-cyan-glow)' : 'var(--cmyk-magenta-glow)'
      }}
    >
      <img src={logo} alt={team.name} className="team-logo mx-auto mb-4" />
      <h3 className="font-display text-2xl md:text-3xl" style={{ color: 'var(--ink)' }}>
        {team.city.toUpperCase()}
      </h3>
      <p className="font-heading text-sm mb-4" style={{ color: 'var(--ink-muted)' }}>
        {team.name} ({team.conference})
      </p>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="selected-badge"
        >
          ✓ ELEGIDO
        </motion.div>
      )}
    </motion.button>
  )
}

export default function StepFirstScore() {
  const { predictions, updatePrediction } = useWizard()

  return (
    <StepLayout
      title="¿QUIEN ANOTA PRIMERO?"
      subtitle="Selecciona el equipo que crees anotara los primeros puntos"
    >
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TeamOption
                team={team}
                logo={TEAM_LOGOS[team.id]}
                isSelected={predictions.first_score === team.id}
                onSelect={() => updatePrediction('first_score', team.id)}
                accentColor={team.id === 'seahawks' ? 'cyan' : 'magenta'}
              />
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center mt-8 font-body text-sm"
          style={{ color: 'var(--ink-muted)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Puede ser touchdown, field goal o safety
        </motion.p>
      </div>
    </StepLayout>
  )
}
