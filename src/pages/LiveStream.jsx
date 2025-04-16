// src/pages/LiveStream.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, MessageSquare, Clock, ThumbsUp, Star, Heart, X, CheckCircle} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/common/Button';
import { useAuthContext } from '../context/AuthContext';
import { useNotificationContext } from '../context/NotificationContext';
import AgoraStreamManager from '../components/streaming/AgoraStreamManager';
import streamService from '../services/streamService';

const LiveStream = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { showSuccess, showError } = useNotificationContext();

  const [session, setSession] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [chatOpen, setChatOpen] = useState(true);
  const [otherParticipants, setOtherParticipants] = useState(0);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Reaction state
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState([]);

  // Start timer when stream is active
  useEffect(() => {
    if (session?.status === 'live' && session?.sessionData?.startedAt) {
      const startTime = new Date(session.sessionData.startedAt).getTime();

      // Calculate initial elapsed time
      const initialElapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(initialElapsed > 0 ? initialElapsed : 0);

      // Set up interval to update every second
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Load session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);

        // Fetch session streaming details
        const response = await streamService.getStreamDetails(sessionId);
        setSession(response);

        // If session is live, set stream data
        if (response.status === 'live') {
          setStreamData(response.streamData);

          // In a real app, you would get the participants count from the API
          if (response.participants) {
            setOtherParticipants(response.participants.length);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching session:', error);
        showError(error.response?.data?.message || 'Failed to load session');
        navigate('/dashboard');
      }
    };

    fetchSession();

    // Join stream endpoint
    const joinStream = async () => {
      try {
        await streamService.joinStream(sessionId);
      } catch (error) {
        console.error('Error joining stream:', error);
      }
    };

    joinStream();

    // Leave stream when component unmounts
    return () => {
      const leaveStream = async () => {
        try {
          await streamService.leaveStream(sessionId);
        } catch (error) {
          console.error('Error leaving stream:', error);
        }
      };

      leaveStream();
    };
  }, [sessionId, navigate, showError]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    // In a real app, you would send this to a backend API or websocket
    const message = {
      id: Date.now(),
      user: `${user.firstName} ${user.lastName}`,
      message: newMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  // Handle reactions
  const sendReaction = (type) => {
    // In a real app, this would be sent to a websocket
    const newReaction = {
      id: Date.now(),
      type,
      userId: user.id
    };

    setReactions(prev => [...prev, newReaction]);

    // Auto-remove reaction after 2 seconds
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2000);

    // Hide reaction panel
    setShowReactions(false);
  };

  // Handle stream error
  const handleStreamError = (errorMessage) => {
    showError(`Stream error: ${errorMessage}`);
  };

  // Waiting screen if session is not live yet
  const renderWaitingScreen = () => (
    <div className="h-full flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md text-center p-8">
        <Clock size={64} className="mx-auto mb-6 text-indigo-400" />
        <h2 className="text-2xl font-bold mb-4">Session Not Started Yet</h2>
        <p className="mb-6 text-gray-300">
          The trainer hasn't started the session yet. The session is scheduled to begin at{' '}
          {new Date(session?.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
        </p>
        <Button
          onClick={() => navigate('/dashboard')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );

  // Completed screen if session has ended
  const renderCompletedScreen = () => (
    <div className="h-full flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md text-center p-8">
        <div className="mx-auto mb-6 bg-green-100 text-green-600 rounded-full p-4 inline-block">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Session Completed</h2>
        <p className="mb-6 text-gray-300">
          This session has ended. Thank you for participating!
        </p>
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Rate this session</h3>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="text-yellow-400 hover:text-yellow-300"
              >
                <Star size={32} />
              </button>
            ))}
          </div>
        </div>
        <Button
          onClick={() => navigate('/dashboard')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <PageContainer fullWidth withoutFooter>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow px-4 py-2 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {session?.sessionData?.title || 'Training Session'}
          </h1>
          <p className="text-sm text-gray-600">
            with {session?.sessionData?.trainer || 'Trainer'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={16} className="mr-1" />
            <span>
              {formatTime(elapsedTime)} / {session?.sessionData?.duration || 0}:00
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users size={16} className="mr-1" />
            <span>{otherParticipants} watching</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            Exit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-grow relative">
          {session?.status === 'live' ? (
            <div className="h-full">
              <AgoraStreamManager
                streamData={streamData}
                isHost={false}
                onError={handleStreamError}
              />

              {/* Floating reaction button */}
              <div className="absolute bottom-4 left-4 z-10">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-full backdrop-blur-sm"
                >
                  <ThumbsUp size={24} className="text-white" />
                </button>

                {/* Reaction panel */}
                {showReactions && (
                  <div className="absolute bottom-16 left-0 bg-white p-2 rounded-lg shadow-lg flex space-x-2">
                    <button
                      onClick={() => sendReaction('thumbsUp')}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <ThumbsUp size={24} className="text-indigo-600" />
                    </button>
                    <button
                      onClick={() => sendReaction('heart')}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Heart size={24} className="text-red-500" />
                    </button>
                    <button
                      onClick={() => sendReaction('star')}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Star size={24} className="text-yellow-500" />
                    </button>
                    <button
                      onClick={() => setShowReactions(false)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <X size={24} className="text-gray-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Floating reactions */}
              <div className="absolute inset-0 pointer-events-none">
                {reactions.map(reaction => {
                  // Random position within the container
                  const left = Math.floor(Math.random() * 70) + 10; // 10% to 80% from left
                  const bottom = Math.floor(Math.random() * 40) + 20; // 20% to 60% from bottom

                  // Render different reaction icons
                  let icon;
                  switch (reaction.type) {
                    case 'thumbsUp':
                      icon = <ThumbsUp size={32} className="text-indigo-600" />;
                      break;
                    case 'heart':
                      icon = <Heart size={32} className="text-red-500" />;
                      break;
                    case 'star':
                      icon = <Star size={32} className="text-yellow-500" />;
                      break;
                    default:
                      icon = <ThumbsUp size={32} className="text-indigo-600" />;
                  }

                  return (
                    <div
                      key={reaction.id}
                      className="absolute animate-float opacity-70"
                      style={{
                        left: `${left}%`,
                        bottom: `${bottom}%`,
                        animation: 'float 2s ease-out forwards'
                      }}
                    >
                      {icon}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : session?.status === 'scheduled' ? (
            renderWaitingScreen()
          ) : (
            renderCompletedScreen()
          )}
        </div>

        {/* Chat Panel */}
        {chatOpen && session?.status === 'live' && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Live Chat</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setChatOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium text-sm flex-shrink-0">
                    {msg.user === 'Trainer' ? 'T' : msg.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-2 flex-grow">
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium text-sm">{msg.user}</span>
                      <span className="text-xs text-gray-500">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Chat Toggle Button */}
        {!chatOpen && session?.status === 'live' && (
          <button
            className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg"
            onClick={() => setChatOpen(true)}
          >
            <MessageSquare size={24} className="text-indigo-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveStream;
