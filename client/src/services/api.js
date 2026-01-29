import axios from 'axios'

// Use environment variable for production, fallback to relative path for dev
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Questions (global - no brand required)
export const getQuestions = () => api.get('/questions')

// Brand info
export const getBrandInfo = (brand) => api.get(`/${brand}/brand-info`)

// Participants (brand-scoped)
export const registerParticipant = (brand, data) => api.post(`/${brand}/participants`, data)
export const getParticipant = (brand, id) => api.get(`/${brand}/participants/${id}`)
export const getAllParticipants = (brand) => api.get(`/${brand}/participants`)

// Predictions (brand-scoped)
export const submitPredictions = (brand, userId, predictions) =>
  api.post(`/${brand}/predictions`, { userId, predictions })
export const getPredictions = (brand, userId) => api.get(`/${brand}/predictions/${userId}`)
export const updatePredictions = (brand, userId, predictions) =>
  api.put(`/${brand}/predictions/${userId}`, { predictions })

// Leaderboard (brand-scoped)
export const getLeaderboard = (brand) => api.get(`/${brand}/leaderboard`)

// Admin (brand-scoped)
export const submitResults = (brand, results, apiKey) =>
  api.post(`/${brand}/admin/results`, { results }, {
    headers: { 'x-api-key': apiKey }
  })
export const calculateScores = (brand, apiKey) =>
  api.post(`/${brand}/admin/calculate`, {}, {
    headers: { 'x-api-key': apiKey }
  })
export const getResults = (brand) => api.get(`/${brand}/admin/results`)

export default api
