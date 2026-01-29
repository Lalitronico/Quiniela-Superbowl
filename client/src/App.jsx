import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { WizardProvider } from './context/WizardContext'
import { BrandProvider } from './context/BrandContext'

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

// Brand-scoped routes wrapper
function BrandRoutes() {
  const location = useLocation()

  return (
    <BrandProvider>
      <WizardProvider>
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
      </WizardProvider>
    </BrandProvider>
  )
}

function App() {
  return (
    <Routes>
      {/* Redirect root to default brand */}
      <Route path="/" element={<Navigate to="/default" replace />} />

      {/* All brand routes */}
      <Route path="/:brand/*" element={<BrandRoutes />} />
    </Routes>
  )
}

export default App
