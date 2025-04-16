// src/components/sessions/SessionCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Package } from 'lucide-react';
import Button from '../common/Button';

const SessionCard = ({ session, onBookClick }) => {
  // Format date
  const formatDate = (date) => {
    const now = new Date();
    const sessionDate = new Date(date);

    // Check if today
    if (
      now.getDate() === sessionDate.getDate() &&
      now.getMonth() === sessionDate.getMonth() &&
      now.getFullYear() === sessionDate.getFullYear()
    ) {
      return `Today, ${sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Check if tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (
      tomorrow.getDate() === sessionDate.getDate() &&
      tomorrow.getMonth() === sessionDate.getMonth() &&
      tomorrow.getFullYear() === sessionDate.getFullYear()
    ) {
      return `Tomorrow, ${sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Otherwise show day of week
    const options = { weekday: 'short' };
    return `${sessionDate.toLocaleDateString([], options)}, ${sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition">
      <div className="h-3 bg-indigo-600"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
          <span className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-800">
            {session.tokenCost} Token{session.tokenCost > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <div className="w-8 h-8 rounded-full mr-2 bg-gray-200 overflow-hidden">
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
          <span>{session.trainer.firstName} {session.trainer.lastName}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
            {session.category}
          </span>
          <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            {session.difficulty}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{formatDate(session.scheduledAt)}</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>{session.participants}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="flex-1"
          >
            <Link to={`/sessions/${session.id}`} className="w-full">
              Details
            </Link>
          </Button>
          <Button
            className="flex-1"
            onClick={() => onBookClick(session.id)}
          >
            Book
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
