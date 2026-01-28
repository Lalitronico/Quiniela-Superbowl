import { motion } from 'framer-motion'
import { useWizard } from '../../context/WizardContext'
import StepLayout from '../../components/wizard/StepLayout'

const POPULAR_SONGS = [
  'Dakiti',
  'Titi Me Pregunto',
  'Me Porto Bonito',
  'Callaita',
  'La Canción',
  'Safaera',
  'Yonaguni',
  'Moscow Mule'
]

export default function StepHalftime() {
  const { predictions, updatePrediction } = useWizard()

  const handleSongClick = (song) => {
    updatePrediction('halftime', song)
  }

  return (
    <StepLayout
      title="MEDIO TIEMPO"
      subtitle="¿Cuál será la primera canción de Bad Bunny?"
    >
      <div className="max-w-xl mx-auto">
        {/* Artist Info */}
        <motion.div
          className="card p-6 mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg, var(--cmyk-magenta-glow), var(--cmyk-cyan-glow))' }}
        >
          <span className="font-heading text-sm" style={{ color: 'var(--ink-muted)' }}>
            ARTISTA DEL MEDIO TIEMPO
          </span>
          <h3 className="font-display text-4xl md:text-5xl mt-2" style={{ color: 'var(--ink)' }}>
            BAD BUNNY
          </h3>
        </motion.div>

        {/* Song Suggestions */}
        <div className="mb-6">
          <p className="font-heading text-sm mb-3 text-center" style={{ color: 'var(--ink-muted)' }}>
            CANCIONES POPULARES
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_SONGS.map((song, index) => (
              <motion.button
                key={song}
                className={`btn-select ${predictions.halftime === song ? 'active' : ''}`}
                onClick={() => handleSongClick(song)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {song}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-heading text-sm mb-3 text-center" style={{ color: 'var(--ink-muted)' }}>
            O ESCRIBE TU PREDICCIÓN
          </p>
          <input
            type="text"
            className="input text-center"
            value={predictions.halftime}
            onChange={(e) => updatePrediction('halftime', e.target.value)}
            placeholder="Nombre de la canción..."
          />
        </motion.div>

        {/* Info */}
        <motion.p
          className="text-center mt-8 font-body text-sm"
          style={{ color: 'var(--ink-muted)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Primer artista latino en encabezar el show del medio tiempo
        </motion.p>
      </div>
    </StepLayout>
  )
}
