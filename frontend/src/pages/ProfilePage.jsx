import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { User, Mail, Shield, Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Trash2, MapPin, Bell } from 'lucide-react';
import { officeService } from '../services/officeService';
import { Link } from 'react-router-dom';
import './Profile.css';

export default function ProfilePage() {
  const { currentUser, updateUserProfile, verifyEmail, resetPassword, deleteAccount } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    inApp: true,
    appointmentReminders: true,
    aiSuggestions: true,
    systemUpdates: true
  });
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      fetchAppointments();
      fetchPreferences();
    }
  }, [currentUser]);

  const fetchAppointments = async () => {
    try {
      const apts = await officeService.getUserAppointments(currentUser.uid);
      setAppointments(apts);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    }
  };

  const fetchPreferences = async () => {
    try {
      const userDoc = await userService.getUserDocument(currentUser.uid);
      if (userDoc?.preferences?.notifications) {
        // Merge fetched prefs with defaults
        setNotificationPrefs(prev => ({
          ...prev,
          ...(typeof userDoc.preferences.notifications === 'object' 
              ? userDoc.preferences.notifications 
              : { inApp: userDoc.preferences.notifications, email: userDoc.preferences.notifications })
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user preferences', error);
    }
  };

  const handlePrefChange = async (key) => {
    const newPrefs = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    setNotificationPrefs(newPrefs);
    setIsSavingPrefs(true);
    
    try {
      const userDoc = await userService.getUserDocument(currentUser.uid);
      const currentPrefs = userDoc?.preferences || {};
      await userService.updateUserPreferences(currentUser.uid, {
        ...currentPrefs,
        notifications: newPrefs
      });
      showMessage('success', 'Notification settings updated.');
    } catch (error) {
      showMessage('error', 'Failed to update notification settings.');
      // Revert on failure
      setNotificationPrefs(notificationPrefs);
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await officeService.cancelAppointment(appointmentId);
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      showMessage('success', 'Appointment cancelled successfully.');
    } catch (error) {
      showMessage('error', 'Failed to cancel appointment.');
    }
  };

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

        <section className="profile-card" style={{ gridColumn: '1 / -1' }}>
          <div className="profile-card-header">
            <Calendar className="profile-icon" size={24} />
            <h2>My Appointments</h2>
          </div>
          
          {appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.map(apt => (
                <div key={apt.id} className="appointment-item" style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', marginBottom: '1rem'
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{apt.officeName}</h3>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{apt.service}</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {apt.appointmentDate} {apt.appointmentTime}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {apt.status}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/office/${apt.officeId}`} className="btn-outline" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
                      View Details
                    </Link>
                    <button className="btn-danger" style={{ padding: '0.5rem 1rem' }} onClick={() => handleCancelAppointment(apt.id)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>You have no upcoming appointments.</p>
          )}
        </section>

        <section className="profile-card" style={{ gridColumn: '1 / -1' }}>
          <div className="profile-card-header">
            <Bell className="profile-icon" size={24} />
            <h2>Notification Settings</h2>
          </div>
          
          <div className="settings-grid" style={{ display: 'grid', gap: '1rem' }}>
            <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>In-App Notifications</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Receive notifications within the application</p>
              </div>
              <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input type="checkbox" checked={notificationPrefs.inApp} onChange={() => handlePrefChange('inApp')} disabled={isSavingPrefs} style={{ opacity: 0, width: 0, height: 0 }} />
                <span className="slider" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: notificationPrefs.inApp ? 'var(--primary-color)' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                  <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: notificationPrefs.inApp ? '24px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                </span>
              </label>
            </div>

            <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Email Notifications</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Receive important updates via email</p>
              </div>
              <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input type="checkbox" checked={notificationPrefs.email} onChange={() => handlePrefChange('email')} disabled={isSavingPrefs} style={{ opacity: 0, width: 0, height: 0 }} />
                <span className="slider" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: notificationPrefs.email ? 'var(--primary-color)' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                  <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: notificationPrefs.email ? '24px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                </span>
              </label>
            </div>

            <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Appointment Reminders</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Get reminded before your upcoming appointments</p>
              </div>
              <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input type="checkbox" checked={notificationPrefs.appointmentReminders} onChange={() => handlePrefChange('appointmentReminders')} disabled={isSavingPrefs || (!notificationPrefs.email && !notificationPrefs.inApp)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span className="slider" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: notificationPrefs.appointmentReminders ? 'var(--primary-color)' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                  <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: notificationPrefs.appointmentReminders ? '24px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                </span>
              </label>
            </div>

            <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>AI Suggestions</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Receive smart recommendations for documents</p>
              </div>
              <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input type="checkbox" checked={notificationPrefs.aiSuggestions} onChange={() => handlePrefChange('aiSuggestions')} disabled={isSavingPrefs || (!notificationPrefs.email && !notificationPrefs.inApp)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span className="slider" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: notificationPrefs.aiSuggestions ? 'var(--primary-color)' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                  <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: notificationPrefs.aiSuggestions ? '24px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                </span>
              </label>
            </div>
            
            <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>System Updates</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Receive updates about platform changes and new features</p>
              </div>
              <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input type="checkbox" checked={notificationPrefs.systemUpdates} onChange={() => handlePrefChange('systemUpdates')} disabled={isSavingPrefs || (!notificationPrefs.email && !notificationPrefs.inApp)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span className="slider" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: notificationPrefs.systemUpdates ? 'var(--primary-color)' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                  <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: notificationPrefs.systemUpdates ? '24px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                </span>
              </label>
            </div>
          </div>
        </section>

        <section className="profile-card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', gridColumn: '1 / -1' }}>
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
