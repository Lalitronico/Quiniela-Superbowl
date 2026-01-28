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

// Participants
export const registerParticipant = (data) => api.post('/participants', data)
export const getParticipant = (id) => api.get(`/participants/${id}`)
export const getAllParticipants = () => api.get('/participants')

// Questions
export const getQuestions = () => api.get('/questions')

// Predictions
export const submitPredictions = (userId, predictions) =>
  api.post('/predictions', { userId, predictions })
export const getPredictions = (userId) => api.get(`/predictions/${userId}`)
export const updatePredictions = (userId, predictions) =>
  api.put(`/predictions/${userId}`, { predictions })

// Leaderboard
export const getLeaderboard = () => api.get('/leaderboard')

// Admin
export const submitResults = (results, apiKey) =>
  api.post('/admin/results', { results }, {
    headers: { 'x-api-key': apiKey }
  })
export const calculateScores = (apiKey) =>
  api.post('/admin/calculate', {}, {
    headers: { 'x-api-key': apiKey }
  })
export const getResults = () => api.get('/admin/results')

export default api
