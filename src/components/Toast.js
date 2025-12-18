import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000, participantName = '' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === 'success' && <span className="toast-icon">✅</span>}
        {type === 'error' && <span className="toast-icon">❌</span>}
        {type === 'info' && <span className="toast-icon">ℹ️</span>}
        
        <div className="toast-message">
          {message}
          {participantName && <div className="toast-name">{participantName}</div>}
        </div>
      </div>
    </div>
  );
};

export default Toast;
