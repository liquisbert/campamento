// Datos mock para funcionamiento sin Firebase
const mockUsers = [
  {
    uid: 'staff-001',
    email: 'admin@campamento.local',
    name: 'Admin Staff',
    phoneNumber: '+34 600 000 001',
    role: 'staff',
    qrId: '550e8400-e29b-41d4-a716-000000000001',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
    mealCheckIns: {
      breakfast: [],
      lunch: [],
      dinner: []
    }
  },
  {
    uid: 'participant-001',
    email: 'juan.550e8400@campamento.local',
    name: 'Juan García',
    phoneNumber: '+34 600 111 111',
    role: 'participant',
    qrId: '550e8400-e29b-41d4-a716-111111111111',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-15'),
    mealCheckIns: {
      breakfast: [],
      lunch: [],
      dinner: []
    }
  },
  {
    uid: 'participant-002',
    email: 'maria.550e8401@campamento.local',
    name: 'María López',
    phoneNumber: '+34 600 222 222',
    role: 'participant',
    qrId: '550e8401-e29b-41d4-a716-111111111111',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-15'),
    mealCheckIns: {
      breakfast: [],
      lunch: [],
      dinner: []
    }
  },
  {
    uid: 'participant-003',
    email: 'carlos.550e8402@campamento.local',
    name: 'Carlos Martínez',
    phoneNumber: '+34 600 333 333',
    role: 'participant',
    qrId: '550e8402-e29b-41d4-a716-111111111111',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-15'),
    mealCheckIns: {
      breakfast: [],
      lunch: [],
      dinner: []
    }
  }
];

const mockScheduleEvents = [
  {
    id: 'event-001',
    title: 'Desayuno',
    description: 'Desayuno general del campamento',
    startTime: '08:00',
    endTime: '09:00',
    day: 'Monday',
    mealType: 'breakfast',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: 'event-002',
    title: 'Almuerzo',
    description: 'Almuerzo general del campamento',
    startTime: '12:30',
    endTime: '13:30',
    day: 'Monday',
    mealType: 'lunch',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: 'event-003',
    title: 'Cena',
    description: 'Cena general del campamento',
    startTime: '18:00',
    endTime: '19:00',
    day: 'Monday',
    mealType: 'dinner',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15')
  }
];

export { mockUsers, mockScheduleEvents };
