import React from 'react';
import './wizard.css';

const QuestionCard = ({ question, options, answer, onAnswer, type = 'radio' }) => {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <h3 className="wizard-question-text">{question}</h3>
      
      {type === 'radio' && (
        <div className="wizard-input-container">
          {options.map((opt, index) => (
            <label
              key={index}
              className={`wizard-radio-label ${answer === opt.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="questionOption"
                value={opt.value}
                checked={answer === opt.value}
                onChange={() => onAnswer(opt.value)}
                className="wizard-radio-input"
              />
              <span className="wizard-radio-text">{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {type === 'number' && (
        <div className="wizard-input-container">
          <input
            type="number"
            value={answer || ''}
            onChange={(e) => onAnswer(e.target.value === '' ? '' : Number(e.target.value))}
            className="wizard-input"
            placeholder="Enter a number..."
            min="0"
          />
        </div>
      )}
      
      {type === 'select' && (
        <div className="wizard-input-container">
          <select
            value={answer || ''}
            onChange={(e) => onAnswer(e.target.value)}
            className="wizard-select"
          >
            <option value="" disabled>Select an option</option>
            {options.map((opt, index) => (
              <option key={index} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
