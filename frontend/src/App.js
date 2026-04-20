import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import { Signup, Login } from './components/Auth';
import Dashboard from './components/Dashboard';
import Books from './components/Books';
import ActiveBorrows from './components/ActiveBorrows';
import History from './components/History';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Books />
                </div>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/active-borrows"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <ActiveBorrows />
                </div>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <History />
                </div>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Profile />
                </div>
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
