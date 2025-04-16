// src/pages/trainer/TrainerLiveStream.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, MessageSquare, PhoneOff, User } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useNotificationContext } from '../../context/NotificationContext';
import Button from '../../components/common/Button';
import AgoraStreamManager from '../../components/streaming/AgoraStreamManager';
import Loader from '../../components/common/Loader';
import { trainerService, streamService } from '../../services';

const TrainerLiveStream = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { showSuccess, showError } = useNotificationContext();

  // State for session details
  const [session, setSession] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streamStarted, setStreamStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [participants, setParticipants] = useState([]);

  // UI state
  const [chatOpen, setChatOpen] = useState(true);
  const [participantsOpen, setParticipantsOpen] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Start timer when stream is active
  useEffect(() => {
    if (streamStarted && session?.streamingDetails?.startedAt) {
      const startTime = new Date(session.streamingDetails.startedAt).getTime();

      // Calculate initial elapsed time
      const initialElapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(initialElapsed > 0 ? initialElapsed : 0);

      // Set up interval to update every second
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [streamStarted, session]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch participants - defined as a callback so it can be used in useEffect and event handlers
  const fetchParticipants = useCallback(async () => {
    if (!streamStarted) return;

    try {
      const response = await trainerService.getSessionParticipants(sessionId);
      setParticipants(response.participants || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
      // Continue without updating participants
    }
  }, [sessionId, streamStarted]);

  // Load session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);

        // Fetch session streaming details
        const response = await streamService.getStreamDetails(sessionId);
        setSession(response);

        // If session is live, set stream data and started state
        if (response.status === 'live') {
          setStreamData(response.streamData);
          setStreamStarted(true);

          // Fetch participants
          await fetchParticipants();

          // Load existing messages if any
          if (response.messages && response.messages.length > 0) {
            setMessages(response.messages.map(msg => ({
              id: msg._id,
              user: typeof msg.user === 'object'
                ? `${msg.user.firstName} ${msg.user.lastName}${msg.user._id === user._id ? ' (Host)' : ''}`
                : 'User',
              message: msg.message,
              timestamp: new Date(msg.timestamp)
            })));
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching session:', error);
        showError(error.response?.data?.message || 'Failed to load session data');
        navigate('/trainer/dashboard');
      }
    };

    fetchSession();

    // Set up polling for participant updates if stream is active
    const participantInterval = setInterval(() => {
      if (streamStarted) {
        fetchParticipants();
      }
    }, 30000); // Poll every 30 seconds

    return () => {
      clearInterval(participantInterval);
    };
  }, [sessionId, navigate, showError, streamStarted, fetchParticipants, user._id]);

  // Start the stream
  const startStream = async () => {
    try {
      const response = await trainerService.startSession(sessionId);

      // Check if we have valid stream data with Agora credentials
      if (!response.streamData || !response.streamData.appId) {
        showError("Agora credentials are not configured. Please set up the environment variables for streaming.");
        return;
      }

      setStreamData(response.streamData);
      setSession(response);
      setStreamStarted(true);

      showSuccess('Stream started successfully');
    } catch (error) {
      console.error('Error starting stream:', error);
      showError(error.response?.data?.message || 'Failed to start stream. Ensure that Agora is properly configured.');
    }
  };

  // End the stream
  const endStream = async () => {
    if (window.confirm('Are you sure you want to end this session for all participants?')) {
      try {
        await trainerService.endSession(sessionId);
        showSuccess('Session ended successfully');
        navigate('/trainer/dashboard');
      } catch (error) {
        console.error('Error ending stream:', error);
        showError(error.response?.data?.message || 'Failed to end stream');
      }
    }
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      // Send message to the backend
      const response = await trainerService.sendChatMessage(sessionId, newMessage.trim());

      // Add message to the local state
      const message = {
        id: response.id || Date.now(),
        user: `${user.firstName} ${user.lastName} (Host)`,
        message: newMessage.trim(),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Failed to send message');
    }
  };

  // Handle user joined event from Agora
  const handleUserJoined = (user, mediaType) => {
    // Refresh participant list when a user joins
    fetchParticipants();
  };

  // Handle user left event from Agora
  const handleUserLeft = (user) => {
    // Refresh participant list when a user leaves
    fetchParticipants();
  };

  // Handle stream error
  const handleStreamError = (errorMessage) => {
    showError(`Stream error: ${errorMessage}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow px-4 py-2 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {session?.title || 'Training Session'}
          </h1>
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>
              {streamStarted
                ? `${formatTime(elapsedTime)} / ${session?.duration || 0}:00`
                : `Scheduled: ${new Date(session?.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              }
            </span>
            <span className="mx-2">•</span>
            <Users size={14} className="mr-1" />
            <span>{participants.length} participants</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setParticipantsOpen(!participantsOpen);
              setChatOpen(false);
            }}
          >
            <Users size={16} className="mr-1" />
            Participants
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setChatOpen(!chatOpen);
              setParticipantsOpen(false);
            }}
          >
            <MessageSquare size={16} className="mr-1" />
            Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
            onClick={endStream}
          >
            <PhoneOff size={16} className="mr-1" />
            End Session
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-grow relative">
          {streamStarted ? (
            <AgoraStreamManager
              streamData={streamData}
              isHost={true}
              onError={handleStreamError}
              onUserJoined={handleUserJoined}
              onUserLeft={handleUserLeft}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-900">
              <div className="max-w-md text-center text-white p-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Start Your Session?</h2>
                <p className="mb-6 text-gray-300">
                  Your scheduled session "{session?.title}" is ready to begin.
                  Once you start, participants will be able to join the live stream.
                </p>
                <Button
                  onClick={startStream}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Start Live Session
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar for chat and participants */}
        {(chatOpen || participantsOpen) && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-3 text-sm font-medium ${chatOpen ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                onClick={() => {
                  setChatOpen(true);
                  setParticipantsOpen(false);
                }}
              >
                <div className="flex items-center justify-center">
                  <MessageSquare size={16} className="mr-2" />
                  Chat
                </div>
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${participantsOpen ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                onClick={() => {
                  setParticipantsOpen(true);
                  setChatOpen(false);
                }}
              >
                <div className="flex items-center justify-center">
                  <Users size={16} className="mr-2" />
                  Participants
                </div>
              </button>
            </div>

            {/* Chat Panel */}
            {chatOpen && (
              <div className="flex-grow flex flex-col">
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                  {messages.length > 0 ? (
                    messages.map(msg => (
                      <div key={msg.id} className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium text-sm flex-shrink-0">
                          {msg.user.split(' ').map(n => n[0]).join('')}
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
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <MessageSquare size={32} className="mb-2" />
                      <p>No messages yet</p>
                    </div>
                  )}
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

            {/* Participants Panel */}
            {participantsOpen && (
              <div className="flex-grow p-4 overflow-y-auto">
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900">Participants ({participants.length})</h3>
                </div>
                <div className="space-y-3">
                  {participants.length > 0 ? (
                    participants.map(participant => (
                      <div key={participant.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium text-sm">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-2">
                            <span className="text-sm font-medium text-gray-900">{participant.name}</span>
                            <div className="text-xs text-gray-500">
                              Joined {new Date(participant.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${participant.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {participant.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <User size={32} className="mb-2" />
                      <p>No participants yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerLiveStream;
