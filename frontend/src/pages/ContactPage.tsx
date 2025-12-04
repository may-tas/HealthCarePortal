import React from 'react';
import Navbar from '../../components/Navbar';

const ContactPage: React.FC = () => {
  return (
    <div>
      <header className="home-header">
        <h1>Healthcare Portal</h1>
      </header>
      <Navbar />
      <main className="home-main">
        <h2>Contact Us</h2>
        <p>Contact information will be displayed here.</p>
      </main>
    </div>
  );
};

export default ContactPage;
