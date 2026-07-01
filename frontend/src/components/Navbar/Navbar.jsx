import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from '../Auth/UserMenu';

export default function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          GUIDOC.
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/search" className="nav-links">Documents</Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-links">About</Link>
          </li>
        </ul>
        <div className="nav-actions">
          {currentUser ? (
            <UserMenu />
          ) : (
            <Link to="/login" className="btn-primary">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
