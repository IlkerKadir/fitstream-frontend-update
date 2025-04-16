// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Play, Package } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/common/Button';
import { useAuthContext } from '../context/AuthContext';
import { useSessionContext } from '../context/SessionContext';
import { useNotificationContext } from '../context/NotificationContext';
import SessionCard from '../components/sessions/SessionCard';
import Loader from '../components/common/Loader';
import userService from '../services/userService';
import sessionService from '../services/sessionService';

const Dashboard = () => {
  const { user } = useAuthContext();
  const { sessions, recommended, loading: sessionsLoading, bookSession } = useSessionContext();
  const { showSuccess, showError } = useNotificationContext();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookedSessions, setBookedSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user's booked sessions
  useEffect(() => {
    const fetchBookedSessions = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userSessions = await userService.getUserSessions(user._id);
        setBookedSessions(userSessions);
      } catch (error) {
        console.error('Error fetching booked sessions:', error);
        showError('Failed to load your booked sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSessions();
  }, [user, showError]);

  // Handle booking a session
  const handleBookSession = async (sessionId) => {
    try {
      if (!user) {
        showError('Please sign in to book a session');
        return;
      }

      const session = sessions.find(s => s._id === sessionId || s.id === sessionId) ||
                    recommended.find(s => s._id === sessionId || s.id === sessionId);

      if (!session) {
        showError('Session not found');
        return;
      }

      if (user.tokens < session.tokenCost) {
        showError(`Insufficient tokens. You need ${session.tokenCost} tokens for this session.`);
        return;
      }

      // Book the session via API
      await bookSession(sessionId, user._id);

      // Refresh booked sessions
      const updatedSessions = await userService.getUserSessions(user._id);
      setBookedSessions(updatedSessions);

      showSuccess('Session booked successfully!');
    } catch (error) {
      showError('Failed to book session. Please try again.');
    }
  };

  const isLoading = loading || sessionsLoading;

  return (
    <PageContainer>
      {/* User welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Your fitness journey continues with new training sessions.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Search for trainers, sessions, or categories..."
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 px-1 ${
              activeTab === 'upcoming'
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming Sessions
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`pb-4 px-1 ${
              activeTab === 'recommended'
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Recommended for You
          </button>
          <button
            onClick={() => setActiveTab('booked')}
            className={`pb-4 px-1 ${
              activeTab === 'booked'
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Booked Sessions
          </button>
        </nav>
      </div>

      {/* Session Lists */}
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {/* Upcoming Sessions */}
          {activeTab === 'upcoming' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.slice(0, 6).map(session => (
                <SessionCard
                  key={session._id || session.id}
                  session={session}
                  onBookClick={handleBookSession}
                />
              ))}
            </div>
          )}

          {/* Recommended Sessions */}
          {activeTab === 'recommended' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map(session => (
                <SessionCard
                  key={session._id || session.id}
                  session={session}
                  onBookClick={handleBookSession}
                />
              ))}
            </div>
          )}

          {/* User's Booked Sessions */}
          {activeTab === 'booked' && (
            <>
              {bookedSessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookedSessions.map(session => (
                    <SessionCard
                      key={session.id || session._id}
                      session={session}
                      onBookClick={() => {}}
                      isBooked={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 p-6 rounded-full inline-flex mb-4">
                    <Calendar size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No booked sessions yet</h3>
                  <p className="text-gray-500 mb-6">Browse upcoming sessions and book your first class</p>
                  <Button
                    onClick={() => setActiveTab('upcoming')}
                  >
                    Explore Sessions
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default Dashboard;
