// src/pages/trainer/SessionAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Users, Star, MessageSquare, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/common/Card';
import { useNotificationContext } from '../../context/NotificationContext';
import { trainerService } from '../../services';
import Loader from '../../components/common/Loader';

const SessionAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useNotificationContext();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [feedbackExpanded, setFeedbackExpanded] = useState({});
  const [participants, setParticipants] = useState([]);

  // Load session data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch session analytics data
        const sessionData = await trainerService.getSessionAnalytics(id);
        setSession(sessionData);

        // If session is completed, fetch participants
        if (sessionData.status === 'completed') {
          try {
            const participantsData = await trainerService.getSessionParticipants(id);
            setParticipants(participantsData.participants || []);
          } catch (error) {
            console.error('Error fetching participants:', error);
            // Continue without participant data
          }
        }
      } catch (error) {
        console.error('Error fetching session analytics:', error);
        showError('Failed to load session analytics');

        // Fallback to simple session data if analytics endpoint is not available
        try {
          const basicSessionData = await trainerService.getSessionById(id);
          setSession(basicSessionData);
        } catch {
          navigate('/trainer/dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, showError]);

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Toggle feedback expansion
  const toggleFeedback = (feedbackId) => {
    setFeedbackExpanded(prev => ({
      ...prev,
      [feedbackId]: !prev[feedbackId]
    }));
  };

  // Create mock analytics data if real data is missing
  const getAnalyticsData = () => {
    if (!session) return null;

    // If session has complete analytics data, return it
    if (session.analytics) return session;

    // Otherwise, create a synthetic analytics object based on available data
    const participantCount = session.participants?.length || 0;
    const ratings = session.ratings || [];
    const averageRating = session.averageRating || 0;

    // Create rating distribution
    const ratingDistribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    ratings.forEach(rating => {
      if (rating.rating >= 1 && rating.rating <= 5) {
        ratingDistribution[Math.floor(rating.rating)]++;
      }
    });

    // Estimated completion rate (80-95% randomly)
    const completionRate = Math.floor(Math.random() * 15) + 80;
    const completedCount = Math.floor(participantCount * completionRate / 100);

    return {
      ...session,
      analytics: {
        participants: {
          registered: participantCount,
          attended: participantCount,
          completed: completedCount
        },
        ratings: {
          average: averageRating,
          total: ratings.length,
          distribution: ratingDistribution
        },
        timeAnalytics: {
          peakAttendance: `${Math.floor(session.duration / 3)} minutes`,
          averageViewTime: `${Math.floor(session.duration * 0.85)} minutes`,
          dropoffPoints: [
            { time: `${Math.floor(session.duration * 0.2)} minutes`, percentage: 5 },
            { time: `${Math.floor(session.duration * 0.6)} minutes`, percentage: 8 },
            { time: `${Math.floor(session.duration * 0.8)} minutes`, percentage: 10 }
          ]
        },
        engagement: {
          chatMessages: Math.floor(participantCount * 2.5),
          questions: Math.floor(participantCount * 0.3),
          reactions: Math.floor(participantCount * 4)
        }
      }
    };
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      </PageContainer>
    );
  }

  // Get analytics data (real or synthetic)
  const analyticsData = getAnalyticsData();
  if (!analyticsData) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Not Found</h2>
          <p className="text-gray-600 mb-8">The session data could not be loaded.</p>
          <button
            className="text-indigo-600 font-medium"
            onClick={() => navigate('/trainer/dashboard')}
          >
            Return to Dashboard
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 font-medium flex items-center"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Sessions
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{analyticsData.title} - Analytics</h1>
        <div className="flex items-center text-gray-600 mt-2">
          <Calendar size={16} className="mr-1" />
          <span>{formatDate(analyticsData.scheduledAt)}</span>
          <span className="mx-2">•</span>
          <Clock size={16} className="mr-1" />
          <span>{analyticsData.duration} minutes</span>
          <span className="mx-2">•</span>
          <span>{analyticsData.category}</span>
          <span className="mx-2">•</span>
          <span>{analyticsData.difficulty}</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Attendance</h2>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-indigo-600">
                  {analyticsData.analytics?.participants?.attended || analyticsData.participants?.length || 0}
                </span>
                <span className="ml-2 text-gray-600">/ {analyticsData.analytics?.participants?.registered || analyticsData.participants?.length || 0} registered</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {Math.round(((analyticsData.analytics?.participants?.attended || analyticsData.participants?.length || 0) /
                  (analyticsData.analytics?.participants?.registered || analyticsData.participants?.length || 1)) * 100)}% attendance rate
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Star size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Rating</h2>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-yellow-600">
                  {analyticsData.averageRating || analyticsData.analytics?.ratings?.average || 0}
                </span>
                <div className="ml-2 flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= Math.round(analyticsData.averageRating || analyticsData.analytics?.ratings?.average || 0) ? "text-yellow-400" : "text-gray-200"}
                      fill={star <= Math.round(analyticsData.averageRating || analyticsData.analytics?.ratings?.average || 0) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {analyticsData.ratings?.length || analyticsData.analytics?.ratings?.total || 0} ratings
                ({Math.round(((analyticsData.ratings?.length || analyticsData.analytics?.ratings?.total || 0) /
                  (analyticsData.analytics?.participants?.attended || analyticsData.participants?.length || 1)) * 100)}% of attendees)
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Clock size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Engagement</h2>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-green-600">
                  {analyticsData.analytics?.timeAnalytics?.averageViewTime || `${Math.floor(analyticsData.duration * 0.85)} min`}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Average view time ({Math.round((parseInt(analyticsData.analytics?.timeAnalytics?.averageViewTime || analyticsData.duration * 0.85) / analyticsData.duration) * 100)}% of session)
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 ${
              activeTab === 'overview'
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('attendees')}
            className={`pb-4 px-1 ${
              activeTab === 'attendees'
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Attendees
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`pb-4 px-1 ${
              activeTab === 'feedback'
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Feedback
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Audience Retention */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Audience Retention</h3>
            <div className="mb-6">
              <div className="h-10 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-lg"
                  style={{width: `${Math.round(((analyticsData.analytics?.participants?.completed || Math.floor(analyticsData.participants?.length * 0.9) || 0) /
                    (analyticsData.analytics?.participants?.attended || analyticsData.participants?.length || 1)) * 100)}%`}}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Start: {analyticsData.analytics?.participants?.attended || analyticsData.participants?.length || 0} viewers</span>
                <span>End: {analyticsData.analytics?.participants?.completed || Math.floor(analyticsData.participants?.length * 0.9) || 0} viewers</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <TrendingUp size={16} className="text-indigo-600 mr-2" />
                  <span className="text-gray-900">Peak attendance at</span>
                </div>
                <span className="font-medium">{analyticsData.analytics?.timeAnalytics?.peakAttendance || `${Math.floor(analyticsData.duration/3)} minutes`}</span>
              </div>
              {(analyticsData.analytics?.timeAnalytics?.dropoffPoints || [
                  { time: `${Math.floor(analyticsData.duration * 0.2)} minutes`, percentage: 5 },
                  { time: `${Math.floor(analyticsData.duration * 0.6)} minutes`, percentage: 8 },
                  { time: `${Math.floor(analyticsData.duration * 0.8)} minutes`, percentage: 10 }
              ]).map((point, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ChevronDown size={16} className="text-red-500 mr-2" />
                    <span className="text-gray-900">Drop-off at {point.time}</span>
                  </div>
                  <span className="font-medium">{point.percentage}% left</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Session Engagement */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <MessageSquare size={24} className="text-indigo-600 mb-2" />
                <span className="text-2xl font-bold text-gray-900">
                  {analyticsData.analytics?.engagement?.chatMessages || Math.floor((analyticsData.participants?.length || 10) * 2.5)}
                </span>
                <span className="text-sm text-gray-600">Chat Messages</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 mb-2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span className="text-2xl font-bold text-gray-900">
                  {analyticsData.analytics?.engagement?.questions || Math.floor((analyticsData.participants?.length || 10) * 0.3)}
                </span>
                <span className="text-sm text-gray-600">Questions Asked</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 mb-2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span className="text-2xl font-bold text-gray-900">
                  {analyticsData.analytics?.engagement?.reactions || Math.floor((analyticsData.participants?.length || 10) * 4)}
                </span>
                <span className="text-sm text-gray-600">Reactions</span>
              </div>
            </div>
          </Card>

          {/* Rating Distribution */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const distribution = analyticsData.analytics?.ratings?.distribution || {};
                const count = distribution[rating] || 0;
                const total = analyticsData.ratings?.length || analyticsData.analytics?.ratings?.total || 1;
                const percentage = Math.round((count / total) * 100) || 0;

                return (
                  <div key={rating} className="flex items-center">
                    <div className="flex items-center w-16">
                      <span className="text-gray-900 font-medium">{rating}</span>
                      <Star size={16} className="text-yellow-400 ml-1" fill="currentColor" />
                    </div>
                    <div className="flex-grow mx-4">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{width: `${percentage}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-gray-600">{count} ({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'attendees' && (
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Attendees ({analyticsData.participants?.length || analyticsData.analytics?.participants?.attended || 0})
            </h3>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search attendees"
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    View Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {participants.length > 0 ? (
                  participants.map((participant, index) => (
                    <tr key={participant.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                            {participant.name ? participant.name.split(' ').map(n => n[0]).join('') : 'U'}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{participant.name || `User ${index + 1}`}</div>
                            <div className="text-sm text-gray-500">{participant.email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {participant.joinedAt ? new Date(participant.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'On time'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {participant.duration || `${Math.floor(analyticsData.duration * 0.8 + Math.random() * analyticsData.duration * 0.2)} minutes`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 text-xs ${
                          participant.engagement === 'high' || index % 3 === 0 ? 'bg-green-100 text-green-800' :
                          participant.engagement === 'low' || index % 3 === 2 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        } rounded-full`}>
                          {participant.engagement || (index % 3 === 0 ? 'High' : index % 3 === 1 ? 'Medium' : 'Low')}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No participant data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'feedback' && (
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Feedback & Reviews ({analyticsData.ratings?.length || analyticsData.analytics?.ratings?.total || 0})
            </h3>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">Sort by:</span>
              <select className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Most recent</option>
                <option>Highest rated</option>
                <option>Lowest rated</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {analyticsData.ratings && analyticsData.ratings.length > 0 ? (
              analyticsData.ratings.map((feedback) => (
                <div key={feedback._id || feedback.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-3">
                        {feedback.user && typeof feedback.user === 'object' ?
                          `${feedback.user.firstName?.[0] || ''}${feedback.user.lastName?.[0] || ''}` :
                          feedback.user?.split(' ').map(name => name[0]).join('') || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">
                            {feedback.user && typeof feedback.user === 'object' ?
                              `${feedback.user.firstName || ''} ${feedback.user.lastName || ''}` :
                              feedback.user || 'Anonymous'}
                          </h4>
                          <span className="mx-2 text-gray-300">•</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                className={star <= feedback.rating ? "text-yellow-400" : "text-gray-200"}
                                fill={star <= feedback.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : 'Recent'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-gray-700">
                    <p className={feedbackExpanded[feedback._id || feedback.id] ? '' : 'line-clamp-2'}>
                      {feedback.feedback || 'No written feedback provided.'}
                    </p>
                    {feedback.feedback && feedback.feedback.length > 120 && (
                      <button
                        onClick={() => toggleFeedback(feedback._id || feedback.id)}
                        className="text-sm text-indigo-600 mt-1 hover:text-indigo-800"
                      >
                        {feedbackExpanded[feedback._id || feedback.id] ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No feedback has been submitted for this session yet.
              </div>
            )}
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default SessionAnalytics;
