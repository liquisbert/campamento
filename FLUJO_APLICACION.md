# 📊 Análisis de Flujo - Campamento App

## 🎯 Resumen Ejecutivo
Esta es una aplicación de gestión de campamento que utiliza **autenticación dual** basada en:
1. **Código QR** (manilla impresa) - Acceso rápido para participantes
2. **Email/Contraseña** - Acceso alternativo para staff

La aplicación tiene dos roles principales: **Participante** y **Staff**, con dashboards diferentes según el rol.

---

## 🔄 Diagrama de Flujo General

```
┌─────────────────────────────────────────────────────────────────┐
│                     APP.JS (Punto de entrada)                   │
│  ✓ Monitorea cambios de autenticación en Firebase              │
│  ✓ Gestiona estado global: currentUser, userData, loading       │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
         ┌────────────────────┐
         │   ¿Usuario existe? │
         └─────┬──────────┬───┘
         NO    │          │    SI
              ▼          ▼
        ┌─────────────────────────────────────────┐
        │   LOGIN.JS - Pantalla de Autenticación  │
        │                                         │
        │  ┌──────────────────────────────────┐   │
        │  │ 🎫 OPCIÓN 1: ESCANEO QR          │   │
        │  │ • Html5QrcodeScanner activado   │   │
        │  │ • Lee GUID desde manilla        │   │
        │  │ • Busca usuario por qrId        │   │
        │  │ • loginByQR() en auth.js        │   │
        │  └──────────────────────────────────┘   │
        │                                         │
        │  ┌──────────────────────────────────┐   │
        │  │ 📝 OPCIÓN 2: INGRESO MANUAL       │   │
        │  │ • Campo de texto para pegar QR  │   │
        │  │ • loginByQR() en auth.js        │   │
        │  └──────────────────────────────────┘   │
        │                                         │
        │  ┌──────────────────────────────────┐   │
        │  │ 🔑 OPCIÓN 3: EMAIL/CONTRASEÑA    │   │
        │  │ • Botón en footer                │   │
        │  │ • loginUser() en auth.js         │   │
        │  │ • Para staff                     │   │
        │  └──────────────────────────────────┘   │
        └─────────────────────────────────────────┘
                      │
                      │ (Autenticación exitosa)
                      ▼
        ┌──────────────────────────────────────────┐
        │  FIREBASE AUTH RESPONDE ✓                 │
        │  • signInAnonymously() para QR            │
        │  • signInWithEmailAndPassword() para staff│
        └──────────┬───────────────────────────────┘
                   │
                   │ (onAuthChange dispara)
                   ▼
        ┌──────────────────────────────────────────┐
        │  APP.JS RECIBE currentUser                │
        │                                          │
        │  1️⃣ Busca datos en localStorage (QR)     │
        │  2️⃣ Si no, busca en Firestore (email)    │
        │  3️⃣ Extrae el rol: 'staff' o 'participant'
        └──────────┬───────────────────────────────┘
                   │
          ┌────────┴────────┐
          │                 │
      STAFF            PARTICIPANT
          │                 │
          ▼                 ▼
   ┌──────────────────┐   ┌──────────────────────┐
   │ STAFF DASHBOARD  │   │ PARTICIPANT DASHBOARD │
   │                  │   │                      │
   │ 📱 Funciones:    │   │ 📱 Funciones:        │
   │ • QR Scanner     │   │ • Ver Cronograma     │
   │ • Gestionar      │   │ • Ver Mi QR          │
   │   Usuarios       │   │ • Ver Check-ins      │
   │ • Check-in Comidas   │ • Cerrar sesión      │
   │ • Reportes       │   │                      │
   │ • Crear Evento   │   │                      │
   │ • Cerrar sesión  │   │                      │
   └──────────────────┘   └──────────────────────┘
```

---

## 🔐 Flujo de Autenticación Detallado

### Opción 1: Escaneo QR (Participante)
```
1. Usuario levanta manilla frente a cámara
   ↓
2. Html5QrcodeScanner detecta QR
   ↓
3. handleQRScanned(qrId) se ejecuta
   ↓
4. loginByQR(qrId) busca en Firestore
   ↓
5. Query: WHERE qrId == scannedQR
   ↓
6. getUserByQRId() retorna userData
   ↓
7. signInAnonymously(auth) → crea sesión anónima
   ↓
8. localStorage.setItem('participantData', userData)
   ↓
9. navigate('/') → App.js recibe user
   ↓
10. App.js valida rol === 'participant'
    ↓
11. Renderiza ParticipantDashboard ✓
```

### Opción 2: Email/Contraseña (Staff)
```
1. Usuario hace clic en footer "🔑 Acceso alternativo"
   ↓
2. emailLogin = true → muestra formulario
   ↓
3. handleEmailSubmit(email, password)
   ↓
4. loginUser(email, password) en auth.js
   ↓
5. signInWithEmailAndPassword(auth, email, password)
   ↓
6. Firebase autentica contra base de datos
   ↓
7. onAuthChange dispara en App.js
   ↓
8. getCurrentUserData(uid) obtiene datos de Firestore
   ↓
9. Extrae userData.role
   ↓
10. Si role === 'staff' → StaffDashboard ✓
    Si role === 'participant' → ParticipantDashboard ✓
```

---

## 💾 Estructura de Datos en Firestore

### Colección: `users`
```javascript
{
  uid: "firebase-uuid",
  email: "usuario@email.com",
  name: "Juan Pérez",
  phoneNumber: "+34123456789",
  role: "participant" | "staff",
  qrId: "550e8400-e29b-41d4-a716-446655440000", // GUID único
  createdAt: Timestamp,
  updatedAt: Timestamp,
  mealCheckIns: {
    breakfast: [
      { timestamp: Timestamp, date: "15/01/2026" }
    ],
    lunch: [
      { timestamp: Timestamp, date: "15/01/2026" }
    ],
    dinner: [
      { timestamp: Timestamp, date: "15/01/2026" }
    ]
  }
}
```

---

## 🔄 Ciclo de Vida del Componente Login

```
┌─────────────────────────────────────────────┐
│ INICIALIZACIÓN (useState)                    │
├─────────────────────────────────────────────┤
│ scanned: false                               │
│ error: ''                                    │
│ loading: false                               │
│ manualInput: false → QR mode activo          │
│ emailLogin: false → QR mode activo           │
│ qrInput: ''                                  │
│ formData: { email: '', password: '' }        │
└─────────────────────────────────────────────┘
                    │
                    ▼
    ┌────────────────────────────────┐
    │ useEffect() - Inicializar QR    │
    │ Cuando: manualInput, scanned    │
    │ Qué: initializeScanner()        │
    │ Cleanup: scanner.clear()        │
    └────────────────────────────────┘
                    │
          ┌─────────┴──────────┐
          │                    │
     emailLogin=false     emailLogin=true
          │                    │
    ┌─────▼────────┐      ┌───▼──────────┐
    │ QR Scanner   │      │ Email Form   │
    │ Section      │      │              │
    └──────────────┘      └──────────────┘
          │
    ┌─────▼─────┬──────────┐
    │          │          │
  Escanear  Manual    Email
    │          │          │
    ▼          ▼          ▼
   ✓          ✓          ✓
```

---

## 🛡️ Flujo de Seguridad y Validaciones

### Login por QR:
```
1. ✓ Validar que qrId no esté vacío
2. ✓ Buscar usuario en Firestore (qrId exacto)
3. ✓ Si no existe → Error: "Usuario no encontrado"
4. ✓ Si existe → loginByQR() retorna userData
5. ✓ Crear sesión anónima
6. ✓ Guardar en localStorage
7. ✓ Navegar a dashboard según rol
```

### Login por Email/Contraseña:
```
1. ✓ Validar email no vacío
2. ✓ Validar contraseña no vacía
3. ✓ signInWithEmailAndPassword() contra Firebase Auth
4. ✓ Si falla → Error: "Credenciales inválidas"
5. ✓ Si existe → Firebase retorna user
6. ✓ getCurrentUserData(uid) obtiene perfil
7. ✓ Validar que role === 'staff' (redirecciona si no)
8. ✓ Navegar a StaffDashboard
```

---

## 📱 Estados de la UI en Login

```
ESTADO 1: QR Scanning (inicial)
├─ emailLogin: false
├─ manualInput: false
├─ Muestra: cámara en vivo
└─ Acciones: Escanear QR o "Ingreso manual"

ESTADO 2: QR Manual Input
├─ emailLogin: false
├─ manualInput: true
├─ Muestra: campo de texto para QR
└─ Acciones: Pegar código o volver a escanear

ESTADO 3: Email/Contraseña
├─ emailLogin: true
├─ manualInput: N/A
├─ Muestra: formulario email + password
└─ Acciones: Entrar o volver a escaneo

ESTADO 4: Procesando
├─ loading: true
├─ Muestra: spinner + "Verificando..."
└─ Acciones: NINGUNA (deshabilitado)

ESTADO 5: Error
├─ error: "mensaje de error"
├─ Muestra: alerta roja con mensaje
└─ Acciones: Reintentar
```

---

## 🎛️ Flujo en App.js (Enrutamiento)

```
┌─────────────────────────────────────────┐
│ App.js - useEffect(onAuthChange)        │
├─────────────────────────────────────────┤
│ Monitorea: auth.onAuthStateChanged()    │
│ Actualiza: currentUser, userData        │
└────────────┬────────────────────────────┘
             │
             ▼
    ┌────────────────┐
    │ ¿loading=true? │
    └┬────────────┬──┘
    SI            NO
     │             │
     ▼             ▼
  Spinner     ┌─────────────┐
              │ ¿currentUser?│
              └┬──────────┬──┘
             NO           SI
              │            │
              ▼            ▼
           Login      ┌──────────────┐
           Register   │¿role='staff'?│
                      └┬──────────┬──┘
                     SI          NO
                      │           │
                      ▼           ▼
                  StaffDash  ParticipantDash
```

---

## 🔄 Componentes Principales y sus Funciones

### **Login.js**
- Gestiona interfaz de autenticación
- Soporta 3 métodos de login
- Valida inputs y maneja errores
- Guarda datos localmente

### **App.js**
- Monitorea estado de autenticación
- Enruta según rol del usuario
- Carga datos desde localStorage o Firestore
- Gestiona Loading global

### **firebase/auth.js**
- `loginByQR(qrId)` → Busca por GUID
- `loginUser(email, password)` → Busca por email
- `registerUser()` → Crea nuevo usuario + genera QR
- `getUserByQRId()` → Query Firestore
- `getCurrentUserData()` → Obtiene perfil completo
- `onAuthChange()` → Listener de Firebase

### **ParticipantDashboard.js**
- Vista del participante
- Tabs: Cronograma, Mi QR, Check-ins
- Acceso a datos personales
- Botón Logout

### **StaffDashboard.js**
- Vista del staff/admin
- Tabs: QR Scanner, Usuarios, Cronograma, Check-in
- Funciones de gestión
- Validación: redirige si no es staff

---

## 🎯 Flujo de Datos

```
Firestore DB
    ↑ │
    │ │ read/write
    │ ▼
firebase/auth.js (funciones CRUD)
    ↑ │
    │ │ import
    │ ▼
Login.js ←→ App.js
  │        │
  │        │ routea según
  │        │ userData.role
  │        ▼
  └────→ Dashboard
         (Participant/Staff)
```

---

## 🔑 Variables de Estado Críticas

| Componente | Variable | Tipo | Propósito |
|-----------|----------|------|----------|
| **Login** | scanned | bool | Indica si se leyó un QR |
| **Login** | emailLogin | bool | Alterna entre QR y Email |
| **Login** | manualInput | bool | Alterna entre cámara y texto |
| **Login** | loading | bool | Bloquea UI durante procesos |
| **Login** | error | string | Muestra mensajes de error |
| **App** | currentUser | User\|null | Usuario autenticado en Firebase |
| **App** | userData | Object\|null | Datos del usuario en Firestore |
| **App** | loading | bool | Estado de carga inicial |

---

## ✅ Validaciones Clave

1. **QR No Encontrado**
   ```javascript
   if (!userData) {
     throw new Error('QR no encontrado. Verifica que el código sea válido.');
   }
   ```

2. **Role Validation en Staff Dashboard**
   ```javascript
   if (data?.role !== 'staff') {
     navigate('/participant-dashboard');
   }
   ```

3. **Datos Locales en App.js**
   ```javascript
   const storedData = localStorage.getItem('participantData');
   if (storedData) {
     // Usa datos locales (más rápido)
   } else {
     // Busca en Firestore
   }
   ```

---

## 🚀 Resumen del Flujo Completo

```
Usuario accede a la app
        ↓
¿Tiene sesión activa? 
  NO → Login.js
  ↓
Elige método:
  • Escanear QR → loginByQR() → localStorage
  • Ingreso manual QR → loginByQR() → localStorage  
  • Email/Contraseña → loginUser() → Firestore
  ↓
Firebase autentica
  ↓
App.js recibe currentUser
  ↓
Obtiene userData (role)
  ↓
¿role === 'staff'?
  SI → StaffDashboard (gestión)
  NO → ParticipantDashboard (participante)
  ↓
Usuario interactúa con dashboard
  ↓
Logout → Limpia localStorage → Vuelve a Login
```

---

## 📈 Caso de Uso Típico

### Participante con Manilla QR:
1. Llega al campamento
2. Abre app
3. Escanea manilla con cámara
4. QR se decodifica automáticamente
5. Se busca en Firestore por qrId
6. Se autentica anónimamente
7. Ve ParticipantDashboard
8. Consulta cronograma, ve su QR, revisa check-ins

### Staff sin Manilla:
1. Abre app
2. Hace clic en "🔑 Acceso alternativo"
3. Ingresa email y contraseña
4. Se autentica con Firebase Auth
5. Sistema valida que sea staff
6. Ve StaffDashboard
7. Gestiona usuarios, escanea QRs de otros, crea eventos

---

## 🔗 Relación entre Componentes

```
App.js (orquestador)
│
├─→ Login.js
│   ├─→ firebase/auth.js
│   └─→ Html5QrcodeScanner
│
├─→ ParticipantDashboard.js
│   ├─→ ScheduleView
│   ├─→ QRDisplay
│   ├─→ Sidebar
│   └─→ firebase/auth.js
│
└─→ StaffDashboard.js
    ├─→ ScheduleEditor
    ├─→ UserManagement
    ├─→ MealCheckIn
    ├─→ MealCheckInAttendance
    ├─→ ParticipantRegistration
    ├─→ Sidebar
    └─→ firebase/auth.js
```
