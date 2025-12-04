import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>Healthcare Portal</h1>
        </Link>

        <nav className="header-nav">
          {!isAuthenticated ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/health-topics" className="nav-link">Health Topics</Link>
              <Link to="/services" className="nav-link">Services</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
              <Link to="/login" className="nav-link nav-link-primary">Login</Link>
              <Link to="/register" className="nav-link nav-link-primary">Register</Link>
            </>
          ) : (
            <>
              {user?.role === 'patient' && (
                <>
                  <Link to="/patient/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/patient/goals" className="nav-link">Goals</Link>
                  <Link to="/patient/profile" className="nav-link">Profile</Link>
                </>
              )}
              {user?.role === 'provider' && (
                <>
                  <Link to="/provider/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/provider/patients" className="nav-link">Patients</Link>
                </>
              )}
              <div className="user-menu">
                <span className="user-name">
                  {user?.firstName || user?.email}
                </span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
