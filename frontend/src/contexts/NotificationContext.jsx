import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { notificationService } from '../services/notificationService';
import { reminderService } from '../services/reminderService';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      // Evaluate reminders on mount/login
      reminderService.evaluateReminders(currentUser);

      // Subscribe to real-time notifications
      const unsubscribe = notificationService.subscribeToNotifications(
        currentUser.uid,
        (notifs) => {
          // Filter out our internal system records
          const visibleNotifs = notifs.filter(n => n.type !== 'System_Internal');
          setNotifications(visibleNotifs);
          setUnreadCount(visibleNotifs.filter(n => !n.isRead).length);
        }
      );

      return () => unsubscribe();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser]);

  const value = {
    notifications,
    unreadCount,
    markAsRead: notificationService.markAsRead,
    markAllAsRead: () => notificationService.markAllAsRead(currentUser?.uid),
    deleteNotification: notificationService.deleteNotification,
    deleteAll: () => notificationService.deleteAll(currentUser?.uid),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
