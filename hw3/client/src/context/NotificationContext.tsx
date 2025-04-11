import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-bootstrap';

interface Notification {
  id: number;
  message: string;
  variant: 'success' | 'danger' | string;
}

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const addNotification = ({ message, variant }: Omit<Notification, 'id'>) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, variant }]);

    // Remove notification after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999, width: '300px' }}>
        {notifications.map((n) => (
          <Alert key={n.id}
                 variant={n.variant}
                 onClose={() => removeNotification(n.id)}
                 dismissible
                 style={{ marginBottom: '10px' }}>
            {n.message}
          </Alert>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};