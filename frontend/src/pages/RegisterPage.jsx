import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';
import './AuthPages.css';

export default function RegisterPage() {
  return (
    <div className="auth-page-wrapper">
      <RegisterForm />
    </div>
  );
}
