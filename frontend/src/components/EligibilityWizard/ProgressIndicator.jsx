import './wizard.css';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="wizard-progress-wrapper">
      <div className="wizard-progress-info">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{percentage}% Completed</span>
      </div>
      <div className="wizard-progress-track">
        <div
          className="wizard-progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;

