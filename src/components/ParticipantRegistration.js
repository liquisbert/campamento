import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { registerUserWithQR } from '../firebase/auth';
import Toast from './Toast';
import './Auth.css';

const ParticipantRegistration = ({ onClose }) => {
  const [step, setStep] = useState('form'); // form, scanning, processing
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: ''
  });
  const [scannedQR, setScannedQR] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastName, setToastName] = useState('');
  const scannerRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const initializeScanner = () => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader-registration',
      { 
        fps: 10,
        qrbox: { width: 280, height: 280}
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        setScannedQR(decodedText);
        setStep('processing');
      },
      (error) => {
        if (!error.includes('NotFoundException')) {
          console.log('QR Error:', error);
        }
      }
    );

    scannerRef.current = scanner;
  };

  useEffect(() => {
    if (step === 'scanning') {
      initializeScanner();
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {
          console.log('Scanner cleanup:', e);
        }
      }
    };
  }, [step]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    setStep('scanning');
  };

  const handleQRScanned = async () => {
    setLoading(true);
    setError('');

    try {
      if (!scannedQR.trim()) {
        throw new Error('Código QR inválido');
      }

      // Registrar usuario con el QR escaneado
      const result = await registerUserWithQR(
        formData.name,
        scannedQR,
        formData.phoneNumber,
        'participant'
      );

      console.log('✅ Usuario registrado:', result);

      // Mostrar toast de éxito
      setToastName(formData.name);
      setShowToast(true);

      // Resetear y cerrar después de 2 segundos
      setTimeout(() => {
        setFormData({ name: '', phoneNumber: '' });
        setScannedQR('');
        setStep('form');
        if (onClose) onClose();
      }, 2000);

    } catch (err) {
      setError(err.message || 'Error al registrar participante');
      setStep('scanning');
      setScannedQR('');
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
          <h2>👤 Registrar Nuevo Participante</h2>
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

        <div className="registration-form">
          {error && <div className="alert alert-error">{error}</div>}

          {/* STEP 1: Formulario con nombre y teléfono */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Teléfono (para WhatsApp)</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+34 123 456 789"
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                ✓ Continuar
              </button>
            </form>
          )}

          {/* STEP 2: Escaneo de QR */}
          {step === 'scanning' && (
            <div>
              <p className="step-description">
                📱 Escanea el código QR de la manilla que asignarás a <strong>{formData.name}</strong>
              </p>

              <div id="qr-reader-registration" className="qr-reader-container"></div>

              <p className="scanner-hint">Coloca la manilla frente a la cámara</p>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep('form')}
                disabled={loading}
              >
                ← Volver
              </button>
            </div>
          )}

          {/* STEP 3: Procesar QR */}
          {step === 'processing' && (
            <div className="processing-section">
              <p className="step-description">
                ✓ QR Detectado: <code>{scannedQR}</code>
              </p>

              <div className="processing-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={handleQRScanned}
                  disabled={loading}
                >
                  {loading ? '⏳ Registrando...' : '✅ Confirmar Registro'}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setStep('scanning');
                    setScannedQR('');
                    setError('');
                  }}
                  disabled={loading}
                >
                  ↺ Escanear Otro QR
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setStep('form');
                    setScannedQR('');
                    setError('');
                  }}
                  disabled={loading}
                >
                  ← Volver al Formulario
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer-info">
          <p>💡 Solo staff puede registrar nuevos participantes. Los datos se sincronizarán automáticamente.</p>
        </div>
      </div>
    </div>
  );
};

export default ParticipantRegistration;
