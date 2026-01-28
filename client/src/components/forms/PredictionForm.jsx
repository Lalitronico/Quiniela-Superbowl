import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button, Modal } from '../common'
import { CategoryTabs, QuestionCard } from '../predictions'
import { fireworkConfetti } from '../animations/ConfettiExplosion'

export default function PredictionForm({
  questions,
  initialPredictions = {},
  onSubmit,
  loading = false,
  disabled = false
}) {
  const [activeCategory, setActiveCategory] = useState('deportivas')
  const [predictions, setPredictions] = useState(initialPredictions)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const categories = ['deportivas', 'entretenimiento', 'comerciales', 'curiosidades']

  const categoryQuestions = questions.filter(q => q.category === activeCategory)

  const completedCategories = categories.filter(cat => {
    const catQuestions = questions.filter(q => q.category === cat)
    return catQuestions.every(q => {
      const answer = predictions[q.id]
      if (q.type === 'score') {
        return answer?.team1 && answer?.team2
      }
      return !!answer
    })
  })

  const totalQuestions = questions.length
  const answeredQuestions = Object.keys(predictions).filter(key => {
    const question = questions.find(q => q.id === key)
    if (!question) return false
    const answer = predictions[key]
    if (question.type === 'score') {
      return answer?.team1 && answer?.team2
    }
    return !!answer
  }).length

  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  const handlePredictionChange = (questionId, value) => {
    setPredictions(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = () => {
    if (answeredQuestions < totalQuestions) {
      setShowConfirmModal(true)
    } else {
      submitPredictions()
    }
  }

  const submitPredictions = () => {
    setShowConfirmModal(false)
    onSubmit(predictions)
    if (answeredQuestions === totalQuestions) {
      fireworkConfetti()
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="bg-white/10 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-superbowl-gold to-yellow-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between text-sm text-white/60">
        <span>{answeredQuestions} de {totalQuestions} respondidas</span>
        <span>{Math.round(progress)}% completado</span>
      </div>

      {/* Category tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        completedCategories={completedCategories}
      />

      {/* Questions */}
      <div className="space-y-4">
        {categoryQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            value={predictions[question.id]}
            onChange={handlePredictionChange}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Navigation and submit */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <div className="flex gap-2 flex-1">
          {categories.map((cat, index) => {
            const currentIndex = categories.indexOf(activeCategory)
            if (index === currentIndex - 1) {
              return (
                <Button
                  key={cat}
                  variant="ghost"
                  onClick={() => setActiveCategory(cat)}
                >
                  ← Anterior
                </Button>
              )
            }
            if (index === currentIndex + 1) {
              return (
                <Button
                  key={cat}
                  variant="secondary"
                  onClick={() => setActiveCategory(cat)}
                >
                  Siguiente →
                </Button>
              )
            }
            return null
          })}
        </div>

        <Button
          variant="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={disabled || answeredQuestions === 0}
          className="min-w-[200px]"
        >
          {answeredQuestions === totalQuestions ? 'Enviar Predicciones' : 'Guardar Progreso'}
        </Button>
      </div>

      {/* Confirmation modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar envio"
      >
        <div className="space-y-4">
          <p className="text-white/80">
            Tienes {totalQuestions - answeredQuestions} preguntas sin responder.
          </p>
          <p className="text-white/60 text-sm">
            Puedes enviar tus predicciones ahora y completar las restantes despues,
            o continuar respondiendo.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1"
            >
              Seguir respondiendo
            </Button>
            <Button
              variant="primary"
              onClick={submitPredictions}
              className="flex-1"
            >
              Enviar ahora
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
