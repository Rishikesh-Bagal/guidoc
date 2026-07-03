import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Search, ShieldCheck, MessageSquare, Plus, Clock, Activity, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import './Dashboard.css';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    documentsViewed: 0,
    eligibilityChecks: 0,
    savedGuides: 0,
    aiConversations: 0
  });
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedDocuments, setSavedDocuments] = useState([]);

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
          docViewCount
        ] = await Promise.all([
          userService.getRecentSearches(userId),
          userService.getEligibilityHistory(userId),
          userService.getAIChatHistory(userId),
          userService.getDocumentViewCount(userId)
        ]);

        if (isMounted) {
          setRecentSearches(searches);
          
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
    if (!timestamp) return 'Recently';
    // Handle Firestore timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}!</h1>
        <p>Manage your government document guidance, saved resources, and eligibility history from one place.</p>
      </header>

      <section className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-value">{loading ? '-' : stats.documentsViewed}</span>
          <span className="stat-label">Documents Viewed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{loading ? '-' : stats.eligibilityChecks}</span>
          <span className="stat-label">Eligibility Checks</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{loading ? '-' : stats.savedGuides}</span>
          <span className="stat-label">Saved Guides</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{loading ? '-' : stats.aiConversations}</span>
          <span className="stat-label">AI Conversations</span>
        </div>
      </section>

      <section className="dashboard-quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <div className="action-card" onClick={() => navigate('/search')} style={{cursor: 'pointer'}}>
            <Search className="action-icon" />
            <h3>Search Documents</h3>
            <p>Find government documents, eligibility, and official application guides.</p>
          </div>
          <div className="action-card" onClick={() => navigate('/eligibility')} style={{cursor: 'pointer'}}>
            <ShieldCheck className="action-icon" />
            <h3>Check Eligibility</h3>
            <p>Get a personalized eligibility roadmap before applying.</p>
          </div>
          <div className="action-card" onClick={() => navigate('/ai')} style={{cursor: 'pointer'}}>
            <MessageSquare className="action-icon" />
            <h3>Ask AI Assistant</h3>
            <p>Ask document-related questions and receive AI-powered guidance.</p>
          </div>
          <div className="action-card" onClick={() => navigate('/tracker')} style={{cursor: 'pointer'}}>
            <Activity className="action-icon" />
            <h3>Track Applications</h3>
            <p>Monitor the progress of your government document applications.</p>
          </div>
        </div>
      </section>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Recent Searches</h2>
            <Clock className="panel-icon" size={20} />
          </div>
          {loading ? (
            <div className="panel-loading">
              <Loader2 className="spin-icon" size={24} />
              <p>Loading searches...</p>
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
               <p>No recent searches yet.</p>
             </div>
          )}
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Saved Documents</h2>
            <FileText className="panel-icon" size={20} />
          </div>
          {loading ? (
            <div className="panel-loading">
              <Loader2 className="spin-icon" size={24} />
              <p>Loading documents...</p>
            </div>
          ) : savedDocuments.length > 0 ? (
            <ul className="panel-list">
              {savedDocuments.map((doc) => (
                <li key={doc.id} className="panel-list-item" onClick={() => navigate(`/documents/${doc.documentId}`)} style={{cursor: 'pointer'}}>
                  <span className="item-title">{doc.title}</span>
                  <span className="item-badge">{doc.category || 'Guide'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="panel-empty">
               <p>No saved documents yet.</p>
             </div>
          )}
        </section>
      </div>
    </div>
  );
}
