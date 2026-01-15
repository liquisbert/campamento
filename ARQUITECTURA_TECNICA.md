# 🏗️ Arquitectura Técnica - Campamento App

## Índice
1. [Stack Tecnológico](#stack-tecnológico)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Flujo de Datos](#flujo-de-datos)
4. [Componentes Principales](#componentes-principales)
5. [Funciones de Autenticación](#funciones-de-autenticación)
6. [Almacenamiento de Datos](#almacenamiento-de-datos)
7. [Estados y Props](#estados-y-props)
8. [Manejo de Errores](#manejo-de-errores)
9. [Optimizaciones](#optimizaciones)
10. [Flujos de Seguridad](#flujos-de-seguridad)

---

## Stack Tecnológico

```
FRONTEND
├─ React 18.2.0
│  ├─ React Router DOM 6.20.0 (enrutamiento)
│  └─ Hooks (useState, useEffect, useRef)
│
├─ HTML5-QRCODE 2.3.4 (escaneo QR)
│
├─ CSS3 (estilos)
│  └─ Gradientes, Flexbox, Animaciones
│
└─ JavaScript ES6+

BACKEND/BASE DE DATOS
├─ Firebase Authentication
│  ├─ signInWithEmailAndPassword()
│  └─ signInAnonymously()
│
├─ Firebase Firestore (BD NoSQL)
│  ├─ Colección: users
│  ├─ Colección: scheduleEvents
│  ├─ Colección: mealCheckIns
│  └─ Queries en tiempo real
│
└─ Firebase Functions (backend serverless)

SERVICIOS EXTERNOS
├─ Twilio (WhatsApp)
│  ├─ Envío de QR por WhatsApp
│  └─ Notificaciones
│
└─ Firebase Hosting (deploy)

HERRAMIENTAS
├─ npm (gestor de paquetes)
├─ react-scripts (bundler)
├─ Firebase CLI (deploy)
└─ VSCode (editor)
```

---

## Estructura del Proyecto

```
src/
├─ App.js ........................... Componente raíz, enrutador principal
├─ App.css .......................... Estilos globales
├─ index.js ......................... Entry point
│
├─ components/
│  ├─ Login.js ...................... Pantalla de autenticación
│  ├─ Auth.css ...................... Estilos de autenticación
│  ├─ Register.js ................... Registro de usuarios
│  ├─ ParticipantDashboard.js ....... Dashboard participante
│  ├─ StaffDashboard.js ............. Dashboard staff/admin
│  ├─ Dashboard.css ................. Estilos dashboards
│  ├─ QRDisplay.js .................. Mostrar QR del usuario
│  ├─ QRScanner.js .................. Escanear QR (deprecated)
│  ├─ QRDisplay.css ................. Estilos QR
│  ├─ QRScanner.css ................. Estilos scanner
│  ├─ ScheduleView.js ............... Ver eventos
│  ├─ ScheduleEditor.js ............. Editar eventos (staff)
│  ├─ Schedule*.css ................. Estilos schedule
│  ├─ UserManagement.js ............. Gestionar usuarios (staff)
│  ├─ UserManagement.css ............ Estilos usuarios
│  ├─ MealCheckIn.js ................ Check-in de comidas
│  ├─ MealCheckInAttendance.js ...... Asistencia comidas
│  ├─ MealCheckIn*.css .............. Estilos check-in
│  ├─ ParticipantRegistration.js .... Registrar participantes (staff)
│  ├─ Sidebar.js .................... Navegación lateral
│  ├─ Sidebar.css ................... Estilos sidebar
│  ├─ Toast.js ...................... Notificaciones toast
│  └─ Toast.css ..................... Estilos toast
│
├─ firebase/
│  ├─ config.js ..................... Configuración Firebase
│  ├─ auth.js ....................... Funciones de autenticación
│  ├─ schedule.js ................... Funciones de eventos
│  ├─ notifications.js .............. Funciones de notificaciones
│  └─ twilio.js ..................... Integración Twilio
│
└─ public/
   └─ index.html .................... HTML base

functions/ (Firebase Functions)
├─ index.js ......................... Funciones serverless
└─ package.json ..................... Dependencias backend

build/ (después de npm build)
├─ index.html ....................... HTML compilado
└─ static/ .......................... JS/CSS compilados
```

---

## Flujo de Datos

```
┌─────────────────────────────────────┐
│  Firebase Firestore                 │
│  /users collection                  │
│  - qrId (busca participantes)       │
│  - email, pwd (busca staff)         │
└──────────────────┬──────────────────┘
                   │
       ┌───────────┴─────────────┐
       │                         │
       ▼                         ▼
   auth.js            schedule.js
  (CRUD Users)       (CRUD Events)
       │                         │
       │        ┌────────────────┘
       │        │
       ▼        ▼
    Login.js ─→ App.js
    (estados)   (orquestador)
       │        │
       └────┬───┘
            │
    ┌───────┴──────────┐
    │                  │
    ▼                  ▼
ParticipantDash    StaffDash
(lectura datos)    (CRUD datos)
    │                  │
    └──────┬───────────┘
           │
           ▼
    localStorage (cache)
    participantData
```

---

## Componentes Principales

### 1. App.js (Orquestador Central)

**Responsabilidades:**
- Monitorear cambios de autenticación
- Cargar datos del usuario
- Enrutar según rol

**State:**
```javascript
const [currentUser, setCurrentUser] = useState(null);
const [userData, setUserData] = useState(null);
const [loading, setLoading] = useState(true);
```

**Flujo:**
```
1. useEffect() escucha onAuthChange()
2. Si user existe:
   - Intenta cargar de localStorage (rápido)
   - Si no, carga de Firestore
3. Valida userData.role
4. Renderiza componente según rol
```

### 2. Login.js (Autenticación)

**Responsabilidades:**
- Presentar 3 métodos de login
- Validar inputs
- Manejar errores
- Guardar datos locales

**State:**
```javascript
const [scanned, setScanned] = useState(false);
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const [manualInput, setManualInput] = useState(false);
const [emailLogin, setEmailLogin] = useState(false);
const [qrInput, setQrInput] = useState('');
const [formData, setFormData] = useState({ email: '', password: '' });
```

**Métodos:**
- `initializeScanner()` → Inicia Html5QrcodeScanner
- `handleQRScanned()` → Procesa QR detectado
- `handleManualSubmit()` → Procesa QR pegado
- `handleEmailSubmit()` → Procesa credenciales

### 3. ParticipantDashboard.js (Vista Participante)

**Responsabilidades:**
- Mostrar cronograma
- Mostrar QR personal
- Mostrar check-ins
- Permitir logout

**Tabs:**
```
📅 Cronograma (ScheduleView)
📱 Mi QR (QRDisplay)
✅ Check-ins (MealCheckInAttendance)
```

### 4. StaffDashboard.js (Vista Staff)

**Responsabilidades:**
- Escanear QR de participantes
- Gestionar usuarios
- Crear/editar eventos
- Registrar check-ins
- Registrar nuevos participantes

**Tabs:**
```
📱 QR Scanner
👥 Usuarios (UserManagement)
📅 Cronograma (ScheduleEditor)
🍽️ Check-in Comidas (MealCheckIn)
👤 Registrar (ParticipantRegistration)
```

---

## Funciones de Autenticación

### firebase/auth.js

#### 1. `registerUser(email, password, name, phoneNumber, role)`
```javascript
// Crea nuevo usuario
// 1. createUserWithEmailAndPassword() → Firebase Auth
// 2. Genera GUID único (qrId)
// 3. setDoc() → Firestore users
// 4. Envía QR por WhatsApp
// Retorna: { user, qrId }
```

#### 2. `loginUser(email, password)`
```javascript
// Login con email/password
// signInWithEmailAndPassword(auth, email, password)
// Retorna: usuario de Firebase Auth
```

#### 3. `loginByQR(qrId)`
```javascript
// Login con QR
// 1. getUserByQRId(qrId) → Query Firestore
// 2. WHERE qrId == qrId
// Retorna: userData completo o error
```

#### 4. `getUserByQRId(qrId)`
```javascript
// Query específica
// collection(db, 'users')
// where('qrId', '==', qrId)
// getDocs()
// Retorna: { uid, name, email, role, ... }
```

#### 5. `getCurrentUserData(uid)`
```javascript
// Obtiene datos completos del usuario
// getDoc(db, 'users', uid)
// Retorna: userData completo
```

#### 6. `logoutUser()`
```javascript
// Cierra sesión
// signOut(auth)
// Limpia localStorage
```

#### 7. `onAuthChange(callback)`
```javascript
// Listener de Firebase Auth
// Dispara cuando usuario se autentica/desautentica
// onAuthStateChanged(auth, callback)
```

#### 8. `getAllUsers()`
```javascript
// Obtiene todos los usuarios (solo staff)
// getDocs(collection(db, 'users'))
// Retorna: array de usuarios
```

#### 9. `registerMealCheckIn(uid, mealType, timestamp)`
```javascript
// Registra asistencia a comida
// updateDoc(users/uid)
// Agrega timestamp a mealCheckIns[mealType]
// Retorna: true/error
```

---

## Almacenamiento de Datos

### Firestore Structure

```javascript
/users collection

{
  uid: string,              // Key principal (Firebase Auth ID)
  email: string,            // Email único
  name: string,             // Nombre completo
  phoneNumber: string,      // Teléfono para WhatsApp
  role: 'participant'|'staff',  // Rol del usuario
  qrId: string (UUID),      // GUID único - KEY PARA BÚSQUEDA QR
  createdAt: Timestamp,     // Fecha creación
  updatedAt: Timestamp,     // Fecha última actualización
  
  mealCheckIns: {           // Check-ins de comidas
    breakfast: [{           // Desayuno
      timestamp: Timestamp,
      date: string (DD/MM/YYYY)
    }, ...],
    lunch: [...],           // Almuerzo
    dinner: [...]           // Cena
  }
}

/scheduleEvents collection

{
  id: string (auto),        // Key principal
  title: string,            // Nombre del evento
  description: string,      // Descripción
  date: string,             // Fecha (DD/MM/YYYY)
  startTime: string,        // HH:MM
  endTime: string,          // HH:MM
  location: string,         // Ubicación
  createdBy: string (uid),  // Staff que creó
  createdAt: Timestamp,
  updatedAt: Timestamp
}

/mealCheckIns collection (alternativo)

{
  id: string,
  userId: string (uid),
  mealType: 'breakfast'|'lunch'|'dinner',
  timestamp: Timestamp,
  date: string,
  staffId: string (uid)     // Staff que registró
}
```

### localStorage Cache

```javascript
// Para login QR (rápido acceso)
localStorage.setItem('participantData', JSON.stringify({
  uid,
  name,
  email,
  role,
  qrId,
  mealCheckIns
}))

localStorage.setItem('participantUID', uid)
```

---

## Estados y Props

### App.js
```javascript
// States
currentUser: User | null
userData: UserData | null
loading: boolean

// Props pasados a componentes
<StaffDashboard currentUser={currentUser} />
<ParticipantDashboard currentUser={currentUser} userData={userData} />
```

### Login.js
```javascript
// States
scanned: boolean
error: string
loading: boolean
manualInput: boolean
emailLogin: boolean
qrInput: string
formData: { email, password }

// Refs
scannerRef: useRef(null)
```

### ParticipantDashboard.js
```javascript
// Props
currentUser: User
userData: UserData (opcional)

// States
userData: UserData (recargado)
scheduleEvents: Array
activeTab: string
loading: boolean
sidebarOpen: boolean
```

### StaffDashboard.js
```javascript
// Props
currentUser: User

// States
userData: UserData
allUsers: Array
scheduleEvents: Array
activeTab: string
loading: boolean
showRegistration: boolean
sidebarOpen: boolean
```

---

## Manejo de Errores

### Niveles de Error

```
NIVEL 1: Validación de Input
├─ QR vacío → "Por favor ingresa un código QR"
├─ Email/pwd vacío → "Campos requeridos"
└─ Email inválido → "Email inválido"

NIVEL 2: Búsqueda en BD
├─ QR no existe → "Usuario no encontrado"
├─ Email no existe → "Credenciales inválidas"
└─ Query error → "Error de conexión"

NIVEL 3: Autenticación
├─ Credenciales inválidas → Firebase error
├─ Session expired → Redirige a login
└─ Auth error → "Error de autenticación"

NIVEL 4: Datos
├─ Firestore no responde → "Error cargando datos"
├─ UID inválido → "Usuario no encontrado"
└─ Permisos insuficientes → "Acceso denegado"
```

### Try-Catch en Funciones Críticas

```javascript
// En handleQRScanned()
try {
  const userData = await loginByQR(qrId);
  if (!userData) {
    throw new Error('Usuario no encontrado');
  }
  await signInAnonymously(auth);
  localStorage.setItem(...);
  navigate('/');
} catch (err) {
  setError(err.message);
  setScanned(false);
  setLoading(false);
}

// En ParticipantDashboard useEffect
try {
  const data = await getCurrentUserData(currentUser.uid);
  setUserData(data);
} catch (error) {
  console.error('Error fetching data:', error);
  // No lanzamos error, dejamos userData null
}
```

---

## Optimizaciones

### 1. localStorage Cache
```javascript
// En Login.js
localStorage.setItem('participantData', userData)

// En App.js
const storedData = localStorage.getItem('participantData')
if (storedData) {
  // Usar datos locales (instantáneo)
  setUserData(JSON.parse(storedData))
} else {
  // Cargar de Firestore (más lento)
  const data = await getCurrentUserData(uid)
}
```

### 2. Lazy Loading
```javascript
// En App.js
const { getCurrentUserData } = await import('./firebase/auth')
// Solo se importa cuando se necesita
```

### 3. Refs para Referencias Persistentes
```javascript
// En Login.js
const scannerRef = useRef(null)
// Scanner persiste entre renders
```

### 4. Cleanup en useEffect
```javascript
useEffect(() => {
  // ... setup
  return () => {
    // Cleanup
    if (scannerRef.current) {
      scannerRef.current.clear()
    }
  }
}, [dependencies])
```

### 5. Conditional Rendering
```javascript
// En App.js
{!currentUser ? (
  <Login />
) : userData?.role === 'staff' ? (
  <StaffDashboard />
) : (
  <ParticipantDashboard />
)}
```

---

## Flujos de Seguridad

### 1. Autenticación QR
```
Usuario levanta manilla
    ↓
QR se escanea
    ↓
loginByQR(qrId)
    ↓
Query: WHERE qrId == exactMatch
    ↓
¿Existe? → userData
    ↓
signInAnonymously() → sesión anónima
    ↓
localStorage guardado
    ↓
✓ Usuario en ParticipantDashboard
```

**Seguridad:**
- ✅ GUID único en QR (no predecible)
- ✅ Búsqueda exacta en Firestore
- ✅ Sesión anónima (no expone credenciales)
- ✅ Datos en localStorage (solo participante local)

### 2. Autenticación Email/Password
```
Staff ingresa credenciales
    ↓
loginUser(email, password)
    ↓
signInWithEmailAndPassword()
    ↓
Firebase Auth verifica contra DB
    ↓
¿Válidas? → Firebase retorna user
    ↓
getCurrentUserData(uid)
    ↓
Valida: role === 'staff'
    ↓
✓ Usuario en StaffDashboard
```

**Seguridad:**
- ✅ Contraseña hasheada en Firebase
- ✅ Conexión HTTPS
- ✅ Validación de rol antes de mostrar datos
- ✅ No se guarda password en cliente

### 3. Control de Acceso
```
¿Es Staff?
├─ SI → StaffDashboard (acceso completo)
└─ NO → ParticipantDashboard (acceso limitado)

StaffDashboard valida:
if (userData?.role !== 'staff') {
  navigate('/participant-dashboard')
}
```

### 4. Logout Seguro
```
Usuario hace logout
    ↓
logoutUser()
    ↓
signOut(auth)
    ↓
localStorage.removeItem('participantData')
localStorage.removeItem('participantUID')
    ↓
currentUser = null
    ↓
Redirige a Login
```

---

## Resumen de Funciones Principales

| Función | Módulo | Entrada | Salida | Uso |
|---------|--------|---------|--------|-----|
| `loginByQR` | auth.js | qrId | userData | Login participante |
| `loginUser` | auth.js | email, pwd | FirebaseUser | Login staff |
| `registerUser` | auth.js | datos | {user, qrId} | Registro |
| `getCurrentUserData` | auth.js | uid | userData | Cargar perfil |
| `getUserByQRId` | auth.js | qrId | userData | Búsqueda QR |
| `getAllUsers` | auth.js | - | Array | Listar usuarios |
| `logoutUser` | auth.js | - | void | Logout |
| `onAuthChange` | auth.js | callback | unsubscribe | Monitorear auth |
| `getScheduleEvents` | schedule.js | - | Array | Cargar eventos |
| `createScheduleEvent` | schedule.js | datos | id | Crear evento |
| `updateScheduleEvent` | schedule.js | id, datos | void | Editar evento |
| `deleteScheduleEvent` | schedule.js | id | void | Eliminar evento |

---

## Conclusión

La arquitectura de Campamento App es:

✅ **Escalable**: Componentes desacoplados, reutilizables
✅ **Segura**: Autenticación dual, validaciones múltiples
✅ **Eficiente**: Cache local, lazy loading, refs
✅ **Mantenible**: Estructura clara, funciones puras
✅ **Flexible**: 3 métodos de login, 2 roles

Está diseñada para crecer y adaptarse a nuevos requisitos sin cambios mayores.
