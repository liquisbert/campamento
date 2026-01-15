import { mockUsers, mockScheduleEvents } from './mockData';

// Flag para usar datos locales en lugar de Firebase
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true';

// Simular delay de red
const simulateNetworkDelay = (ms = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Storage local para datos
const getStoredUsers = () => {
  const stored = localStorage.getItem('mockUsers');
  return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(mockUsers));
};

const getStoredSchedule = () => {
  const stored = localStorage.getItem('mockScheduleEvents');
  return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(mockScheduleEvents));
};

const saveStoredUsers = (users) => {
  localStorage.setItem('mockUsers', JSON.stringify(users));
};

const saveStoredSchedule = (events) => {
  localStorage.setItem('mockScheduleEvents', JSON.stringify(events));
};

// Exportar para uso en auth.js
export {
  USE_MOCK_DATA,
  simulateNetworkDelay,
  getStoredUsers,
  getStoredSchedule,
  saveStoredUsers,
  saveStoredSchedule
};
