import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(t('auth.errorLogin'));
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
      setError(t('auth.errorGoogle'));
    }
    setLoading(false);
  }

  return (
    <div className="auth-form-container">
      <h2 className="auth-title">{t('auth.signInTitle')}</h2>
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
        <button disabled={loading} className="btn-primary auth-submit" type="submit">
          {t('auth.loginButton')}
        </button>
      </form>
      <div className="auth-divider">{t('auth.or')}</div>
      <button 
        disabled={loading} 
        className="btn-secondary auth-google" 
        onClick={handleGoogleSignIn}
      >
        {t('auth.googleSignIn')}
      </button>
      <div className="auth-footer">
        {t('auth.needAccount')} <Link to="/register">{t('auth.registerLink')}</Link>
      </div>
    </div>
  );
}
