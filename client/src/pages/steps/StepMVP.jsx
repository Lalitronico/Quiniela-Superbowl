import { motion } from 'framer-motion'
import { useWizard } from '../../context/WizardContext'
import StepLayout from '../../components/wizard/StepLayout'

// Real player images from ESPN
const MVP_OPTIONS = [
  {
    id: 'geno_smith',
    name: 'Geno Smith',
    team: 'Seahawks',
    position: 'QB',
    image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/14875.png&w=350&h=254',
    accentColor: 'cyan'
  },
  {
    id: 'dk_metcalf',
    name: 'DK Metcalf',
    team: 'Seahawks',
    position: 'WR',
    image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/3895856.png&w=350&h=254',
    accentColor: 'cyan'
  },
  {
    id: 'kenneth_walker',
    name: 'Kenneth Walker III',
    team: 'Seahawks',
    position: 'RB',
    image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4362887.png&w=350&h=254',
    accentColor: 'cyan'
  },
  {
    id: 'devon_witherspoon',
    name: 'Devon Witherspoon',
    team: 'Seahawks',
    position: 'CB',
    image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4429013.png&w=350&h=254',
    accentColor: 'cyan'
  },
  {
    id: 'drake_maye',
    name: 'Drake Maye',
    team: 'Patriots',
    position: 'QB',
    image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4431452.png&w=350&h=254',
    accentColor: 'magenta'
  },
  {
    id: 'rhamondre_stevenson',
    name: 'Rhamondre Stevenson',
    team: 'Patriots',
    position: 'RB',
    image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4259545.png&w=350&h=254',
    accentColor: 'magenta'
  }
]

function PlayerCard({ player, isSelected, onSelect }) {
  const accentVar = player.accentColor === 'cyan' ? 'var(--cmyk-cyan)' : 'var(--cmyk-magenta)'
  const glowVar = player.accentColor === 'cyan' ? 'var(--cmyk-cyan-glow)' : 'var(--cmyk-magenta-glow)'

  return (
    <motion.button
      className={`player-card-image ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        '--accent': accentVar,
        '--accent-glow': glowVar
      }}
    >
      <div className="player-image-container">
        <img
          src={player.image}
          alt={player.name}
          className="player-image"
          loading="lazy"
        />
        <div className="player-overlay" />
        <div className="player-info">
          <h4 className="player-name">{player.name}</h4>
          <div className="player-meta">
            <span className="player-position" style={{ background: accentVar }}>{player.position}</span>
            <span className="player-team">{player.team}</span>
          </div>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="player-check-badge"
          >
            ✓
          </motion.div>
        )}
      </div>
    </motion.button>
  )
}

function OtherOption({ isSelected, onSelect }) {
  return (
    <motion.button
      className={`player-card-image ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        '--accent': 'var(--cmyk-yellow)',
        '--accent-glow': 'var(--cmyk-yellow-glow)'
      }}
    >
      <div className="player-image-container" style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)' }}>
        <div className="flex items-center justify-center h-full">
          <span className="text-6xl">🏈</span>
        </div>
        <div className="player-overlay" />
        <div className="player-info">
          <h4 className="player-name">Otro Jugador</h4>
          <div className="player-meta">
            <span className="player-position" style={{ background: 'var(--cmyk-yellow)' }}>?</span>
            <span className="player-team">Sorpresa</span>
          </div>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="player-check-badge"
          >
            ✓
          </motion.div>
        )}
      </div>
    </motion.button>
  )
}

export default function StepMVP() {
  const { predictions, updatePrediction } = useWizard()

  return (
    <StepLayout
      title="¿QUIÉN SERÁ MVP?"
      subtitle="Selecciona al jugador más valioso del partido"
    >
      <div className="max-w-4xl mx-auto">
        {/* Team Labels - Hidden on mobile */}
        <div className="hidden md:flex justify-center gap-8 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--cmyk-cyan)' }} />
            <span className="font-heading text-sm" style={{ color: 'var(--ink-muted)' }}>SEAHAWKS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--cmyk-magenta)' }} />
            <span className="font-heading text-sm" style={{ color: 'var(--ink-muted)' }}>PATRIOTS</span>
          </div>
        </div>

        {/* Player Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {MVP_OPTIONS.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PlayerCard
                player={player}
                isSelected={predictions.mvp === player.id}
                onSelect={() => updatePrediction('mvp', player.id)}
              />
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: MVP_OPTIONS.length * 0.05 }}
          >
            <OtherOption
              isSelected={predictions.mvp === 'otro'}
              onSelect={() => updatePrediction('mvp', 'otro')}
            />
          </motion.div>
        </div>

        {/* Info - Hidden on mobile */}
        <motion.p
          className="hidden md:block text-center mt-8 font-body text-sm"
          style={{ color: 'var(--ink-muted)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          El MVP recibe un auto nuevo y un viaje a Disney World
        </motion.p>
      </div>
    </StepLayout>
  )
}
