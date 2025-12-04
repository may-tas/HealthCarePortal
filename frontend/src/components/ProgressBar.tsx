import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  current: number;
  goal: number;
  label: string;
  color?: string;
  unit?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  goal, 
  label, 
  color = 'var(--primary-color)',
  unit = ''
}) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <span className="progress-label">{label}</span>
        <span className="progress-value">{current.toLocaleString()}{unit} / {goal.toLocaleString()}{unit}</span>
      </div>
      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color 
          }}
        />
      </div>
      <div className="progress-percentage">{percentage.toFixed(0)}% Complete</div>
    </div>
  );
};

export default ProgressBar;
