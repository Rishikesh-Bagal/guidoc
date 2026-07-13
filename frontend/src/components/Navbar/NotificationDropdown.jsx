import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import './NotificationDropdown.css';

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const latestNotifications = notifications.slice(0, 5);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
    setIsOpen(false);
  };

  return (
    <div className="notification-dropdown-container" ref={dropdownRef}>
      <button 
        className="notification-bell" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-read-btn" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="dropdown-list">
            {latestNotifications.length === 0 ? (
              <div className="dropdown-empty">
                No new notifications
              </div>
            ) : (
              latestNotifications.map(notif => (
                <Link 
                  key={notif.id}
                  to={notif.actionLink || '/notifications'}
                  className={`dropdown-item ${!notif.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notif.id)}
                >
                  <div className="dropdown-item-title">{notif.title}</div>
                  <div className="dropdown-item-message">{notif.message}</div>
                  <div className="dropdown-item-time">{formatTime(notif.createdAt)}</div>
                </Link>
              ))
            )}
          </div>
          
          <div className="dropdown-footer">
            <Link to="/notifications" className="view-all-link" onClick={() => setIsOpen(false)}>
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
