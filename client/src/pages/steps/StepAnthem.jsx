import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWizard } from '../../context/WizardContext'
import StepLayout from '../../components/wizard/StepLayout'

const ANTHEM_PRESETS = [
  { value: '90', label: 'Menos de 90s', description: 'Muy rápido' },
  { value: '105', label: '90-120s', description: 'Normal' },
  { value: '130', label: '120-140s', description: 'Largo' },
  { value: '150', label: 'Más de 140s', description: 'Muy largo' }
]

export default function StepAnthem() {
  const { predictions, updatePrediction } = useWizard()
  const [customMode, setCustomMode] = useState(false)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <StepLayout
      title="¿DURACIÓN DEL HIMNO?"
      subtitle="¿Cuántos segundos durará el himno nacional?"
    >
      <div className="max-w-xl mx-auto">
        {/* Preset Options */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {ANTHEM_PRESETS.map((preset, index) => (
            <motion.button
              key={preset.value}
              className={`anthem-option ${predictions.anthem === preset.value ? 'selected' : ''}`}
              onClick={() => {
                updatePrediction('anthem', preset.value)
                setCustomMode(false)
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="font-display text-2xl" style={{ color: 'var(--ink)' }}>
                {preset.label}
              </span>
              <span className="font-body text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>
                {preset.description}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Custom Input */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className="font-heading text-sm mb-4"
            style={{ color: 'var(--cmyk-cyan)' }}
            onClick={() => setCustomMode(!customMode)}
          >
            {customMode ? 'USAR RANGOS' : 'INGRESAR TIEMPO EXACTO'}
          </button>

          {customMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  className="input-score-large"
                  value={predictions.anthem}
                  onChange={(e) => updatePrediction('anthem', e.target.value)}
                  placeholder="120"
                  min="60"
                  max="300"
                />
                <span className="font-heading text-lg" style={{ color: 'var(--ink-muted)' }}>
                  segundos
                </span>
              </div>
              {predictions.anthem && (
                <p className="font-body text-sm" style={{ color: 'var(--ink-muted)' }}>
                  = {formatTime(parseInt(predictions.anthem) || 0)}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          className="card p-4 mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-body text-sm" style={{ color: 'var(--ink-muted)' }}>
            Promedio histórico: <strong style={{ color: 'var(--ink)' }}>110 segundos</strong>
          </p>
          <p className="font-body text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>
            Más largo: Whitney Houston (1991) con 139s
          </p>
        </motion.div>
      </div>
    </StepLayout>
  )
}
