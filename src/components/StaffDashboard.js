import React, { useState, useEffect } from 'react';
import { getCurrentUserData, logoutUser, getAllUsers, updateUserRole } from '../firebase/auth';
import { getScheduleEvents, createScheduleEvent, updateScheduleEvent, deleteScheduleEvent } from '../firebase/schedule';
import Sidebar from './Sidebar';
import ScheduleEditor from './ScheduleEditor';
import UserManagement from './UserManagement';
import MealCheckIn from './MealCheckIn';
import MealCheckInAttendance from './MealCheckInAttendance';
import ParticipantRegistration from './ParticipantRegistration';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const StaffDashboard = ({ currentUser }) => {
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('qr-scanner');
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const data = await getCurrentUserData(currentUser.uid);
          if (data?.role !== 'staff') {
            navigate('/participant-dashboard');
            return;
          }
          setUserData(data);
          
          const users = await getAllUsers();
          setAllUsers(users);
          
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
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleAddEvent = async (event) => {
    try {
      await createScheduleEvent(
        event.title,
        event.description,
        event.startTime,
        event.endTime,
        event.day,
        event.mealType
      );
      const events = await getScheduleEvents();
      setScheduleEvents(events);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleUpdateEvent = async (eventId, updates) => {
    try {
      await updateScheduleEvent(eventId, updates);
      const events = await getScheduleEvents();
      setScheduleEvents(events);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteScheduleEvent(eventId);
      const events = await getScheduleEvents();
      setScheduleEvents(events);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      const users = await getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const menuItems = [
    { id: 'qr-scanner', label: 'Scanner QR', icon: '📱' },
    { id: 'attendance', label: 'Asistencia', icon: '📊' },
    { id: 'schedule', label: 'Cronograma', icon: '📅' },
    { id: 'users', label: 'Usuarios', icon: '👥', badge: allUsers.length }
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
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
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
          <h2>🏕️ Campamento App - Staff</h2>
        </div>
      </nav>

      <div className="container">
        {activeTab === 'qr-scanner' && (
          <div className="tab-content">
            <h2>Scanner QR</h2>
            <MealCheckIn />
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="tab-content">
            <h2>📊 Asistencia a eventos</h2>
            <MealCheckInAttendance />
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="tab-content">
            <h2>Gestión de Cronograma</h2>
            <ScheduleEditor 
              events={scheduleEvents}
              onAdd={handleAddEvent}
              onUpdate={handleUpdateEvent}
              onDelete={handleDeleteEvent}
            />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="tab-content">
            <h2>Gestión de Usuarios</h2>
            <UserManagement 
              users={allUsers}
              onUpdateRole={handleUpdateUserRole}
            />
          </div>
        )}

        {showRegistration && (
          <ParticipantRegistration 
            onClose={() => {
              setShowRegistration(false);
              const fetchUsers = async () => {
                const users = await getAllUsers();
                setAllUsers(users);
              };
              fetchUsers();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
