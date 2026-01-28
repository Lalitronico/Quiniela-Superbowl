import { useWizard, STEPS } from '../context/WizardContext'

// Step Components
import StepWinner from './steps/StepWinner'
import StepScore from './steps/StepScore'
import StepMVP from './steps/StepMVP'
import StepFirstScore from './steps/StepFirstScore'
import StepGatorade from './steps/StepGatorade'
import StepAnthem from './steps/StepAnthem'
import StepHalftime from './steps/StepHalftime'
import StepCommercial from './steps/StepCommercial'

const STEP_COMPONENTS = {
  winner: StepWinner,
  score: StepScore,
  mvp: StepMVP,
  first_score: StepFirstScore,
  gatorade: StepGatorade,
  anthem: StepAnthem,
  halftime: StepHalftime,
  commercial: StepCommercial
}

export default function Quiniela() {
  const { currentStep } = useWizard()

  const currentStepId = STEPS[currentStep]?.id
  const StepComponent = STEP_COMPONENTS[currentStepId]

  if (!StepComponent) {
    return <div>Error: Step not found</div>
  }

  return <StepComponent />
}
