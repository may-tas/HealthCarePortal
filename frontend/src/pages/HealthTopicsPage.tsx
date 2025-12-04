import React from 'react';
import Navbar from "../components/Navbar";

const HealthTopicsPage: React.FC = () => {
  return (
    <div>
      <header className="home-header">
        <h1>Healthcare Portal</h1>
      </header>
      <Navbar />
      <main className="home-main">
        <h2>Health Topics</h2>
        <p>Information about various health topics will be displayed here.</p>
      </main>
    </div>
  );
};

export default HealthTopicsPage;
