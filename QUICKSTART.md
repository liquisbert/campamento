# 🚀 Guía Rápida de Inicio

## Prerequisitos

- Node.js instalado (v14 o superior)
- npm o yarn
- Cuenta de Firebase

## Pasos para Ejecutar

### 1. Instalación Inicial

```bash
# Navegar a la carpeta del proyecto
cd campamento

# Instalar dependencias
npm install --legacy-peer-deps
```

### 2. Configuración de Firebase

1. Lee `FIREBASE_SETUP.md` para configurar tu proyecto Firebase
2. Crea un archivo `.env` en la raíz del proyecto con tus credenciales:

```env
REACT_APP_FIREBASE_API_KEY=tu-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-auth-domain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
REACT_APP_FIREBASE_APP_ID=tu-app-id
```

### 3. Iniciar la Aplicación

```bash
# Iniciar el servidor de desarrollo
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 🧪 Pruebas Iniciales

### Crear Usuario de Prueba (Participante)
1. Haz clic en "Regístrate aquí"
2. Completa el formulario:
   - Nombre: Juan Pérez
   - Email: juan@example.com
   - Contraseña: Password123
3. Se creará automáticamente tu código QR
4. Ve a "Mi QR" para visualizarlo

### Crear Usuario de Prueba (Staff)
1. Registra otro usuario diferente
2. Ve a Firebase Console → Firestore
3. Edita el documento del usuario en la colección `users`
4. Cambia el campo `role` de "participant" a "staff"
5. Cierra sesión y vuelve a iniciar con las nuevas credenciales

### Crear Eventos en el Cronograma (Como Staff)
1. Ve a la pestaña "Cronograma"
2. Haz clic en "Agregar Evento"
3. Completa los campos:
   - Título: Desayuno
   - Día: Día 1
   - Hora de Inicio: 08:00
   - Hora de Fin: 09:00
   - Tipo de Comida: 🥐 Desayuno
4. Haz clic en "Crear Evento"

### Probar Scanner QR
1. Como Staff, ve a "Scanner QR"
2. Selecciona "Desayuno"
3. Haz clic en "Iniciar Scanner QR"
4. En otra pestaña (como Participante), ve a "Mi QR"
5. Toma una captura de pantalla del QR o úsalo directamente
6. Apunta la cámara al QR
7. El sistema registrará la asistencia automáticamente

## 📱 Funcionalidades Principales

### Participante
- ✅ Registro con generación de QR único
- 📱 Descarga del código QR
- 💬 Compartir QR en WhatsApp
- 📅 Ver cronograma del campamento
- ✅ Seguimiento de check-ins de comidas

### Staff
- 📱 Escanear QR para registrar asistencia
- 📅 Crear, editar y eliminar eventos
- 👥 Gestionar roles de usuarios
- 🔍 Ver información de cualquier usuario
- 📊 Ver estadísticas de check-ins

## 🛠️ Comandos Útiles

```bash
# Instalar dependencias
npm install --legacy-peer-deps

# Iniciar en modo desarrollo
npm start

# Crear build para producción
npm run build

# Ejecutar pruebas
npm test

# Ver logs
npm start -- --verbose

# Limpiar cache
npm cache clean --force
```

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module"
```bash
# Eliminar node_modules y reinstalar
rm -r node_modules
npm install --legacy-peer-deps
```

### Error: "Firebase not initialized"
- Verifica que el archivo `.env` está en la raíz
- Reinicia el servidor: `Ctrl+C` y `npm start`

### La cámara no funciona
- Asegúrate de haber concedido permisos de cámara al navegador
- Algunos navegadores requieren HTTPS

### Los datos no se guardan en Firestore
- Verifica las reglas de Firestore en Firebase Console
- Comprueba que estés autenticado

## 📖 Estructura de Archivos

```
campamento/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Componentes React
│   ├── firebase/            # Lógica de Firebase
│   ├── App.js              # Componente principal
│   ├── index.js            # Punto de entrada
│   └── index.css            # Estilos globales
├── package.json            # Dependencias
├── .env.example            # Plantilla de variables
├── README.md               # Documentación
├── FIREBASE_SETUP.md       # Guía de Firebase
└── QUICKSTART.md          # Este archivo
```

## 🚀 Despliegue en Producción

Para desplegar en producción:

```bash
# Crear build optimizado
npm run build

# El contenido en la carpeta 'build' está listo para deploy
# Puedes usar Firebase Hosting, Netlify, Vercel, etc.
```

### Con Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Inicializar Firebase
firebase init hosting

# Desplegar
firebase deploy
```

## 📞 Contacto

Para preguntas o problemas, por favor contacta al equipo de desarrollo.

---

¡Listo para empezar! 🎉
