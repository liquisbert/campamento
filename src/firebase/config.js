import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Reemplaza con tu configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "tu-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "tu-auth-domain",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "tu-project-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "tu-storage-bucket",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "tu-sender-id",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "tu-app-id"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
