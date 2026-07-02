import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

// Temporary placeholder for dashboard. Will be replaced in Stage 6.
const DashboardPlaceholder = () => (
  <div className="container" style={{ marginTop: '2rem' }}>
    <h2>Student Task Dashboard</h2>
    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
      Please log in or sign up to view and manage your tasks.
    </p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="content">
            <Routes>
              <Route path="/" element={<DashboardPlaceholder />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
