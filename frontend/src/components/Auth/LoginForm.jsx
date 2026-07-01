import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in with Google.');
    }
    setLoading(false);
  }

  return (
    <div className="auth-form-container">
      <h2 className="auth-title">Sign In</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <button disabled={loading} className="btn-primary auth-submit" type="submit">
          Log In
        </button>
      </form>
      <div className="auth-divider">or</div>
      <button 
        disabled={loading} 
        className="btn-secondary auth-google" 
        onClick={handleGoogleSignIn}
      >
        Sign in with Google
      </button>
      <div className="auth-footer">
        Need an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
