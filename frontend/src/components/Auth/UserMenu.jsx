import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { User, LogOut, LayoutDashboard, Activity } from 'lucide-react';
import './UserMenu.css';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button 
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <div className="user-avatar">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt={displayName} />
          ) : (
            <span>{initial}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <p className="user-name">{displayName}</p>
            <p className="user-email">{currentUser?.email}</p>
          </div>
          <ul className="user-menu-list">
            <li>
              <Link to="/dashboard" className="user-menu-item" onClick={() => setIsOpen(false)}>
                <LayoutDashboard size={16} />
                {t('userMenu.dashboard')}
              </Link>
            </li>
            <li>
              <Link to="/profile" className="user-menu-item" onClick={() => setIsOpen(false)}>
                <User size={16} />
                {t('userMenu.myProfile')}
              </Link>
            </li>
            <li>
              <Link to="/tracker" className="user-menu-item" onClick={() => setIsOpen(false)}>
                <Activity size={16} />
                {t('userMenu.tracker')}
              </Link>
            </li>
            <li>
              <button className="user-menu-item" onClick={handleLogout}>
                <LogOut size={16} />
                {t('userMenu.logout')}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
