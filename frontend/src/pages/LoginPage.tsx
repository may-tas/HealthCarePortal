import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    // Here you would normally validate the inputs
    // and then call the login function with credentials
    login();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src="https://via.placeholder.com/150" alt="logo" className="login-logo" />
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>Login</button>
        <a href="#" className="forgot-password">Forgot Password?</a>
        <p className="register-link">New User? <a href="#">Register here</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
