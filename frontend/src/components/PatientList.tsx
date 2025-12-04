import React, { useState } from 'react';
import PatientCard from './PatientCard';
import PatientDetailModal from './PatientDetailModal';
import './PatientList.css';

interface Patient {
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
  goalsCompleted?: number;
  totalGoals?: number;
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

interface PatientListProps {
  patients: Patient[];
  searchTerm: string;
  statusFilter: string;
}

const PatientList: React.FC<PatientListProps> = ({ patients, searchTerm, statusFilter }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  // Filter patients based on search term and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || patient.complianceStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (filteredPatients.length === 0) {
    return (
      <div className="patient-list-empty">
        <div className="empty-icon">👥</div>
        <h3>No patients found</h3>
        <p>
          {searchTerm || statusFilter !== 'all'
            ? 'Try adjusting your filters'
            : 'No patients assigned yet'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="patient-list">
        {filteredPatients.map(patient => (
          <PatientCard
            key={patient.uid}
            patient={patient}
            onClick={() => handlePatientClick(patient)}
          />
        ))}
      </div>

      <PatientDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        patient={selectedPatient}
      />
    </>
  );
};

export default PatientList;
