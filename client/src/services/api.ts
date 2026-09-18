import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept request to add guest session ID if stored
api.interceptors.request.use((config) => {
  let sessionId = localStorage.getItem('pk_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('pk_session_id', sessionId);
  }
  config.headers['x-session-id'] = sessionId;
  return config;
});

export default api;
