// src/services/sessionService.js
import api from './api';

const sessionService = {
  // Get all sessions
  getAllSessions: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    // Add query parameters for filtering
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters.trainer) queryParams.append('trainer', filters.trainer);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.upcoming) queryParams.append('upcoming', filters.upcoming);

    const response = await api.get(`/sessions?${queryParams.toString()}`);
    return response.data;
  },

  // Get session by ID
  getSessionById: async (id) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  // Book a session
  bookSession: async (sessionId) => {
    // Make sure sessionId is defined before making the request
    if (!sessionId) {
      throw new Error('Session ID is undefined');
    }

    const response = await api.post(`/sessions/${sessionId}/book`);
    return response.data;
  },

  // Rate a session
  rateSession: async (sessionId, rating, feedback) => {
    const response = await api.post(`/sessions/${sessionId}/rate`, { rating, feedback });
    return response.data;
  },

  // Get sessions by trainer
  getSessionsByTrainer: async (trainerId) => {
    const response = await api.get(`/sessions/trainer/${trainerId}`);
    return response.data;
  },

  // Create a new session (for trainers)
  createSession: async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },

  // Update a session (for trainers)
  updateSession: async (id, sessionData) => {
    const response = await api.put(`/sessions/${id}`, sessionData);
    return response.data;
  },

  // Delete a session (for trainers)
  deleteSession: async (id) => {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  },

  // Update session status (for trainers)
  updateSessionStatus: async (id, status) => {
    const response = await api.put(`/sessions/${id}/status`, { status });
    return response.data;
  }
};

export default sessionService;
