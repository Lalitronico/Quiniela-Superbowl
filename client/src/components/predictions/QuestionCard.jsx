import { motion } from 'framer-motion'
import { Card, Select, Input } from '../common'

export default function QuestionCard({
  question,
  index,
  value,
  onChange,
  disabled = false
}) {
  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const difficultyLabels = {
    easy: 'Facil (1x)',
    medium: 'Media (1.5x)',
    hard: 'Dificil (2x)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden">
        {/* Difficulty badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[question.difficulty]}`}>
            {difficultyLabels[question.difficulty]}
          </span>
        </div>

        {/* Question number */}
        <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-superbowl-gold text-stadium-dark flex items-center justify-center font-bold text-sm">
          {index + 1}
        </div>

        <div className="pt-12 pb-2">
          <h3 className="text-lg font-semibold text-white mb-4">
            {question.text}
          </h3>

          {question.type === 'select' && (
            <Select
              name={question.id}
              value={value || ''}
              onChange={(e) => onChange(question.id, e.target.value)}
              options={question.options.map(opt => ({ value: opt, label: opt }))}
              placeholder="Selecciona tu prediccion..."
              disabled={disabled}
            />
          )}

          {question.type === 'number' && (
            <Input
              type="number"
              name={question.id}
              value={value || ''}
              onChange={(e) => onChange(question.id, e.target.value)}
              placeholder={question.placeholder || 'Ingresa tu prediccion...'}
              disabled={disabled}
            />
          )}

          {question.type === 'text' && (
            <Input
              type="text"
              name={question.id}
              value={value || ''}
              onChange={(e) => onChange(question.id, e.target.value)}
              placeholder={question.placeholder || 'Ingresa tu prediccion...'}
              disabled={disabled}
            />
          )}

          {question.type === 'score' && (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-white/60 mb-1 block">{question.team1}</label>
                <Input
                  type="number"
                  name={`${question.id}_team1`}
                  value={value?.team1 || ''}
                  onChange={(e) => onChange(question.id, { ...value, team1: e.target.value })}
                  placeholder="0"
                  disabled={disabled}
                />
              </div>
              <span className="text-2xl font-bold text-white/50 pt-6">-</span>
              <div className="flex-1">
                <label className="text-sm text-white/60 mb-1 block">{question.team2}</label>
                <Input
                  type="number"
                  name={`${question.id}_team2`}
                  value={value?.team2 || ''}
                  onChange={(e) => onChange(question.id, { ...value, team2: e.target.value })}
                  placeholder="0"
                  disabled={disabled}
                />
              </div>
            </div>
          )}

          {value && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 flex items-center gap-2 text-field-green text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Respondida</span>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
