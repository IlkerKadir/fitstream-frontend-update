// src/components/common/Notification.jsx
import React, { useEffect } from 'react';
import { useNotificationContext } from '../../context/NotificationContext';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const NotificationItem = ({ notification, onDismiss }) => {
  const { id, type, message, title } = notification;

  // Auto-dismiss after timeout
  useEffect(() => {
    if (!notification.persistent) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, notification.timeout || 5000);

      return () => clearTimeout(timer);
    }
  }, [id, notification, onDismiss]);

  const typeConfigs = {
    success: {
      icon: <CheckCircle className="text-green-500" size={20} />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400'
    },
    error: {
      icon: <AlertCircle className="text-red-500" size={20} />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400'
    },
    warning: {
      icon: <AlertTriangle className="text-yellow-500" size={20} />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-400'
    },
    info: {
      icon: <Info className="text-blue-500" size={20} />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400'
    }
  };

  const config = typeConfigs[type] || typeConfigs.info;

  return (
    <div
      className={`
        ${config.bgColor}
        ${config.borderColor}
        border-l-4
        p-4
        mb-3
        rounded-r
        shadow-md
        flex
        items-start
      `}
    >
      <div className="flex-shrink-0 mr-3">
        {config.icon}
      </div>

      <div className="flex-1 mr-2">
        {title && <h4 className="font-medium text-gray-900 mb-1">{title}</h4>}
        <p className="text-sm text-gray-700">{message}</p>
      </div>

      <button
        className="flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
        onClick={() => onDismiss(id)}
      >
        <X size={16} />
      </button>
    </div>
  );
};

const NotificationContainer = () => {
  const { notifications, dismissNotification } = useNotificationContext();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-0 right-0 p-4 z-50 w-full max-w-sm">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={dismissNotification}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
