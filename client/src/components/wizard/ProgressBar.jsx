import { motion } from 'framer-motion'
import { useWizard, STEPS } from '../../context/WizardContext'

export default function ProgressBar() {
  const { currentStep, isStepComplete, goToStep } = useWizard()

  return (
    <div className="progress-bar-container">
      {/* Mobile: Simplified dots */}
      <div className="progress-dots md:hidden">
        {STEPS.map((step, index) => {
          const isActive = index === currentStep
          const isComplete = isStepComplete(step.id)
          const isPast = index < currentStep

          return (
            <motion.button
              key={step.id}
              className={`progress-dot ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''} ${isPast ? 'past' : ''}`}
              onClick={() => goToStep(index)}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
            />
          )
        })}
      </div>

      {/* Desktop: Full progress with labels */}
      <div className="hidden md:flex items-center justify-center gap-1">
        {STEPS.map((step, index) => {
          const isActive = index === currentStep
          const isComplete = isStepComplete(step.id)
          const isPast = index < currentStep

          return (
            <div key={step.id} className="flex items-center">
              <motion.button
                className={`progress-step ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''} ${isPast ? 'past' : ''}`}
                onClick={() => goToStep(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="progress-step-number">{index + 1}</span>
                <span className="progress-step-label">{step.shortTitle}</span>
              </motion.button>

              {index < STEPS.length - 1 && (
                <div className={`progress-connector ${isPast || isComplete ? 'filled' : ''}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step counter */}
      <div className="text-center mt-3">
        <span className="font-heading text-sm" style={{ color: 'var(--ink-muted)' }}>
          PASO {currentStep + 1} DE {STEPS.length}
        </span>
      </div>
    </div>
  )
}
