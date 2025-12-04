import React from 'react';
import './UnderDevelopment.css';

interface UnderDevelopmentProps {
  title: string;
  features?: string[];
}

const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({ title, features }) => {
  return (
    <div className="under-development">
      <div className="dev-container">
        <div className="dev-icon">
          <span className="construction-emoji">🚧</span>
        </div>
        
        <h1 className="dev-title">{title}</h1>
        <p className="dev-subtitle">This feature is currently under development</p>
        
        {features && features.length > 0 && (
          <div className="planned-features">
            <h3>Planned Features:</h3>
            <ul className="features-list">
              {features.map((feature, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="dev-status">
          <div className="status-badge">
            <span className="status-dot"></span>
            In Active Development
          </div>
        </div>

        <div className="dev-footer">
          <p className="dev-note">
            <strong>Note:</strong> The backend API for this feature is ready. 
            Frontend UI implementation is in progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;
