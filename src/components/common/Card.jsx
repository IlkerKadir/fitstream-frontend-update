// src/components/common/Card.jsx
import React from 'react';

const Card = ({
  children,
  className = '',
  header,
  footer,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow overflow-hidden
        ${hoverable ? 'transition hover:shadow-md' : ''}
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-200">
          {header}
        </div>
      )}

      <div className="p-6">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
