// Configuración directa de Twilio
const accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.REACT_APP_TWILIO_WHATSAPP_NUMBER;

const TWILIO_API_URL = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

/**
 * Envía un mensaje WhatsApp con imagen del QR usando Twilio directamente
 * @param {string} phoneNumber - Número del participante (ej: +56912345678)
 * @param {string} message - Mensaje a enviar
 * @param {string} qrUrl - URL del código QR
 */
export const sendWhatsAppDirect = async (phoneNumber, message, qrUrl) => {
  try {
    if (!accountSid || !authToken || !twilioWhatsAppNumber) {
      throw new Error(
        'Credenciales de Twilio no configuradas en .env: ' +
        'REACT_APP_TWILIO_ACCOUNT_SID, REACT_APP_TWILIO_AUTH_TOKEN, REACT_APP_TWILIO_WHATSAPP_NUMBER'
      );
    }

    // Formatear números con prefijo whatsapp:
    const toNumber = `whatsapp:${phoneNumber}`;
    const fromNumber = `whatsapp:${twilioWhatsAppNumber}`;

    // Crear parámetros de la solicitud
    const params = new URLSearchParams();
    params.append('From', fromNumber);
    params.append('To', toNumber);
    params.append('Body', message);
    
    // Agregar la imagen del QR como media
    params.append('MediaUrl', qrUrl);

    // Crear header con autenticación Basic Auth
    const auth = btoa(`${accountSid}:${authToken}`);

    // Hacer solicitud a Twilio
    const response = await fetch(TWILIO_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Twilio Error: ${error.message}`);
    }

    const data = await response.json();
    console.log('✅ WhatsApp con imagen enviado correctamente:', {
      messageSid: data.sid,
      to: data.to,
      status: data.status,
    });

    return data.sid;
  } catch (error) {
    console.error('❌ Error al enviar WhatsApp:', error);
    throw error;
  }
};

/**
 * Genera la URL del código QR como imagen
 * @param {string} qrId - ID único del participante
 * @returns {string} URL de la imagen del QR
 */
export const generateQRUrl = (qrId) => {
  // Retorna URL de imagen PNG del QR
  return `https://api.qrserver.com/v1/create-qr-code/?format=png&size=300x300&data=${qrId}`;
};
