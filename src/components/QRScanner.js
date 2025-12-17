import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan, onError }) => {
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
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
  }, [isScanning, onScan, onError]);

  return (
    <div className="qr-scanner">
      {!isScanning ? (
        <button 
          className="btn btn-primary"
          onClick={() => setIsScanning(true)}
        >
          🎥 Iniciar Scanner QR
        </button>
      ) : (
        <>
          <div id="qr-reader" style={{ width: '100%' }}></div>
          <button 
            className="btn btn-danger"
            onClick={() => setIsScanning(false)}
          >
            ❌ Detener Scanner
          </button>
        </>
      )}
    </div>
  );
};

export default QRScanner;
