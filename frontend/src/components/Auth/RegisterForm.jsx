import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerWithEmail } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError(t('auth.errorMismatch'));
    }
    try {
      setError('');
      setLoading(true);
      await registerWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(t('auth.errorRegister'));
    }
    setLoading(false);
  }

  return (
    <div className="auth-form-container">
      <h2 className="auth-title">{t('auth.registerTitle')}</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>{t('auth.emailLabel')}</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>{t('auth.passwordLabel')}</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>{t('auth.confirmPasswordLabel')}</label>
          <input 
            type="password" 
            required 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
          />
        </div>
        <button disabled={loading} className="btn-primary auth-submit" type="submit">
          {t('auth.signUpButton')}
        </button>
      </form>
      <div className="auth-footer">
        {t('auth.haveAccount')} <Link to="/login">{t('auth.logInLink')}</Link>
      </div>
    </div>
  );
}
