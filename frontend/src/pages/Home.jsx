import React from 'react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="hero-container">
        <h1 className="hero-title">Navigate Government Documents Without the Confusion.</h1>
        <p className="hero-subtitle">
          Get clear, step-by-step guidance for your Aadhaar, PAN, Passport, and state certificates. No legal jargon, just simple steps.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" style={{ fontSize: '1.05rem', padding: '14px 28px' }}>
            Find Your Document
          </button>
          <button className="btn-secondary" style={{ fontSize: '1.05rem', padding: '14px 28px' }}>
            Learn How It Works
          </button>
        </div>
      </div>

      {/* Popular Services Section */}
      <section className="section section-gray">
        <div className="section-header">
          <h2 className="section-title">Popular Document Services</h2>
          <p className="section-subtitle">Select a document to view requirements, latest fees, and official application portals.</p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">💳</div>
            <h3>PAN Card</h3>
            <p className="service-desc">New applications, corrections, or duplicate requests.</p>
            <ul className="service-tags">
              <li>New PAN</li>
              <li>Corrections</li>
            </ul>
          </div>
          <div className="service-card">
            <div className="service-icon">🛂</div>
            <h3>Passport</h3>
            <p className="service-desc">Fresh issuance, renewals, and Police Clearance Certificates.</p>
            <ul className="service-tags">
              <li>Fresh / Renewal</li>
              <li>PCC</li>
            </ul>
          </div>
          <div className="service-card">
            <div className="service-icon">🆔</div>
            <h3>Aadhaar Card</h3>
            <p className="service-desc">Address updates, demographic changes, and PVC card orders.</p>
            <ul className="service-tags">
              <li>Address Update</li>
              <li>PVC Order</li>
            </ul>
          </div>
          <div className="service-card">
            <div className="service-icon">📜</div>
            <h3>State Certificates</h3>
            <p className="service-desc">Income, Caste, and Domicile certificates for various states.</p>
            <ul className="service-tags">
              <li>Income</li>
              <li>Domicile</li>
            </ul>
          </div>
        </div>
      </section>

      {/* The Guided Process */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">How GUIDOC Helps You</h2>
          <p className="section-subtitle">We don't just give you a link. We guide you from preparation to submission.</p>
        </div>

        <div className="process-timeline">
          <div className="process-step">
            <div className="step-number">1</div>
            <div className="step-details">
              <h3>Tell us your situation</h3>
              <p>For example, "I lost my PAN card and need a duplicate." We ask a few simple questions to understand your exact need.</p>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <div className="step-details">
              <h3>Get your customized checklist</h3>
              <p>We analyze current government rules and provide the exact list of valid proofs required based on your specific profile.</p>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <div className="step-details">
              <h3>Follow the step-by-step roadmap</h3>
              <p>We direct you to the official portal, tell you exactly which forms to fill, and how to book necessary appointments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="section section-gray">
        <div className="section-header">
          <h2 className="section-title">Built on Trust and Accuracy</h2>
          <p className="section-subtitle">Dealing with government documents requires precision. Here is our commitment to you.</p>
        </div>
        
        <div className="trust-grid">
          <div className="trust-card">
            <div className="trust-icon">🔄</div>
            <h3>Always Up-to-Date</h3>
            <p>Government rules change frequently. Our guidance updates in real-time with the latest official circulars and fee structures.</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon">🔒</div>
            <h3>Privacy First</h3>
            <p>We don't store your sensitive documents. We guide you, but you apply directly and securely on the official government portals.</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon">🗣️</div>
            <h3>Zero Jargon</h3>
            <p>We translate complex bureaucratic terms and confusing legal instructions into plain English and regional languages.</p>
          </div>
        </div>
      </section>

      {/* Clean CTA Section */}
      <section className="cta-clean">
        <h2>Ready to simplify your paperwork?</h2>
        <p>Join thousands of citizens who have successfully navigated complex documentation with GUIDOC.</p>
        <button className="btn-primary" style={{ fontSize: '1.05rem', padding: '12px 28px', marginTop: '1.5rem' }}>Find Your Document Now</button>
      </section>
    </>
  );
}