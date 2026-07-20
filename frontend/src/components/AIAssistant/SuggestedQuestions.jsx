
export default function SuggestedQuestions({ onSelect }) {
  const suggestions = [
    "I lost my PAN card",
    "How to apply for a Passport?",
    "Documents for Driving License",
    "Check Aadhar eligibility"
  ];

  return (
    <div className="suggested-questions">
      <div className="suggested-title">Suggested Questions</div>
      <div className="suggestions-list">
        {suggestions.map((q, index) => (
          <button 
            key={index} 
            className="suggestion-chip"
            onClick={() => onSelect(q)}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
