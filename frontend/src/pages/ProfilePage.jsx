import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { User, Mail, Shield, Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import './Profile.css';

export default function ProfilePage() {
  const { currentUser, updateUserProfile, verifyEmail, resetPassword, deleteAccount } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const provider = currentUser.providerData?.[0]?.providerId || 'password';
  const isEmailPassword = provider === 'password';
  const createdAt = currentUser.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'Unknown';
  const lastLogin = currentUser.metadata.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() : 'Unknown';
  const userInitial = (displayName || currentUser.email || 'U').charAt(0).toUpperCase();

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    
    setLoading(true);
    try {
      await updateUserProfile({ displayName });
      // Sync with Firestore
      await userService.syncUserDocument(currentUser);
      showMessage('success', 'Profile updated successfully.');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      showMessage('error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await verifyEmail();
      showMessage('success', 'Verification email sent. Please check your inbox.');
    } catch (error) {
      console.error('Failed to send verification email:', error);
      showMessage('error', 'Failed to send verification email. It may have already been sent.');
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(currentUser.email);
      showMessage('success', 'Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      showMessage('error', 'Failed to send password reset email.');
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // 1. Delete Firestore Data First
      await userService.deleteUserData(currentUser.uid);
      // 2. Delete Auth Account
      await deleteAccount();
      // The user is logged out automatically by firebase/auth
    } catch (error) {
      console.error('Failed to delete account:', error);
      showMessage('error', 'Failed to delete account. You may need to log in again before doing this.');
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account settings and preferences.</p>
      </header>

      {message.text && (
        <div className={`notification ${message.type}`}>
          {message.type === 'success' ? (
             <CheckCircle className="notification-icon" size={20} />
          ) : (
             <XCircle className="notification-icon" size={20} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="profile-grid">
        <section className="profile-card">
          <div className="profile-card-header">
            <User className="profile-icon" size={24} />
            <h2>Profile Information</h2>
          </div>
          
          <div className="profile-avatar-large">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Avatar" />
            ) : (
              <span>{userInitial}</span>
            )}
          </div>

          {!isEditing ? (
            <div className="profile-info-grid">
              <div className="info-group">
                <span className="info-label">Full Name</span>
                <span className="info-value">{currentUser.displayName || 'Not provided'}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Email Address</span>
                <span className="info-value">{currentUser.email}</span>
              </div>
              <div className="info-group">
                <span className="info-label">User ID</span>
                <span className="info-value" style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>{currentUser.uid}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Account Created</span>
                <span className="info-value">{createdAt}</span>
              </div>
              
              <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
                <button className="btn-outline" onClick={() => setIsEditing(true)}>Edit Profile</button>
              </div>
            </div>
          ) : (
            <form className="edit-form" onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Display Name</label>
                <input 
                  type="text" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn-outline" onClick={() => { setIsEditing(false); setDisplayName(currentUser.displayName || ''); }}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="profile-card">
          <div className="profile-card-header">
            <Shield className="profile-icon" size={24} />
            <h2>Security & Settings</h2>
          </div>

          <div className="profile-info-grid">
            <div className="info-group">
              <span className="info-label">Login Provider</span>
              <div>
                <span className={`badge ${provider === 'google.com' ? 'google' : 'email'}`}>
                  {provider === 'google.com' ? 'Google' : 'Email & Password'}
                </span>
              </div>
            </div>
            
            <div className="info-group">
              <span className="info-label">Email Verification</span>
              <div>
                {currentUser.emailVerified ? (
                  <span className="badge verified">Verified</span>
                ) : (
                  <span className="badge unverified">Not Verified</span>
                )}
              </div>
            </div>

            <div className="info-group">
              <span className="info-label"><Clock size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> Last Login</span>
              <span className="info-value">{lastLogin}</span>
            </div>
          </div>

          <div className="security-actions">
            {isEmailPassword && !currentUser.emailVerified && (
              <button className="btn-outline" onClick={handleVerifyEmail}>
                Send Verification Email
              </button>
            )}
            
            {isEmailPassword && (
              <button className="btn-outline" onClick={handleResetPassword}>
                Reset Password
              </button>
            )}
          </div>
        </section>

        <section className="profile-card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div className="profile-card-header" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.1)' }}>
            <AlertTriangle className="profile-icon" size={24} color="#ef4444" />
            <h2 style={{ color: '#ef4444' }}>Danger Zone</h2>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
            Deleting your account is permanent. This will erase all your saved guides, application tracker data, recent searches, and eligibility history.
          </p>
          
          <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>
            <Trash2 size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px' }}/>
            Delete Account
          </button>
        </section>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AlertTriangle className="modal-icon" size={48} />
            <h3>Are you sure?</h3>
            <p>This action cannot be undone. All your data will be permanently deleted from our servers.</p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowDeleteModal(false)} disabled={loading}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteAccount} disabled={loading}>
                {loading ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
