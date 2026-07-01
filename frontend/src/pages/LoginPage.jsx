import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import './AuthPages.css';

export default function LoginPage() {
  return (
    <div className="auth-page-wrapper">
      <LoginForm />
    </div>
  );
}
