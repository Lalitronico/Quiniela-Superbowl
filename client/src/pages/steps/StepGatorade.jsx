import { motion } from 'framer-motion'
import { useWizard } from '../../context/WizardContext'
import StepLayout from '../../components/wizard/StepLayout'

const GATORADE_OPTIONS = [
  { id: 'naranja', name: 'Naranja', color: '#FF6B00', emoji: '🟠' },
  { id: 'azul', name: 'Azul', color: '#0066FF', emoji: '🔵' },
  { id: 'amarillo', name: 'Amarillo', color: '#FFD700', emoji: '🟡' },
  { id: 'verde', name: 'Verde', color: '#00CC66', emoji: '🟢' },
  { id: 'rojo', name: 'Rojo', color: '#FF0033', emoji: '🔴' },
  { id: 'morado', name: 'Morado', color: '#9933FF', emoji: '🟣' },
  { id: 'transparente', name: 'Transparente', color: '#E8E8E8', emoji: '⚪' },
  { id: 'ninguno', name: 'No habra', color: '#666666', emoji: '❌' }
]

function ColorOption({ option, isSelected, onSelect }) {
  return (
    <motion.button
      className={`color-option ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ '--color': option.color }}
    >
      <div className="color-circle" style={{ background: option.color }}>
        {isSelected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="color-check"
          >
            ✓
          </motion.span>
        )}
      </div>
      <p className="font-heading text-sm mt-3" style={{ color: 'var(--ink)' }}>
        {option.name}
      </p>
    </motion.button>
  )
}

export default function StepGatorade() {
  const { predictions, updatePrediction } = useWizard()

  return (
    <StepLayout
      title="¿COLOR DEL GATORADE?"
      subtitle="¿De que color sera el Gatorade que le echaran al entrenador ganador?"
    >
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {GATORADE_OPTIONS.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ColorOption
                option={option}
                isSelected={predictions.gatorade === option.id}
                onSelect={() => updatePrediction('gatorade', option.id)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-body text-sm" style={{ color: 'var(--ink-muted)' }}>
            Tradicion del Super Bowl desde 1987
          </p>
        </motion.div>
      </div>
    </StepLayout>
  )
}
