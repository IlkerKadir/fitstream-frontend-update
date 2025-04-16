// src/pages/trainer/TrainerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, Play, Edit, Trash2, Plus, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import { useAuthContext } from '../../context/AuthContext';
import { useNotificationContext } from '../../context/NotificationContext';
import { trainerService, sessionService } from '../../services';
import Loader from '../../components/common/Loader';

const TrainerDashboard = () => {
  const { user } = useAuthContext();
  const { showSuccess, showError } = useNotificationContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [sessions, setSessions] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    upcomingCount: 0,
    totalParticipants: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  // Format date
  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Load sessions and dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch sessions based on active tab
        let sessionsData;
        if (activeTab === 'upcoming') {
          sessionsData = await trainerService.getUpcomingSessions();
        } else if (activeTab === 'past') {
          sessionsData = await trainerService.getPastSessions();
        }

        setSessions(sessionsData);

        // Calculate dashboard stats
        const upcomingSessions = activeTab === 'upcoming' ? sessionsData : await trainerService.getUpcomingSessions();
        const pastSessions = activeTab === 'past' ? sessionsData : await trainerService.getPastSessions();

        const totalParticipants = upcomingSessions.reduce((total, session) =>
          total + (session.participants ? session.participants.length : 0), 0);

        let averageRating = 0;
        if (pastSessions.length > 0) {
          const totalRating = pastSessions.reduce((total, session) =>
            total + (session.averageRating || 0), 0);
          averageRating = totalRating / pastSessions.length;
        }

        setDashboardStats({
          upcomingCount: upcomingSessions.length,
          totalParticipants,
          averageRating: parseFloat(averageRating.toFixed(1))
        });
      } catch (error) {
        console.error('Error fetching trainer data:', error);
        showError('Failed to load trainer dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, showError]);

  // Handle starting a session
  const handleStartSession = async (sessionId) => {
    try {
      await trainerService.startSession(sessionId);
      showSuccess("Session started successfully");
      navigate(`/trainer/live/${sessionId}`);
    } catch (error) {
      console.error('Error starting session:', error);
      showError(error.response?.data?.message || 'Failed to start session');
    }
  };

  // Handle editing a session
  const handleEditSession = (sessionId) => {
    navigate(`/trainer/sessions/edit/${sessionId}`);
  };

  // Handle deleting a session
  const handleDeleteSession = async (sessionId) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await sessionService.deleteSession(sessionId);
        showSuccess("Session deleted successfully");
        setSessions(sessions.filter(session => session._id !== sessionId));
      } catch (error) {
        console.error('Error deleting session:', error);
        showError(error.response?.data?.message || 'Failed to delete session');
      }
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trainer Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your training sessions and view analytics
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => navigate('/trainer/sessions/create')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Create Session
          </button>
        </div>
      </div>

      {/* Trainer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <Calendar size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Upcoming Sessions</h2>
              <p className="text-2xl font-semibold text-gray-900">{dashboardStats.upcomingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Participants</h2>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardStats.totalParticipants}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <BarChart2 size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Average Rating</h2>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardStats.averageRating > 0 ? dashboardStats.averageRating : 'N/A'}
              </p>
            </div>
          </div>
        </div>
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
            onClick={() => setActiveTab('past')}
            className={`pb-4 px-1 ${
              activeTab === 'past'
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Past Sessions
          </button>
        </nav>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {sessions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {activeTab === 'past' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                  )}
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {session.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.category} • {session.difficulty}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(session.scheduledAt)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(session.scheduledAt)} ({session.duration} min)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users size={16} className="mr-1 text-gray-500" />
                        <span className="text-sm text-gray-900">
                          {session.participants ? session.participants.length : 0}
                          {session.maxParticipants > 0 && ` / ${session.maxParticipants}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        session.status === 'live'
                          ? 'bg-green-100 text-green-800'
                          : session.status === 'scheduled'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </td>
                    {activeTab === 'past' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 mr-1">
                            {session.averageRating ? session.averageRating.toFixed(1) : 'N/A'}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {activeTab === 'upcoming' && session.status === 'scheduled' && (
                          <button
                            onClick={() => handleStartSession(session._id)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <Play size={16} className="mr-1" />
                            Start
                          </button>
                        )}
                        {activeTab === 'upcoming' && (
                          <>
                            <button
                              onClick={() => handleEditSession(session._id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteSession(session._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                        {activeTab === 'past' && (
                          <Link
                            to={`/trainer/sessions/${session._id}/analytics`}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            <BarChart2 size={16} className="mr-1" />
                            Analytics
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                {activeTab === 'upcoming' ? (
                  <Calendar size={48} />
                ) : (
                  <BarChart2 size={48} />
                )}
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'upcoming'
                  ? 'You have no upcoming sessions scheduled.'
                  : 'You have not completed any sessions yet.'}
              </p>
              {activeTab === 'upcoming' && (
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/trainer/sessions/create')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus size={16} className="-ml-1 mr-2" />
                    Create New Session
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default TrainerDashboard;
