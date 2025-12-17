import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { shareQROnWhatsApp } from '../firebase/notifications';
import './QRDisplay.css';

const QRDisplay = ({ userData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && userData.qrId) {
      QRCode.toCanvas(canvasRef.current, userData.qrId, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      }).catch(err => console.error('Error generating QR:', err));
    }
  }, [userData.qrId]);

  const downloadQR = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `QR_${userData.name.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  const handleShareWhatsApp = () => {
    const canvas = canvasRef.current;
    shareQROnWhatsApp(userData.name, canvas.toDataURL('image/png'));
  };

  return (
    <div className="qr-display">
      <div className="qr-container">
        <canvas ref={canvasRef}></canvas>
      </div>

      <div className="qr-info">
        <p><strong>Nombre:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Rol:</strong> {userData.role === 'staff' ? 'Personal' : 'Participante'}</p>
        <p><strong>ID QR:</strong> <code>{userData.qrId}</code></p>
      </div>

      <div className="qr-actions">
        <button className="btn btn-primary" onClick={downloadQR}>
          📥 Descargar QR
        </button>
        <button className="btn btn-success" onClick={handleShareWhatsApp}>
          💬 Compartir en WhatsApp
        </button>
      </div>

      <p className="qr-note">
        Este código QR es único y permanente. Se utiliza para registrar tu asistencia a las comidas del campamento.
      </p>
    </div>
  );
};

export default QRDisplay;
