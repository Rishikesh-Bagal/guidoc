import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Search, ShieldCheck, MessageSquare, Plus, Clock } from 'lucide-react';
import './Dashboard.css';

export default function DashboardPage() {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}!</h1>
        <p>Access your personalized GovTech portal</p>
      </header>

      <section className="dashboard-quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <div className="action-card">
            <Search className="action-icon" />
            <h3>Search Documents</h3>
            <p>Find laws, policies, and forms</p>
          </div>
          <div className="action-card">
            <ShieldCheck className="action-icon" />
            <h3>Check Eligibility</h3>
            <p>See what programs you qualify for</p>
          </div>
          <div className="action-card">
            <MessageSquare className="action-icon" />
            <h3>Ask AI Assistant</h3>
            <p>Get quick answers to your questions</p>
          </div>
          <div className="action-card">
            <Plus className="action-icon" />
            <h3>New Application</h3>
            <p>Start a new government service request</p>
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
              <span className="item-title">Tax Return Form 1040</span>
              <span className="item-meta">2 days ago</span>
            </li>
            <li className="panel-list-item">
              <span className="item-title">Small Business Grants 2026</span>
              <span className="item-meta">5 days ago</span>
            </li>
            <li className="panel-list-item">
              <span className="item-title">Vehicle Registration Renewal</span>
              <span className="item-meta">1 week ago</span>
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
              <span className="item-title">Healthcare Benefits Guide</span>
              <span className="item-badge">PDF</span>
            </li>
            <li className="panel-list-item">
              <span className="item-title">Property Tax Assessment 2025</span>
              <span className="item-badge">Link</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
