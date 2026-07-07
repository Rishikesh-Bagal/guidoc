import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'text', count = 1, width, height, className = '' }) => {
  const elements = [];
  
  for (let i = 0; i < count; i++) {
    elements.push(
      <div 
        key={i} 
        className={`skeleton skeleton-${type} ${className}`}
        style={{ width, height }}
        aria-hidden="true"
      ></div>
    );
  }

  return (
    <div className="skeleton-container" aria-live="polite" aria-busy="true">
      {elements}
    </div>
  );
};

export default SkeletonLoader;
