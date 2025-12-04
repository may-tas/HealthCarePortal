import React from 'react';
import './ComplianceStatus.css';

interface ComplianceStatusProps {
  status: 'compliant' | 'at-risk' | 'overdue';
  lastCheckup?: string;
}

const ComplianceStatus: React.FC<ComplianceStatusProps> = ({ status, lastCheckup }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'compliant':
        return {
          label: 'Goal Met',
          icon: '✓',
          className: 'compliant'
        };
      case 'at-risk':
        return {
          label: 'At Risk',
          icon: '⚠',
          className: 'at-risk'
        };
      case 'overdue':
        return {
          label: 'Missed Preventive Checkup',
          icon: '⨯',
          className: 'overdue'
        };
      default:
        return {
          label: 'Unknown',
          icon: '?',
          className: 'unknown'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`compliance-status ${config.className}`}>
      <span className="status-icon">{config.icon}</span>
      <span className="status-label">{config.label}</span>
      {lastCheckup && (
        <span className="last-checkup">
          Last: {new Date(lastCheckup).toLocaleDateString()}
        </span>
      )}
    </div>
  );
};

export default ComplianceStatus;
