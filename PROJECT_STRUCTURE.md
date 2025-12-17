# 📊 Estructura del Proyecto Campamento App

## 📁 Árbol de Carpetas Completo

```
campamento/
│
├── 📂 public/
│   └── index.html                 # Archivo HTML principal
│
├── 📂 src/
│   │
│   ├── 📂 components/             # Componentes React
│   │   ├── Login.js              # Componente de inicio de sesión
│   │   ├── Register.js           # Componente de registro
│   │   ├── Auth.css              # Estilos de autenticación
│   │   │
│   │   ├── ParticipantDashboard.js    # Dashboard para participantes
│   │   ├── StaffDashboard.js          # Dashboard para staff
│   │   ├── Dashboard.css              # Estilos generales del dashboard
│   │   │
│   │   ├── QRDisplay.js          # Mostrar y descargar QR
│   │   ├── QRDisplay.css         # Estilos del QR
│   │   │
│   │   ├── QRScanner.js          # Scanner de QR con cámara
│   │   ├── MealCheckIn.js        # Registro de comidas
│   │   ├── MealCheckIn.css       # Estilos del check-in
│   │   │
│   │   ├── ScheduleView.js       # Vista del cronograma
│   │   ├── ScheduleView.css      # Estilos del cronograma
│   │   ├── ScheduleEditor.js     # Editor de cronograma
│   │   ├── ScheduleEditor.css    # Estilos del editor
│   │   │
│   │   ├── UserManagement.js     # Gestión de usuarios
│   │   └── UserManagement.css    # Estilos de usuarios
│   │
│   ├── 📂 firebase/              # Lógica de Firebase
│   │   ├── config.js             # Configuración de Firebase
│   │   ├── auth.js               # Funciones de autenticación
│   │   ├── schedule.js           # Funciones del cronograma
│   │   └── notifications.js      # Funciones de notificaciones
│   │
│   ├── App.js                    # Componente principal
│   ├── App.css                   # Estilos principales
│   ├── index.js                  # Punto de entrada
│   └── index.css                 # Estilos globales
│
├── 📄 package.json               # Dependencias del proyecto
├── 📄 package-lock.json          # Lock file de npm
├── 📄 .env.example               # Plantilla de variables de entorno
├── 📄 .gitignore                 # Archivos ignorados por git
├── 📄 README.md                  # Documentación principal
├── 📄 FIREBASE_SETUP.md          # Guía de configuración Firebase
├── 📄 QUICKSTART.md              # Guía rápida de inicio
└── 📄 PROJECT_STRUCTURE.md       # Este archivo
```

## 🔄 Flujo de la Aplicación

```
┌─────────────────────────────────────┐
│      APP (App.js)                   │
│   - Monitorea autenticación         │
│   - Enruta según rol del usuario    │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────────┐
        │                 │
    ┌───▼────────┐   ┌───▼──────────┐
    │ NO AUTH    │   │  AUTH        │
    └───┬────────┘   └───┬──────────┘
        │                 │
   ┌────▼─────┐      ┌────┴──────────┐
   │  Login   │      │ ¿Rol?         │
   │ Register │      └────┬───────┬──┘
   └──────────┘           │       │
                     ┌────▼─┐ ┌──▼────┐
                  ┌──▼──┐┌──▼──┐
                  │STAFF│   │PARTICIPANT│
                  └──┬──┘    └──┬───────┘
                  ┌──▼──────────▼──────────┐
                  │  DASHBOARD SELECTION   │
                  └───────────┬────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
    ┌────▼─────┐        ┌────▼──────┐      ┌────▼──────┐
    │ QR       │        │ Schedule  │      │ Users     │
    │ Scanner  │        │ Editor    │      │Management │
    └──────────┘        └───────────┘      └───────────┘
```

## 📋 Características por Rol

### 👤 Participante

| Característica | Componente | Estado |
|---|---|---|
| Registro | Register.js | ✅ |
| Login | Login.js | ✅ |
| Ver QR | QRDisplay.js | ✅ |
| Descargar QR | QRDisplay.js | ✅ |
| Compartir WhatsApp | QRDisplay.js | ✅ |
| Ver Cronograma | ScheduleView.js | ✅ |
| Ver Check-ins | ParticipantDashboard.js | ✅ |
| Logout | ParticipantDashboard.js | ✅ |

### 👨‍💼 Staff

| Característica | Componente | Estado |
|---|---|---|
| Scanner QR | QRScanner.js | ✅ |
| Check-in Comidas | MealCheckIn.js | ✅ |
| Crear Eventos | ScheduleEditor.js | ✅ |
| Editar Eventos | ScheduleEditor.js | ✅ |
| Eliminar Eventos | ScheduleEditor.js | ✅ |
| Ver Usuarios | UserManagement.js | ✅ |
| Cambiar Roles | UserManagement.js | ✅ |
| Ver QR de Usuarios | UserManagement.js | ✅ |
| Logout | StaffDashboard.js | ✅ |

## 🗄️ Estructura de Base de Datos (Firestore)

### Colección: `users`
```
users/
├── user-id-1/
│   ├── uid: "user-id-1"
│   ├── email: "juan@example.com"
│   ├── name: "Juan Pérez"
│   ├── role: "participant"
│   ├── qrId: "uuid-1234-5678"
│   ├── phoneNumber: "+56912345678"
│   ├── createdAt: Timestamp
│   ├── updatedAt: Timestamp
│   └── mealCheckIns:
│       ├── breakfast: [{timestamp, date}]
│       ├── lunch: [{timestamp, date}]
│       └── dinner: [{timestamp, date}]
└── user-id-2/
    └── ...
```

### Colección: `schedule`
```
schedule/
├── event-id-1/
│   ├── id: "event-id-1"
│   ├── title: "Desayuno"
│   ├── description: "Primer desayuno"
│   ├── startTime: "08:00"
│   ├── endTime: "09:00"
│   ├── day: "Día 1"
│   ├── mealType: "breakfast"
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
└── event-id-2/
    └── ...
```

## 🔐 Flujo de Autenticación

```
1. Usuario escribe Email y Contraseña
   ↓
2. Firebase.auth().signInWithEmailAndPassword()
   ↓
3. Si es exitoso:
   - Guarda el user en estado global
   - Obtiene datos del usuario desde Firestore
   - Redirige según el rol
   ↓
4. Si falla:
   - Muestra mensaje de error
   - Usuario puede intentar de nuevo
```

## 🎫 Flujo de QR

### Generación de QR (Registro)
```
1. Usuario se registra
   ↓
2. Se genera UUID único
   ↓
3. Se guarda en Firestore
   ↓
4. QRDisplay.js genera canvas con el ID
   ↓
5. Usuario puede descargar o compartir
```

### Lectura de QR (Check-in)
```
1. Staff inicia Scanner QR
   ↓
2. html5-qrcode abre la cámara
   ↓
3. Lee el código QR
   ↓
4. getUserByQRId() busca en Firestore
   ↓
5. registerMealCheckIn() registra la asistencia
   ↓
6. Muestra confirmación en pantalla
```

## 📦 Dependencias Principales

```json
{
  "react": "^18.2.0",              // Framework UI
  "react-dom": "^18.2.0",          // Rendering
  "react-router-dom": "^6.20.0",   // Routing
  "firebase": "^10.7.0",           // Backend
  "qrcode": "^1.5.3",              // Generación QR
  "html5-qrcode": "^2.3.4",        // Scanner QR
  "axios": "^1.6.2",               // HTTP requests
  "react-scripts": "5.0.1"         // Build tools
}
```

## 🎨 Diseño de Colores

```
Primario:     #667eea (Azul morado)
Secundario:   #764ba2 (Púrpura)
Éxito:        #28a745 (Verde)
Error:        #dc3545 (Rojo)
Fondo:        #f5f5f5 (Gris claro)
Texto:        #333333 (Gris oscuro)
```

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| Componentes | 10 |
| Servicios Firebase | 4 |
| Colecciones Firestore | 2 |
| Rutas | 6 |
| Archivos CSS | 10 |
| Líneas de código aprox. | 2000+ |

## 🔄 Ciclo de Vida de Datos

```
Usuario se registra
    ↓
Se crea documento en users/ con UUID
    ↓
QRDisplay.js genera código QR visual
    ↓
Staff escanea QR de participante
    ↓
Se busca usuario en Firestore
    ↓
Se registra check-in en mealCheckIns
    ↓
Se actualiza Timestamp
    ↓
Participante ve el check-in en su dashboard
```

## 🔧 Variables de Entorno

```
REACT_APP_FIREBASE_API_KEY              - Key de API de Firebase
REACT_APP_FIREBASE_AUTH_DOMAIN          - Dominio de autenticación
REACT_APP_FIREBASE_PROJECT_ID           - ID del proyecto
REACT_APP_FIREBASE_STORAGE_BUCKET       - Bucket de almacenamiento
REACT_APP_FIREBASE_MESSAGING_SENDER_ID  - ID del remitente
REACT_APP_FIREBASE_APP_ID               - ID de la aplicación
```

## 📱 Responsividad

La aplicación es responsive para:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## 🚀 Próximas Fases

- [ ] Cloud Functions para envío de emails
- [ ] Integración WhatsApp Business API
- [ ] Panel de reportes y estadísticas
- [ ] Notificaciones en tiempo real
- [ ] Multiidioma (ES/EN)
- [ ] Modo oscuro
- [ ] App móvil nativa

---

Estructura creada: **17 de Diciembre de 2025**
