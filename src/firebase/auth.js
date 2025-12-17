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

// Generar un UUID simple
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
};

// Crear usuario (Registro)
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
