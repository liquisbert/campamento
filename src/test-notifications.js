import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import QRCode from 'qrcode';

// Configurar Firebase (asegúrate de que tu .env tenga las credenciales correctas)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Script para probar el envío de notificaciones
 * Uso: node test-notifications.js
 */

async function testNotifications() {
  console.log('=================================');
  console.log('🧪 Prueba de Notificaciones');
  console.log('=================================\n');

  // Datos de prueba
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const testUser = {
    name: 'Usuario de Prueba',
    email: testEmail,
    phone: '+56912345678', // Cambia esto por tu número
    qrId: `test-qr-${Date.now()}`
  };

  try {
    console.log('1️⃣ Creando usuario en Firebase...');
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    const uid = userCredential.user.uid;
    console.log(`✅ Usuario creado: ${uid}\n`);

    console.log('2️⃣ Guardando en Firestore...');
    await addDoc(collection(db, 'users'), {
      uid: uid,
      email: testUser.email,
      name: testUser.name,
      phoneNumber: testUser.phone,
      qrId: testUser.qrId,
      role: 'participant',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      mealCheckIns: {
        breakfast: [],
        lunch: [],
        dinner: []
      }
    });
    console.log('✅ Datos guardados en Firestore\n');

    console.log('3️⃣ Generando QR...');
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(testUser.qrId)}`;
    console.log(`✅ QR generado: ${qrUrl}\n`);

    console.log('4️⃣ Cloud Functions debería haber enviado:');
    console.log(`📧 Email a: ${testUser.email}`);
    console.log(`💬 WhatsApp a: ${testUser.phone}`);
    console.log(`🔖 Con QR ID: ${testUser.qrId}\n`);

    console.log('=================================');
    console.log('✨ Prueba completada');
    console.log('=================================');
    console.log('\n📝 CHECKLIST:');
    console.log('[ ] ¿Llegó email a ' + testUser.email + '?');
    console.log('[ ] ¿Llegó WhatsApp a ' + testUser.phone + '?');
    console.log('[ ] ¿Se ve el QR en los mensajes?');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar prueba
testNotifications();
