import React, { useState, useEffect } from 'react';
import QRScanner from './QRScanner';
import Toast from './Toast';
import { getUserByQRId } from '../firebase/auth';
import { 
  getMealEvents, 
  createMealEvent, 
  registerMealCheckInEvent
} from '../firebase/schedule';
import './MealCheckIn.css';

const MealCheckIn = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [toastName, setToastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showingLoading, setShowingLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEventName, setNewEventName] = useState('');

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEvents = async () => {
    try {
      const fetchedEvents = await getMealEvents();
      setEvents(fetchedEvents);
      if (fetchedEvents.length > 0 && !selectedEventId) {
        setSelectedEventId(fetchedEvents[0].id);
      }
    } catch (error) {
      console.error('Error cargando eventos:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEventName.trim()) {
      setToastType('error');
      setToastMessage('Ingresa un nombre para el evento');
      setShowToast(true);
      return;
    }

    try {
      const eventId = await createMealEvent(newEventName, '', '');
      const eventNameCopy = newEventName;
      setNewEventName('');
      setShowModal(false);
      setSelectedEventId(eventId);
      await loadEvents();
      setToastType('success');
      setToastMessage(`Evento "${eventNameCopy}" creado exitosamente`);
      setShowToast(true);
    } catch (error) {
      setToastType('error');
      setToastMessage('Error al crear evento: ' + error.message);
      setShowToast(true);
    }
  };

  const handleScan = async (qrId) => {
    if (!selectedEventId) {
      setToastType('error');
      setToastMessage('Selecciona un evento primero');
      setShowToast(true);
      return;
    }

    const event = events.find(e => e.id === selectedEventId);

    setShowingLoading(true);
    setIsLoading(true);

    try {
      const user = await getUserByQRId(qrId);
      if (user) {
        await registerMealCheckInEvent(selectedEventId, user.uid, user.name);
        
        setToastType('success');
        setToastMessage(`${user.name} registrado en ${event.title}`);
        setToastName(user.name);
        setShowToast(true);
      } else {
        setToastType('error');
        setToastMessage('Código QR no encontrado');
        setShowToast(true);
      }
    } catch (error) {
      setToastType('error');
      setToastMessage('Error al registrar: ' + error.message);
      setShowToast(true);
    } finally {
      setShowingLoading(false);
      setIsLoading(false);
    }
  };

  const currentEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="meal-checkin">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          participantName={toastName}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Event Header Card */}
      <div className="event-header-card">
        <h2 className="event-title">
          {currentEvent ? currentEvent.title : 'Selecciona un evento'}
        </h2>
        <div className="event-selector-compact">
          <select 
            value={selectedEventId} 
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="event-select-compact"
            disabled={showingLoading}
          >
            <option value="">Selecciona evento...</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="btn-new-event-compact"
            disabled={showingLoading}
            title="Crear nuevo evento"
          >
            ➕
          </button>
        </div>
      </div>

      {/* Modal para crear evento */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Crear Nuevo Evento</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  setNewEventName('');
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Nombre del evento"
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                className="modal-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateEvent();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  setNewEventName('');
                }}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateEvent}
              >
                Guardar Evento
              </button>
            </div>
          </div>
        </div>
      )}

      {showingLoading && (
        <div className="scanner-loading-overlay">
          <div className="spinner"></div>
          <p>Validando QR...</p>
        </div>
      )}

      <div className="scanner-section">
        <h3>📱 Escanear QR</h3>
        <QRScanner onScan={handleScan} disabled={isLoading || (currentEvent && currentEvent.finished)} />
      </div>

      <div className="checkin-info">
        <p>
          📱 Utiliza la cámara para escanear el código QR del participante. 
          El sistema registrará automáticamente su asistencia al evento seleccionado.
        </p>
      </div>
    </div>
  );
};

export default MealCheckIn;
