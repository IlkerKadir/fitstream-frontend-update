// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <PageContainer>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-16">
        <h1 className="text-8xl font-bold text-indigo-600 mb-6">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-600 max-w-md mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex space-x-4">
          <Button
            as={Link}
            to="/"
          >
            Go to Home
          </Button>
          <Button
            variant="outline"
            as={Link}
            to="/sessions"
          >
            Browse Sessions
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotFound;
