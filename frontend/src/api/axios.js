import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Fast client-side GET cache (30s TTL) — cleared automatically on any POST/PUT/DELETE
const clientCache = new Map()
const CACHE_TTL = 30 * 1000

export const clearClientCache = () => clientCache.clear()

// Request interceptor — attach Bearer token & clear cache on mutations
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventsphere_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.method && config.method.toLowerCase() !== 'get') {
      clientCache.clear()
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clientCache.clear()
      localStorage.removeItem('eventsphere_token')
      localStorage.removeItem('eventsphere_user')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Wrap api.get for instant zero-latency page transitions
const rawGet = api.get.bind(api)
api.get = (url, config = {}) => {
  if (url === '/auth/me' || config.skipCache) {
    return rawGet(url, config)
  }
  const token = localStorage.getItem('eventsphere_token') || 'public'
  const paramsKey = config.params ? JSON.stringify(config.params) : ''
  const key = `${token}:${url}:${paramsKey}`

  const cached = clientCache.get(key)
  if (cached && cached.expiresAt > Date.now()) {
    return Promise.resolve(cached.response)
  }

  return rawGet(url, config).then((response) => {
    clientCache.set(key, {
      response,
      expiresAt: Date.now() + CACHE_TTL,
    })
    return response
  })
}

export default api
