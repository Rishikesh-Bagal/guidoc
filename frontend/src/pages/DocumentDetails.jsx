import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentService } from '../services/documentService';
import { 
  ArrowLeft, FileText, Download, ExternalLink, Clock, IndianRupee, 
  CheckCircle2, AlertTriangle, AlertCircle, Lightbulb, ChevronDown, 
  ChevronUp, MapPin, Monitor, HelpCircle, FileCheck, Info, Building 
} from 'lucide-react';

export default function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProcess, setActiveProcess] = useState('online');
  const [activeFaq, setActiveFaq] = useState(null);

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
        <Clock className="spin-icon" size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', animation: 'spin 2s linear infinite' }} />
        <h3>Loading official details...</h3>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="doc-details-page error-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <AlertCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <h1>Document Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>The guidance page you are looking for does not exist or has been removed.</p>
        <button className="btn-primary" onClick={() => navigate('/search')}>
          Back to Search
        </button>
      </div>
    );
  }

  const processData = doc.process[activeProcess];

  const toggleFaq = (idx) => {
    if (activeFaq === idx) {
      setActiveFaq(null);
    } else {
      setActiveFaq(idx);
    }
  };

  return (
    <div className="doc-details-page">
      <div className="doc-header-banner">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="doc-header-content">
          <div className="doc-header-icon">
             <FileText size={48} color="var(--primary-color)" />
          </div>
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

      {/* Official Government Resources Banner */}
      <div className="official-resources-banner">
        <div className="resource-banner-content">
          <div className="resource-icon-wrapper">
            <Info className="resource-icon" size={24} />
          </div>
          <div>
            <h3>Official Government Resources</h3>
            <p>Access the official portals and forms for your application.</p>
          </div>
        </div>
        <div className="resource-actions">
          {doc.process?.online?.portalLink && doc.process.online.portalLink !== '#' && (
            <a href={doc.process.online.portalLink} target="_blank" rel="noreferrer" className="btn-primary resource-btn">
              <ExternalLink size={16} /> Visit Official Portal
            </a>
          )}
          {doc.formUrl && (
            <a href={doc.formUrl} target="_blank" rel="noreferrer" className="btn-secondary resource-btn">
              <Download size={16} /> Download Form
            </a>
          )}
        </div>
      </div>

      <div className="doc-content-grid">
        <div className="doc-main-col">
          <section className="doc-section">
            <h2>Overview</h2>
            <p className="doc-overview-text">{doc.overview}</p>
          </section>

          {/* Application Guidance - Eligibility */}
          {doc.eligibility && doc.eligibility.length > 0 && (
            <section className="doc-section">
              <h2>Eligibility Criteria</h2>
              <div className="eligibility-card">
                <ul className="modern-checklist">
                  {doc.eligibility.map((item, idx) => (
                    <li key={idx}>
                      <CheckCircle2 className="check-icon" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Required Documents */}
          {doc.requiredDocuments && doc.requiredDocuments.length > 0 && (
            <section className="doc-section">
              <h2>Required Documents</h2>
              <div className="req-docs-container">
                {doc.requiredDocuments.map((group, idx) => (
                  <div key={idx} className="req-doc-group">
                    <h3 className="req-doc-group-title">
                      <FileCheck size={18} /> {group.category}
                    </h3>
                    <ul className="modern-checklist documents-checklist">
                      {group.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <div className="checkbox-dummy"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Process Timeline */}
          <section className="doc-section process-section">
            <div className="process-header">
              <h2>Application Process</h2>
              <div className="process-tabs">
                <button 
                  className={`process-tab ${activeProcess === 'online' ? 'active' : ''}`}
                  onClick={() => setActiveProcess('online')}
                >
                  <Monitor size={16} /> Online
                </button>
                <button 
                  className={`process-tab ${activeProcess === 'offline' ? 'active' : ''}`}
                  onClick={() => setActiveProcess('offline')}
                >
                  <MapPin size={16} /> Offline
                </button>
              </div>
            </div>

            <div className="process-content">
              {activeProcess === 'online' ? (
                <div className="process-info-card online-info">
                  <h3>Online Application Portal</h3>
                  <a href={processData.portalLink} target="_blank" rel="noreferrer" className="portal-link-text">
                    {processData.portalName} <ExternalLink size={14} />
                  </a>
                </div>
              ) : (
                <div className="office-locator-card">
                  <div className="office-locator-header">
                    <h3><Building size={20} className="office-icon" /> Visit Official Location</h3>
                    {doc.officeInfo?.officialDepartment && (
                      <span className="department-badge">{doc.officeInfo.officialDepartment}</span>
                    )}
                  </div>
                  <div className="office-locator-body">
                    {doc.officeInfo ? (
                      <>
                        <h4 className="office-type">{doc.officeInfo.officeType}</h4>
                        <p className="office-description">{doc.officeInfo.officeDescription}</p>
                        <a 
                          href={`https://www.google.com/maps/search/${encodeURIComponent(doc.officeInfo.officeType)}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn-primary locator-btn"
                        >
                          <MapPin size={16} /> Find Nearby Office
                        </a>
                      </>
                    ) : (
                      <p>{processData.centerInfo}</p>
                    )}
                  </div>
                </div>
              )}

              {processData.steps && processData.steps.length > 0 && (
                <div className="timeline-container">
                  {processData.steps.map((step, idx) => (
                    <div key={idx} className="timeline-step">
                      <div className="timeline-marker">
                        <span className="timeline-number">{idx + 1}</span>
                        {idx < processData.steps.length - 1 && <div className="timeline-line"></div>}
                      </div>
                      <div className="timeline-content">
                        <p>{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* FAQ Accordion */}
          {doc.faq && doc.faq.length > 0 && (
            <section className="doc-section faq-section">
              <h2><HelpCircle size={24} style={{marginRight: '8px'}} /> Frequently Asked Questions</h2>
              <div className="faq-accordion">
                {doc.faq.map((item, idx) => (
                  <div key={idx} className={`faq-accordion-item ${activeFaq === idx ? 'expanded' : ''}`}>
                    <button className="faq-accordion-header" onClick={() => toggleFaq(idx)}>
                      <span className="faq-question">{item.question}</span>
                      {activeFaq === idx ? <ChevronUp size={20} className="faq-icon" /> : <ChevronDown size={20} className="faq-icon" />}
                    </button>
                    <div className="faq-accordion-content">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="doc-sidebar-col">
          {/* Eligibility Wizard CTA */}
          <div className="sidebar-card info-card" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
            <h3 style={{ color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle2 size={18} /> Am I Eligible?
            </h3>
            <p style={{ marginBottom: '15px', color: '#1e40af', fontSize: '0.95rem' }}>
              Use our personalized wizard to find out your exact requirements and eligibility.
            </p>
            <button onClick={() => navigate('/eligibility')} className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              Check Eligibility <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>

          {/* Important Notes */}
          {doc.importantNotes && doc.importantNotes.length > 0 && (
            <div className="sidebar-card info-card">
              <h3><Info size={18} /> Important Notes</h3>
              <ul className="bullet-list">
                {doc.importantNotes.map((note, idx) => <li key={idx}>{note}</li>)}
              </ul>
            </div>
          )}

          {/* Tips */}
          {doc.tips && doc.tips.length > 0 && (
            <div className="sidebar-card tip-card">
              <h3><Lightbulb size={18} /> Pro Tips</h3>
              <ul className="bullet-list">
                {doc.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
              </ul>
            </div>
          )}

          {/* Warnings / Common Mistakes */}
          {(doc.warnings?.length > 0 || doc.commonMistakes?.length > 0) && (
            <div className="sidebar-card warning-card">
              <h3><AlertTriangle size={18} /> Watch Out For</h3>
              <ul className="bullet-list">
                {doc.warnings?.map((warning, idx) => <li key={`w-${idx}`}>{warning}</li>)}
                {doc.commonMistakes?.map((mistake, idx) => <li key={`m-${idx}`}>Mistake: {mistake}</li>)}
              </ul>
            </div>
          )}

          <div className="sidebar-card summary-card">
            <h3><IndianRupee size={18} /> Fees & Charges</h3>
            <ul className="fee-list">
              {doc.fees.map((fee, idx) => (
                <li key={idx} className="fee-item">
                  <span className="fee-type">{fee.type}</span>
                  <span className="fee-amount">{fee.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-card summary-card">
            <h3><Clock size={18} /> Processing Time</h3>
            <div className="processing-time-modern">
              <p>{doc.processingTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
