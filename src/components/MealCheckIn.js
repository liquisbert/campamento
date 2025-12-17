import React, { useState } from 'react';
import QRScanner from './QRScanner';
import { getUserByQRId, registerMealCheckIn } from '../firebase/auth';
import './MealCheckIn.css';

const MealCheckIn = () => {
  const [mealType, setMealType] = useState('breakfast');
  const [scannedUser, setScannedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleScan = async (qrId) => {
    try {
      const user = await getUserByQRId(qrId);
      if (user) {
        setScannedUser(user);
        
        // Registrar el check-in
        await registerMealCheckIn(user.uid, mealType);
        
        setMessageType('success');
        setMessage(`✅ ${user.name} registrado para ${getMealLabel(mealType)}`);
        
        setTimeout(() => {
          setScannedUser(null);
          setMessage('');
        }, 3000);
      } else {
        setMessageType('error');
        setMessage('❌ Código QR no encontrado');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('❌ Error al registrar: ' + error.message);
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

      {message && (
        <div className={`alert alert-${messageType}`}>
          {message}
        </div>
      )}

      {scannedUser && (
        <div className="checkin-result">
          <div className="result-card">
            <h3>Participante Registrado</h3>
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
        <h3>Escanear QR</h3>
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
