import { 
  doc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  deleteDoc,
  Timestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './config';

// Crear evento en el cronograma
export const createScheduleEvent = async (title, description, startTime, endTime, day, mealType = null) => {
  try {
    const eventId = `${Date.now()}-${Math.random()}`;
    await setDoc(doc(db, 'schedule', eventId), {
      id: eventId,
      title: title,
      description: description,
      startTime: startTime,
      endTime: endTime,
      day: day,
      mealType: mealType,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return eventId;
  } catch (error) {
    throw error;
  }
};

// Obtener eventos del cronograma
export const getScheduleEvents = async () => {
  try {
    const q = query(collection(db, 'schedule'), orderBy('day', 'asc'));
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    return events;
  } catch (error) {
    throw error;
  }
};

// Actualizar evento del cronograma
export const updateScheduleEvent = async (eventId, updates) => {
  try {
    await updateDoc(doc(db, 'schedule', eventId), {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    throw error;
  }
};

// Eliminar evento del cronograma
export const deleteScheduleEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, 'schedule', eventId));
  } catch (error) {
    throw error;
  }
};

// Obtener eventos por día
export const getScheduleEventsByDay = async (day) => {
  try {
    const events = await getScheduleEvents();
    return events.filter(event => event.day === day);
  } catch (error) {
    throw error;
  }
};

/* ===================================
   MEAL EVENTS - Eventos de Comidas
   =================================== */

// Crear evento de comida
export const createMealEvent = async (title, description, mealType, finished = false) => {
  try {
    const eventId = `meal-${Date.now()}-${Math.random()}`;
    await setDoc(doc(db, 'mealEvents', eventId), {
      id: eventId,
      title: title,
      description: description,
      mealType: mealType,
      finished: finished,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return eventId;
  } catch (error) {
    throw error;
  }
};

// Obtener todos los eventos de comida
export const getMealEvents = async () => {
  try {
    const q = query(collection(db, 'mealEvents'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    return events;
  } catch (error) {
    throw error;
  }
};

// Obtener evento de comida por ID
export const getMealEvent = async (eventId) => {
  try {
    const docSnap = await getDocs(query(collection(db, 'mealEvents')));
    const event = docSnap.docs.find(doc => doc.id === eventId);
    return event ? { id: event.id, ...event.data() } : null;
  } catch (error) {
    throw error;
  }
};

// Actualizar evento de comida
export const updateMealEvent = async (eventId, updates) => {
  try {
    await updateDoc(doc(db, 'mealEvents', eventId), {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    throw error;
  }
};

// Finalizar evento de comida
export const finishMealEvent = async (eventId) => {
  try {
    await updateMealEvent(eventId, { finished: true });
  } catch (error) {
    throw error;
  }
};

// Registrar check-in en evento de comida
export const registerMealCheckInEvent = async (eventId, userId, userName) => {
  try {
    const checkInId = `checkin-${eventId}-${userId}-${Date.now()}`;
    await setDoc(doc(db, 'mealCheckins', checkInId), {
      id: checkInId,
      eventId: eventId,
      userId: userId,
      userName: userName,
      checkedAt: Timestamp.now()
    });
    return checkInId;
  } catch (error) {
    throw error;
  }
};

// Obtener check-ins de un evento de comida
export const getMealCheckinsForEvent = async (eventId) => {
  try {
    const q = query(collection(db, 'mealCheckins'));
    const querySnapshot = await getDocs(q);
    const checkins = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().eventId === eventId) {
        checkins.push({ id: doc.id, ...doc.data() });
      }
    });
    return checkins;
  } catch (error) {
    throw error;
  }
};
