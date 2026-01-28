import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWizard, STEPS } from '../../context/WizardContext'
import ProgressBar from './ProgressBar'

// Subtle grid pattern background
function GridPattern() {
  return (
    <div className="grid-pattern">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}

// Ambient glow effects
function AmbientGlow() {
  return (
    <div className="ambient-glow">
      <div className="glow-orb glow-magenta" />
      <div className="glow-orb glow-cyan" />
    </div>
  )
}

export default function StepLayout({ children, title, subtitle }) {
  const navigate = useNavigate()
  const { currentStep, nextStep, prevStep, canProceed, totalSteps } = useWizard()

  const isLastStep = currentStep === totalSteps - 1

  const handleNext = () => {
    if (isLastStep) {
      navigate('/confirmar')
    } else {
      nextStep()
    }
  }

  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/')
    } else {
      prevStep()
    }
  }

  return (
    <div className="step-page">
      {/* Background Effects */}
      <GridPattern />
      <AmbientGlow />

      {/* Header */}
      <header className="step-header">
        <div className="container flex items-center justify-between h-14">
          <button
            onClick={() => navigate('/')}
            className="logo-link"
          >
            <span className="font-display text-lg">QUINIELA</span>
            <span className="logo-year-sm">2026</span>
          </button>
          <div className="event-badge-sm">SUPER BOWL LX</div>
        </div>
      </header>

      {/* Progress */}
      <div className="progress-section">
        <ProgressBar />
      </div>

      {/* Main Content */}
      <main className="step-main">
        <div className="container relative z-10 py-6 md:py-10">
          {/* Step Header */}
          <motion.div
            className="text-center mb-8 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.h1
              className="step-title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                className="step-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="step-footer">
        <div className="container">
          <div className="nav-buttons">
            <motion.button
              className="nav-btn nav-btn-back"
              onClick={handleBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="nav-arrow">←</span>
              <span>ATRAS</span>
            </motion.button>

            <motion.button
              className={`nav-btn nav-btn-next ${canProceed() ? 'active' : 'disabled'}`}
              onClick={handleNext}
              disabled={!canProceed()}
              whileHover={canProceed() ? { scale: 1.02 } : {}}
              whileTap={canProceed() ? { scale: 0.98 } : {}}
            >
              <span>{isLastStep ? 'FINALIZAR' : 'CONTINUAR'}</span>
              <span className="nav-arrow">→</span>
            </motion.button>
          </div>
        </div>
      </footer>
    </div>
  )
}
