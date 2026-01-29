import db from './databaseService.js'

// Difficulty multipliers
const DIFFICULTY_MULTIPLIERS = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0
}

// Base points for correct answer
const BASE_POINTS = 10

// Bonus points
const CATEGORY_PERFECT_BONUS = 15
const ALL_PERFECT_BONUS = 50

// Score difference thresholds for partial points
const SCORE_THRESHOLDS = [
  { maxDiff: 2, percentage: 0.8 },    // 80% for difference 1-2
  { maxDiff: 6, percentage: 0.6 },    // 60% for difference 3-6
  { maxDiff: 14, percentage: 0.3 },   // 30% for difference 7-14
]

function calculateScorePoints(prediction, actual, basePoints) {
  if (!prediction || !actual) return 0

  const pred1 = parseInt(prediction.team1) || 0
  const pred2 = parseInt(prediction.team2) || 0
  const act1 = parseInt(actual.team1) || 0
  const act2 = parseInt(actual.team2) || 0

  // Exact match
  if (pred1 === act1 && pred2 === act2) {
    return basePoints
  }

  // Calculate total score difference
  const diff = Math.abs((pred1 - act1)) + Math.abs((pred2 - act2))

  // Check if winner is correct
  const predWinner = pred1 > pred2 ? 'team1' : pred1 < pred2 ? 'team2' : 'tie'
  const actWinner = act1 > act2 ? 'team1' : act1 < act2 ? 'team2' : 'tie'

  if (predWinner !== actWinner) {
    return 0 // Wrong winner gets no points
  }

  // Partial points based on score difference
  for (const threshold of SCORE_THRESHOLDS) {
    if (diff <= threshold.maxDiff) {
      return Math.round(basePoints * threshold.percentage)
    }
  }

  return 0
}

function compareAnswers(prediction, actual, questionType) {
  if (questionType === 'score') {
    return prediction?.team1 === actual?.team1 && prediction?.team2 === actual?.team2
  }

  if (questionType === 'number') {
    return parseInt(prediction) === parseInt(actual)
  }

  // String comparison (case insensitive)
  return String(prediction).toLowerCase().trim() === String(actual).toLowerCase().trim()
}

export async function calculateParticipantScore(brandId, participantId) {
  const questions = await db.getQuestions()
  const results = await db.getResults(brandId)
  const userPredictionData = await db.getPredictionsByUserId(brandId, participantId)

  if (!userPredictionData?.predictions) {
    return { score: 0, correctPredictions: 0, categoryScores: {} }
  }

  const predictions = userPredictionData.predictions
  let totalScore = 0
  let correctPredictions = 0
  const categoryScores = {}
  const categoryCorrect = {}
  const categoryTotal = {}

  for (const question of questions) {
    const { id, category, difficulty, type } = question
    const prediction = predictions[id]
    const actual = results[id]

    // Initialize category tracking
    if (!categoryScores[category]) {
      categoryScores[category] = 0
      categoryCorrect[category] = 0
      categoryTotal[category] = 0
    }
    categoryTotal[category]++

    // Skip if no result yet
    if (actual === undefined || actual === null || actual === '') continue

    const multiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1
    const basePoints = BASE_POINTS * multiplier

    if (type === 'score') {
      const points = calculateScorePoints(prediction, actual, basePoints)
      if (points > 0) {
        totalScore += points
        categoryScores[category] += points
        if (points === basePoints) {
          correctPredictions++
          categoryCorrect[category]++
        }
      }
    } else if (compareAnswers(prediction, actual, type)) {
      totalScore += basePoints
      correctPredictions++
      categoryScores[category] += basePoints
      categoryCorrect[category]++
    }
  }

  // Category perfect bonus
  for (const category of Object.keys(categoryTotal)) {
    if (categoryCorrect[category] === categoryTotal[category] && categoryTotal[category] > 0) {
      totalScore += CATEGORY_PERFECT_BONUS
      categoryScores[category] += CATEGORY_PERFECT_BONUS
    }
  }

  // All perfect bonus
  if (correctPredictions === questions.length && questions.length > 0) {
    totalScore += ALL_PERFECT_BONUS
  }

  return {
    score: Math.round(totalScore),
    correctPredictions,
    categoryScores
  }
}

export async function calculateAllScores(brandId) {
  const participants = await db.getParticipants(brandId)
  let updated = 0

  for (const participant of participants) {
    const { score, correctPredictions, categoryScores } = await calculateParticipantScore(brandId, participant.id)
    await db.updateParticipantScore(brandId, participant.id, score, correctPredictions, categoryScores)
    updated++
  }

  return { updated }
}

export async function checkPrediction(brandId, participantId, questionId) {
  const questions = await db.getQuestions()
  const results = await db.getResults(brandId)
  const userPredictionData = await db.getPredictionsByUserId(brandId, participantId)

  const question = questions.find(q => q.id === questionId)
  if (!question) return null

  const prediction = userPredictionData?.predictions?.[questionId]
  const actual = results[questionId]

  if (!prediction || !actual) return null

  const isCorrect = question.type === 'score'
    ? prediction?.team1 === actual?.team1 && prediction?.team2 === actual?.team2
    : compareAnswers(prediction, actual, question.type)

  return { isCorrect, question, prediction, actual }
}

export default {
  calculateParticipantScore,
  calculateAllScores,
  checkPrediction
}
