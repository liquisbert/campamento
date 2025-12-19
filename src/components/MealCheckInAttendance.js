import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../firebase/auth';
import { getMealEvents, getMealCheckinsForEvent } from '../firebase/schedule';
import './MealCheckInAttendance.css';

const MealCheckInAttendance = () => {
  const [mealEvents, setMealEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [currentEvent, setCurrentEvent] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [eventCheckins, setEventCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('marked'); // 'marked' or 'notMarked'

  // Load events and users on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const events = await getMealEvents();
      setMealEvents(events);
      
      const users = await getAllUsers();
      setAllUsers(users.filter(u => u.role === 'participant')); // Only participants

      // Select first event if available
      if (events.length > 0 && !selectedEventId) {
        setSelectedEventId(events[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load checkins when selected event changes
  useEffect(() => {
    if (selectedEventId) {
      loadEventCheckins();
    }
  }, [selectedEventId]);

  const loadEventCheckins = async () => {
    try {
      setLoading(true);
      const event = mealEvents.find(e => e.id === selectedEventId);
      setCurrentEvent(event);

      const checkins = await getMealCheckinsForEvent(selectedEventId);
      setEventCheckins(checkins);
    } catch (error) {
      console.error('Error loading checkins:', error);
    } finally {
      setLoading(false);
    }
  };

  // Separate users into marked and not marked
  const getAttendanceGroups = () => {
    const checkinUserIds = new Set(eventCheckins.map(c => c.userId));
    
    const marked = allUsers.filter(u => checkinUserIds.has(u.uid));
    const notMarked = allUsers.filter(u => !checkinUserIds.has(u.uid));

    return { marked, notMarked };
  };

  const { marked, notMarked } = getAttendanceGroups();

  const getEventLabel = (event) => {
    if (!event) return '';
    return `${event.title}`;
  };

  if (loading && mealEvents.length === 0) {
    return (
      <div className="attendance-loading">
        <div className="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="meal-attendance-container">
      {/* Event Selector */}
      <div className="event-selector-section">
        <label htmlFor="event-select">Seleccionar Evento:</label>
        <select
          id="event-select"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="event-select"
        >
          <option value="">-- Selecciona un evento --</option>
          {mealEvents.map(event => (
            <option key={event.id} value={event.id}>
              {getEventLabel(event)}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Stats */}
      {currentEvent && (
        <div className="attendance-summary">
          <div className="summary-stat marked-count">
            <span className="stat-label">Marcaron QR</span>
            <span className="stat-value">{marked.length}</span>
          </div>
          <div className="summary-stat notmarked-count">
            <span className="stat-label">No Marcaron</span>
            <span className="stat-value">{notMarked.length}</span>
          </div>
          <div className="summary-stat total-count">
            <span className="stat-label">Total</span>
            <span className="stat-value">{allUsers.length}</span>
          </div>
        </div>
      )}

      {/* Attendance Lists */}
      <div className="attendance-lists">
        {/* Not Marked Section */}
        <div className="attendance-section not-marked">
          <div className="section-header">
            <h4>❌ No Marcaron QR ({notMarked.length})</h4>
          </div>
          <div className="users-list">
            {notMarked.length === 0 ? (
              <div className="empty-state">
                <p>Todos marcaron su asistencia 🎉</p>
              </div>
            ) : (
              <ul>
                {notMarked.map(user => (
                  <li key={user.uid} className="user-item not-marked-item">
                    <div className="user-info">
                      <span className="user-name">{user.name || user.displayName || 'Sin nombre'}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Marked Section */}
        <div className="attendance-section marked">
          <div className="section-header">
            <h4>✅ Marcaron QR ({marked.length})</h4>
          </div>
          <div className="users-list">
            {marked.length === 0 ? (
              <div className="empty-state">
                <p>Aún no hay registro de asistencia</p>
              </div>
            ) : (
              <ul>
                {marked.map(user => {
                  const checkin = eventCheckins.find(c => c.userId === user.uid);
                  const checkinTime = checkin?.checkedAt 
                    ? new Date(checkin.checkedAt.toDate()).toLocaleTimeString()
                    : 'Hora desconocida';
                  
                  return (
                    <li key={user.uid} className="user-item marked-item">
                      <div className="user-info">
                        <span className="user-name">{user.name || user.displayName || 'Sin nombre'}</span>
                      </div>
                      <div className="checkin-time">
                        <span className="time-label">Marca:</span>
                        <span className="time-value">{checkinTime}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* No Event Selected Message */}
      {!currentEvent && selectedEventId === '' && (
        <div className="no-event-message">
          <p>👉 Selecciona un evento para ver la asistencia</p>
        </div>
      )}
    </div>
  );
};

export default MealCheckInAttendance;
