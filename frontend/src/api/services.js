import api from './axios'

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) =>
    api.put(`/auth/reset-password/${token}`, { password }),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
}

// ─── Expos ─────────────────────────────────────────────────────────────────────
export const expoService = {
  getAll: (params) => api.get('/expos', { params }),
  getOne: (id) => api.get(`/expos/${id}`),
  create: (data) => api.post('/expos', data),
  update: (id, data) => api.put(`/expos/${id}`, data),
  delete: (id) => api.delete(`/expos/${id}`),
  getStats: (id) => api.get(`/expos/${id}/stats`),
}

// ─── Booths ────────────────────────────────────────────────────────────────────
export const boothService = {
  getByExpo: (expoId) => api.get(`/booths/expo/${expoId}`),
  getOne: (id) => api.get(`/booths/${id}`),
  update: (id, data) => api.put(`/booths/${id}`, data),
  reserve: (id, data) => api.post(`/booths/${id}/reserve`, data),
  release: (id) => api.post(`/booths/${id}/release`),
  assign: (id, data) => api.post(`/booths/${id}/assign`, data),
}

// ─── Exhibitor Applications ────────────────────────────────────────────────────
export const exhibitorService = {
  apply: (expoId, data) => api.post(`/exhibitors/apply/${expoId}`, data),
  getMyApplications: () => api.get('/exhibitors/my-applications'),
  getByExpo: (expoId, params) =>
    api.get(`/exhibitors/expo/${expoId}`, { params }),
  getOne: (id) => api.get(`/exhibitors/${id}`),
  approve: (id, data) => api.put(`/exhibitors/${id}/approve`, data),
  reject: (id, data) => api.put(`/exhibitors/${id}/reject`, data),
  updateStatus: (id, data) => api.put(`/exhibitors/application/${id}`, data),
  updateProfile: (data) => api.put('/exhibitors/profile', data),
  getProfile: () => api.get('/exhibitors/profile'),
}

// ─── Sessions ──────────────────────────────────────────────────────────────────
export const sessionService = {
  getByExpo: (expoId) => api.get(`/sessions/expo/${expoId}`),
  getOne: (id) => api.get(`/sessions/${id}`),
  create: (data) => api.post('/sessions', data),
  update: (id, data) => api.put(`/sessions/${id}`, data),
  delete: (id) => api.delete(`/sessions/${id}`),
  bookmark: (id) => api.post(`/sessions/${id}/bookmark`),
  unbookmark: (id) => api.delete(`/sessions/${id}/bookmark`),
  getMyBookmarks: () => api.get('/sessions/my-bookmarks'),
}

// ─── Registrations ─────────────────────────────────────────────────────────────
export const registrationService = {
  register: (expoId) => api.post(`/registrations/expo/${expoId}`),
  cancel: (expoId) => api.delete(`/registrations/expo/${expoId}`),
  getMyRegistrations: () => api.get('/registrations/my'),
  getByExpo: (expoId, params) =>
    api.get(`/registrations/expo/${expoId}`, { params }),
  checkRegistration: (expoId) => api.get(`/registrations/check/${expoId}`),
}

// ─── Messages ──────────────────────────────────────────────────────────────────
export const messageService = {
  getConversations: () => api.get('/messages/conversations'),
  getThread: (userId) => api.get(`/messages/thread/${userId}`),
  send: (data) => api.post('/messages', data),
  markRead: (userId) => api.put(`/messages/read/${userId}`),
}

// ─── Analytics ─────────────────────────────────────────────────────────────────
export const analyticsService = {
  getExpoAnalytics: (expoId) => api.get(`/analytics/expo/${expoId}`),
  getRegistrationsOverTime: (expoId) =>
    api.get(`/analytics/expo/${expoId}/registrations`),
  getSessionPopularity: (expoId) =>
    api.get(`/analytics/expo/${expoId}/sessions`),
  getBoothStats: (expoId) => api.get(`/analytics/expo/${expoId}/booths`),
}

// ─── Feedback ──────────────────────────────────────────────────────────────────
export const feedbackService = {
  submit: (data) => api.post('/feedback', data),
  getByExpo: (expoId) => api.get(`/feedback/expo/${expoId}`),
  getBySession: (sessionId) => api.get(`/feedback/session/${sessionId}`),
}
