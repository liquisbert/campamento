// Utilidades para notificaciones
// Sistema de WhatsApp ahora es directo (sin Cloud Functions)

// Compartir QR en WhatsApp (cliente-side)
export const shareQROnWhatsApp = (name, qrImage) => {
  const message = `Hola, aquí está mi código QR del campamento: ${name}`;
  const whatsappURL = `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
};

