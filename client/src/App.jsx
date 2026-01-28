import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { WizardProvider } from './context/WizardContext'

// Pages
import Landing from './pages/Landing'
import Quiniela from './pages/Quiniela'
import Confirmation from './pages/Confirmation'

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/quiniela" element={<Quiniela />} />
        <Route path="/confirmar" element={<Confirmation />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <WizardProvider>
      <AppRoutes />
    </WizardProvider>
  )
}

export default App
