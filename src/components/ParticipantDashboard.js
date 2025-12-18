import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUserData, logoutUser } from '../firebase/auth';
import { getScheduleEvents } from '../firebase/schedule';
import Sidebar from './Sidebar'; // eslint-disable-line no-unused-vars
import QRDisplay from './QRDisplay';
import ScheduleView from './ScheduleView';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const ParticipantDashboard = ({ currentUser }) => {
  const [userData, setUserData] = useState(null);
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('schedule');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toggleSidebarRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const data = await getCurrentUserData(currentUser.uid);
          setUserData(data);
          
          const events = await getScheduleEvents();
          setScheduleEvents(events);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleToggleSidebar = () => {
    toggleSidebarRef.current?.();
  };

  const menuItems = [ // eslint-disable-line no-unused-vars
    { id: 'schedule', label: 'Cronograma', icon: '📅' },
    { id: 'qr', label: 'Mi QR', icon: '📱' },
    { id: 'checkins', label: 'Mis Check-ins', icon: '✅' }
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar
        userData={userData}
        onLogout={handleLogout}
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggleRef={toggleSidebarRef}
      />

      <nav className="navbar">
        <button 
          className="navbar-toggle" 
          onClick={handleToggleSidebar}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <div className="navbar-brand">
          <h2>🏕️ Campamento App</h2>
        </div>
      </nav>

      <div className="container">
        {activeTab === 'schedule' && (
          <div className="tab-content">
            <h2>Cronograma del Campamento</h2>
            <ScheduleView events={scheduleEvents} isStaff={false} />
          </div>
        )}

        {activeTab === 'qr' && userData && (
          <div className="tab-content">
            <h2>Mi Código QR</h2>
            <QRDisplay userData={userData} />
          </div>
        )}

        {activeTab === 'checkins' && userData && (
          <div className="tab-content">
            <h2>Mis Check-ins de Comidas</h2>
            <div className="checkins-container">
              <div className="checkin-item">
                <h3>🥐 Desayunos</h3>
                <p>Total: {userData.mealCheckIns?.breakfast?.length || 0}</p>
              </div>
              <div className="checkin-item">
                <h3>🍽️ Almuerzos</h3>
                <p>Total: {userData.mealCheckIns?.lunch?.length || 0}</p>
              </div>
              <div className="checkin-item">
                <h3>🍽️ Cenas</h3>
                <p>Total: {userData.mealCheckIns?.dinner?.length || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantDashboard;
