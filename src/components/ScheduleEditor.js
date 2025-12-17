import React, { useState } from 'react';
import ScheduleView from './ScheduleView';
import './ScheduleEditor.css';

const ScheduleEditor = ({ events, onAdd, onUpdate, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '08:00',
    endTime: '09:00',
    day: 'Día 1',
    mealType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onAdd(formData);
    }
    setFormData({
      title: '',
      description: '',
      startTime: '08:00',
      endTime: '09:00',
      day: 'Día 1',
      mealType: ''
    });
    setShowForm(false);
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      startTime: '08:00',
      endTime: '09:00',
      day: 'Día 1',
      mealType: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="schedule-editor">
      <div className="editor-controls">
        <button 
          className="btn btn-success"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancelar' : '➕ Agregar Evento'}
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <h3>{editingId ? 'Editar Evento' : 'Crear Nuevo Evento'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Título del Evento *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Ceremonia de Inauguración"
                />
              </div>

              <div className="form-group">
                <label>Día *</label>
                <select name="day" value={formData.day} onChange={handleChange} required>
                  <option value="Día 1">Día 1</option>
                  <option value="Día 2">Día 2</option>
                  <option value="Día 3">Día 3</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detalles adicionales del evento"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Hora de Inicio *</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hora de Fin *</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo de Comida</label>
                <select name="mealType" value={formData.mealType} onChange={handleChange}>
                  <option value="">Sin comida</option>
                  <option value="breakfast">🥐 Desayuno</option>
                  <option value="lunch">🍽️ Almuerzo</option>
                  <option value="dinner">🍽️ Cena</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? '💾 Actualizar' : '✅ Crear Evento'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="schedule-list">
        <h3>Cronograma Actual</h3>
        <ScheduleView events={events} isStaff={true} />
        
        {events.length > 0 && (
          <div className="events-management">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Día</th>
                  <th>Hora</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.day}</td>
                    <td>{event.startTime} - {event.endTime}</td>
                    <td>{event.mealType ? '🍴' : '📅'}</td>
                    <td className="actions">
                      <button 
                        className="btn-small btn-edit"
                        onClick={() => handleEdit(event)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-small btn-delete"
                        onClick={() => onDelete(event.id)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleEditor;
