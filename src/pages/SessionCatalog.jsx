// src/pages/SessionCatalog.jsx
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import SessionList from '../components/sessions/SessionList';
import SessionFilters from '../components/sessions/SessionFilters';
import { useSessionContext } from '../context/SessionContext';
import { useAuthContext } from '../context/AuthContext';
import { useNotificationContext } from '../context/NotificationContext';

const SessionCatalog = () => {
  const { sessions, loading, filterSessions, bookSession } = useSessionContext();
  const { user } = useAuthContext();
  const { showSuccess, showError } = useNotificationContext();

  const [filteredSessions, setFilteredSessions] = useState([]);

  // Initialize with all sessions
  useEffect(() => {
    setFilteredSessions(sessions);
  }, [sessions]);

  // Handle filter changes
  const handleFilterChange = (filters) => {
    const result = filterSessions(filters);
    setFilteredSessions(result);
  };

  // Handle booking a session
  const handleBookSession = async (sessionId) => {
    try {
      if (!user) {
        showError('Please sign in to book a session');
        return;
      }

      const session = sessions.find(s => s.id === sessionId || s._id === sessionId);

      if (!session) {
        showError('Session not found');
        return;
      }

      if (user.tokens < session.tokenCost) {
        showError(`Insufficient tokens. You need ${session.tokenCost} tokens for this session.`);
        return;
      }

      await bookSession(sessionId, user.id);
      showSuccess('Session booked successfully!');
    } catch (error) {
      showError('Failed to book session. Please try again.');
    }
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Training Sessions
        </h1>
        <p className="text-gray-600">
          Browse and book live training sessions with expert trainers
        </p>
      </div>

      <SessionFilters onFilterChange={handleFilterChange} />

      <SessionList
        sessions={filteredSessions}
        loading={loading}
        onBookSession={handleBookSession}
        emptyMessage="No sessions matching your filters"
      />
    </PageContainer>
  );
};

export default SessionCatalog;
