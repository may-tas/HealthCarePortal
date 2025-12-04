import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import './PatientDashboard.css';

interface Goal {
  type: string;
  target: number;
  current: number;
  unit: string;
}

interface Reminder {
  title: string;
  description: string;
  date: string;
  type: string;
}

interface HealthTip {
  title: string;
  content: string;
  category: string;
}

interface DashboardData {
  goals: Goal[];
  reminders: Reminder[];
  healthTip: HealthTip;
}

const PatientDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/patient/dashboard');
      setDashboardData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header">
        <h1>Your Wellness Dashboard</h1>
        <p>Track your health goals and stay on top of preventive care</p>
      </div>

      <div className="dashboard-grid">
        {/* Wellness Goals Section */}
        <Card title="Wellness Goals" className="goals-card">
          {dashboardData?.goals && dashboardData.goals.length > 0 ? (
            dashboardData.goals.map((goal, index) => (
              <ProgressBar
                key={index}
                label={goal.type}
                current={goal.current}
                goal={goal.target}
                unit={goal.unit}
                color={getGoalColor(goal.type)}
              />
            ))
          ) : (
            <p className="empty-state">No goals set yet. Start tracking your wellness!</p>
          )}
        </Card>

        {/* Reminders Section */}
        <Card title="Upcoming Preventive Care" className="reminders-card">
          {dashboardData?.reminders && dashboardData.reminders.length > 0 ? (
            <div className="reminders-list">
              {dashboardData.reminders.map((reminder, index) => (
                <div key={index} className="reminder-item">
                  <div className="reminder-icon">
                    {getReminderIcon(reminder.type)}
                  </div>
                  <div className="reminder-content">
                    <h4>{reminder.title}</h4>
                    <p>{reminder.description}</p>
                    <span className="reminder-date">
                      {new Date(reminder.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No upcoming reminders</p>
          )}
        </Card>

        {/* Health Tip Section */}
        <Card title="Today's Health Tip" className="health-tip-card">
          {dashboardData?.healthTip ? (
            <div className="health-tip">
              <div className="tip-category">{dashboardData.healthTip.category}</div>
              <h3>{dashboardData.healthTip.title}</h3>
              <p>{dashboardData.healthTip.content}</p>
            </div>
          ) : (
            <p className="empty-state">No health tip available today</p>
          )}
        </Card>
      </div>
    </div>
  );
};

// Helper functions
const getGoalColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    'Steps': '#4a90e2',
    'Active Time': '#50c878',
    'Sleep': '#9b59b6',
    'Water Intake': '#3498db',
    'Exercise': '#e74c3c'
  };
  return colors[type] || '#4a90e2';
};

const getReminderIcon = (type: string): string => {
  const icons: { [key: string]: string } = {
    'checkup': '🏥',
    'vaccination': '💉',
    'dental': '🦷',
    'screening': '🔬',
    'default': '📋'
  };
  return icons[type.toLowerCase()] || icons['default'];
};

export default PatientDashboard;
