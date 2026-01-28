import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '../../data')

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

// Generic file operations
async function readJsonFile(filename) {
  await ensureDataDir()
  const filepath = join(DATA_DIR, filename)

  try {
    const data = await readFile(filepath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null
    }
    throw err
  }
}

async function writeJsonFile(filename, data) {
  await ensureDataDir()
  const filepath = join(DATA_DIR, filename)

  // Create backup before writing
  try {
    const existing = await readFile(filepath, 'utf-8')
    const backupPath = join(DATA_DIR, `${filename}.backup`)
    await writeFile(backupPath, existing)
  } catch {
    // No existing file to backup
  }

  await writeFile(filepath, JSON.stringify(data, null, 2))
}

// Participants
export async function getParticipants() {
  const data = await readJsonFile('participants.json')
  return data || []
}

export async function getParticipantById(id) {
  const participants = await getParticipants()
  return participants.find(p => p.id === id)
}

export async function getParticipantByEmail(email) {
  const participants = await getParticipants()
  return participants.find(p => p.email.toLowerCase() === email.toLowerCase())
}

export async function saveParticipant(participant) {
  const participants = await getParticipants()
  const existingIndex = participants.findIndex(p => p.id === participant.id)

  if (existingIndex >= 0) {
    participants[existingIndex] = { ...participants[existingIndex], ...participant }
  } else {
    participants.push(participant)
  }

  await writeJsonFile('participants.json', participants)
  return participant
}

export async function updateParticipantScore(id, score, correctPredictions, categoryScores) {
  const participants = await getParticipants()
  const index = participants.findIndex(p => p.id === id)

  if (index >= 0) {
    participants[index].score = score
    participants[index].correctPredictions = correctPredictions
    participants[index].categoryScores = categoryScores
    participants[index].updatedAt = new Date().toISOString()
    await writeJsonFile('participants.json', participants)
  }
}

// Predictions
export async function getPredictions() {
  const data = await readJsonFile('predictions.json')
  return data || {}
}

export async function getPredictionsByUserId(userId) {
  const predictions = await getPredictions()
  return predictions[userId] || null
}

export async function savePredictions(userId, userPredictions) {
  const predictions = await getPredictions()
  predictions[userId] = {
    predictions: userPredictions,
    updatedAt: new Date().toISOString()
  }
  await writeJsonFile('predictions.json', predictions)
}

// Questions
export async function getQuestions() {
  const data = await readJsonFile('questions.json')
  return data || []
}

export async function saveQuestions(questions) {
  await writeJsonFile('questions.json', questions)
}

// Results
export async function getResults() {
  const data = await readJsonFile('results.json')
  return data || {}
}

export async function saveResults(results) {
  await writeJsonFile('results.json', results)
}

// Leaderboard
export async function getLeaderboard() {
  const participants = await getParticipants()
  return participants
    .map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: p.score || 0,
      correctPredictions: p.correctPredictions || 0,
      categoryScores: p.categoryScores || {}
    }))
    .sort((a, b) => b.score - a.score)
}

export default {
  getParticipants,
  getParticipantById,
  getParticipantByEmail,
  saveParticipant,
  updateParticipantScore,
  getPredictions,
  getPredictionsByUserId,
  savePredictions,
  getQuestions,
  saveQuestions,
  getResults,
  saveResults,
  getLeaderboard
}
