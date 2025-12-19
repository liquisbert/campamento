import React, { useState } from 'react';
import { registerUser } from '../firebase/auth';
import Toast from './Toast';
import './Auth.css';

const ParticipantRegistration = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastName, setToastName] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Generar contraseña temporal si no la proporciona
      const password = formData.password || Math.random().toString(36).slice(-8);

      // Registrar usuario (esto ya envía WhatsApp en auth.js)
      await registerUser(
        formData.email,
        password,
        formData.name,
        formData.phoneNumber,
        'participant'
      );

      // Mostrar toast de éxito
      setToastName(formData.name);
      setShowToast(true);

      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
      });

      // Cerrar después de 2 segundos
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al registrar participante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {showToast && (
        <Toast
          message="Participante registrado correctamente. ¡WhatsApp enviado!"
          type="success"
          participantName={toastName}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Registrar Nuevo Participante</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {loading && (
          <div className="loader-overlay">
            <div className="loader">
              <div className="spinner"></div>
              <p>Registrando participante...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label>Nombre Completo *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Juan Pérez"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="juan@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Teléfono (para WhatsApp) *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="78567887"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Contraseña (opcional - se genera automática)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Dejar vacío para generar automáticamente"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Registrando...' : '✅ Registrar Participante'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParticipantRegistration;
