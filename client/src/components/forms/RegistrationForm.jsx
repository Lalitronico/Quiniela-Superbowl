import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input, Button, Card } from '../common'

const avatars = ['🏈', '🎯', '🏆', '⭐', '🔥', '💪', '🎪', '🎭']

export default function RegistrationForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: avatars[0]
  })
  const [errors, setErrors] = useState({})

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display text-superbowl-gold mb-2">
            Unete a la Quiniela
          </h2>
          <p className="text-white/60">
            Registrate para hacer tus predicciones
          </p>
        </div>

        <Input
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tu nombre o apodo"
          error={errors.name}
          required
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          error={errors.email}
          required
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/80">
            Elige tu avatar
          </label>
          <div className="flex flex-wrap gap-2">
            {avatars.map((avatar) => (
              <motion.button
                key={avatar}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`
                  w-12 h-12 rounded-lg text-2xl flex items-center justify-center
                  transition-all duration-200
                  ${formData.avatar === avatar
                    ? 'bg-superbowl-gold/30 border-2 border-superbowl-gold'
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                  }
                `}
              >
                {avatar}
              </motion.button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
        >
          Registrarme
        </Button>

        <p className="text-center text-white/40 text-sm">
          Al registrarte aceptas participar en esta quiniela amistosa
        </p>
      </form>
    </Card>
  )
}
