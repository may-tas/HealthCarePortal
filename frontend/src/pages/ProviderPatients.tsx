import React from 'react';
import UnderDevelopment from '../components/UnderDevelopment';

const ProviderPatients: React.FC = () => {
  const features = [
    'Complete patient list with search and filters',
    'Sort by compliance status (compliant/at-risk/overdue)',
    'View individual patient details in modal',
    'See patient wellness goals and progress',
    'Access emergency contact information',
    'Track medication and allergy information'
  ];

  return (
    <UnderDevelopment 
      title="Patient Management"
      features={features}
    />
  );
};

export default ProviderPatients;
