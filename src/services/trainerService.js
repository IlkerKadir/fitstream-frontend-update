// src/services/trainerService.js
import api from './api';

const trainerService = {
  // Get trainer dashboard data (upcoming and past sessions)
  getDashboardData: async () => {
    try {
      // First try to get current user
      const userData = await api.get('/auth/me');
      const userId = userData.data._id;

      // Get both upcoming and past sessions in parallel
      const [upcomingResponse, pastResponse] = await Promise.all([
        api.get(`/sessions/trainer/${userId}?status=scheduled,live`),
        api.get(`/sessions/trainer/${userId}?status=completed`)
      ]);

      return {
        upcoming: upcomingResponse.data,
        past: pastResponse.data
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },

  // Get trainer's upcoming sessions
  getUpcomingSessions: async () => {
    try {
      // First try to get current user
      const userData = await api.get('/auth/me');
      const userId = userData.data._id;

      // Then get sessions for this user's ID
      const response = await api.get(`/sessions/trainer/${userId}?status=scheduled,live`);
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming sessions:", error);
      throw error;
    }
  },

  // Get trainer's past sessions
  getPastSessions: async () => {
    try {
      // First try to get current user
      const userData = await api.get('/auth/me');
      const userId = userData.data._id;

      // Then get sessions for this user's ID
      const response = await api.get(`/sessions/trainer/${userId}?status=completed`);
      return response.data;
    } catch (error) {
      console.error("Error fetching past sessions:", error);
      throw error;
    }
  },

  // Update trainer profile
  updateTrainerProfile: async (profileData) => {
    try {
      const response = await api.put('/users/me/trainer-profile', profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating trainer profile:", error);
      throw error;
    }
  },

  // Start a session
  startSession: async (sessionId) => {
    try {
      const response = await api.post(`/stream/${sessionId}/start`);
      return response.data;
    } catch (error) {
      console.error("Error starting session:", error);
      throw error;
    }
  },

  // End a session
  endSession: async (sessionId) => {
    try {
      const response = await api.post(`/stream/${sessionId}/end`);
      return response.data;
    } catch (error) {
      console.error("Error ending session:", error);
      throw error;
    }
  },

  // Get session analytics
  getSessionAnalytics: async (sessionId) => {
    try {
      const response = await api.get(`/sessions/${sessionId}/analytics`);
      return response.data;
    } catch (error) {
      console.error("Error fetching session analytics:", error);
      throw error;
    }
  },

  // Get session participants
  getSessionParticipants: async (sessionId) => {
    try {
      const response = await api.get(`/stream/${sessionId}/participants`);
      return response.data;
    } catch (error) {
      console.error("Error fetching session participants:", error);
      throw error;
    }
  },

  // Send a chat message
  sendChatMessage: async (sessionId, message) => {
    try {
      const response = await api.post(`/stream/${sessionId}/message`, { message });
      return response.data;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  },

  // Send a reaction
  sendReaction: async (sessionId, reactionType) => {
    try {
      const response = await api.post(`/stream/${sessionId}/reaction`, { type: reactionType });
      return response.data;
    } catch (error) {
      console.error("Error sending reaction:", error);
      throw error;
    }
  }
};

export default trainerService;
