# 🔧 Guía de Configuración Firebase

Esta guía te ayudará a configurar Firebase para la aplicación Campamento App.

## 1. Crear un Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear proyecto"
3. Ingresa el nombre del proyecto: `campamento-app`
4. Acepta los términos y crea el proyecto
5. Espera a que se complete la creación

## 2. Habilitar Autenticación

1. En la consola de Firebase, ve a **Authentication** (Autenticación)
2. Haz clic en **Get Started** (Comenzar)
3. Ve a la pestaña **Sign-in method**
4. Habilita **Email/Password**
5. Guarda los cambios

## 3. Crear Base de Datos Firestore

1. Ve a **Firestore Database**
2. Haz clic en **Create database**
3. Selecciona la ubicación más cercana
4. Inicia en modo test (para desarrollo)
5. Crea la base de datos

### Reglas de Firestore (Importante)

Ve a **Rules** (Reglas) en Firestore y reemplaza el contenido con:

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

Esto permite que cualquier usuario autenticado lea y escriba en la base de datos.

## 4. Obtener Credenciales de Firebase

1. Ve a **Project Settings** (Configuración del proyecto)
2. En la pestaña **General**, desplázate hasta **Your apps**
3. Haz clic en el ícono de web `</>`
4. Ingresa el nombre de la aplicación: `campamento-app`
5. Registra la aplicación
6. Copia el objeto de configuración

## 5. Configurar Variables de Entorno

1. En la raíz del proyecto, crea un archivo `.env` (copia de `.env.example`)
2. Complétalo con los datos que copiaste:

```env
REACT_APP_FIREBASE_API_KEY=tu-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto-id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
REACT_APP_FIREBASE_APP_ID=tu-app-id
```

## 6. Crear Índices de Firestore (Opcional pero Recomendado)

Para mejorar el rendimiento de las consultas, crea estos índices:

### Índice para Users
- Colección: `users`
- Campo 1: `qrId` (Ascending)
- Campo 2: `role` (Ascending)

### Índice para Schedule
- Colección: `schedule`
- Campo 1: `day` (Ascending)
- Campo 2: `startTime` (Ascending)

## 7. Configuración de Storage (Opcional para futuro)

Si necesitas almacenar imágenes QR en el futuro:

1. Ve a **Storage**
2. Haz clic en **Get Started**
3. Elige una ubicación
4. Reemplaza las reglas con:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 8. Crear Datos de Prueba

### Usuario de Prueba (Staff)
```json
uid: "staff-user-id"
email: "staff@example.com"
name: "Personal de Campamento"
role: "staff"
qrId: "uuid-aqui"
phoneNumber: "+56912345678"
createdAt: timestamp
mealCheckIns: {
  breakfast: [],
  lunch: [],
  dinner: []
}
```

### Usuario de Prueba (Participante)
```json
uid: "participant-user-id"
email: "participant@example.com"
name: "Juan Pérez"
role: "participant"
qrId: "otro-uuid"
phoneNumber: "+56987654321"
createdAt: timestamp
mealCheckIns: {
  breakfast: [],
  lunch: [],
  dinner: []
}
```

### Evento de Prueba
```json
id: "event-1"
title: "Desayuno"
description: "Primer desayuno del campamento"
startTime: "08:00"
endTime: "09:00"
day: "Día 1"
mealType: "breakfast"
createdAt: timestamp
updatedAt: timestamp
```

## 9. Verificar la Conexión

1. Inicia la aplicación: `npm start`
2. Intenta registrarte con un correo de prueba
3. Verifica que se cree el usuario en Firebase
4. Revisa Firestore para ver los datos creados

## 🚨 Seguridad

- **Nunca** compartas tu `REACT_APP_FIREBASE_API_KEY` públicamente
- Usa variables de entorno (archivo `.env`)
- Ten cuidado al hacer push a repositorios públicos (usa `.gitignore`)
- En producción, configura las reglas de Firestore más restrictivas

## 📧 Envío de Email (Futuro)

Para habilitar el envío de QR por email, necesitarás:

1. Firebase Cloud Functions
2. Nodemailer o SendGrid
3. Función que se ejecute al crear un usuario

Ejemplo de Cloud Function:

```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendQREmail = functions.https.onRequest(async (req, res) => {
  const { email, name, qrImage } = req.body;
  
  // Configurar transporte de email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Enviar email
  await transporter.sendMail({
    from: 'noreply@campamento.com',
    to: email,
    subject: 'Tu Código QR del Campamento',
    html: `<h1>Bienvenido ${name}</h1><p>Aquí está tu código QR:</p><img src="${qrImage}" />`
  });

  res.json({ success: true });
});
```

## 🆘 Solución de Problemas

### Error: "Firebase App not initialized"
- Verifica que tu archivo `.env` está en la raíz del proyecto
- Reinicia el servidor: `npm start`

### Error: "Permission denied" en Firestore
- Revisa las reglas de Firestore
- Verifica que estés autenticado

### Los datos no se guardan
- Revisa la consola del navegador (F12)
- Verifica en Firebase Console que la base de datos existe
- Comprueba las reglas de seguridad

## ✅ Checklist Final

- [ ] Proyecto Firebase creado
- [ ] Authentication habilitada
- [ ] Firestore Database creada
- [ ] Reglas de Firestore configuradas
- [ ] Credenciales en archivo `.env`
- [ ] Variables de entorno cargadas correctamente
- [ ] Prueba de registro funciona
- [ ] Datos aparecen en Firestore

¡Ahora estás listo para usar la aplicación!
