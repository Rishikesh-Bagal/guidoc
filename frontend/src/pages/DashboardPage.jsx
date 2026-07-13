import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Search, ShieldCheck, User, Plus, Clock, Activity, Loader2, ScanLine, Mic, MapPin, Calendar, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { userService } from '../services/userService';
import { officeService } from '../services/officeService';
import { useNotification } from '../contexts/NotificationContext';
import SEO from '../components/common/SEO';
import SkeletonLoader from '../components/common/SkeletonLoader';
import './Dashboard.css';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { notifications } = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    documentsViewed: 0,
    eligibilityChecks: 0,
    savedGuides: 0,
    aiConversations: 0
  });
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        const userId = currentUser.uid;
        
        // Fetch non-realtime stats
        const [
          searches,
          eligibilityHistory,
          aiHistory,
          docViewCount,
          userAppointments
        ] = await Promise.all([
          userService.getRecentSearches(userId),
          userService.getEligibilityHistory(userId),
          userService.getAIChatHistory(userId),
          userService.getDocumentViewCount(userId),
          officeService.getUserAppointments(userId)
        ]);

        if (isMounted) {
          setRecentSearches(searches);
          setAppointments(userAppointments);
          
          setStats(prev => ({
            ...prev,
            documentsViewed: docViewCount,
            eligibilityChecks: eligibilityHistory.length,
            aiConversations: aiHistory.length
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();

    // Set up real-time listener for favorites
    let unsubscribeFavorites = () => {};
    if (currentUser) {
      unsubscribeFavorites = userService.subscribeToFavorites(currentUser.uid, (favorites) => {
        if (isMounted) {
          setSavedDocuments(favorites);
          setStats(prev => ({
            ...prev,
            savedGuides: favorites.length
          }));
        }
      });
    }

    return () => {
      isMounted = false;
      unsubscribeFavorites();
    };
  }, [currentUser]);

  const formatDate = (timestamp) => {
    if (!timestamp) return t('dashboard.recently');
    // Handle Firestore timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t('dashboard.today');
    if (diffDays === 1) return t('dashboard.yesterday');
    if (diffDays < 7) return t('dashboard.daysAgo', { count: diffDays });
    if (diffDays < 30) return t('dashboard.weeksAgo', { count: Math.floor(diffDays / 7) });
    return t('dashboard.monthsAgo', { count: Math.floor(diffDays / 30) });
  };

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || t('dashboard.defaultUser');

  return (
    <main className="dashboard-container">
      <SEO title="Dashboard | GUIDOC" description="Your personal dashboard to track and manage documents." />
      <header className="dashboard-header">
        <h1>{t('dashboard.welcomeBack', { name: displayName })}</h1>
        <p>{t('dashboard.subtitle')}</p>
      </header>

      <section className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-value">{loading ? <SkeletonLoader width="40px" height="32px" /> : stats.documentsViewed}</span>
          <span className="stat-label">{t('dashboard.documentsViewed')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{loading ? <SkeletonLoader width="40px" height="32px" /> : stats.eligibilityChecks}</span>
          <span className="stat-label">{t('dashboard.eligibilityChecks')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{loading ? <SkeletonLoader width="40px" height="32px" /> : stats.savedGuides}</span>
          <span className="stat-label">{t('dashboard.savedGuides')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{loading ? <SkeletonLoader width="40px" height="32px" /> : stats.aiConversations}</span>
          <span className="stat-label">{t('dashboard.aiConversations')}</span>
        </div>
      </section>

      <section className="dashboard-quick-actions">
        <h2>{t('dashboard.quickActions')}</h2>
        <div className="action-grid">
          <div className="action-card" onClick={() => navigate('/search')} style={{cursor: 'pointer'}}>
            <Search className="action-icon" />
            <h3>{t('dashboard.searchDocuments')}</h3>
            <p>{t('dashboard.searchDocumentsDesc')}</p>
          </div>
          <div className="action-card" onClick={() => navigate('/eligibility')} style={{cursor: 'pointer'}}>
            <ShieldCheck className="action-icon" />
            <h3>{t('dashboard.checkEligibility')}</h3>
            <p>{t('dashboard.checkEligibilityDesc')}</p>
          </div>
          <div className="action-card" onClick={() => navigate('/profile')} style={{cursor: 'pointer'}}>
            <User className="action-icon" />
            <h3>{t('dashboard.myProfile')}</h3>
            <p>{t('dashboard.myProfileDesc')}</p>
          </div>
          <div className="action-card" onClick={() => navigate('/tracker')} style={{cursor: 'pointer'}}>
            <Activity className="action-icon" />
            <h3>{t('dashboard.trackApplications')}</h3>
            <p>{t('dashboard.trackApplicationsDesc')}</p>
          </div>
          <div className="action-card" onClick={() => navigate('/scanner')} style={{cursor: 'pointer'}}>
            <ScanLine className="action-icon" />
            <h3>AI Document Scanner</h3>
            <p>Extract details from documents</p>
          </div>
          <div className="action-card" onClick={() => navigate('/voice-assistant')} style={{cursor: 'pointer'}}>
            <Mic className="action-icon" />
            <h3>Voice Assistant</h3>
            <p>Interact with GUIDOC using voice</p>
          </div>
          <div className="action-card" onClick={() => navigate('/office-locator')} style={{cursor: 'pointer'}}>
            <MapPin className="action-icon" />
            <h3>Office Locator</h3>
            <p>Find offices and book appointments</p>
          </div>
        </div>
      </section>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>{t('dashboard.recentSearches')}</h2>
            <Clock className="panel-icon" size={20} />
          </div>
          {loading ? (
            <div className="panel-loading" style={{ padding: '20px' }}>
              <SkeletonLoader type="text" count={3} height="40px" />
            </div>
          ) : recentSearches.length > 0 ? (
            <ul className="panel-list">
              {recentSearches.map((search) => (
                <li key={search.id} className="panel-list-item" onClick={() => navigate(`/search?q=${encodeURIComponent(search.query)}`)} style={{cursor: 'pointer'}}>
                  <span className="item-title">{search.query}</span>
                  <span className="item-meta">{formatDate(search.searchedAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
             <div className="panel-empty">
               <p>{t('dashboard.noRecentSearches')}</p>
             </div>
          )}
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>{t('dashboard.savedDocumentsTitle')}</h2>
            <FileText className="panel-icon" size={20} />
          </div>
          {loading ? (
            <div className="panel-loading" style={{ padding: '20px' }}>
              <SkeletonLoader type="text" count={3} height="40px" />
            </div>
          ) : savedDocuments.length > 0 ? (
            <ul className="panel-list">
              {savedDocuments.map((doc) => (
                <li key={doc.id} className="panel-list-item" onClick={() => navigate(`/documents/${doc.documentId}`)} style={{cursor: 'pointer'}}>
                  <span className="item-title">{doc.title}</span>
                  <span className="item-badge">{doc.category || t('dashboard.defaultCategory')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="panel-empty">
               <p>{t('dashboard.noSavedDocuments')}</p>
             </div>
          )}
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Upcoming Appointments</h2>
            <Calendar className="panel-icon" size={20} />
          </div>
          {loading ? (
            <div className="panel-loading" style={{ padding: '20px' }}>
              <SkeletonLoader type="text" count={3} height="40px" />
            </div>
          ) : appointments.length > 0 ? (
            <ul className="panel-list">
              {appointments.slice(0, 3).map((apt) => (
                <li key={apt.id} className="panel-list-item" onClick={() => navigate('/profile')} style={{cursor: 'pointer'}}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span className="item-title">{apt.officeName}</span>
                    <span className="item-meta">{apt.service}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span className="item-badge">{apt.status}</span>
                    <span className="item-meta" style={{ fontSize: '0.75rem' }}>{apt.appointmentDate} {apt.appointmentTime}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="panel-empty">
               <p>No upcoming appointments</p>
             </div>
          )}
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Recent Notifications</h2>
            <Bell className="panel-icon" size={20} />
          </div>
          {notifications.length > 0 ? (
            <ul className="panel-list">
              {notifications.slice(0, 3).map((notif) => (
                <li key={notif.id} className={`panel-list-item ${!notif.isRead ? 'unread' : ''}`} onClick={() => navigate('/notifications')} style={{cursor: 'pointer', backgroundColor: !notif.isRead ? 'rgba(99, 102, 241, 0.05)' : 'transparent'}}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                    <span className="item-title">{notif.title}</span>
                    <span className="item-meta" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{notif.message}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    {!notif.isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></span>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="panel-empty">
               <p>No recent notifications</p>
             </div>
          )}
        </section>
      </div>
    </main>
  );
}
