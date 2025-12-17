# 🏕️ CAMPAMENTO - NOTIFICACIONES (Solo WhatsApp)

## 📋 TABLA DE CONTENIDOS
1. Estado Actual
2. Lo Que Necesitas Hacer (AQUÍ)
3. Pasos de Configuración
4. Troubleshooting
5. Estructura de Código
6. Nuevas Funcionalidades

---

## 🎯 ESTADO ACTUAL

```
✅ Aplicación corriendo:        http://localhost:3000
✅ Registro de usuarios:        Email + Teléfono capturados
✅ QR generado:                UUID único por usuario
✅ Cloud Functions:            Creadas + 538 paquetes instalados
✅ Código modificado:          Solo WhatsApp (sin emails)
✅ Staff puede registrar:      Nuevos participantes con modal

❌ PENDIENTE (TU TURNO):
   1. Obtener credenciales Twilio
   2. Configurar en Firebase
   3. Desplegar Cloud Functions
   4. Probar
```

---

## 🆕 NUEVAS FUNCIONALIDADES

### 1. Solo WhatsApp (sin Emails)
- ✅ Emails eliminados completamente
- ✅ Solo envía WhatsApp al registrarse
- ✅ Más simple y rápido

### 2. Staff Registra Participantes
- ✅ Botón "➕ Registrar Participante" en StaffDashboard
- ✅ Modal con formulario
- ✅ Teléfono obligatorio
- ✅ WhatsApp se envía automáticamente al guardar
- ✅ Contraseña se genera automática (opcional)

---

## ⚡ LO QUE NECESITAS HACER AHORA

### OPCIÓN: SOLO WHATSAPP (RECOMENDADO - 10 MINUTOS)

```bash
# 1. Obtén credenciales de Twilio
#    - Ve a: https://www.twilio.com/console
#    - Copia: Account SID, Auth Token, WhatsApp Number

# 2. Ejecuta en tu terminal (reemplaza valores):
firebase functions:config:set \
  twilio.account_sid="ACxxxxxxxxxxxxxxxx" \
  twilio.auth_token="xxxxxxxxxxxxxxxx" \
  twilio.whatsapp_number="+1415238886"

# 3. Despliega
firebase deploy --only functions

# 4. Listo! Prueba registrando participantes
```

---

## 📝 PASOS DETALLADOS

### PASO 1: Verificar Firebase CLI

```bash
firebase --version
# Si no: npm install -g firebase-tools
```

### PASO 2: Obtener Credenciales Twilio

1. Ve a: **https://www.twilio.com/console**
2. Crea cuenta (prueba gratuita con $15)
3. Copia:
   - **Account SID**: ACxxxxxxxxxxxxxxxx
   - **Auth Token**: xxxxxxxxxxxxxxxx
   - **WhatsApp Number**: +1415238886
4. En WhatsApp Sandbox, agrega tu número primero

### PASO 3: Autenticarse en Firebase

```bash
firebase login
```

### PASO 4: Seleccionar Proyecto

```bash
firebase use --add
# Selecciona tu proyecto del campamento
```

### PASO 5: Configurar Twilio en Firebase

```bash
firebase functions:config:set \
  twilio.account_sid="ACxxxxxxxxxxxxxxxx" \
  twilio.auth_token="xxxxxxxxxxxxxxxx" \
  twilio.whatsapp_number="+1415238886"
```

### PASO 6: Verificar Configuración

```bash
firebase functions:config:get

# Deberías ver:
# {
#   "twilio": {
#     "account_sid": "ACxxxxxxxxxxxxxxxx",
#     "auth_token": "xxxxxxxxxxxxxxxx",
#     "whatsapp_number": "+1415238886"
#   }
# }
```

### PASO 7: Desplegar

```bash
firebase deploy --only functions

# Verás:
# ✔ Deploy complete!
#
# Function URL (sendRegistrationNotifications): https://...
# Function URL (sendWhatsAppNotification): https://...
```

### PASO 8: Probar

**Opción 1: Registro directo**
1. Abre: http://localhost:3000
2. Click: "Regístrate aquí"
3. Rellena con tu teléfono REAL (+56912345678)
4. ✅ Revisa tu WhatsApp

**Opción 2: Staff registra participante**
1. Abre: http://localhost:3000
2. Login como STAFF
3. Click: "➕ Registrar Participante"
4. Rellena el formulario (teléfono obligatorio)
5. Click: "Registrar Participante"
6. ✅ Revisa WhatsApp del participante

---

## 🐛 TROUBLESHOOTING

### ❌ "No llega WhatsApp"

**Soluciones:**
1. Verifica número en formato: `+56912345678`
2. En Twilio Console, agrega tu número al WhatsApp Sandbox
3. Comprueba credenciales:
   ```bash
   firebase functions:config:get
   ```
4. Ve los logs:
   ```bash
   firebase functions:log --lines=50
   ```

### ❌ "Error: Twilio no está configurado"

```bash
# Verifica configuración
firebase functions:config:get

# Si está vacío, configura:
firebase functions:config:set \
  twilio.account_sid="ACxxxxxxxxxxxxxxxx" \
  twilio.auth_token="xxxxxxxxxxxxxxxx" \
  twilio.whatsapp_number="+1415238886"

# Vuelve a desplegar
firebase deploy --only functions
```

### ❌ "firebase: command not found"
```bash
npm install -g firebase-tools
```

### ❌ Error al desplegar
```bash
firebase deploy --only functions --verbose
```

---

## 💻 CAMBIOS DE CÓDIGO

### Cloud Functions

**Archivo: `functions/index.js`**

```javascript
// Cambio 1: Eliminado Nodemailer (solo Twilio)
- const nodemailer = require('nodemailer');
+ const twilio = require('twilio');

// Cambio 2: Nueva función para staff
exports.sendWhatsAppNotification = functions.https.onCall(async (data, context) => {
  // Envía WhatsApp cuando staff registra participante
});

// Cambio 3: Simplificado sendRegistrationNotifications
// Solo envía WhatsApp, sin emails
```

### Componentes React

**Archivo: `src/components/ParticipantRegistration.js`** (NUEVO)
- Modal para que staff registre participantes
- Campos: Nombre, Email, Teléfono, Contraseña (opcional)
- Envía WhatsApp automáticamente al guardar

**Archivo: `src/components/StaffDashboard.js`** (ACTUALIZADO)
- Botón: "➕ Registrar Participante"
- Abre modal de registro
- Recarga lista de usuarios después de registrar

**Archivo: `src/firebase/notifications.js`** (ACTUALIZADO)
- Nueva función: `sendWhatsAppToParticipant()`
- Llama a Cloud Function `sendWhatsAppNotification`

---

## 📊 FLUJO ACTUAL

```
OPCIÓN 1: Usuario se registra
────────────────────────────
Usuario abre http://localhost:3000
    ↓
Click "Regístrate"
    ↓
Rellena: Email, Nombre, Teléfono, Contraseña
    ↓
Cloud Function se activa automáticamente
    ↓
Genera UUID para QR
    ↓
Envía WhatsApp con link del QR
    ↓
Usuario recibe notificación


OPCIÓN 2: Staff registra participante
──────────────────────────────
Staff inicia sesión
    ↓
Click "➕ Registrar Participante"
    ↓
Modal se abre
    ↓
Rellena: Email, Nombre, Teléfono, Contraseña (opcional)
    ↓
Cloud Function se activa al guardar
    ↓
Genera UUID para QR
    ↓
Envía WhatsApp con link del QR
    ↓
Participante recibe notificación
```

---

## 💬 EJEMPLO DE MENSAJE WHATSAPP

```
¡Hola Juan! 👋

Tu registro en el campamento ha sido exitoso. 🏕️

Tu código QR:
https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=uuid-unico

¡Que disfrutes! 🎉
```

---

## ✅ CHECKLIST FINAL

- [ ] Twilio CLI instalado/verificado
- [ ] Account SID y Auth Token obtenidos
- [ ] Autenticado en Firebase
- [ ] Variables configuradas en Firebase Console
- [ ] Cloud Functions desplegadas
- [ ] Prueba 1: Registro directo en http://localhost:3000
- [ ] Prueba 2: Staff registra participante
- [ ] WhatsApp recibido ✓
- [ ] Código QR visible en WhatsApp ✓

---

## 📞 RESUMEN RÁPIDO

| Tarea | Tiempo | Comando |
|-------|--------|---------|
| Obtener credenciales Twilio | 3 min | ir a console.twilio.com |
| Configurar en Firebase | 2 min | `firebase functions:config:set ...` |
| Desplegar | 3 min | `firebase deploy --only functions` |
| Probar | 2 min | http://localhost:3000 |
| **TOTAL** | **~10 min** | - |

---

## 🚀 COMIENZA AHORA

1. **Ve a**: https://www.twilio.com/console
2. **Obtén**: Account SID, Auth Token, WhatsApp Number
3. **Ejecuta en terminal**:
   ```bash
   firebase functions:config:set \
     twilio.account_sid="ACxxxxxxxxxxxxxxxx" \
     twilio.auth_token="xxxxxxxxxxxxxxxx" \
     twilio.whatsapp_number="+1415238886"
   ```
4. **Despliega**:
   ```bash
   firebase deploy --only functions
   ```
5. **Prueba** en http://localhost:3000

---

**¿PREGUNTAS?** Todos los logs están disponibles:
```bash
firebase functions:log --lines=100
```
````
