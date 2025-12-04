import React from 'react';
import { Navigate } from 'react-router-dom';

const ProviderPatients: React.FC = () => {
  // Redirect to main dashboard since patient list is integrated there
  return <Navigate to="/provider/dashboard" replace />;
};

export default ProviderPatients;
