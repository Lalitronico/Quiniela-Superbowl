import { motion } from 'framer-motion'
import { useWizard } from '../../context/WizardContext'
import StepLayout from '../../components/wizard/StepLayout'

const TEAM_LOGOS = {
  seahawks: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
  patriots: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png'
}

function ScoreInput({ team, logo, value, onChange, accentColor }) {
  return (
    <motion.div
      className="card p-6 md:p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <img src={logo} alt={team} className="team-logo mx-auto mb-4" />
      <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--ink)' }}>{team}</h3>
      <input
        type="number"
        className="input-score-large"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        min="0"
        max="99"
        style={{
          '--focus-color': accentColor === 'cyan' ? 'var(--cmyk-cyan)' : 'var(--cmyk-magenta)',
          '--focus-glow': accentColor === 'cyan' ? 'var(--cmyk-cyan-glow)' : 'var(--cmyk-magenta-glow)'
        }}
      />
      <p className="font-body text-sm mt-3" style={{ color: 'var(--ink-muted)' }}>puntos</p>
    </motion.div>
  )
}

export default function StepScore() {
  const { predictions, updatePrediction } = useWizard()

  const handleScoreChange = (team, value) => {
    updatePrediction('score', {
      ...predictions.score,
      [team]: value
    })
  }

  const totalScore = (parseInt(predictions.score.seahawks) || 0) + (parseInt(predictions.score.patriots) || 0)

  return (
    <StepLayout
      title="¿CUAL SERA EL MARCADOR?"
      subtitle="Predice los puntos finales de cada equipo"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-8">
          <div className="flex-1">
            <ScoreInput
              team="SEAHAWKS"
              logo={TEAM_LOGOS.seahawks}
              value={predictions.score.seahawks}
              onChange={(v) => handleScoreChange('seahawks', v)}
              accentColor="cyan"
            />
          </div>

          <div className="flex items-center justify-center">
            <motion.div
              className="score-dash"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              —
            </motion.div>
          </div>

          <div className="flex-1">
            <ScoreInput
              team="PATRIOTS"
              logo={TEAM_LOGOS.patriots}
              value={predictions.score.patriots}
              onChange={(v) => handleScoreChange('patriots', v)}
              accentColor="magenta"
            />
          </div>
        </div>

        {/* Total Score */}
        <motion.div
          className="text-center mt-8 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}
        >
          <p className="font-heading text-sm mb-2" style={{ color: 'var(--ink-muted)' }}>PUNTOS TOTALES</p>
          <p className="font-display text-4xl" style={{ color: 'var(--ink)' }}>{totalScore}</p>
          <p className="font-body text-xs mt-2" style={{ color: 'var(--ink-muted)' }}>
            Este valor sirve como desempate
          </p>
        </motion.div>
      </div>
    </StepLayout>
  )
}
