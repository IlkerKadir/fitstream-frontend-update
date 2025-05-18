// src/pages/SessionPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import SessionDetail from '../components/sessions/SessionDetail';
import { useSessionContext } from '../context/SessionContext';
import { useAuthContext } from '../context/AuthContext';
import { useNotificationContext } from '../context/NotificationContext';
import Loader from '../components/common/Loader';
import sessionService from '../services/sessionService';

const SessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSessionById } = useSessionContext();
  const { user, bookSession: bookUserSession, updateTokens } = useAuthContext();
  const { showSuccess, showError } = useNotificationContext();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);

  // Load session details
  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const sessionData = await getSessionById(id);
        setSession(sessionData);

        // Check if user has booked this session
        if (user && user.bookedSessions) {
          const hasBooked = user.bookedSessions.some(booking =>
            booking.session === id || booking.session?._id === id
          );
          setIsBooked(hasBooked);
        }
      } catch (error) {
        showError('Failed to load session details');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [id, getSessionById, user, showError]);

  // Handle booking a session
  const handleBookSession = async (sessionId) => {
    try {
      if (!user) {
        // Redirect to login with return path
        navigate('/auth', { state: { from: `/sessions/${sessionId}` } });
        return;
      }

      if (user.tokens < session.tokenCost) {
        showError(`Insufficient tokens. You need ${session.tokenCost} tokens for this session.`);
        navigate('/packages');
        return;
      }

      // Book the session via API
      const result = await sessionService.bookSession(sessionId);

      // Update user's tokens (will be returned from API in a real implementation)
      updateTokens(user.tokens - session.tokenCost);

      // Update user's booked sessions
      bookUserSession(sessionId);

      // Update UI
      setIsBooked(true);

      showSuccess('Session booked successfully!');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to book session. Please try again.');
    }
  };

  const handleJoinSession = (sessionId) => {
  navigate(`/live/${sessionId}`);
};


  if (loading) {
    return (
      <PageContainer>
        <Loader fullPage />
      </PageContainer>
    );
  }

  if (!session) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Session Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The session you're looking for doesn't exist or has been removed.
          </p>
          <button
            className="text-indigo-600 font-medium"
            onClick={() => navigate('/sessions')}
          >
            Browse Available Sessions
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <button
          className="text-indigo-600 font-medium"
          onClick={() => navigate(-1)}
        >
          &larr; Back to Sessions
        </button>
      </div>

      <SessionDetail
        session={session}
        isBooked={isBooked}
        onBookSession={handleBookSession}
        onJoinSession={handleJoinSession}  // Add this prop
      />
    </PageContainer>
  );
};

export default SessionPage;
