import React from 'react';
import ComplianceStatus from './ComplianceStatus';
import './PatientCard.css';

interface PatientCardProps {
  patient: {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    lastCheckup?: string;
    complianceStatus: 'compliant' | 'at-risk' | 'overdue';
    goalsCompleted?: number;
    totalGoals?: number;
  };
  onClick: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  const completionRate = patient.totalGoals 
    ? Math.round((patient.goalsCompleted || 0) / patient.totalGoals * 100)
    : 0;

  return (
    <div className="patient-card" onClick={onClick}>
      <div className="patient-card-header">
        <div className="patient-avatar">
          {patient.firstName[0]}{patient.lastName[0]}
        </div>
        <div className="patient-info">
          <h3 className="patient-name">
            {patient.firstName} {patient.lastName}
          </h3>
          <p className="patient-email">{patient.email}</p>
        </div>
      </div>

      <div className="patient-card-body">
        <ComplianceStatus 
          status={patient.complianceStatus}
          lastCheckup={patient.lastCheckup}
        />

        {patient.totalGoals !== undefined && (
          <div className="goals-summary">
            <div className="goals-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="progress-text">
                {patient.goalsCompleted || 0} / {patient.totalGoals} goals completed
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="patient-card-footer">
        <button className="view-details-btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          View Details →
        </button>
      </div>
    </div>
  );
};

export default PatientCard;
