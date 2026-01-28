import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import useParticipant from '../hooks/useParticipant'
import { fireworkConfetti } from '../components/animations/ConfettiExplosion'

const avatars = [
  { emoji: '🏈', name: 'Football' },
  { emoji: '🎯', name: 'Target' },
  { emoji: '🏆', name: 'Trophy' },
  { emoji: '⭐', name: 'Star' },
  { emoji: '🔥', name: 'Fire' },
  { emoji: '💪', name: 'Strong' },
  { emoji: '🦅', name: 'Eagle' },
  { emoji: '🐻', name: 'Bear' },
]

export default function Register() {
  const navigate = useNavigate()
  const { register, loading, error, isRegistered } = useParticipant()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '🏈'
  })
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (isRegistered) {
      navigate('/predictions')
    }
  }, [isRegistered, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    } else if (formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email valido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {
      try {
        await register(formData)
        fireworkConfetti()
        navigate('/predictions')
      } catch (err) {
        // Error handled by hook
      }
    }
  }

  const nextStep = () => {
    if (step === 1 && formData.name.trim().length >= 2) {
      setStep(2)
    } else if (step === 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStep(3)
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 -z-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1920&q=80)'
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0c1220] via-[#0c1220]/95 to-[#0c1220] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-[#D50A0A]'
                  : s < step
                  ? 'w-2 bg-[#D50A0A]/60'
                  : 'w-2 bg-white/20'
              }`}
              animate={{ scale: s === step ? 1.1 : 1 }}
            />
          ))}
        </div>

        <div className="card p-8 md:p-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-block mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/en/a/a2/National_Football_League_logo.svg"
                alt="NFL"
                className="w-16 h-16 mx-auto"
              />
            </motion.div>
            <h1 className="font-display text-3xl md:text-4xl text-white mb-2">
              UNETE A LA QUINIELA
            </h1>
            <p className="font-body text-white/50">
              {step === 1 && 'Como te llamas?'}
              {step === 2 && 'Cual es tu email?'}
              {step === 3 && 'Elige tu avatar'}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Name */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block font-body text-sm text-white/60 mb-2">
                      Tu nombre o apodo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ej: Juan Perez"
                      className="input-field text-xl"
                      autoFocus
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  <motion.button
                    type="button"
                    onClick={nextStep}
                    disabled={formData.name.trim().length < 2}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continuar
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Email */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block font-body text-sm text-white/60 mb-2">
                      Tu email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="input-field text-xl"
                      autoFocus
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      className="btn-ghost flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                      </svg>
                      Atras
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continuar
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Avatar */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-4 gap-3">
                    {avatars.map((avatar, index) => (
                      <motion.button
                        key={avatar.emoji}
                        type="button"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setFormData(prev => ({ ...prev, avatar: avatar.emoji }))}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className={`
                          aspect-square rounded-2xl text-3xl flex items-center justify-center
                          transition-all duration-300
                          ${formData.avatar === avatar.emoji
                            ? 'bg-[#D50A0A] shadow-lg shadow-[#D50A0A]/30 ring-2 ring-[#D50A0A]'
                            : 'bg-white/10 hover:bg-white/20'
                          }
                        `}
                      >
                        {avatar.emoji}
                      </motion.button>
                    ))}
                  </div>

                  {/* Preview */}
                  <div className="card p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#013369] to-[#D50A0A] flex items-center justify-center text-2xl">
                      {formData.avatar}
                    </div>
                    <div>
                      <p className="font-heading text-white">{formData.name}</p>
                      <p className="font-body text-white/50 text-sm">{formData.email}</p>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      className="btn-ghost flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                      </svg>
                      Atras
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Registrando...
                        </>
                      ) : (
                        <>
                          Comenzar
                          <span>🎯</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Footer text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white/30 text-xs mt-8"
          >
            Las predicciones se bloquearan al inicio del partido
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
