import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from './config';
import { sendWhatsAppDirect, generateQRUrl } from './twilio';
import { 
  USE_MOCK_DATA, 
  simulateNetworkDelay,
  getStoredUsers,
  getStoredSchedule,
  saveStoredUsers,
  saveStoredSchedule
} from './offlineUtils';

// Generar un UUID simple
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
};

// Crear usuario (Registro) - Solo Staff puede registrar
// Requiere: name, qrId (escaneado)
// El GUID del QR se asigna como ID del usuario
export const registerUserWithQR = async (name, qrId, phoneNumber = '', role = 'participant') => {
  try {
    if (USE_MOCK_DATA) {
      await simulateNetworkDelay(500);
      
      // Verificar que el qrId no esté en uso
      const users = getStoredUsers();
      const existingUser = users.find(u => u.qrId === qrId);
      if (existingUser) {
        throw new Error('Este código QR ya está asignado a otro usuario');
      }

      // Generar datos del usuario
      const sanitizedName = name.toLowerCase().replace(/\s+/g, '.');
      const email = `${sanitizedName}.${qrId.split('-')[0]}@campamento.local`;
      const tempPassword = Math.random().toString(36).slice(-12);
      const uid = uuidv4();

      const newUser = {
        uid: uid,
        email: email,
        name: name,
        phoneNumber: phoneNumber,
        role: role,
        qrId: qrId,
        createdAt: new Date(),
        updatedAt: new Date(),
        mealCheckIns: {
          breakfast: [],
          lunch: [],
          dinner: []
        }
      };

      // Guardar en localStorage
      users.push(newUser);
      saveStoredUsers(users);

      console.log('✅ Usuario registrado (modo offline):', newUser);
      return { user: newUser, qrId, email, tempPassword };
    }

    // Verificar que el qrId no esté en uso
    const existingUser = await getUserByQRId(qrId);
    if (existingUser) {
      throw new Error('Este código QR ya está asignado a otro usuario');
    }

    // Generar email temporal basado en el nombre y qrId
    const sanitizedName = name.toLowerCase().replace(/\s+/g, '.');
    const email = `${sanitizedName}.${qrId.split('-')[0]}@campamento.local`;

    // Generar contraseña temporal aleatoria
    const tempPassword = Math.random().toString(36).slice(-12);

    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
    const user = userCredential.user;

    // Guardar datos del usuario en Firestore con el qrId como identificador
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      name: name,
      phoneNumber: phoneNumber,
      role: role,
      qrId: qrId,  // El GUID del QR escaneado
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      mealCheckIns: {
        breakfast: [],
        lunch: [],
        dinner: []
      }
    });

    // Enviar WhatsApp con el código QR si hay teléfono
    if (phoneNumber && phoneNumber.trim()) {
      try {
        const qrUrl = generateQRUrl(qrId);
        await sendWhatsAppDirect(
          phoneNumber,
          `¡Hola ${name}! 👋\n\nHas sido registrado en el campamento. 🏕️\n\n📱 Tu código QR está en la imagen adjunta.\n🔑 Usa tu manilla para acceder a la app.\n\n¡Que disfrutes! 🎉`,
          qrUrl
        );
        console.log('✅ WhatsApp enviado a', phoneNumber);
      } catch (whatsappError) {
        console.error('⚠️ WhatsApp no se envió:', whatsappError);
        // No lanzamos error - el registro fue exitoso
      }
    }

    return { user, qrId, email, tempPassword };
  } catch (error) {
    throw error;
  }
};

// Crear usuario (Legacy - mantener para compatibilidad)
export const registerUser = async (email, password, name, phoneNumber = '', role = 'participant') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const qrId = uuidv4();

    // Guardar datos del usuario
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      name: name,
      phoneNumber: phoneNumber,
      role: role,
      qrId: qrId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      mealCheckIns: {
        breakfast: [],
        lunch: [],
        dinner: []
      }
    });

    // Enviar WhatsApp directamente si hay teléfono
    if (phoneNumber && phoneNumber.trim()) {
      try {
        const qrUrl = generateQRUrl(qrId);
        await sendWhatsAppDirect(
          phoneNumber,
          `¡Hola ${name}! 👋\n\nTu registro en el campamento ha sido exitoso. 🏕️\n\nTu código QR está en la imagen adjunta. ¡Que disfrutes! 🎉`,
          qrUrl
        );
        console.log('✅ WhatsApp enviado a', phoneNumber);
      } catch (whatsappError) {
        console.error('⚠️ WhatsApp no se envió:', whatsappError);
        // No lanzamos error aquí - el registro fue exitoso, solo el WhatsApp falló
      }
    }

    return { user, qrId };
  } catch (error) {
    throw error;
  }
};

// Iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Iniciar sesión por QR (usando GUID del QR)
export const loginByQR = async (qrId) => {
  try {
    if (USE_MOCK_DATA) {
      await simulateNetworkDelay();
      const users = getStoredUsers();
      const userData = users.find(u => u.qrId === qrId);
      
      if (!userData) {
        throw new Error('QR no encontrado. Verifica que el código sea válido.');
      }
      
      return userData;
    }

    // Buscar usuario por QR ID
    const userData = await getUserByQRId(qrId);
    
    if (!userData) {
      throw new Error('QR no encontrado. Verifica que el código sea válido.');
    }

    // Obtener usuario de Firebase Auth
    const user = auth.currentUser;
    if (!user) {
      // Si no hay usuario autenticado, necesitamos crear una sesión anónima o usar custom auth
      // Por ahora, retornamos los datos del usuario para que se autentique
      return userData;
    }

    return userData;
  } catch (error) {
    throw error;
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Obtener datos del usuario actual
export const getCurrentUserData = async (uid) => {
  try {
    if (USE_MOCK_DATA) {
      await simulateNetworkDelay();
      const users = getStoredUsers();
      return users.find(u => u.uid === uid) || null;
    }

    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Obtener usuario por QR ID
export const getUserByQRId = async (qrId) => {
  try {
    if (USE_MOCK_DATA) {
      await simulateNetworkDelay();
      const users = getStoredUsers();
      return users.find(u => u.qrId === qrId) || null;
    }

    const q = query(collection(db, 'users'), where('qrId', '==', qrId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { uid: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Actualizar rol del usuario
export const updateUserRole = async (uid, newRole) => {
  try {
    if (USE_MOCK_DATA) {
      await simulateNetworkDelay(300);
      const users = getStoredUsers();
      const userIndex = users.findIndex(u => u.uid === uid);
      if (userIndex !== -1) {
        users[userIndex].role = newRole;
        users[userIndex].updatedAt = new Date();
        saveStoredUsers(users);
      }
      return;
    }

    await updateDoc(doc(db, 'users', uid), {
      role: newRole,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    throw error;
  }
};

// Obtener todos los usuarios
export const getAllUsers = async () => {
  try {
    if (USE_MOCK_DATA) {
      await simulateNetworkDelay();
      return getStoredUsers();
    }

    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ uid: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    throw error;
  }
};

// Registrar check-in de comida
export const registerMealCheckIn = async (uid, mealType, timestamp = Timestamp.now()) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userData = await getDoc(userRef);
    const mealCheckIns = userData.data().mealCheckIns || {
      breakfast: [],
      lunch: [],
      dinner: []
    };

    mealCheckIns[mealType].push({
      timestamp: timestamp,
      date: timestamp.toDate().toLocaleDateString()
    });

    await updateDoc(userRef, {
      mealCheckIns: mealCheckIns,
      updatedAt: Timestamp.now()
    });

    return true;
  } catch (error) {
    throw error;
  }
};

// Monitorear estado de autenticación
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
