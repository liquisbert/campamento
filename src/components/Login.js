import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { loginByQR, loginUser } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInAnonymously } from 'firebase/auth';
import './Auth.css';

const Login = () => {
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualInput, setManualInput] = useState(false);
  const [emailLogin, setEmailLogin] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  const initializeScanner = () => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10,
        qrbox: { width: 280, height: 280}
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        // QR leído exitosamente
        await handleQRScanned(decodedText);
      },
      (error) => {
        // Solo loguear errores de formato, no los de scanning
        if (!error.includes('NotFoundException')) {
          console.log('QR Error:', error);
        }
      }
    );

    scannerRef.current = scanner;
  };

  useEffect(() => {
    if (!manualInput && !scanned) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualInput, scanned]);

  const handleQRScanned = async (qrId) => {
    setScanned(true);
    setLoading(true);
    setError('');

    try {
      // Buscar usuario por QR
      const userData = await loginByQR(qrId);
      
      if (!userData) {
        throw new Error('Usuario no encontrado');
      }

      // Autenticarse anónimamente para mantener la sesión
      await signInAnonymously(auth);
      
      // Guardar datos del usuario en localStorage para acceso rápido
      localStorage.setItem('participantData', JSON.stringify(userData));
      localStorage.setItem('participantUID', userData.uid);

      console.log('✅ Inicio de sesión exitoso:', userData.name);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al escanear QR');
      setScanned(false);
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    
    if (!qrInput.trim()) {
      setError('Por favor ingresa un código QR válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userData = await loginByQR(qrInput);
      
      if (!userData) {
        throw new Error('Usuario no encontrado');
      }

      // Autenticarse anónimamente
      await signInAnonymously(auth);
      
      // Guardar datos del usuario
      localStorage.setItem('participantData', JSON.stringify(userData));
      localStorage.setItem('participantUID', userData.uid);

      console.log('✅ Inicio de sesión exitoso:', userData.name);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Código QR inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(formData.email, formData.password);
      console.log('✅ Inicio de sesión exitoso');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container qr-auth">
      <div className="qr-login-wrapper">
        {/* Header */}
        <div className="qr-header">
          <div className="qr-header-icon">🎫</div>
          <h1>Escanear Manilla</h1>
          <p>Accede al campamento escaneando tu código QR</p>
        </div>

        {/* Contenido Principal */}
        {!emailLogin ? (
          <>
            {!manualInput ? (
              <div className="qr-scanner-section">
                {error && <div className="alert alert-error">{error}</div>}

                {!scanned ? (
                  <>
                    <div id="qr-reader" className="qr-reader-container"></div>
                    <p className="scanner-hint">Coloca la manilla frente a la cámara</p>
                  </>
                ) : (
                  <div className="scanner-loading">
                    <div className="spinner"></div>
                    <p>Verificando código...</p>
                  </div>
                )}

                <div className="qr-actions-inline">
                  <button
                    type="button"
                    className="btn-manual-toggle"
                    onClick={() => setManualInput(true)}
                  >
                    📝 Ingresar manualmente
                  </button>
                </div>
              </div>
            ) : (
              <div className="manual-input-full">
                {error && <div className="alert alert-error">{error}</div>}
                
                <form onSubmit={handleManualSubmit}>
                  <div className="form-group">
                    <label>Código QR:</label>
                    <input
                      type="text"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      placeholder="Pega el código aquí..."
                      disabled={loading}
                      autoFocus
                    />
                  </div>

                  <div className="button-group">
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={loading || !qrInput.trim()}
                    >
                      {loading ? '⏳ Verificando...' : '✓ Ingresar'}
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setManualInput(false);
                        setQrInput('');
                        setScanned(false);
                      }}
                    >
                      ← Volver a escanear
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="manual-input-full">
            {error && <div className="alert alert-error">{error}</div>}
            
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  placeholder="tu@email.com"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleEmailChange}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <div className="button-group">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading || !formData.email || !formData.password}
                >
                  {loading ? '⏳ Iniciando...' : '✓ Entrar'}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEmailLogin(false);
                    setFormData({ email: '', password: '' });
                  }}
                >
                  ← Volver
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="qr-footer">
          {!emailLogin ? (
            <>
              <p>💡 Si aún no tienes manilla, contacta al personal</p>
              <button 
                className="btn-footer-login"
                onClick={() => setEmailLogin(true)}
              >
                🔑 Acceso alternativo
              </button>
            </>
          ) : (
            <>
              <p>💡 ¿Tienes manilla? Vuelve al escaneo QR</p>
              <button 
                className="btn-footer-login"
                onClick={() => setEmailLogin(false)}
              >
                📱 Escanear QR
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
