import { createContext, useContext, useState, useEffect } from 'react'

const WizardContext = createContext()

export const STEPS = [
  { id: 'winner', title: 'CAMPEON', shortTitle: 'Ganador' },
  { id: 'score', title: 'MARCADOR', shortTitle: 'Score' },
  { id: 'mvp', title: 'MVP', shortTitle: 'MVP' },
  { id: 'first_score', title: 'PRIMER ANOTADOR', shortTitle: '1er Punt' },
  { id: 'gatorade', title: 'GATORADE', shortTitle: 'Gatorade' },
  { id: 'anthem', title: 'HIMNO', shortTitle: 'Himno' },
  { id: 'halftime', title: 'MEDIO TIEMPO', shortTitle: 'Halftime' },
  { id: 'commercial', title: 'COMERCIALES', shortTitle: 'Ads' }
]

export function WizardProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [predictions, setPredictions] = useState({
    winner: null,
    score: { seahawks: '', patriots: '' },
    mvp: null,
    first_score: null,
    gatorade: null,
    anthem: '',
    halftime: '',
    commercial: null
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  const updatePrediction = (key, value) => {
    setPredictions(prev => ({ ...prev, [key]: value }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const goToStep = (step) => {
    if (step >= 0 && step < STEPS.length) {
      setCurrentStep(step)
    }
  }

  const isStepComplete = (stepId) => {
    const pred = predictions[stepId]
    if (stepId === 'score') {
      return pred.seahawks !== '' && pred.patriots !== ''
    }
    return pred !== null && pred !== ''
  }

  const getCompletedCount = () => {
    return STEPS.filter(step => isStepComplete(step.id)).length
  }

  const canProceed = () => {
    return isStepComplete(STEPS[currentStep]?.id)
  }

  return (
    <WizardContext.Provider value={{
      currentStep,
      setCurrentStep,
      predictions,
      updatePrediction,
      nextStep,
      prevStep,
      goToStep,
      isStepComplete,
      getCompletedCount,
      canProceed,
      totalSteps: STEPS.length
    }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider')
  }
  return context
}
