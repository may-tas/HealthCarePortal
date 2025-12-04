import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HealthTopicsPage from './pages/HealthTopicsPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import PatientDashboard from './pages/PatientDashboard';
import GoalTracker from './pages/GoalTracker';
import ProfilePage from './pages/ProfilePage';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderPatients from './pages/ProviderPatients';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/health-topics" element={<HealthTopicsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Patient Routes - Protected */}
            <Route 
              path="/patient/dashboard" 
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/patient/goals" 
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <GoalTracker />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/patient/profile" 
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <ProfilePage />
                </PrivateRoute>
              } 
            />

            {/* Provider Routes - Protected */}
            <Route 
              path="/provider/dashboard" 
              element={
                <PrivateRoute allowedRoles={['provider']}>
                  <ProviderDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/provider/patients" 
              element={
                <PrivateRoute allowedRoles={['provider']}>
                  <ProviderPatients />
                </PrivateRoute>
              } 
            />

            {/* Unauthorized Route */}
            <Route 
              path="/unauthorized" 
              element={
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <h1>Unauthorized</h1>
                  <p>You don't have permission to access this page.</p>
                </div>
              } 
            />

            {/* 404 Route */}
            <Route 
              path="*" 
              element={
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              } 
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
