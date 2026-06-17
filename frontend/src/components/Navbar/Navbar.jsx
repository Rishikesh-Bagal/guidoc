import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
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
            <Link to="/" className="nav-links">Documents</Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-links">About</Link>
          </li>
        </ul>
        <div className="nav-actions">
          <button className="btn-primary">Sign In</button>
        </div>
      </div>
    </nav>
  );
}
