import React from 'react';
import EligibilityWizard from '../components/EligibilityWizard/EligibilityWizard';

const WizardPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Document Eligibility Wizard
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Answer a few simple questions to find out your eligibility and get a personalized application roadmap.
          </p>
        </div>
        
        <EligibilityWizard />
      </div>
    </div>
  );
};

export default WizardPage;
