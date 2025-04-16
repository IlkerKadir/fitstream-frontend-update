// src/services/userService.js
import api from './api';

const userService = {
  // Get user profile
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    const response = await api.put(`/users/${userId}`, profileData);
    return response.data;
  },

  // Get user's booked sessions
  getUserSessions: async (userId) => {
    const response = await api.get(`/users/${userId}/sessions`);
    return response.data;
  },

  // Update user preferences
  updateUserPreferences: async (userId, preferences) => {
    const response = await api.put(`/users/${userId}/preferences`, preferences);
    return response.data;
  },

  // Update trainer profile (for trainers)
  updateTrainerProfile: async (userId, trainerProfileData) => {
    const response = await api.put(`/users/${userId}`, {
      trainerProfile: trainerProfileData
    });
    return response.data;
  }
};

export default userService;
