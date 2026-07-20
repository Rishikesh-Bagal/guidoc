import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminRoute() {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-primary, #121212)',
        color: 'var(--text-primary, #ffffff)'
      }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#ff4d4d' }}>403</h1>
        <h2>Access Denied</h2>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary, #a0a0a0)' }}>
          You do not have permission to access the Admin Portal.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
