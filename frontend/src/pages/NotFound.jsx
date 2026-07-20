import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '../components/common/SEO';

const NotFound = () => {
  return (
    <main className="not-found-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <SEO title="Page Not Found | GUIDOC" description="The page you are looking for does not exist." />
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '8rem', fontWeight: '800', color: 'var(--primary-color)', lineHeight: '1' }}>404</h1>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-main)' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => window.history.back()} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={18} />
          Go Back
        </button>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Home size={18} />
          Return to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
