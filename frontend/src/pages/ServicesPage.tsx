import React from 'react';
import Navbar from '../../components/Navbar';

const ServicesPage: React.FC = () => {
  return (
    <div>
      <header className="home-header">
        <h1>Healthcare Portal</h1>
      </header>
      <Navbar />
      <main className="home-main">
        <h2>Our Services</h2>
        <p>Details about our healthcare services will be displayed here.</p>
      </main>
    </div>
  );
};

export default ServicesPage;
