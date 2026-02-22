import axios from 'axios'

const api = axios.create({
  baseURL: 'https://fraudshield-backend-2.onrender.com',
})

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally – token expired or invalid
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth
export const signup = (data) => api.post('/auth/signup', data)
export const login = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')
export const logout = () => api.post('/auth/logout')

// ── Analysis
export const analyzeMessage = (message) => api.post('/api/analyze', { message })
export const getHistory = (skip = 0, limit = 20) => api.get(`/api/history?skip=${skip}&limit=${limit}`)
export const getStats = () => api.get('/api/stats')

export default api
