import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    const newNotif = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification,
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 50));
    setUnreadCount((prev) => prev + 1);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAllRead, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
