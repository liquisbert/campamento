import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './QRScanner.css';

const QRScanner = ({ onScan, onError, disabled = false }) => {
  const [isScanning, setIsScanning] = useState(true);

  // Calcula el tamaño del qrbox según la pantalla
  const getQrBoxSize = () => {
    const width = window.innerWidth;
    if (width < 480) {
      return { width: 200, height: 200 };
    } else if (width < 768) {
      return { width: 220, height: 220 };
    } else {
      return { width: 250, height: 250 };
    }
  };

  useEffect(() => {
    if (!isScanning || disabled) return;

    const qrbox = getQrBoxSize();
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10, 
        qrbox: qrbox,
        aspectRatio: 1.0,
        disableFlip: false
      },
      false
    );

    const success = (decodedText) => {
      onScan(decodedText);
      scanner.clear();
      setIsScanning(false);
    };

    const error = (err) => {
      if (err && err !== 'QR code parse error') {
        console.error('Scanner error:', err);
        onError?.(err);
      }
    };

    scanner.render(success, error);

    return () => {
      scanner.clear().catch((err) => console.error('Error clearing scanner:', err));
    };
  }, [isScanning, onScan, onError, disabled]);

  return (
    <div className={`qr-scanner ${disabled ? 'disabled' : ''}`}>
      {isScanning && !disabled ? (
        <div className="scanner-active">
          <div id="qr-reader" style={{ width: '100%' }}></div>
          <button 
            className="btn btn-danger btn-stop"
            onClick={() => setIsScanning(false)}
            disabled={disabled}
          >
            ❌ Detener Scanner
          </button>
        </div>
      ) : (
        <button 
          className="btn btn-primary btn-start"
          onClick={() => !disabled && setIsScanning(true)}
          disabled={disabled}
        >
          {disabled ? '🔒 Scanner Deshabilitado' : '🎥 Reanudar Scanner'}
        </button>
      )}
    </div>
  );
};

export default QRScanner;
