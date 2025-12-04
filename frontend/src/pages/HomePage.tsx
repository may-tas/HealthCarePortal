import React from 'react';
import Navbar from '../../components/Navbar';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Healthcare Portal</h1>
      </header>
      <Navbar />
      <main className="home-main">
        <h2>Latest Health Information</h2>
        <div className="health-info-display">
          {/* Placeholder for health information */}
          <p>Loading health information...</p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
