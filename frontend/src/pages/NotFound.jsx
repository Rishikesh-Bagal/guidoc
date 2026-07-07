import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const NotFound = () => {
  return (
    <main className="not-found-container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <SEO title="Page Not Found | GUIDOC" description="The page you are looking for does not exist." />
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#1e293b' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#334155' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem', color: '#64748b' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        style={{ 
          display: 'inline-block', 
          padding: '12px 24px', 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          borderRadius: '6px', 
          textDecoration: 'none',
          fontWeight: '500'
        }}
      >
        Return to Home
      </Link>
    </main>
  );
};

export default NotFound;
