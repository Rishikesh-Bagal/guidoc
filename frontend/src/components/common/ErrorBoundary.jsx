import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-color)' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', padding: '3rem', borderRadius: '12px', border: '1px solid var(--border-color)', maxWidth: '500px', width: '100%' }}>
            <AlertTriangle size={64} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-main)' }}>Oops! Something went wrong.</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
              We encountered an unexpected error. Please try refreshing the page or navigating back.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
            >
              <RefreshCcw size={18} />
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
