// src/context/SessionContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import sessionService from '../services/sessionService';
import { useNotificationContext } from './NotificationContext';

const SessionContext = createContext();

export const useSessionContext = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useNotificationContext();

  // src/context/SessionContext.jsx
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Check if user is authenticated before trying to fetch sessions
        const token = localStorage.getItem('auth_token');

        if (token) {
          // Get all upcoming sessions
          const upcomingSessions = await sessionService.getAllSessions({ upcoming: true });
          setSessions(upcomingSessions);

          // For recommended sessions, just use a subset for now
          setRecommended(upcomingSessions.slice(0, 3));
        } else {
          // If no token, set empty arrays or fetch public sessions if your API supports it
          setSessions([]);
          setRecommended([]);
        }

        setError(null);
      } catch (err) {
        console.error('Error loading sessions:', err);
        setError('Failed to load sessions. Please try again later.');

        // Set empty arrays on error
        setSessions([]);
        setRecommended([]);

        // Only show error if we have a token (meaning user should be authenticated)
        if (localStorage.getItem('auth_token') && showError) {
          showError('Failed to load sessions. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showError]);
  
  // Get a specific session by ID
  const getSessionById = async (id) => {
    try {
      const sessionId = parseInt(id, 10) || id;

      // First check if we already have this session in our state
      const cachedSession = [...sessions, ...recommended].find(
        session => session.id === sessionId || session._id === id
      );

      if (cachedSession) return cachedSession;

      // If not found in state, fetch from API
      const sessionData = await sessionService.getSessionById(id);
      return sessionData;
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to load session details.');
      showError('Failed to load session details.');
      throw err;
    }
  };

  // Filter sessions based on criteria
  const filterSessions = async (filters) => {
    try {
      setLoading(true);
      const filteredSessions = await sessionService.getAllSessions(filters);
      return filteredSessions;
    } catch (err) {
      console.error('Error filtering sessions:', err);
      setError('Failed to apply filters.');
      showError('Failed to filter sessions.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Book a session
  const bookSession = async (sessionId, userId) => {
    try {
      const result = await sessionService.bookSession(sessionId);

      // Update session participants count in local state
      setSessions(prevSessions => {
        return prevSessions.map(session => {
          if (session.id === sessionId || session._id === sessionId) {
            return {
              ...session,
              participants: session.participants ? session.participants + 1 : 1
            };
          }
          return session;
        });
      });

      // Also update in recommended sessions if present
      setRecommended(prevRecommended => {
        return prevRecommended.map(session => {
          if (session.id === sessionId || session._id === sessionId) {
            return {
              ...session,
              participants: session.participants ? session.participants + 1 : 1
            };
          }
          return session;
        });
      });

      return result;
    } catch (err) {
      console.error('Error booking session:', err);
      setError('Failed to book session.');
      showError(err.response?.data?.message || 'Failed to book session.');
      throw err;
    }
  };

  const value = {
    sessions,
    recommended,
    loading,
    error,
    getSessionById,
    filterSessions,
    bookSession
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};
