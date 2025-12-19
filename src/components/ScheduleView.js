import React, { useState } from 'react';
import './ScheduleView.css';
import { updateScheduleEvent, deleteScheduleEvent } from '../firebase/schedule';

const ScheduleView = ({ events, isStaff, onEventsUpdate }) => {
  const dayLabels = ['Sábado', 'Domingo', 'Lunes', 'Martes'];
  const [selectedDay, setSelectedDay] = useState('Día 1');
  const [editingEvent, setEditingEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });
  
  const eventsByDay = dayLabels.reduce((acc, label, index) => {
    const dayKey = `Día ${index + 1}`;
    acc[label] = events.filter(e => e.day === dayKey).sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
    return acc;
  }, {});

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const handleEventClick = (event) => {
    if (isStaff) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description || '',
        startTime: event.startTime,
        endTime: event.endTime
      });
      setIsModalOpen(true);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEvent = async () => {
    if (!formData.title || !formData.startTime || !formData.endTime) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      await updateScheduleEvent(editingEvent.id, {
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime
      });
      
      if (onEventsUpdate) {
        onEventsUpdate();
      }
      
      setIsModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      alert('Error al actualizar el evento');
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      return;
    }

    try {
      await deleteScheduleEvent(editingEvent.id);
      
      if (onEventsUpdate) {
        onEventsUpdate();
      }
      
      setIsModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      alert('Error al eliminar el evento');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="schedule-view">
      <div className="schedule-header">
        <label htmlFor="day-select" className="day-label">Selecciona un día:</label>
        <select 
          id="day-select" 
          className="day-dropdown" 
          value={selectedDay}
          onChange={handleDayChange}
        >
          {dayLabels.map((label, index) => (
            <option key={label} value={`Día ${index + 1}`}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="day-section">
        <h3 className="day-title">{dayLabels[parseInt(selectedDay.split(' ')[1]) - 1]}</h3>
        <div className="events-list">
          {eventsByDay[dayLabels[parseInt(selectedDay.split(' ')[1]) - 1]].length > 0 ? (
            eventsByDay[dayLabels[parseInt(selectedDay.split(' ')[1]) - 1]].map((event) => (
              <div 
                key={event.id} 
                className={`event-card ${isStaff ? 'event-card-editable' : ''}`}
                onClick={() => handleEventClick(event)}
              >
                <div className="event-content">
                  <div className="event-header">
                    <h4>{event.title}</h4>
                    <p className="event-time">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
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

      {isModalOpen && editingEvent && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Evento</h2>
              <button className="close-btn" onClick={handleCloseModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="title">Título *</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Título del evento"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Descripción del evento (opcional)"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startTime">Hora de inicio *</label>
                  <input
                    id="startTime"
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endTime">Hora de fin *</label>
                  <input
                    id="endTime"
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-delete" 
                onClick={handleDeleteEvent}
              >
                Eliminar
              </button>
              <div className="btn-group">
                <button 
                  className="btn-cancel" 
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-save" 
                  onClick={handleSaveEvent}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
