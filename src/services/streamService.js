// src/services/streamService.js
import api from './api';

const streamService = {
  // Get streaming details for a session
  getStreamDetails: async (sessionId) => {
    const response = await api.get(`/stream/${sessionId}`);
    return response.data;
  },

  // Start a streaming session (for trainers)
  startStream: async (sessionId) => {
    const response = await api.post(`/stream/${sessionId}/start`);
    return response.data;
  },

  // End a streaming session (for trainers)
  endStream: async (sessionId) => {
    const response = await api.post(`/stream/${sessionId}/end`);
    return response.data;
  },

  // Join a streaming session
  joinStream: async (sessionId) => {
    const response = await api.post(`/stream/${sessionId}/join`);
    return response.data;
  },

  // Leave a streaming session
  leaveStream: async (sessionId) => {
    const response = await api.post(`/stream/${sessionId}/leave`);
    return response.data;
  },

  // Get stream participants (for trainers)
  getStreamParticipants: async (sessionId) => {
    const response = await api.get(`/stream/${sessionId}/participants`);
    return response.data;
  }
};

export default streamService;
