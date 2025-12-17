import React from 'react';
import './ScheduleView.css';

const ScheduleView = ({ events, isStaff }) => {
  const days = ['Día 1', 'Día 2', 'Día 3'];
  
  const eventsByDay = days.reduce((acc, day) => {
    acc[day] = events.filter(e => e.day === day).sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
    return acc;
  }, {});

  const getMealIcon = (mealType) => {
    const icons = {
      breakfast: '🥐',
      lunch: '🍽️',
      dinner: '🍽️'
    };
    return icons[mealType] || '📅';
  };

  const getMealLabel = (mealType) => {
    const labels = {
      breakfast: 'Desayuno',
      lunch: 'Almuerzo',
      dinner: 'Cena'
    };
    return labels[mealType] || 'Evento';
  };

  return (
    <div className="schedule-view">
      {days.map((day) => (
        <div key={day} className="day-section">
          <h3 className="day-title">{day}</h3>
          <div className="events-list">
            {eventsByDay[day].length > 0 ? (
              eventsByDay[day].map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-icon">
                    {event.mealType ? getMealIcon(event.mealType) : '📅'}
                  </div>
                  <div className="event-content">
                    <h4>{event.title}</h4>
                    <p className="event-time">
                      🕐 {event.startTime} - {event.endTime}
                    </p>
                    {event.mealType && (
                      <p className="event-meal">
                        🍴 {getMealLabel(event.mealType)}
                      </p>
                    )}
                    {event.description && (
                      <p className="event-description">{event.description}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-events">No hay eventos programados para este día</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleView;
