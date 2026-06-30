import React, { useState } from 'react';
import QuestionCard from './QuestionCard';
import ProgressIndicator from './ProgressIndicator';
import ResultCard from './ResultCard';
import { eligibilityService } from '../../services/eligibilityService';
import './wizard.css';

const DOCUMENTS = [
  { id: 'pan-card', label: 'PAN Card', icon: '💳' },
  { id: 'aadhaar-card', label: 'Aadhaar Card', icon: '🆔' },
  { id: 'passport', label: 'Passport', icon: '🛂' },
  { id: 'driving-license', label: 'Driving License', icon: '🚗' },
  { id: 'income-certificate', label: 'Income Certificate', icon: '📄' }
];

const QUESTIONS_CONFIG = {
  'pan-card': [
    { id: 'citizenship', text: 'What is your citizenship?', type: 'radio', options: [{ label: 'Indian Citizen', value: 'indian' }, { label: 'Foreign Citizen', value: 'foreign' }] },
    { id: 'age', text: 'What is your age?', type: 'number' }
  ],
  'aadhaar-card': [
    { id: 'hasEnrolledBefore', text: 'Have you ever enrolled for an Aadhaar card before?', type: 'radio', options: [{ label: 'Yes, I have an enrollment slip/Aadhaar', value: true }, { label: 'No, this is my first time', value: false }] },
    { id: 'age', text: 'What is the age of the applicant?', type: 'number' }
  ],
  'passport': [
    { id: 'citizenship', text: 'Are you a citizen of India?', type: 'radio', options: [{ label: 'Yes', value: 'indian' }, { label: 'No', value: 'foreign' }] },
    { id: 'isRenewal', text: 'Is this a fresh application or a re-issue (renewal)?', type: 'radio', options: [{ label: 'Fresh Application', value: false }, { label: 'Re-issue / Renewal', value: true }] },
    { id: 'age', text: 'What is your age?', type: 'number' }
  ],
  'driving-license': [
    { id: 'age', text: 'What is your current age?', type: 'number' },
    { id: 'hasLearnerLicense', text: 'Do you already hold a valid Learner\'s License?', type: 'radio', options: [{ label: 'Yes, I have one', value: true }, { label: 'No, I don\'t', value: false }] },
    { id: 'vehicleType', text: 'Which type of vehicle are you applying for?', type: 'select', options: [{ label: 'Motorcycle without gear (upto 50cc)', value: 'mcwg' }, { label: 'Motorcycle with gear / Car', value: 'lmv' }, { label: 'Commercial / Transport Vehicle', value: 'transport' }] }
  ],
  'income-certificate': [
    { id: 'purpose', text: 'What is the main purpose of this income certificate?', type: 'select', options: [{ label: 'General / Education / Scholarship', value: 'general' }, { label: 'EWS (Economically Weaker Section) Quota', value: 'ews' }, { label: 'Other', value: 'other' }] }
  ]
};

const EligibilityWizard = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDocumentSelect = (docId) => {
    setSelectedDocument(docId);
    setAnswers({});
    setCurrentStep(0);
    setResult(null);
    setError(null);
  };

  const handleAnswer = (value) => {
    const questions = QUESTIONS_CONFIG[selectedDocument];
    const currentQ = questions[currentStep];
    
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: value
    }));
  };

  const handleNext = async () => {
    const questions = QUESTIONS_CONFIG[selectedDocument];
    
    // Validate if answer is provided
    if (answers[questions[currentStep].id] === undefined || answers[questions[currentStep].id] === '') {
      setError('Please provide an answer before proceeding.');
      return;
    }
    
    setError(null);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      await submitEligibility();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setError(null);
    } else {
      // Go back to document selection
      setSelectedDocument(null);
      setAnswers({});
    }
  };

  const submitEligibility = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await eligibilityService.checkEligibility(selectedDocument, answers);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setSelectedDocument(null);
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
  };

  if (result) {
    return <ResultCard result={result} onRestart={handleRestart} />;
  }

  return (
    <div className="wizard-container">
      {/* Header */}
      <div className="wizard-header">
        <h2 className="wizard-title">Eligibility Wizard</h2>
        <p className="wizard-subtitle">Find out if you're eligible and get a personalized application roadmap.</p>
      </div>

      <div className="wizard-body">
        {!selectedDocument ? (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h3 className="wizard-question-text" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Which document do you want to apply for?</h3>
            <div className="wizard-doc-grid">
              {DOCUMENTS.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => handleDocumentSelect(doc.id)}
                  className="wizard-option-card"
                >
                  <span className="wizard-option-icon">{doc.icon}</span>
                  <span className="wizard-option-text">{doc.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <ProgressIndicator 
              currentStep={currentStep + 1} 
              totalSteps={QUESTIONS_CONFIG[selectedDocument].length} 
            />
            
            <div style={{ flexGrow: 1 }}>
              <QuestionCard
                question={QUESTIONS_CONFIG[selectedDocument][currentStep].text}
                type={QUESTIONS_CONFIG[selectedDocument][currentStep].type}
                options={QUESTIONS_CONFIG[selectedDocument][currentStep].options}
                answer={answers[QUESTIONS_CONFIG[selectedDocument][currentStep].id]}
                onAnswer={handleAnswer}
              />
              
              {error && (
                <div className="wizard-error">
                  <span>⚠️</span> {error}
                </div>
              )}
            </div>

            <div className="wizard-actions">
              <button
                onClick={handlePrevious}
                disabled={isLoading}
                className="btn-secondary"
              >
                Back
              </button>
              
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="btn-primary"
                style={{ minWidth: '120px' }}
              >
                {isLoading ? 'Processing...' : (currentStep === QUESTIONS_CONFIG[selectedDocument].length - 1 ? 'Check Eligibility' : 'Next')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EligibilityWizard;
