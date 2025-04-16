// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');

      if (token) {
        try {
          // Validate token with backend
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token invalid or expired
          localStorage.removeItem('auth_token');
          console.error('Auth token validation failed:', error);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setAuthError(null);
      const { token, user } = await authService.login(email, password);
      localStorage.setItem('auth_token', token);
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setAuthError(errorMessage);
      throw error;
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setAuthError(null);
      const { token, user } = await authService.register(userData);
      localStorage.setItem('auth_token', token);
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      setAuthError(errorMessage);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user tokens
  const updateTokens = (newTokenCount) => {
    setUser(prevUser => ({
      ...prevUser,
      tokens: newTokenCount
    }));
  };

  // Book a session for the user
  const bookSession = (sessionId) => {
    setUser(prevUser => ({
      ...prevUser,
      bookedSessions: [...(prevUser.bookedSessions || []), { session: sessionId }]
    }));
  };

  // Clear auth error
  const clearAuthError = () => {
    setAuthError(null);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    authError,
    login,
    signup,
    logout,
    updateTokens,
    bookSession,
    clearAuthError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
