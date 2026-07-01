import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerWithEmail } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      setError('');
      setLoading(true);
      await registerWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create an account.');
    }
    setLoading(false);
  }

  return (
    <div className="auth-form-container">
      <h2 className="auth-title">Register</h2>
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
        <div className="form-group">
          <label>Confirm Password</label>
          <input 
            type="password" 
            required 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
          />
        </div>
        <button disabled={loading} className="btn-primary auth-submit" type="submit">
          Sign Up
        </button>
      </form>
      <div className="auth-footer">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
}
