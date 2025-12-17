import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthChange, getCurrentUserData } from './firebase/auth';
import Login from './components/Login';
import Register from './components/Register';
import ParticipantDashboard from './components/ParticipantDashboard';
import StaffDashboard from './components/StaffDashboard';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        try {
          const data = await getCurrentUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando aplicación...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!currentUser ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : userData?.role === 'staff' ? (
          <>
            <Route path="/" element={<StaffDashboard currentUser={currentUser} />} />
            <Route path="/staff-dashboard" element={<StaffDashboard currentUser={currentUser} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<ParticipantDashboard currentUser={currentUser} />} />
            <Route path="/participant-dashboard" element={<ParticipantDashboard currentUser={currentUser} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
