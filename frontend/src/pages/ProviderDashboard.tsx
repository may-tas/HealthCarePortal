import React from 'react';
import UnderDevelopment from '../components/UnderDevelopment';

const ProviderDashboard: React.FC = () => {
  const features = [
    'View all assigned patients in a searchable list',
    'Monitor patient compliance with preventive care',
    'See real-time wellness goal tracking',
    'Access patient medical history and profiles',
    'Generate compliance reports',
    'Send reminders for upcoming checkups'
  ];

  return (
    <UnderDevelopment 
      title="Provider Dashboard"
      features={features}
    />
  );
};

export default ProviderDashboard;
