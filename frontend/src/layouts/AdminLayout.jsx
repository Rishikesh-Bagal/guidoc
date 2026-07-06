import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/documents', label: 'Documents', icon: '📄' },
    { path: '/', label: 'Back to Site', icon: '🏠' }
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link to="/admin">
            <h2>GUIDOC <span>Admin</span></h2>
          </Link>
        </div>
        
        <nav className="admin-nav">
          <ul>
            {menuItems.map(item => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="header-title">
            <h1>Admin Portal</h1>
          </div>
          <div className="header-user">
            <span className="user-email">{currentUser?.email}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
