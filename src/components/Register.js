import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir automáticamente al login después de 2 segundos
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="registration-disabled-message">
          <h2>📋 Registro de Participantes</h2>
          
          <div className="info-box">
            <p className="info-title">ℹ️ Información Importante</p>
            <p className="info-text">
              El registro de participantes <strong>solo puede ser realizado por el personal de staff</strong> del campamento.
            </p>
            <p className="info-text">
              Si eres un participante, <strong>solicita a un miembro del staff</strong> que te registre con tu manilla de código QR.
            </p>
          </div>

          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              ← Volver al Inicio de Sesión
            </button>
          </div>

          <p className="redirect-notice">
            Redirigiendo al inicio de sesión en breve...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
