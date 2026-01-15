# 📋 Sistema de Registro con QR - Guía de Implementación

## Cambios Realizados

Se ha actualizado la lógica del sistema de registro de participantes para implementar un modelo **staff-only** donde solo el personal del campamento puede registrar nuevos usuarios escaneando sus códigos QR.

### 1. **firebase/auth.js** - Nueva función `registerUserWithQR()`

#### Función agregada:
```javascript
export const registerUserWithQR = async (
  name,           // Nombre del participante
  qrId,           // GUID del código QR escaneado
  phoneNumber,    // Teléfono (opcional)
  role            // Rol (por defecto 'participant')
)
```

#### Características:
- ✅ Valida que el `qrId` no esté ya asignado a otro usuario
- ✅ Auto-genera email: `nombre.qrPrefix@campamento.local`
- ✅ Auto-genera contraseña temporal aleatoria (12 caracteres)
- ✅ Crea usuario en Firebase Auth
- ✅ Guarda perfil en Firestore con `qrId` como identificador
- ✅ Envía notificación WhatsApp al participante
- ✅ Retorna credenciales para confirmación

---

## 2. **ParticipantRegistration.js** - Reescrito con Escáner QR

### Flujo de Registro (3 pasos):

#### **Paso 1: Formulario de Datos**
- Staff ingresa el nombre del participante
- Staff ingresa teléfono (opcional, para WhatsApp)
- Botón "Continuar" → avanza al escáner

#### **Paso 2: Escaneo de Código QR**
- Se abre escáner de cámara
- Staff escanea el código QR de la manilla
- Automáticamente captura el GUID del QR
- Muestra vista previa del código detectado

#### **Paso 3: Confirmación y Registro**
- Muestra el código QR escaneado para confirmación
- Opción: "Confirmar Registro" → completa el registro
- Opción: "Escanear Otro QR" → vuelve al paso 2
- Opción: "Volver al Formulario" → vuelve al paso 1

### Estados del Componente:
```javascript
- step: 'form' | 'scanning' | 'processing'
- formData: { name, phoneNumber }
- scannedQR: string (GUID capturado)
- loading: boolean (durante registro)
- error: string (mensaje de error)
```

### Métodos Principales:
- `handleChange()` - Actualiza campos del formulario
- `initializeScanner()` - Inicializa el lector de QR
- `handleFormSubmit()` - Valida nombre y avanza a escaneo
- `handleQRScanned()` - Procesa el QR escaneado y registra usuario

---

## 3. **Register.js** - Deshabilitado para Público

### Cambio de Funcionalidad:
- ❌ Ya no permite auto-registro
- ℹ️ Muestra mensaje informativo
- 🔄 Redirije automáticamente a /login después de 2 segundos
- 📱 Botón manual para volver al inicio de sesión

### Mensaje Mostrado:
```
"El registro de participantes solo puede ser realizado por el personal 
de staff del campamento. Si eres un participante, solicita a un miembro 
del staff que te registre con tu manilla de código QR."
```

---

## 4. **Auth.css** - Estilos para el Nuevo Sistema

### Nuevas Clases CSS:
- `.qr-reader-registration` - Contenedor del escáner en modal
- `.step-description` - Texto descriptivo de cada paso
- `.processing-section` - Sección de confirmación de QR
- `.processing-buttons` - Botones de acción (Confirmar, Escanear, Volver)
- `.registration-disabled-message` - Mensaje de registro deshabilitado
- `.info-box` - Caja informativa

### Características Visuales:
- Escáner con aspecto 1:1 (cuadrado)
- Controles flotantes sobre la cámara
- Animaciones suaves en transiciones
- Diseño responsive para móviles
- Colores consistentes con tema verde (#005312)

---

## 5. **App.js** - Sin Cambios Necesarios

La estructura de rutas ya soporta ambos componentes:
- `/login` - Inicio de sesión
- `/register` - Muestra mensaje y redirije a login
- Rutas protegidas basadas en rol

---

## Flujo Completo de Registro

```
┌─────────────────────────────────────────────┐
│  Staff en StaffDashboard                    │
│  Hace clic en "Registrar Nuevo Participante"│
└──────────────────┬──────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Modal de Registro    │
        │ (ParticipantReg.js)  │
        └──────────────┬───────┘
                       │
        ┌──────────────▼──────────────┐
        │ PASO 1: Formulario          │
        │ • Ingresa nombre            │
        │ • Ingresa teléfono (opt.)   │
        │ • Clic en "Continuar"       │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────────┐
        │ PASO 2: Escaneo QR             │
        │ • Cámara abierta               │
        │ • Escanea manilla del usuario  │
        │ • Captura GUID del QR          │
        └──────────────┬──────────────────┘
                       │
        ┌──────────────▼─────────────────────┐
        │ PASO 3: Confirmación                │
        │ • Muestra QR detectado              │
        │ • Clic en "Confirmar Registro"     │
        └──────────────┬─────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────┐
        │ registerUserWithQR() se ejecuta:            │
        │ 1. Valida qrId único                       │
        │ 2. Auto-genera email                       │
        │ 3. Auto-genera contraseña                  │
        │ 4. Crea usuario en Firebase Auth           │
        │ 5. Guarda en Firestore con qrId            │
        │ 6. Envía WhatsApp al teléfono              │
        └──────────────┬──────────────────────────────┘
                       │
        ┌──────────────▼──────────────────┐
        │ ✅ Registro Completado          │
        │ • Toast de éxito                │
        │ • Modal se cierra               │
        │ • Participante puede iniciar    │
        │   sesión con su QR              │
        └─────────────────────────────────┘
```

---

## Características de Seguridad

✅ **Validación de Unicidad**: Cada QR solo puede ser asignado a un usuario
✅ **Credenciales Temporales**: Auto-generadas, no compartidas en claro
✅ **Registro Staff-Only**: Solo personal autorizado puede registrar
✅ **Notificación WhatsApp**: El participante recibe sus credenciales
✅ **Firestore Query**: Búsqueda rápida de usuarios por qrId

---

## Cómo Usar

### Para Staff:
1. Acceder al StaffDashboard
2. Buscar opción "Registrar Nuevo Participante"
3. Modal aparece con 3 pasos
4. Completar nombre y teléfono
5. Escanear código QR de la manilla
6. Confirmar registro
7. ✅ Participante registrado y notificado

### Para Participantes:
1. Intentar acceder a /register → ver mensaje
2. Redirigido automáticamente a /login
3. Iniciar sesión escaneando su QR (manilla)
4. Acceder al ParticipantDashboard

---

## Variables de Entorno Requeridas

Asegurar que estas estén configuradas en `firebase/config.js`:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_DATABASE_URL`
- `REACT_APP_TWILIO_ACCOUNT_SID`
- `REACT_APP_TWILIO_AUTH_TOKEN`
- `REACT_APP_TWILIO_PHONE_NUMBER`

---

## Próximos Pasos (Opcional)

- 📊 Panel de análisis de registros para staff
- 🔄 Opción de re-escaneo si el QR se daña
- 📧 Email con código QR para impresión
- 🔐 Cambio de contraseña en primer acceso
- 📱 Validación de formato de teléfono

---

## Notas Técnicas

- El `qrId` es el GUID completo del código QR (ej: `550e8400-e29b-41d4-a716-446655440000`)
- El email auto-generado usa formato: `nombre.xxxxx@campamento.local`
- La contraseña temporal se genera con: `Math.random().toString(36).slice(-12)`
- El escáner usa `html5-qrcode` con fps: 10 y qrbox: 280x280
- Firestore query: `WHERE qrId == scannedValue`

---

**Última actualización**: $(date)
**Versión del sistema**: 2.0 (Staff-Controlled Registration)
