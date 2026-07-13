import React, { useState, useMemo } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { Bell, Check, Trash2, Search, Info, AlertTriangle, Calendar, FileText, Settings, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Notifications.css';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, deleteAll } = useNotification();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      // 1. Filter by unread status
      if (filter === 'unread' && notif.isRead) return false;
      
      // 2. Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = notif.title?.toLowerCase().includes(query);
        const msgMatch = notif.message?.toLowerCase().includes(query);
        const typeMatch = notif.type?.toLowerCase().includes(query);
        if (!titleMatch && !msgMatch && !typeMatch) return false;
      }
      
      return true;
    });
  }, [notifications, filter, searchQuery]);

  const getIconForType = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('appointment')) return <Calendar size={20} />;
    if (t.includes('document')) return <FileText size={20} />;
    if (t.includes('ai')) return <Sparkles size={20} />;
    if (t.includes('eligibility')) return <CheckCircle size={20} />;
    if (t.includes('update') || t.includes('system')) return <Settings size={20} />;
    if (t.includes('alert')) return <AlertTriangle size={20} />;
    return <Info size={20} />;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
    }).format(date);
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all notifications? This cannot be undone.')) {
      deleteAll();
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated on your appointments, documents, and application status.</p>
        </div>
        <div className="notifications-actions">
          {notifications.some(n => !n.isRead) && (
            <button className="btn-outline" onClick={markAllAsRead}>
              <Check size={16} style={{ display: 'inline', marginRight: '6px' }}/> 
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button className="btn-danger" onClick={handleDeleteAll}>
              <Trash2 size={16} style={{ display: 'inline', marginRight: '6px' }}/> 
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="notifications-controls">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread
          </button>
        </div>
        <div className="search-box">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search notifications..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <h3>No notifications found</h3>
            <p>{searchQuery ? 'Try adjusting your search query.' : 'You are all caught up!'}</p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <div key={notif.id} className={`notification-card ${!notif.isRead ? 'unread' : ''} ${notif.priority === 'high' ? 'priority-high' : ''}`}>
              <div className="notification-icon-container">
                {getIconForType(notif.type)}
              </div>
              <div className="notification-content">
                <div className="notification-title-row">
                  <h4 className="notification-title">{notif.title}</h4>
                  <span className="notification-time">{formatTime(notif.createdAt)}</span>
                </div>
                <p className="notification-message">{notif.message}</p>
                <div className="notification-footer">
                  <span className="notification-type-badge">{notif.type}</span>
                  <div className="notification-item-actions">
                    {notif.actionLink && (
                      <Link to={notif.actionLink} className="btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                        View Details
                      </Link>
                    )}
                    {!notif.isRead && (
                      <button 
                        className="btn-icon" 
                        title="Mark as read"
                        onClick={() => markAsRead(notif.id)}
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button 
                      className="btn-icon delete" 
                      title="Delete notification"
                      onClick={() => deleteNotification(notif.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
