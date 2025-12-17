const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

// Inicializar Firebase Admin
admin.initializeApp();

// Configurar cliente de Twilio para WhatsApp
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID || 'tu-account-sid',
  process.env.TWILIO_AUTH_TOKEN || 'tu-auth-token'
);

// Cloud Function: Enviar WhatsApp al registrarse
exports.sendRegistrationNotifications = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    const { phoneNumber, name, qrId } = userData;

    try {
      // Enviar WhatsApp (solo si tiene teléfono)
      if (phoneNumber && process.env.TWILIO_ACCOUNT_SID) {
        try {
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrId)}`;
          
          await twilioClient.messages.create({
            body: `¡Hola ${name}! 👋\n\nTu registro en el campamento ha sido exitoso. 🏕️\n\nTu código QR:\n${qrUrl}\n\n¡Que disfrutes! 🎉`,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`,
            to: `whatsapp:${phoneNumber}`
          });
          console.log('WhatsApp enviado a:', phoneNumber);
        } catch (whatsappError) {
          console.error('Error enviando WhatsApp:', whatsappError.message);
        }
      }

      return { success: true, message: 'Notificación enviada' };
    } catch (error) {
      console.error('Error en sendRegistrationNotifications:', error);
      throw new functions.https.HttpsError('internal', error.message);
    }
  });

// HTTP Endpoint: Enviar WhatsApp a un participante (por staff)
exports.sendWhatsAppNotification = functions.https.onCall(async (data, context) => {
  const { phoneNumber, name, qrId } = data;

  if (!phoneNumber || !name || !qrId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Faltan campos requeridos: phoneNumber, name, qrId'
    );
  }

  if (!process.env.TWILIO_ACCOUNT_SID) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Twilio no está configurado'
    );
  }

  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrId)}`;

    const message = await twilioClient.messages.create({
      body: `¡Hola ${name}! 👋\n\nTu registro en el campamento ha sido exitoso. 🏕️\n\nTu código QR:\n${qrUrl}\n\n¡Que disfrutes! 🎉`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`,
      to: `whatsapp:${phoneNumber}`
    });

    console.log('WhatsApp enviado a:', phoneNumber, 'SID:', message.sid);
    return { success: true, message: 'WhatsApp enviado correctamente', messageSid: message.sid };
  } catch (error) {
    console.error('Error enviando WhatsApp:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
