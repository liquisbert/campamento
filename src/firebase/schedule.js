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
