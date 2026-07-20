import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from '../Auth/UserMenu';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationDropdown from './NotificationDropdown';
import { Mic } from 'lucide-react';

export default function Navbar() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          GUIDOC.
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">{t('navbar.home')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/search" className="nav-links">{t('navbar.documents')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/scanner" className="nav-links">Scanner</Link>
          </li>
          {currentUser && (
            <li className="nav-item">
              <Link to="/office-locator" className="nav-links">Office Locator</Link>
            </li>
          )}
          <li className="nav-item">
            <Link to="/" className="nav-links">{t('navbar.about')}</Link>
          </li>
        </ul>
        <div className="nav-actions flex items-center gap-4">
          <LanguageSwitcher />
          {currentUser && (
            <NotificationDropdown />
          )}
          {currentUser && (
            <Link to="/voice-assistant" className="nav-icon-link" aria-label="Voice Assistant" style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
              <Mic size={20} />
            </Link>
          )}
          {currentUser ? (
            <UserMenu />
          ) : (
            <Link to="/login" className="btn-primary">{t('navbar.signIn')}</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
