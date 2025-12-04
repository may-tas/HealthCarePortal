import React from 'react';
import Modal from './Modal';
import ComplianceStatus from './ComplianceStatus';
import ProgressBar from './ProgressBar';
import './PatientDetailModal.css';

interface PatientDetails {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  phone?: string;
  allergies?: string[];
  currentMedications?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  lastCheckup?: string;
  complianceStatus: 'compliant' | 'at-risk' | 'overdue';
  goals?: Array<{
    type: string;
    target: number;
    current: number;
    unit: string;
    completed: boolean;
  }>;
  recentActivity?: Array<{
    date: string;
    type: string;
    value: number;
    unit: string;
  }>;
}

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientDetails | null;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ isOpen, onClose, patient }) => {
  if (!patient) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${patient.firstName} ${patient.lastName}`}>
      <div className="patient-detail-modal">
        {/* Basic Info Section */}
        <section className="detail-section">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Email:</label>
              <span>{patient.email}</span>
            </div>
            {patient.dateOfBirth && (
              <div className="info-item">
                <label>Date of Birth:</label>
                <span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
            {patient.phone && (
              <div className="info-item">
                <label>Phone:</label>
                <span>{patient.phone}</span>
              </div>
            )}
            <div className="info-item">
              <label>Compliance Status:</label>
              <ComplianceStatus 
                status={patient.complianceStatus}
                lastCheckup={patient.lastCheckup}
              />
            </div>
          </div>
        </section>

        {/* Medical Info Section */}
        {(patient.allergies?.length || patient.currentMedications?.length) && (
          <section className="detail-section medical-section">
            <h3>Medical Information</h3>
            {patient.allergies && patient.allergies.length > 0 && (
              <div className="medical-item">
                <label>Allergies:</label>
                <div className="tags">
                  {patient.allergies.map((allergy, index) => (
                    <span key={index} className="tag allergy-tag">{allergy}</span>
                  ))}
                </div>
              </div>
            )}
            {patient.currentMedications && patient.currentMedications.length > 0 && (
              <div className="medical-item">
                <label>Current Medications:</label>
                <div className="tags">
                  {patient.currentMedications.map((medication, index) => (
                    <span key={index} className="tag medication-tag">{medication}</span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Emergency Contact Section */}
        {patient.emergencyContact && (
          <section className="detail-section">
            <h3>Emergency Contact</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <span>{patient.emergencyContact.name}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{patient.emergencyContact.phone}</span>
              </div>
              <div className="info-item">
                <label>Relationship:</label>
                <span>{patient.emergencyContact.relationship}</span>
              </div>
            </div>
          </section>
        )}

        {/* Wellness Goals Section */}
        {patient.goals && patient.goals.length > 0 && (
          <section className="detail-section">
            <h3>Current Wellness Goals</h3>
            <div className="goals-list">
              {patient.goals.map((goal, index) => (
                <div key={index} className="goal-item">
                  <ProgressBar
                    label={goal.type}
                    current={goal.current}
                    goal={goal.target}
                    unit={goal.unit}
                    color={goal.completed ? 'var(--secondary-color)' : 'var(--primary-color)'}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Activity Section */}
        {patient.recentActivity && patient.recentActivity.length > 0 && (
          <section className="detail-section">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {patient.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-date">
                    {new Date(activity.date).toLocaleDateString()}
                  </div>
                  <div className="activity-details">
                    <strong>{activity.type}:</strong> {activity.value} {activity.unit}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
};

export default PatientDetailModal;
