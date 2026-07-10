import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from '../Auth/UserMenu';
import LanguageSwitcher from './LanguageSwitcher';

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
          <li className="nav-item">
            <Link to="/" className="nav-links">{t('navbar.about')}</Link>
          </li>
        </ul>
        <div className="nav-actions flex items-center gap-4">
          <LanguageSwitcher />
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
