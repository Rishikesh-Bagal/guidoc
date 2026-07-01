import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Search, ShieldCheck, MessageSquare, Plus, Clock, Activity } from 'lucide-react';
import './Dashboard.css';

export default function DashboardPage() {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}!</h1>
        <p>Manage your government document guidance, saved resources, and eligibility history from one place.</p>
      </header>

      {/* Optional Statistics Row */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-value">12</span>
          <span className="stat-label">Documents Viewed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">4</span>
          <span className="stat-label">Eligibility Checks</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">6</span>
          <span className="stat-label">Saved Guides</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">18</span>
          <span className="stat-label">AI Conversations</span>
        </div>
      </section>

      <section className="dashboard-quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <div className="action-card">
            <Search className="action-icon" />
            <h3>Search Documents</h3>
            <p>Find government documents, eligibility, and official application guides.</p>
          </div>
          <div className="action-card">
            <ShieldCheck className="action-icon" />
            <h3>Check Eligibility</h3>
            <p>Get a personalized eligibility roadmap before applying.</p>
          </div>
          <div className="action-card">
            <MessageSquare className="action-icon" />
            <h3>Ask AI Assistant</h3>
            <p>Ask document-related questions and receive AI-powered guidance.</p>
          </div>
          <div className="action-card">
            <Plus className="action-icon" />
            <h3>New Application</h3>
            <p>Start preparing for a new government document application.</p>
          </div>
        </div>
      </section>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Recent Searches</h2>
            <Clock className="panel-icon" size={20} />
          </div>
          <ul className="panel-list">
            <li className="panel-list-item">
              <span className="item-title">PAN Card Application</span>
              <span className="item-meta">2 days ago</span>
            </li>
            <li className="panel-list-item">
              <span className="item-title">Aadhaar Address Update</span>
              <span className="item-meta">5 days ago</span>
            </li>
            <li className="panel-list-item">
              <span className="item-title">Passport Renewal</span>
              <span className="item-meta">1 week ago</span>
            </li>
            <li className="panel-list-item">
              <span className="item-title">Income Certificate</span>
              <span className="item-meta">2 weeks ago</span>
            </li>
            <li className="panel-list-item">
              <span className="item-title">Driving License Renewal</span>
              <span className="item-meta">1 month ago</span>
            </li>
          </ul>
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Saved Documents</h2>
            <FileText className="panel-icon" size={20} />
          </div>
          <ul className="panel-list">
            <li className="panel-list-item">
              <span className="item-title">PAN Card Guide</span>
              <span className="item-badge">Guide</span>
            </li>
            <li className="panel-list-item">
              <span className="item-title">Passport Application</span>
              <span className="item-badge">Guide</span>
            </li>
            <li className="panel-list-item">
              <span className="item-title">Aadhaar Update Guide</span>
              <span className="item-badge">Link</span>
            </li>
            <li className="panel-list-item">
              <span className="item-title">Income Certificate Guide</span>
              <span className="item-badge">PDF</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
