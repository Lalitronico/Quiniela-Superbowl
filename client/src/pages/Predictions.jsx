import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useParticipant, usePredictions } from '../hooks'
import { fireworkConfetti } from '../components/animations/ConfettiExplosion'

const categories = [
  { id: 'deportivas', label: 'Deportivas', icon: '🏈', color: 'from-[#013369] to-[#012247]', description: 'Resultados del partido' },
  { id: 'entretenimiento', label: 'Entretenimiento', icon: '🎤', color: 'from-[#D50A0A] to-[#8B0000]', description: 'Show de medio tiempo' },
  { id: 'comerciales', label: 'Comerciales', icon: '📺', color: 'from-[#013369] to-[#012247]', description: 'Los mejores anuncios' },
  { id: 'curiosidades', label: 'Curiosidades', icon: '🎯', color: 'from-[#D50A0A] to-[#8B0000]', description: 'Datos random' }
]

const difficultyConfig = {
  easy: { label: 'Facil', multiplier: '1x', class: 'difficulty-easy' },
  medium: { label: 'Media', multiplier: '1.5x', class: 'difficulty-medium' },
  hard: { label: 'Dificil', multiplier: '2x', class: 'difficulty-hard' }
}

function QuestionCard({ question, index, value, onChange, disabled }) {
  const difficulty = difficultyConfig[question.difficulty]
  const hasValue = question.type === 'score'
    ? value?.team1 && value?.team2
    : !!value

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`question-card ${hasValue ? 'answered' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D50A0A]/20 to-[#D50A0A]/5 border border-[#D50A0A]/30 flex items-center justify-center font-display text-[#D50A0A]">
            {index + 1}
          </div>
          <div className={`${difficulty.class}`}>
            {difficulty.label} ({difficulty.multiplier})
          </div>
        </div>

        {hasValue && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Question text */}
      <h3 className="font-heading text-xl text-white mb-4">
        {question.text}
      </h3>

      {/* Input based on type */}
      {question.type === 'select' && (
        <div className="grid grid-cols-2 gap-2">
          {question.options.map((option) => (
            <motion.button
              key={option}
              type="button"
              onClick={() => !disabled && onChange(question.id, option)}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={`
                p-3 rounded-xl text-left font-body text-sm transition-all duration-300
                ${value === option
                  ? 'bg-gradient-to-r from-[#D50A0A]/30 to-[#D50A0A]/10 border-2 border-[#D50A0A] text-white'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {option}
            </motion.button>
          ))}
        </div>
      )}

      {question.type === 'number' && (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(question.id, e.target.value)}
          placeholder={question.placeholder || 'Ingresa un numero...'}
          disabled={disabled}
          className="input-field"
        />
      )}

      {question.type === 'text' && (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(question.id, e.target.value)}
          placeholder={question.placeholder || 'Escribe tu respuesta...'}
          disabled={disabled}
          className="input-field"
        />
      )}

      {question.type === 'score' && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block font-body text-xs text-white/50 mb-2 uppercase tracking-wider">
              {question.team1 || 'Equipo 1'}
            </label>
            <input
              type="number"
              value={value?.team1 || ''}
              onChange={(e) => onChange(question.id, { ...value, team1: e.target.value })}
              placeholder="0"
              disabled={disabled}
              className="input-field text-center text-2xl font-display"
            />
          </div>
          <div className="text-3xl font-display text-white/30 pt-6">VS</div>
          <div className="flex-1">
            <label className="block font-body text-xs text-white/50 mb-2 uppercase tracking-wider">
              {question.team2 || 'Equipo 2'}
            </label>
            <input
              type="number"
              value={value?.team2 || ''}
              onChange={(e) => onChange(question.id, { ...value, team2: e.target.value })}
              placeholder="0"
              disabled={disabled}
              className="input-field text-center text-2xl font-display"
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function Predictions() {
  const navigate = useNavigate()
  const { participant, isRegistered, loading: participantLoading } = useParticipant()
  const { questions, predictions, loading, saving, error, savePredictions } = usePredictions(participant?.id)
  const [activeCategory, setActiveCategory] = useState('deportivas')
  const [localPredictions, setLocalPredictions] = useState({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!participantLoading && !isRegistered) {
      navigate('/register')
    }
  }, [participantLoading, isRegistered, navigate])

  useEffect(() => {
    setLocalPredictions(predictions)
  }, [predictions])

  const handlePredictionChange = (questionId, value) => {
    setLocalPredictions(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = async () => {
    const success = await savePredictions(localPredictions)
    if (success) {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)

      // Check if all answered
      const answeredCount = Object.keys(localPredictions).filter(key => {
        const question = questions.find(q => q.id === key)
        if (!question) return false
        const answer = localPredictions[key]
        if (question.type === 'score') {
          return answer?.team1 && answer?.team2
        }
        return !!answer
      }).length

      if (answeredCount === questions.length) {
        fireworkConfetti()
      }
    }
  }

  const categoryQuestions = questions.filter(q => q.category === activeCategory)

  const getCategoryProgress = (categoryId) => {
    const catQuestions = questions.filter(q => q.category === categoryId)
    const answered = catQuestions.filter(q => {
      const answer = localPredictions[q.id]
      if (q.type === 'score') {
        return answer?.team1 && answer?.team2
      }
      return !!answer
    }).length
    return { answered, total: catQuestions.length }
  }

  const totalAnswered = Object.keys(localPredictions).filter(key => {
    const question = questions.find(q => q.id === key)
    if (!question) return false
    const answer = localPredictions[key]
    if (question.type === 'score') {
      return answer?.team1 && answer?.team2
    }
    return !!answer
  }).length

  const progress = questions.length > 0 ? (totalAnswered / questions.length) * 100 : 0

  if (participantLoading || (isRegistered && loading)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-[#D50A0A]/30 border-t-[#D50A0A]"
        />
        <p className="mt-6 font-body text-white/50">Cargando predicciones...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-4xl md:text-5xl text-white mb-2">
          MIS PREDICCIONES
        </h1>
        {participant && (
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">{participant.avatar}</span>
            <span className="font-body text-white/60">
              Jugando como <span className="text-white font-semibold">{participant.name}</span>
            </span>
          </div>
        )}
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading text-white/80">PROGRESO</span>
          <span className="font-display text-[#D50A0A]">{totalAnswered}/{questions.length}</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-right text-sm text-white/40 mt-2">{Math.round(progress)}% completado</p>
      </motion.div>

      {/* Messages */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-center font-body"
          >
            <span className="mr-2">✓</span>
            Predicciones guardadas exitosamente!
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-center font-body"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        {categories.map((category) => {
          const { answered, total } = getCategoryProgress(category.id)
          const isActive = activeCategory === category.id
          const isComplete = answered === total

          return (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 rounded-2xl text-left transition-all duration-300 overflow-hidden
                ${isActive
                  ? 'bg-gradient-to-br ' + category.color + ' shadow-lg'
                  : 'card hover:border-white/20'
                }
              `}
            >
              {/* Completed indicator */}
              {isComplete && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <span className="text-3xl block mb-2">{category.icon}</span>
              <h3 className={`font-heading text-sm ${isActive ? 'text-white' : 'text-white/80'}`}>
                {category.label}
              </h3>
              <p className={`font-body text-xs mt-1 ${isActive ? 'text-white/80' : 'text-white/40'}`}>
                {answered}/{total} respondidas
              </p>

              {/* Progress bar inside card */}
              <div className="mt-3 h-1 bg-black/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(answered / total) * 100}%` }}
                />
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Questions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {categoryQuestions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                value={localPredictions[question.id]}
                onChange={handlePredictionChange}
                disabled={false}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-col sm:flex-row gap-4"
      >
        {/* Category navigation */}
        <div className="flex gap-2 flex-1">
          {categories.map((cat, index) => {
            const currentIndex = categories.findIndex(c => c.id === activeCategory)
            if (index === currentIndex - 1) {
              return (
                <motion.button
                  key={`prev-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className="btn-ghost"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {cat.label}
                </motion.button>
              )
            }
            if (index === currentIndex + 1) {
              return (
                <motion.button
                  key={`next-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className="btn-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cat.label}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              )
            }
            return null
          })}
        </div>

        {/* Submit button */}
        <motion.button
          onClick={handleSubmit}
          disabled={saving || totalAnswered === 0}
          className="btn-primary min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: saving ? 1 : 1.02 }}
          whileTap={{ scale: saving ? 1 : 0.98 }}
        >
          {saving ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Guardando...
            </>
          ) : totalAnswered === questions.length ? (
            <>
              <span>🎯</span>
              Enviar Todo
            </>
          ) : (
            <>
              <span>💾</span>
              Guardar ({totalAnswered}/{questions.length})
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Go to leaderboard */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <button
          onClick={() => navigate('/leaderboard')}
          className="font-body text-white/50 hover:text-[#D50A0A] transition-colors"
        >
          Ver Tabla de Posiciones →
        </button>
      </motion.div>
    </div>
  )
}
