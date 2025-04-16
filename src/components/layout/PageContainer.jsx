// src/components/layout/PageContainer.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import NotificationContainer from '../common/Notification';

const PageContainer = ({
  children,
  withoutFooter = false,
  fullWidth = false,
  className = ''
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NotificationContainer />
      <Header />

      <main className={`flex-grow ${!fullWidth ? 'max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8' : ''} ${className}`}>
        {children}
      </main>

      {!withoutFooter && <Footer />}
    </div>
  );
};

export default PageContainer;
