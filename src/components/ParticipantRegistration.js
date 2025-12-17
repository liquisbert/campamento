import React, { useState } from 'react';
import { registerUser } from '../firebase/auth';
import { sendWhatsAppDirect, generateQRUrl } from '../firebase/twilio';
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
  const [success, setSuccess] = useState('');

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
      const result = await registerUser(
        formData.email,
        password,
        formData.name,
        formData.phoneNumber,
        'participant'
      );

      // Si llegamos aquí, el registro fue exitoso
      // El WhatsApp ya se envió automáticamente en registerUser()
      setSuccess(`✅ Participante "${formData.name}" registrado correctamente. ¡WhatsApp enviado!`);

      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
      });

      // Cerrar después de 3 segundos
      setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error al registrar participante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Registrar Nuevo Participante</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label>Nombre Completo *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Juan Pérez"
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
              placeholder="+56912345678"
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
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar Participante'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParticipantRegistration;
