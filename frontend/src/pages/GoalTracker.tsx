import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Card from '../components/Card';
import Button from '../components/Button';
import './GoalTracker.css';

interface GoalLog {
  id: string;
  type: string;
  target: number;
  current: number;
  unit: string;
  date: string;
  notes?: string;
  completed?: boolean;
}

const GoalTracker: React.FC = () => {
  const [goalType, setGoalType] = useState('Steps');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [goals, setGoals] = useState<GoalLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterType, setFilterType] = useState('all');

  const goalTypes = [
    { value: 'Steps', unit: 'steps', target: 10000 },
    { value: 'Active Time', unit: 'minutes', target: 60 },
    { value: 'Sleep', unit: 'hours', target: 8 },
    { value: 'Water Intake', unit: 'glasses', target: 8 },
    { value: 'Exercise', unit: 'minutes', target: 30 }
  ];

  useEffect(() => {
    fetchGoals();
  }, [filterType]);

  const fetchGoals = async () => {
    try {
      const params = filterType !== 'all' ? { type: filterType } : {};
      const response = await axios.get('/patient/goals', { params });
      setGoals(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error('Failed to fetch goals:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!value || parseFloat(value) <= 0) {
      setError('Please enter a valid value');
      return;
    }

    setIsLoading(true);
    try {
      const selectedGoal = goalTypes.find(g => g.value === goalType);
      await axios.post('/patient/goals/log', {
        type: goalType,
        target: selectedGoal?.target || 0,
        current: parseFloat(value),
        unit: selectedGoal?.unit || '',
        date,
        notes: notes || undefined
      });
      
      setSuccess('Goal logged successfully!');
      setValue('');
      setNotes('');
      fetchGoals();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to log goal');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedGoalInfo = goalTypes.find(g => g.value === goalType);

  return (
    <div className="goal-tracker">
      <div className="tracker-header">
        <h1>Goal Tracker</h1>
        <p>Log your daily wellness activities</p>
      </div>

      <div className="tracker-container">
        <Card title="Log New Goal" className="log-card">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="log-form">
            <div className="form-group">
              <label htmlFor="goalType">Goal Type</label>
              <select
                id="goalType"
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                className="form-select"
                disabled={isLoading}
              >
                {goalTypes.map(goal => (
                  <option key={goal.value} value={goal.value}>
                    {goal.value} (Target: {goal.target} {goal.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="value">Value ({selectedGoalInfo?.unit})</label>
                <input
                  id="value"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder={`Enter ${selectedGoalInfo?.unit}`}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (Optional)</label>
              <textarea
                id="notes"
                placeholder="Add any notes about this entry..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-textarea"
                disabled={isLoading}
                rows={3}
              />
            </div>

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Logging...' : 'Log Goal'}
            </Button>
          </form>
        </Card>

        <Card title="Goal History" className="history-card">
          <div className="filter-section">
            <label htmlFor="filter">Filter by type:</label>
            <select
              id="filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Goals</option>
              {goalTypes.map(goal => (
                <option key={goal.value} value={goal.value}>{goal.value}</option>
              ))}
            </select>
          </div>

          <div className="history-list">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <div key={goal.id} className="history-item">
                  <div className="history-header">
                    <span className="goal-type-badge">{goal.type}</span>
                    <span className="goal-date">
                      {new Date(goal.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="history-value">
                    <strong>{goal.current}</strong> / {goal.target} {goal.unit}
                    {goal.completed && <span className="completed-badge">✓ Completed</span>}
                  </div>
                  {goal.notes && <p className="history-notes">{goal.notes}</p>}
                </div>
              ))
            ) : (
              <p className="empty-state">
                No goals logged yet. Start tracking your progress!
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GoalTracker;
