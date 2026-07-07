import React from 'react';
import './PageLoader.css';

const PageLoader = () => {
  return (
    <div className="page-loader-container" aria-busy="true" aria-live="polite">
      <div className="page-loader-spinner"></div>
      <p className="page-loader-text">Loading...</p>
    </div>
  );
};

export default PageLoader;
