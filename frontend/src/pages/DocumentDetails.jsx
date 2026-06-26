import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentService } from '../services/documentService';

export default function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProcess, setActiveProcess] = useState('online');

  useEffect(() => {
    let isMounted = true;
    
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await documentService.getDocumentBySlug(id);
        if (isMounted) {
          if (data) {
            setDoc(data);
          } else {
            setError('Document Not Found');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Document Not Found');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDocument();
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="doc-details-page error-state" style={{ padding: '60px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="error-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
        <h3>Loading document details...</h3>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="doc-details-page error-state">
        <div className="error-icon">📄❓</div>
        <h1>Document Not Found</h1>
        <p>The document you are looking for does not exist or has been removed.</p>
        <button className="btn-primary" onClick={() => navigate('/search')}>
          Back to Search
        </button>
      </div>
    );
  }

  const processData = doc.process[activeProcess];

  return (
    <div className="doc-details-page">
      <div className="doc-header-banner">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="doc-header-content">
          <div className="doc-header-icon">{doc.icon}</div>
          <div>
            <div className="doc-meta">
              <span className="doc-category-badge">{doc.category}</span>
              {doc.tags.map(tag => (
                <span key={tag} className="doc-tag-badge">{tag}</span>
              ))}
            </div>
            <h1 className="doc-title">{doc.title}</h1>
            <p className="doc-subtitle">{doc.description}</p>
          </div>
        </div>
      </div>

      <div className="doc-content-grid">
        <div className="doc-main-col">
          <section className="doc-section">
            <h2>Overview</h2>
            <p className="doc-overview-text">{doc.overview}</p>
          </section>

          {doc.eligibility && doc.eligibility.length > 0 && (
            <section className="doc-section">
              <h2>Eligibility</h2>
              <ul className="doc-list eligibility-list">
                {doc.eligibility.map((item, idx) => (
                  <li key={idx}>
                    <span className="list-icon">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {doc.requiredDocuments && doc.requiredDocuments.length > 0 && (
            <section className="doc-section">
              <h2>Required Documents (General)</h2>
              <div className="req-docs-container">
                {doc.requiredDocuments.map((group, idx) => (
                  <div key={idx} className="req-doc-group">
                    <h3>{group.category}</h3>
                    <ul className="doc-list">
                      {group.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="doc-section process-section">
            <div className="process-header">
              <h2>Application Process</h2>
              <div className="process-tabs">
                <button 
                  className={`process-tab ${activeProcess === 'online' ? 'active' : ''}`}
                  onClick={() => setActiveProcess('online')}
                >
                  <span className="tab-icon">💻</span> Online
                </button>
                <button 
                  className={`process-tab ${activeProcess === 'offline' ? 'active' : ''}`}
                  onClick={() => setActiveProcess('offline')}
                >
                  <span className="tab-icon">🏢</span> Offline
                </button>
              </div>
            </div>

            <div className="process-content">
              {activeProcess === 'online' ? (
                <div className="process-info-card online-info">
                  <h3>Official Portal</h3>
                  <a href={processData.portalLink} target="_blank" rel="noreferrer" className="portal-link">
                    {processData.portalName} ↗
                  </a>
                </div>
              ) : (
                <div className="process-info-card offline-info">
                  <h3>Visit Location</h3>
                  <p>{processData.centerInfo}</p>
                </div>
              )}

              <div className="process-reqs">
                <h4>Submission Format</h4>
                <p>{processData.docRequirements}</p>
              </div>

              {processData.steps && processData.steps.length > 0 && (
                <div className="doc-steps-container">
                  {processData.steps.map((step, idx) => (
                    <div key={idx} className="doc-step">
                      <div className="doc-step-number">{idx + 1}</div>
                      <div className="doc-step-text">{step}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {doc.faq && doc.faq.length > 0 && (
            <section className="doc-section">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-container">
                {doc.faq.map((item, idx) => (
                  <div key={idx} className="faq-item">
                    <h4 className="faq-q">Q: {item.question}</h4>
                    <p className="faq-a">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="doc-sidebar-col">
          <div className="sidebar-card">
            <h3>Fees & Charges</h3>
            <ul className="fee-list">
              {doc.fees.map((fee, idx) => (
                <li key={idx} className="fee-item">
                  <span className="fee-type">{fee.type}</span>
                  <span className="fee-amount">{fee.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>Processing Time</h3>
            <div className="processing-time">
              <span className="time-icon">⏱️</span>
              <p>{doc.processingTime}</p>
            </div>
          </div>

          <div className="sidebar-card support-card">
            <h3>Need Help?</h3>
            <p>If you face issues during your application, refer to the official portal guidelines or visit your nearest Sewa Kendra.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
