import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageTransition, FootballBounce } from '../components/animations'
import { Card, Button, Input, Select } from '../components/common'
import { getQuestions, submitResults, calculateScores, getResults } from '../services/api'

export default function Admin() {
  const [apiKey, setApiKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [questions, setQuestions] = useState([])
  const [results, setResults] = useState({})
  const [existingResults, setExistingResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    const loadData = async () => {
      try {
        const questionsRes = await getQuestions()
        setQuestions(questionsRes.data)

        try {
          const resultsRes = await getResults()
          setExistingResults(resultsRes.data || {})
          setResults(resultsRes.data || {})
        } catch {
          // No results yet
        }
      } catch (err) {
        console.error('Error loading questions:', err)
      }
    }

    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const handleAuth = (e) => {
    e.preventDefault()
    if (apiKey.trim()) {
      setIsAuthenticated(true)
    }
  }

  const handleResultChange = (questionId, value) => {
    setResults(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmitResults = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await submitResults(results, apiKey)
      setMessage({ type: 'success', text: 'Resultados guardados exitosamente!' })
      setExistingResults(results)
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error guardando resultados'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCalculateScores = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await calculateScores(apiKey)
      setMessage({
        type: 'success',
        text: `Puntuaciones calculadas! ${response.data.updated} participantes actualizados.`
      })
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error calculando puntuaciones'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <FootballBounce size="md" />
          <Card className="max-w-md w-full mt-8">
            <h1 className="font-display text-3xl text-superbowl-gold text-center mb-6">
              ADMIN
            </h1>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input
                label="API Key"
                type="password"
                name="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Ingresa la API Key"
                required
              />
              <Button type="submit" variant="primary" className="w-full">
                Acceder
              </Button>
            </form>
          </Card>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-4xl text-superbowl-gold mb-2">
            PANEL DE ADMINISTRACION
          </h1>
          <p className="text-white/60">
            Ingresa los resultados oficiales del Super Bowl
          </p>
        </motion.div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg text-center ${
              message.type === 'success'
                ? 'bg-field-green/20 border border-field-green text-field-green'
                : 'bg-nfl-red/20 border border-nfl-red text-nfl-red'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="space-y-6">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-xs text-white/50 uppercase tracking-wider">
                      {question.category}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-1">
                      {question.text}
                    </h3>
                    {existingResults[question.id] && (
                      <p className="text-sm text-field-green mt-2">
                        Resultado actual: {
                          typeof existingResults[question.id] === 'object'
                            ? `${existingResults[question.id].team1} - ${existingResults[question.id].team2}`
                            : existingResults[question.id]
                        }
                      </p>
                    )}
                  </div>

                  <div className="w-64">
                    {question.type === 'select' && (
                      <Select
                        name={question.id}
                        value={results[question.id] || ''}
                        onChange={(e) => handleResultChange(question.id, e.target.value)}
                        options={question.options.map(opt => ({ value: opt, label: opt }))}
                        placeholder="Resultado..."
                      />
                    )}

                    {question.type === 'number' && (
                      <Input
                        type="number"
                        name={question.id}
                        value={results[question.id] || ''}
                        onChange={(e) => handleResultChange(question.id, e.target.value)}
                        placeholder="Resultado..."
                      />
                    )}

                    {question.type === 'text' && (
                      <Input
                        type="text"
                        name={question.id}
                        value={results[question.id] || ''}
                        onChange={(e) => handleResultChange(question.id, e.target.value)}
                        placeholder="Resultado..."
                      />
                    )}

                    {question.type === 'score' && (
                      <div className="flex gap-2 items-center">
                        <Input
                          type="number"
                          name={`${question.id}_team1`}
                          value={results[question.id]?.team1 || ''}
                          onChange={(e) => handleResultChange(question.id, {
                            ...results[question.id],
                            team1: e.target.value
                          })}
                          placeholder={question.team1?.substring(0, 3) || 'T1'}
                        />
                        <span className="text-white/50">-</span>
                        <Input
                          type="number"
                          name={`${question.id}_team2`}
                          value={results[question.id]?.team2 || ''}
                          onChange={(e) => handleResultChange(question.id, {
                            ...results[question.id],
                            team2: e.target.value
                          })}
                          placeholder={question.team2?.substring(0, 3) || 'T2'}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="primary"
            onClick={handleSubmitResults}
            loading={loading}
            className="min-w-[200px]"
          >
            Guardar Resultados
          </Button>
          <Button
            variant="secondary"
            onClick={handleCalculateScores}
            loading={loading}
            className="min-w-[200px]"
          >
            Calcular Puntuaciones
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-center"
        >
          <Button variant="ghost" onClick={() => setIsAuthenticated(false)}>
            Cerrar Sesion
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  )
}
