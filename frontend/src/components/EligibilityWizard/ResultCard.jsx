import React from 'react';
import './wizard.css';

const ResultCard = ({ result, onRestart }) => {
  if (!result) return null;

  return (
    <div className="wizard-container" style={{ minHeight: 'auto' }}>
      <div className={result.eligible ? 'result-header-success' : 'result-header-fail'}>
        <h2 className="result-title">
          {result.eligible ? (
            <>
              <span style={{ fontSize: '2.5rem' }}>✅</span>
              Eligible for {result.recommendedService || 'Application'}
            </>
          ) : (
            <>
              <span style={{ fontSize: '2.5rem' }}>❌</span>
              Not Eligible for New Application
            </>
          )}
        </h2>
        <p className="result-subtitle">{result.message}</p>
      </div>

      <div className="wizard-body" style={{ paddingTop: 0 }}>
        
        {/* Important Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {result.fees && (
            <div className="sidebar-card summary-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1rem', borderBottom: 'none', paddingBottom: 0, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Estimated Fees</h3>
              <div className="fee-amount">{result.fees}</div>
            </div>
          )}
          {result.processingTime && (
            <div className="sidebar-card summary-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1rem', borderBottom: 'none', paddingBottom: 0, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Processing Time</h3>
              <div className="fee-amount">{result.processingTime}</div>
            </div>
          )}
        </div>

        {/* Required Documents */}
        {result.requiredDocuments && result.requiredDocuments.length > 0 && (
          <div className="req-doc-group" style={{ marginBottom: '2rem' }}>
            <h3>Required Documents</h3>
            <ul className="modern-checklist documents-checklist">
              {result.requiredDocuments.map((doc, idx) => (
                <li key={idx}>
                  <div className="checkbox-dummy"></div>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps */}
        {result.nextSteps && result.nextSteps.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Next Steps</h3>
            <div className="timeline-container">
              {result.nextSteps.map((step, idx) => (
                <div key={idx} className="timeline-step">
                  <div className="timeline-marker">
                    <span className="timeline-number">{idx + 1}</span>
                    {idx < result.nextSteps.length - 1 && <div className="timeline-line"></div>}
                  </div>
                  <div className="timeline-content">
                    <p>{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="wizard-actions">
          <button 
            onClick={onRestart}
            className="btn-secondary"
          >
            Start Over
          </button>
          
          {result.officialPortal && (
            <a 
              href={result.officialPortal.startsWith('http') ? result.officialPortal : `https://${result.officialPortal}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Go to Official Portal →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
