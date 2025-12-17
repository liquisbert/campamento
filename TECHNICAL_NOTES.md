# 🛠️ Notas Técnicas y Consideraciones

## 1️⃣ Autenticación

### Firebase Authentication
- **Método**: Email/Password
- **Ubicación**: `src/firebase/auth.js`
- **Estado**: Monitorizado globalmente en `App.js` con `onAuthStateChanged()`

### Seguridad
- Las contraseñas se envían encriptadas a Firebase
- Las sesiones se mantienen en localStorage
- Los tokens de autenticación son gestionados por Firebase

## 2️⃣ Generación de QR

### UUID para QR
Se usa una función personalizada de UUID (no externa) para generar identificadores únicos:

```javascript
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
```

### Librería QR
- **Generación**: `qrcode` v1.5.3
- **Lectura**: `html5-qrcode` v2.3.4
- **Rendimiento**: Genera el código en canvas para mejor rendimiento

## 3️⃣ Base de Datos Firestore

### Índices Recomendados

#### Para búsqueda de usuario por QR
```
Colección: users
Campos:
- qrId (Ascending)
- role (Ascending)
```

#### Para búsqueda de eventos por día
```
Colección: schedule
Campos:
- day (Ascending)
- startTime (Ascending)
```

### Consultas Activas
```javascript
// Buscar usuario por QR
query(collection(db, 'users'), where('qrId', '==', qrId))

// Obtener eventos ordenados
query(collection(db, 'schedule'), orderBy('day', 'asc'))
```

## 4️⃣ Gestión de Estado

### Estado Local vs Global
- **Local**: Componentes individuales (formularios, pestañas activas)
- **Global**: Usuario actual y sus datos (mediante `onAuthChange`)

### Patrones
- Componentes controlados con `useState`
- Efectos secundarios con `useEffect`
- Refs para elementos del DOM (canvas, cámara)

## 5️⃣ Rendimiento

### Optimizaciones Implementadas

1. **Lazy Loading**: Los dashboards cargan datos bajo demanda
2. **Memoización**: Funciones reutilizables en `firebase/`
3. **Event Handlers**: Debouncing en filtros (si se añade)
4. **Renderizado**: Componentes funcionales con hooks

### Mejoras Futuras
- [ ] React.memo() para componentes que no cambian
- [ ] useMemo() para cálculos costosos
- [ ] Lazy loading de componentes con React.lazy()

## 6️⃣ Seguridad

### Reglas de Firestore (Mínimas)

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Para Producción (Más Restrictivo)

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios: pueden leer su propio documento, solo staff puede leer otros
    match /users/{userId} {
      allow read: if request.auth.uid == userId || request.auth.token.role == 'staff';
      allow write: if request.auth.uid == userId;
    }
    
    // Cronograma: solo lectura para participantes, lectura/escritura para staff
    match /schedule/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'staff';
    }
  }
}
```

## 7️⃣ Manejo de Errores

### Try/Catch
Todos los métodos Firebase usan try/catch:

```javascript
try {
  // Operación
} catch (error) {
  console.error('Error:', error);
  setError(error.message);
}
```

### Mensajes de Error
- Se muestran en componentes usando `alert` clases CSS
- Console logs en desarrollo
- Mensajes amigables al usuario

## 8️⃣ Caché y Sincronización

### Firebase Real-time
- Los datos se sincronizan en tiempo real por defecto
- `onAuthChange()` escucha cambios de autenticación
- `getDocs()` obtiene snapshot actual

### Actualizaciones
Para verificar cambios en datos compartidos, se puede usar `onSnapshot()`:

```javascript
onSnapshot(doc(db, 'users', userId), (doc) => {
  setUserData(doc.data());
});
```

## 9️⃣ Módulos y Importaciones

### Organización
```
firebase/
  ├── config.js         # Inicialización (importado primero)
  ├── auth.js           # Autenticación
  ├── schedule.js       # Cronograma
  └── notifications.js  # Notificaciones (futuro)

components/
  ├── Auth/             # Login, Register
  ├── Dashboard/        # ParticipantDashboard, StaffDashboard
  ├── QR/               # QRDisplay, QRScanner
  ├── Schedule/         # ScheduleView, ScheduleEditor
  ├── Meals/            # MealCheckIn
  └── Users/            # UserManagement
```

## 🔟 Testing (Futuro)

### Jest para Unit Tests
```javascript
// Ejemplo
test('registra un usuario correctamente', async () => {
  const result = await registerUser('test@example.com', 'password', 'Test User');
  expect(result.user).toBeDefined();
  expect(result.qrId).toBeDefined();
});
```

### Testing de Componentes con React Testing Library
```javascript
test('muestra el QR después del registro', () => {
  render(<QRDisplay userData={mockData} />);
  const qrElement = screen.getByRole('button', { name: /descargar/i });
  expect(qrElement).toBeInTheDocument();
});
```

## 1️⃣1️⃣ Escalabilidad

### Consideraciones para Crecer

1. **Muchos usuarios**: Agregar paginación en UserManagement
2. **Muchos eventos**: Agregar filtros y búsqueda
3. **Carga de cámara**: Considerar Web Workers
4. **Base de datos**: Implementar indexación adecuada
5. **Almacenamiento**: Usar Storage de Firebase para imágenes

### Estructura para Escalar
```
src/
├── components/
│   ├── common/         # Componentes reutilizables
│   ├── pages/          # Páginas principales
│   ├── layout/         # Header, Footer, Navbar
│   └── forms/          # Formularios compartidos
├── hooks/              # Custom hooks
├── utils/              # Funciones utilitarias
├── constants/          # Constantes de la app
├── types/              # TypeScript types (futuro)
└── context/            # Context API (futuro)
```

## 1️⃣2️⃣ Debugging

### Chrome DevTools
- **Elements**: Inspector del DOM
- **Console**: Logs y errores
- **Network**: Peticiones Firebase
- **Application**: LocalStorage, SessionStorage

### React DevTools
- Inspeccionar props y estado
- Perfilar rendimiento
- Seguimiento de re-renders

### Firebase Console
- Monitoreo en tiempo real
- Logs de acceso
- Uso de cuota

## 1️⃣3️⃣ Deployment

### Firebase Hosting
```bash
firebase init hosting
npm run build
firebase deploy
```

### Variables de Entorno en Producción
- Usar `.env.production.local`
- No comprometer datos sensibles
- Usar secretos de CI/CD

## 1️⃣4️⃣ Monitoreo

### Métricas Importantes
- Tiempo de carga
- Errores de autenticación
- Problemas de QR scanning
- Latencia de base de datos

### Firebase Analytics
```javascript
import { getAnalytics, logEvent } from "firebase/analytics";

logEvent(analytics, "user_registration", {
  method: "email"
});
```

## 1️⃣5️⃣ Mejoras Técnicas Pendientes

- [ ] TypeScript para type safety
- [ ] Context API para estado global
- [ ] Custom hooks para lógica reutilizable
- [ ] Lazy loading de rutas
- [ ] Service Workers para offline
- [ ] Compresión de imágenes
- [ ] Minificación automática
- [ ] Testing automatizado
- [ ] CI/CD pipeline
- [ ] Monitoreo en tiempo real

---

**Última actualización**: 17 de Diciembre de 2025
