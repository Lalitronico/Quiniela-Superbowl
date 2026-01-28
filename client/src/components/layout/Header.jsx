import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/predictions', label: 'Predicciones' },
    { path: '/leaderboard', label: 'Ranking' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0f1a]/95 backdrop-blur-md border-b border-white/10" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/en/a/a2/National_Football_League_logo.svg"
                alt="NFL"
                className="w-12 h-12"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-display text-xl text-white tracking-wider">
                QUINIELA
              </span>
              <span className="font-heading text-xs text-[#D50A0A] tracking-[0.2em]">
                SUPER BOWL LX
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative"
                >
                  <motion.div
                    className={`
                      flex items-center gap-2 px-5 py-2.5 rounded-full font-heading text-sm tracking-wide
                      transition-colors duration-300
                      ${isActive
                        ? 'text-white'
                        : 'text-white/60 hover:text-white'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{link.label}</span>

                    {isActive && (
                      <motion.div
                        layoutId="navPill"
                        className="absolute inset-0 bg-[#D50A0A] rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/register">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Unirme</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex flex-col gap-1.5">
              <motion.span
                className="w-5 h-0.5 bg-white rounded-full"
                animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 4 : 0 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-white rounded-full"
                animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-white rounded-full"
                animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -4 : 0 }}
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: mobileMenuOpen ? 'auto' : 0,
            opacity: mobileMenuOpen ? 1 : 0
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-heading
                    transition-all duration-300
                    ${isActive
                      ? 'bg-[#D50A0A] text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <span>{link.label}</span>
                </Link>
              )
            })}

            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block mt-4"
            >
              <button className="btn-primary w-full">
                Unirme Ahora
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </header>
  )
}
