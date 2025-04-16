// src/components/sessions/SessionDetail.jsx
import React from 'react';
import { Clock, Users, Package, Award, Dumbbell } from 'lucide-react';
import Button from '../common/Button';

const SessionDetail = ({ session, onBookSession, isBooked = false }) => {
  if (!session) return null;

  // Safely handle properties that might be objects or arrays
  const participantCount = Array.isArray(session.participants)
    ? session.participants.length
    : (typeof session.participants === 'number' ? session.participants : 0);

  const equipmentList = Array.isArray(session.equipmentRequired)
    ? session.equipmentRequired.join(', ')
    : (typeof session.equipmentRequired === 'string' ? session.equipmentRequired : '');

  const tagsList = Array.isArray(session.tags)
    ? session.tags
    : [];

  // Handle trainer data which might be an object
  const trainerName = session.trainer && typeof session.trainer === 'object'
    ? `${session.trainer.firstName || ''} ${session.trainer.lastName || ''}`
    : (typeof session.trainer === 'string' ? session.trainer : 'Unknown');

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    const sessionDate = new Date(date);
    return `${sessionDate.toLocaleDateString(undefined, options)} at ${sessionDate.toLocaleTimeString(undefined, timeOptions)}`;
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }

    return `${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header Image or Banner */}
      <div className="h-48 bg-indigo-600 relative overflow-hidden">
        {session.thumbnail ? (
          <img
            src={session.thumbnail}
            alt={session.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white">{session.title}</h1>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{session.title}</h1>

            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 overflow-hidden">
                {session.trainer.profilePicture ? (
                  <img
                    src={session.trainer.profilePicture}
                    alt={`${session.trainer.firstName} ${session.trainer.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                    {session.trainer.firstName[0]}{session.trainer.lastName[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {session.trainer.firstName} {session.trainer.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {session.trainer.specialties?.join(', ')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                {session.category || 'General'}
              </span>
              <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {session.difficulty || 'All Levels'}
              </span>
              {tagsList.map(tag => (
                <span key={tag} className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <Clock size={18} className="mr-2 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm">{formatDate(session.scheduledAt)}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <Clock size={18} className="mr-2 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm">{formatDuration(session.duration)}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <Users size={18} className="mr-2 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium">Participants</p>
                  <p className="text-sm">
                    {participantCount} joined
                    {session.maxParticipants > 0 && ` (Max: ${session.maxParticipants})`}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <Package size={18} className="mr-2 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium">Token Cost</p>
                  <p className="text-sm">{session.tokenCost} Token{session.tokenCost > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <Award size={18} className="mr-2 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium">Level</p>
                  <p className="text-sm">{session.difficulty}</p>
                </div>
              </div>

              {equipmentList && (
                <div className="flex items-center text-gray-700">
                  <div>
                    <p className="text-sm font-medium">Equipment Required</p>
                    <p className="text-sm">{equipmentList}</p>
                  </div>
                </div>
              )}

            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{session.description}</p>
            </div>
          </div>

          <div className="md:ml-8 md:w-64 mt-6 md:mt-0">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Join This Session</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(session.scheduledAt) > new Date() ? (
                    `Starting in ${Math.ceil((new Date(session.scheduledAt) - new Date()) / (1000 * 60 * 60))} hours`
                  ) : (
                    'In Progress'
                  )}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Token Cost:</span>
                  <span className="font-medium text-gray-900">{session.tokenCost}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Duration:</span>
                  <span className="font-medium text-gray-900">{formatDuration(session.duration)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Participants:</span>
                  <span className="font-medium text-gray-900">{session.participants}</span>
                </div>
              </div>

              {isBooked ? (
                <Button
                  variant="primary"
                  fullWidth
                  disabled={new Date(session.scheduledAt) > new Date()}
                >
                  {new Date(session.scheduledAt) > new Date()
                    ? 'Already Booked'
                    : 'Join Live Session'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => onBookSession(session.id)}
                  disabled={new Date(session.scheduledAt) < new Date()}
                >
                  {new Date(session.scheduledAt) < new Date()
                    ? 'Session Started'
                    : 'Book Session'}
                </Button>
              )}

              {isBooked && new Date(session.scheduledAt) > new Date() && (
                <p className="text-sm text-center mt-4 text-gray-500">
                  Your session is confirmed. You'll receive a reminder email 30 minutes before it starts.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
