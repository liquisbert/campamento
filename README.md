# 🏕️ Campamento App

Aplicación web completa para la gestión de campamentos de 3 días. Permite registrar participantes, crear cronogramas, gestionar roles y registrar asistencia a través de códigos QR.

## ✨ Características

### Para Participantes
- ✅ Registro e inicio de sesión
- 📱 Código QR único y permanente al registrarse
- 📱 Descarga y compartir QR por WhatsApp
- 📅 Visualización del cronograma del campamento
- ✅ Seguimiento de check-ins de comidas
- 📧 Recepción de QR por email y WhatsApp

### Para Personal (Staff)
- 📱 Scanner QR para registrar asistencia a comidas
- 📅 Crear, editar y eliminar eventos del cronograma
- 👥 Gestión de usuarios (cambiar roles)
- 🔍 Ver información de cualquier usuario
- 📱 Acceso a QR de participantes
- 💬 Compartir QR por WhatsApp
- 🥐 Registro de desayunos, almuerzos y cenas

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18
- **Backend:** Firebase (Authentication, Firestore, Storage)
- **QR:** qrcode.react, html5-qrcode
- **Routing:** React Router v6
- **HTTP:** Axios
- **Estilos:** CSS3

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta Firebase

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd campamento
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Authentication (Email/Password)
4. Crea una base de datos Firestore
5. Copia tu configuración de Firebase

### 4. Crear archivo .env
```bash
cp .env.example .env
```

Completa el archivo `.env` con tus credenciales de Firebase:
```
REACT_APP_FIREBASE_API_KEY=tu-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-auth-domain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
REACT_APP_FIREBASE_APP_ID=tu-app-id
```

## 🎮 Ejecutar la Aplicación

### Modo Desarrollo
```bash
npm start
```

La aplicación se abrirá en `http://localhost:3000`

### Crear Build para Producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
campamento/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── ParticipantDashboard.js
│   │   ├── StaffDashboard.js
│   │   ├── QRDisplay.js
│   │   ├── QRScanner.js
│   │   ├── MealCheckIn.js
│   │   ├── ScheduleView.js
│   │   ├── ScheduleEditor.js
│   │   ├── UserManagement.js
│   │   └── *.css (archivos de estilos)
│   ├── firebase/
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── schedule.js
│   │   └── notifications.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── .env.example
└── README.md
```

## 🔐 Configuración de Firestore

### Colecciones Necesarias

#### 1. **users**
```json
{
  "uid": "string",
  "email": "string",
  "name": "string",
  "role": "participant|staff",
  "qrId": "string (UUID)",
  "phoneNumber": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "mealCheckIns": {
    "breakfast": [{"timestamp": "timestamp", "date": "string"}],
    "lunch": [{"timestamp": "timestamp", "date": "string"}],
    "dinner": [{"timestamp": "timestamp", "date": "string"}]
  }
}
```

#### 2. **schedule**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "startTime": "string (HH:mm)",
  "endTime": "string (HH:mm)",
  "day": "Día 1|Día 2|Día 3",
  "mealType": "breakfast|lunch|dinner|null",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 📱 Cómo Usar

### Registro e Inicio de Sesión
1. Haz clic en "Regístrate aquí"
2. Completa el formulario con tus datos
3. Se generará automáticamente un código QR único
4. Inicia sesión con tus credenciales

### Como Participante
1. Ve a la sección "Mi QR" para ver tu código
2. Descárgalo o compártelo por WhatsApp
3. Consulta el cronograma en la sección "Cronograma"
4. Visualiza tus asistencias en "Mis Check-ins"

### Como Personal
1. Ve a "Scanner QR" para registrar asistencia
2. Selecciona el tipo de comida (Desayuno/Almuerzo/Cena)
3. Escanea el QR del participante
4. El sistema registrará la asistencia automáticamente

### Gestión del Cronograma
1. Ve a la sección "Cronograma"
2. Haz clic en "Agregar Evento"
3. Completa los detalles del evento
4. Opcionalmente, asócialo a una comida
5. Guarda los cambios

### Gestión de Usuarios
1. Ve a la sección "Usuarios"
2. Filtra por rol si es necesario
3. Haz clic en 📱 para ver el QR de un usuario
4. Usa ⬆️ para promover a Staff o ⬇️ para cambiar a Participante

## 🔧 Mejoras Futuras

- [ ] Envío automático de QR por email usando Firebase Cloud Functions
- [ ] Integración con WhatsApp Business API
- [ ] Reportes y estadísticas detalladas
- [ ] Notificaciones en tiempo real
- [ ] Soporte para múltiples idiomas
- [ ] Tema oscuro
- [ ] Aplicación móvil nativa
- [ ] Integración con Google Calendar

## 📝 Notas Importantes

- El código QR es único y permanente para cada usuario
- Los roles pueden ser cambiados en cualquier momento
- Los eventos del cronograma se pueden editar antes del campamento
- Los registros de comidas se almacenan por usuario y tipo

## ❓ Solución de Problemas

### Error: "apiKey is not valid"
- Verifica que tu archivo `.env` tiene las credenciales correctas
- Asegúrate de que copiaste exactamente los valores de Firebase Console

### La cámara no funciona
- Verifica los permisos de la cámara en tu navegador
- Algunos navegadores requieren HTTPS para acceder a la cámara

### Firebase no se conecta
- Verifica las reglas de Firestore:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📞 Contacto y Soporte

Para preguntas o soporte, por favor contacta al equipo de desarrollo.

## 📄 Licencia

Este proyecto está bajo licencia MIT.

---

**Hecho con ❤️ para tu campamento**
