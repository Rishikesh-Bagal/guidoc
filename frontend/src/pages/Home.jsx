import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section */}
      <div className="hero-container">
        <h1 className="hero-title">{t('home.heroTitle')}</h1>
        <p className="hero-subtitle">{t('home.heroSubtitle')}</p>
        <div className="hero-actions">
          <button onClick={() => navigate('/eligibility')} className="btn-primary" style={{ fontSize: '1.05rem', padding: '14px 28px' }}>
            {t('home.checkEligibility')}
          </button>
          <button className="btn-secondary" style={{ fontSize: '1.05rem', padding: '14px 28px' }}>
            {t('home.learnHow')}
          </button>
        </div>
      </div>

      {/* Popular Services Section */}
      <section className="section section-gray">
        <div className="section-header">
          <h2 className="section-title">{t('home.popularServicesTitle')}</h2>
          <p className="section-subtitle">{t('home.popularServicesSubtitle')}</p>
        </div>

        <div className="services-grid">
          <div 
            className="service-card" 
            onClick={() => navigate('/documents/pan-card')}
            style={{ cursor: 'pointer' }}
          >
            <div className="service-icon">💳</div>
            <h3>{t('home.panCardTitle')}</h3>
            <p className="service-desc">{t('home.panCardDesc')}</p>
            <ul className="service-tags">
              <li>{t('home.newPan')}</li>
              <li>{t('home.corrections')}</li>
            </ul>
          </div>
          <div 
            className="service-card" 
            onClick={() => navigate('/documents/passport')}
            style={{ cursor: 'pointer' }}
          >
            <div className="service-icon">🛂</div>
            <h3>{t('home.passportTitle')}</h3>
            <p className="service-desc">{t('home.passportDesc')}</p>
            <ul className="service-tags">
              <li>{t('home.freshRenewal')}</li>
              <li>{t('home.pcc')}</li>
            </ul>
          </div>
          <div 
            className="service-card" 
            onClick={() => navigate('/documents/aadhaar-card')}
            style={{ cursor: 'pointer' }}
          >
            <div className="service-icon">🆔</div>
            <h3>{t('home.aadhaarTitle')}</h3>
            <p className="service-desc">{t('home.aadhaarDesc')}</p>
            <ul className="service-tags">
              <li>{t('home.addressUpdate')}</li>
              <li>{t('home.pvcOrder')}</li>
            </ul>
          </div>
          <div 
            className="service-card" 
            onClick={() => navigate('/documents/income-certificate')}
            style={{ cursor: 'pointer' }}
          >
            <div className="service-icon">📜</div>
            <h3>{t('home.stateCertsTitle')}</h3>
            <p className="service-desc">{t('home.stateCertsDesc')}</p>
            <ul className="service-tags">
              <li>{t('home.income')}</li>
              <li>{t('home.domicile')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* The Guided Process */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{t('home.howHelpsTitle')}</h2>
          <p className="section-subtitle">{t('home.howHelpsSubtitle')}</p>
        </div>

        <div className="process-timeline">
          <div className="process-step">
            <div className="step-number">1</div>
            <div className="step-details">
              <h3>{t('home.step1Title')}</h3>
              <p>{t('home.step1Desc')}</p>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <div className="step-details">
              <h3>{t('home.step2Title')}</h3>
              <p>{t('home.step2Desc')}</p>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <div className="step-details">
              <h3>{t('home.step3Title')}</h3>
              <p>{t('home.step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="section section-gray">
        <div className="section-header">
          <h2 className="section-title">{t('home.trustTitle')}</h2>
          <p className="section-subtitle">{t('home.trustSubtitle')}</p>
        </div>
        
        <div className="trust-grid">
          <div className="trust-card">
            <div className="trust-icon">🔄</div>
            <h3>{t('home.upToDateTitle')}</h3>
            <p>{t('home.upToDateDesc')}</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon">🔒</div>
            <h3>{t('home.privacyTitle')}</h3>
            <p>{t('home.privacyDesc')}</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon">🗣️</div>
            <h3>{t('home.zeroJargonTitle')}</h3>
            <p>{t('home.zeroJargonDesc')}</p>
          </div>
        </div>
      </section>

      {/* Clean CTA Section */}
      <section className="cta-clean">
        <h2>{t('home.ctaTitle')}</h2>
        <p>{t('home.ctaDesc')}</p>
        <button className="btn-primary" style={{ fontSize: '1.05rem', padding: '12px 28px', marginTop: '1.5rem' }}>
          {t('home.ctaButton')}
        </button>
      </section>
    </>
  );
}