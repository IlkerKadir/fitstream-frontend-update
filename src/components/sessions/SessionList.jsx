// src/components/sessions/SessionList.jsx
import React from 'react';
import SessionCard from './SessionCard';
import Loader from '../common/Loader';

const SessionList = ({
  sessions,
  loading = false,
  error = null,
  onBookSession,
  emptyMessage = "No sessions found"
}) => {
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-800">
        <p>Error loading sessions: {error.message}</p>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map(session => (
        <SessionCard
          key={session.id}
          session={session}
          onBookClick={onBookSession}
        />
      ))}
    </div>
  );
};

export default SessionList;
