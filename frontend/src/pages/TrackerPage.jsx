import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { trackerService } from '../services/trackerService';
import { Plus, Trash2, Check, Clock, Loader2, FileText, ChevronRight } from 'lucide-react';
import './TrackerPage.css';

const TRACKING_STEPS = [
  'Documents Prepared',
  'Application Submitted',
  'Under Verification',
  'Approved',
  'Completed'
];

const PREDEFINED_DOCS = [
  'Passport',
  'Driver\'s License',
  'Social Security Card',
  'Birth Certificate',
  'Voter ID',
  'Other'
];

export default function TrackerPage() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDocType, setNewDocType] = useState(PREDEFINED_DOCS[0]);
  const [customDocName, setCustomDocName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    
    if (currentUser) {
      setLoading(true);
      unsubscribe = trackerService.subscribeToApplications(currentUser.uid, (data) => {
        setApplications(data);
        setLoading(false);
      });
    }

    return () => unsubscribe();
  }, [currentUser]);

  const handleCreateApplication = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const docName = newDocType === 'Other' ? customDocName : newDocType;
    if (!docName.trim()) return;

    setIsSubmitting(true);
    try {
      await trackerService.createApplication(currentUser.uid, '', docName);
      setIsModalOpen(false);
      setNewDocType(PREDEFINED_DOCS[0]);
      setCustomDocName('');
    } catch (error) {
      console.error('Error creating application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (applicationId) => {
    if (window.confirm('Are you sure you want to delete this tracked application?')) {
      await trackerService.deleteApplication(applicationId);
    }
  };

  const handleAdvanceStep = async (app) => {
    if (app.currentStep >= TRACKING_STEPS.length - 1) return;
    
    const nextStepIndex = app.currentStep + 1;
    let nextStatus = 'Draft';
    if (nextStepIndex === 1) nextStatus = 'Submitted';
    else if (nextStepIndex === 2) nextStatus = 'Under Verification';
    else if (nextStepIndex === 3) nextStatus = 'Approved';
    else if (nextStepIndex === 4) nextStatus = 'Completed';

    const updatedCompletedSteps = [...(app.completedSteps || [])];
    if (!updatedCompletedSteps.includes(TRACKING_STEPS[app.currentStep])) {
      updatedCompletedSteps.push(TRACKING_STEPS[app.currentStep]);
    }

    await trackerService.updateApplicationStatus(
      app.applicationId,
      nextStatus,
      nextStepIndex,
      updatedCompletedSteps
    );
  };

  const getStepIcon = (stepIndex, currentStepIndex) => {
    if (stepIndex < currentStepIndex) return <Check size={14} />;
    if (stepIndex === currentStepIndex) return <Clock size={14} />;
    return <span style={{fontSize: '10px'}}>○</span>;
  };

  if (loading) {
    return (
      <div className="tracker-page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh'}}>
        <Loader2 className="spin-icon" size={32} style={{color: 'var(--primary-color)'}}/>
      </div>
    );
  }

  return (
    <div className="tracker-page">
      <div className="tracker-header">
        <div className="tracker-title">
          <h1>Application Progress Tracker</h1>
          <p>Monitor the status of your government document applications.</p>
        </div>
        <button 
          className="btn-primary new-app-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          <span>New Application</span>
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <FileText className="empty-icon" />
          <h3>No applications are being tracked yet.</h3>
          <p>Click "New Application" to start tracking your progress.</p>
        </div>
      ) : (
        <div className="tracker-grid">
          {applications.map((app) => (
            <div key={app.applicationId} className="tracker-card">
              <div className="tracker-card-header">
                <div className="tracker-card-title">
                  <FileText className="tracker-card-icon" size={24} />
                  <h3>{app.documentName}</h3>
                </div>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(app.applicationId)}
                  title="Delete Application"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="timeline">
                {TRACKING_STEPS.map((stepLabel, index) => {
                  const isCompleted = index < app.currentStep;
                  const isCurrent = index === app.currentStep;
                  
                  return (
                    <div 
                      key={stepLabel} 
                      className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                    >
                      <div className="step-indicator">
                        {getStepIcon(index, app.currentStep)}
                      </div>
                      <div className="step-content">
                        <span className="step-label">{stepLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="tracker-card-actions">
                {app.currentStep < TRACKING_STEPS.length - 1 ? (
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleAdvanceStep(app)}
                    style={{display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center'}}
                  >
                    Mark as {TRACKING_STEPS[app.currentStep + 1]}
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <div style={{color: '#10b981', fontWeight: '600', textAlign: 'center', width: '100%'}}>
                    All Steps Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Application Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Start Tracking Application</h2>
            <form onSubmit={handleCreateApplication}>
              <div className="form-group">
                <label>Document Type</label>
                <select 
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value)}
                  required
                >
                  {PREDEFINED_DOCS.map(doc => (
                    <option key={doc} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>
              
              {newDocType === 'Other' && (
                <div className="form-group">
                  <label>Custom Document Name</label>
                  <input 
                    type="text" 
                    value={customDocName}
                    onChange={(e) => setCustomDocName(e.target.value)}
                    placeholder="e.g. Marriage License"
                    required
                  />
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Tracker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
