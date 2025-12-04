import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import PatientList from '../components/PatientList';
import './ProviderDashboard.css';

interface DashboardStats {
  totalPatients: number;
  compliantPatients: number;
  atRiskPatients: number;
  overduePatients: number;
}

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

const ProviderDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    compliantPatients: 0,
    atRiskPatients: 0,
    overduePatients: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/provider/patients');
      const patientData = response.data.patients || [];
      setPatients(patientData);
      
      // Calculate stats
      const stats = patientData.reduce(
        (acc: DashboardStats, patient: Patient) => {
          acc.totalPatients++;
          if (patient.complianceStatus === 'compliant') acc.compliantPatients++;
          if (patient.complianceStatus === 'at-risk') acc.atRiskPatients++;
          if (patient.complianceStatus === 'overdue') acc.overduePatients++;
          return acc;
        },
        { totalPatients: 0, compliantPatients: 0, atRiskPatients: 0, overduePatients: 0 }
      );
      setStats(stats);
      setError('');
    } catch (err: any) {
      console.error('Error fetching patients:', err);
      setError(err.response?.data?.error?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="provider-dashboard">
        <div className="dashboard-loading">
          <div className="loader"></div>
          <p>Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="provider-dashboard">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={fetchPatients} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-dashboard">
      <div className="dashboard-header">
        <h1>Provider Dashboard</h1>
        <p className="dashboard-subtitle">Monitor your assigned patients and their wellness progress</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalPatients}</h3>
            <p>Total Patients</p>
          </div>
        </div>
        
        <div className="stat-card compliant">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>{stats.compliantPatients}</h3>
            <p>Goals Met</p>
          </div>
        </div>
        
        <div className="stat-card at-risk">
          <div className="stat-icon">⚠</div>
          <div className="stat-content">
            <h3>{stats.atRiskPatients}</h3>
            <p>At Risk</p>
          </div>
        </div>
        
        <div className="stat-card overdue">
          <div className="stat-icon">⨯</div>
          <div className="stat-content">
            <h3>{stats.overduePatients}</h3>
            <p>Overdue Checkups</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search patients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Patients
          </button>
          <button
            className={`filter-btn ${statusFilter === 'compliant' ? 'active' : ''}`}
            onClick={() => setStatusFilter('compliant')}
          >
            Goal Met
          </button>
          <button
            className={`filter-btn ${statusFilter === 'at-risk' ? 'active' : ''}`}
            onClick={() => setStatusFilter('at-risk')}
          >
            At Risk
          </button>
          <button
            className={`filter-btn ${statusFilter === 'overdue' ? 'active' : ''}`}
            onClick={() => setStatusFilter('overdue')}
          >
            Overdue
          </button>
        </div>
      </div>

      {/* Patient List */}
      <PatientList
        patients={patients}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
      />
    </div>
  );
};

export default ProviderDashboard;
