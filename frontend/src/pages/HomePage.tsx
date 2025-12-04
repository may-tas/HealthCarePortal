import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import './HomePage.css';

interface HealthSection {
  title: string;
  content: string;
  link: string;
}

interface PrivacyPolicy {
  title: string;
  content: string;
  lastUpdated: string;
}

interface HealthInfo {
  title: string;
  sections: HealthSection[];
  privacyPolicy: PrivacyPolicy;
}

const HomePage: React.FC = () => {
  const [healthInfo, setHealthInfo] = useState<HealthInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHealthInfo();
  }, []);

  const fetchHealthInfo = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/health-info`);
      setHealthInfo(response.data);
    } catch (err: any) {
      console.error('Failed to fetch health info:', err);
      setError('Failed to load health information. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1>Healthcare Portal</h1>
          <p>Your partner in wellness and preventive care</p>
        </div>
      </div>
      
      <Navbar />
      
      <main className="home-main">
        {isLoading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading health information...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
          </div>
        ) : healthInfo ? (
          <>
            <section className="health-info-section">
              <h2>{healthInfo.title}</h2>
              <div className="health-cards">
                {healthInfo.sections.map((section, index) => (
                  <Card key={index} title={section.title} className="health-card">
                    <p>{section.content}</p>
                    {section.link !== '#' && (
                      <a href={section.link} className="learn-more">
                        Learn More →
                      </a>
                    )}
                  </Card>
                ))}
              </div>
            </section>

            <section className="privacy-section">
              <Card title={healthInfo.privacyPolicy.title} className="privacy-card">
                <p>{healthInfo.privacyPolicy.content}</p>
                <p className="last-updated">
                  Last Updated: {new Date(healthInfo.privacyPolicy.lastUpdated).toLocaleDateString()}
                </p>
              </Card>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default HomePage;
