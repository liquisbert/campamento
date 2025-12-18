import React, { useState } from 'react';
import QRScanner from './QRScanner';
import Toast from './Toast';
import { getUserByQRId, registerMealCheckIn } from '../firebase/auth';
import './MealCheckIn.css';

const MealCheckIn = () => {
  const [mealType, setMealType] = useState('breakfast');
  const [scannedUser, setScannedUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [toastName, setToastName] = useState('');
  const handleScan = async (qrId) => {
    try {
      const user = await getUserByQRId(qrId);
      if (user) {
        setScannedUser(user);
        
        // Registrar el check-in
        await registerMealCheckIn(user.uid, mealType);
        
        setToastType('success');
        setToastMessage(`Registrado para ${getMealLabel(mealType)}`);
        setToastName(user.name);
        setShowToast(true);
        
        setTimeout(() => {
          setScannedUser(null);
        }, 2000);
      } else {
        setToastType('error');
        setToastMessage('Código QR no encontrado');
        setToastName('');
        setShowToast(true);
      }
    } catch (error) {
      setToastType('error');
      setToastMessage('Error al registrar: ' + error.message);
      setToastName('');
      setShowToast(true);
    }
  };

  const getMealLabel = (type) => {
    const labels = {
      breakfast: 'Desayuno',
      lunch: 'Almuerzo',
      dinner: 'Cena'
    };
    return labels[type] || type;
  };

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

      <div className="checkin-config">
        <div className="form-group">
          <label>Seleccionar Comida</label>
          <select 
            value={mealType} 
            onChange={(e) => setMealType(e.target.value)}
            className="meal-select"
          >
            <option value="breakfast">🥐 Desayuno</option>
            <option value="lunch">🍽️ Almuerzo</option>
            <option value="dinner">🍽️ Cena</option>
          </select>
        </div>
      </div>

      {scannedUser && (
        <div className="checkin-result">
          <div className="result-card">
            <h3>✅ Participante Registrado</h3>
            <p><strong>Nombre:</strong> {scannedUser.name}</p>
            <p><strong>Email:</strong> {scannedUser.email}</p>
            <p><strong>Comida:</strong> {getMealLabel(mealType)}</p>
            <p className="result-time">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      <div className="scanner-section">
        <h3>📱 Escanear QR</h3>
        <QRScanner onScan={handleScan} />
      </div>

      <div className="checkin-info">
        <p>
          📱 Utiliza la cámara para escanear el código QR del participante. 
          El sistema registrará automáticamente su asistencia a la comida seleccionada.
        </p>
      </div>
    </div>
  );
};

export default MealCheckIn;
