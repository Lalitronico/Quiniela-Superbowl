import { Router } from 'express'
import storage from '../services/fileStorageService.js'

const router = Router()

// Default questions
const DEFAULT_QUESTIONS = [
  // Deportivas
  {
    id: 'winner',
    category: 'deportivas',
    text: 'Quien ganara el Super Bowl LIX?',
    type: 'select',
    options: ['Kansas City Chiefs', 'San Francisco 49ers', 'Philadelphia Eagles', 'Baltimore Ravens', 'Detroit Lions', 'Buffalo Bills'],
    difficulty: 'easy'
  },
  {
    id: 'score',
    category: 'deportivas',
    text: 'Cual sera el marcador final?',
    type: 'score',
    team1: 'Equipo 1',
    team2: 'Equipo 2',
    difficulty: 'hard'
  },
  {
    id: 'mvp',
    category: 'deportivas',
    text: 'Quien sera el MVP del partido?',
    type: 'select',
    options: ['Patrick Mahomes', 'Travis Kelce', 'Jalen Hurts', 'Lamar Jackson', 'Brock Purdy', 'Josh Allen', 'Otro'],
    difficulty: 'medium'
  },
  {
    id: 'first_score',
    category: 'deportivas',
    text: 'Cual equipo anotara primero?',
    type: 'select',
    options: ['AFC', 'NFC'],
    difficulty: 'easy'
  },

  // Entretenimiento
  {
    id: 'halftime_guest',
    category: 'entretenimiento',
    text: 'Artista invitado sorpresa en el medio tiempo?',
    type: 'text',
    placeholder: 'Nombre del artista...',
    difficulty: 'hard'
  },
  {
    id: 'first_song',
    category: 'entretenimiento',
    text: 'Primera cancion del show de medio tiempo?',
    type: 'text',
    placeholder: 'Nombre de la cancion...',
    difficulty: 'hard'
  },

  // Comerciales
  {
    id: 'best_commercial',
    category: 'comerciales',
    text: 'Mejor comercial segun USA Today Ad Meter?',
    type: 'select',
    options: ['Budweiser', 'Doritos', 'Pepsi', 'Coca-Cola', 'Amazon', 'Google', 'Apple', 'Otro'],
    difficulty: 'medium'
  },
  {
    id: 'most_commercials',
    category: 'comerciales',
    text: 'Marca con mas comerciales durante el partido?',
    type: 'select',
    options: ['Budweiser', 'Toyota', 'Pepsi', 'Coca-Cola', 'Amazon', 'T-Mobile', 'Verizon', 'Otro'],
    difficulty: 'medium'
  },

  // Curiosidades
  {
    id: 'anthem_duration',
    category: 'curiosidades',
    text: 'Duracion del himno nacional? (en segundos)',
    type: 'number',
    placeholder: 'Ej: 120',
    difficulty: 'hard'
  },
  {
    id: 'gatorade_color',
    category: 'curiosidades',
    text: 'Color del Gatorade que echaran al entrenador ganador?',
    type: 'select',
    options: ['Naranja', 'Azul', 'Amarillo', 'Verde', 'Rojo', 'Morado', 'Transparente', 'No habra Gatorade'],
    difficulty: 'medium'
  }
]

// Get all questions
router.get('/', async (req, res) => {
  try {
    let questions = await storage.getQuestions()

    // Initialize with default questions if empty
    if (!questions || questions.length === 0) {
      await storage.saveQuestions(DEFAULT_QUESTIONS)
      questions = DEFAULT_QUESTIONS
    }

    res.json(questions)
  } catch (err) {
    console.error('Error getting questions:', err)
    res.status(500).json({ message: 'Error obteniendo preguntas' })
  }
})

export default router
