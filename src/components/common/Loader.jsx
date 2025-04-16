// src/components/common/Loader.jsx
import React from 'react';

const Loader = ({ size = 'md', color = 'indigo', fullPage = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    indigo: 'border-indigo-600',
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    white: 'border-white'
  };

  const loaderElement = (
    <div
      className={`
        ${sizeClasses[size]}
        ${colorClasses[color]}
        border-t-transparent
        rounded-full
        animate-spin
      `}
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {loaderElement}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      {loaderElement}
    </div>
  );
};

export default Loader;
