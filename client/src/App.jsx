import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { WizardProvider } from './context/WizardContext'

// Landing loads immediately (critical for LCP)
import Landing from './pages/Landing'

// Lazy load other pages (code splitting)
const Quiniela = lazy(() => import('./pages/Quiniela'))
const Confirmation = lazy(() => import('./pages/Confirmation'))

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper-dark)' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--cmyk-cyan)', borderTopColor: 'transparent' }} />
        <p className="font-heading" style={{ color: 'var(--ink-muted)' }}>Cargando...</p>
      </div>
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/quiniela" element={<Quiniela />} />
          <Route path="/confirmar" element={<Confirmation />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
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
