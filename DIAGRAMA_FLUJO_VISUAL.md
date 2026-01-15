# 🎫 Campamento App - Diagrama Visual de Flujo

## 1️⃣ FLUJO PRINCIPAL (Entrada a la Aplicación)

```
                    ┌─────────────────┐
                    │  APP INICIADA   │
                    │   App.js        │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ onAuthChange    │
                    │ monitorea       │
                    │ Firebase Auth   │
                    └────────┬────────┘
                             │
                    ┌────────▼───────────┐
                    │ ¿Usuario existe?   │
                    │ currentUser == null│
                    └────────┬─────┬─────┘
                    NO       │     │      SI
                   ┌────────┘     └──────────────┐
                   │                             │
                   ▼                             ▼
        ┌──────────────────────┐      ┌────────────────────┐
        │  MOSTRAR LOGIN       │      │ CARGAR DATOS       │
        │  - QR Scanner        │      │ - localStorage o   │
        │  - Ingreso Manual    │      │   Firestore        │
        │  - Email/Password    │      │                    │
        └──────────────────────┘      └────────┬───────────┘
                   │                           │
                   │ (Usuario autentica)       │
                   │                           │
                   └───────────────┬───────────┘
                                   │
                        ┌──────────▼──────────┐
                        │ Leer userData.role  │
                        │ de Firestore        │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
              STAFF                        PARTICIPANT
              ↓                                    ↓
        ┌──────────────┐               ┌──────────────────┐
        │ STAFF        │               │ PARTICIPANT      │
        │ DASHBOARD    │               │ DASHBOARD        │
        └──────────────┘               └──────────────────┘
```

---

## 2️⃣ DESGLOSE DEL LOGIN (3 Opciones)

```
                    LOGIN.JS
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ OPCIÓN 1 │ │ OPCIÓN 2 │ │ OPCIÓN 3 │
    │   QR    │ │  MANUAL  │ │  EMAIL   │
    │ SCAN    │ │   QR     │ │ PASSWORD │
    └────┬─────┘ └────┬─────┘ └────┬─────┘
         │            │            │
         ▼            ▼            ▼
    ┌─────────────────────────────────────┐
    │ INPUT → VALIDACIÓN → PROCESAMIENTO  │
    └─────────────────────────────────────┘
         │            │            │
         └────────────┼────────────┘
                      │
                 LLAMADA A:
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
    loginByQR()            loginUser()
    (qrId)                (email, pwd)
         │                         │
         ▼                         ▼
    Busca en:             Busca en:
    Firestore             Firebase Auth
    por qrId              Database
         │                         │
         ▼                         ▼
    ┌──────────────┐     ┌──────────────┐
    │ ¿Encontrado? │     │ ¿Credenciales?
    │              │     │ válidas?     │
    └──────┬───┬───┘     └──────┬───┬───┘
       SI  │   │ NO          SI  │   │ NO
           │   │                │   │
           ▼   ▼                ▼   ▼
         ✓   ERROR             ✓   ERROR
         │   (mostrar)         │   (mostrar)
         │                     │
         └─────────┬───────────┘
                   │
            AUTENTICACIÓN
            EXITOSA
                   │
    signInAnonymously() O
    signInWithEmailAndPassword()
                   │
                   ▼
         localStorage.setItem()
         participantData
                   │
                   ▼
            navigate('/')
                   │
                   ▼
          App.js recibe
          currentUser
```

---

## 3️⃣ FLUJO ESPECÍFICO: ESCANEO QR (El más usado)

```
┌─────────────────────────────────────────────────────────┐
│ USUARIO LEVANTA MANILLA FRENTE A CÁMARA                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ Html5QrcodeScanner DETECTA CÓDIGO                        │
│ • Lee píxeles                                           │
│ • Decodifica contenido                                 │
│ • Extrae GUID: "550e8400-e29b-41d4-a716-446655440000"  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ handleQRScanned(qrId) SE EJECUTA                         │
│ • setScanned(true) → Muestra spinner                    │
│ • setLoading(true) → Desactiva botones                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ await loginByQR(qrId)                                   │
│ → Llamada a firebase/auth.js                           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ getUserByQRId(qrId)                                     │
│ → Query Firestore                                      │
│                                                        │
│ const q = query(                                       │
│   collection(db, 'users'),                             │
│   where('qrId', '==', qrId)                            │
│ )                                                      │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │                         │
        ▼                         ▼
    ENCONTRADO:            NO ENCONTRADO:
    userData               userData = null
        │                         │
        ▼                         ▼
    ┌─────────┐            ┌──────────────┐
    │ {       │            │ throw Error  │
    │ uid,    │            │ "Usuario no  │
    │ name,   │            │ encontrado"  │
    │ email,  │            └──────┬───────┘
    │ role,   │                   │
    │ qrId    │            ┌──────▼────────┐
    │ }       │            │ MOSTRAR ALERTA│
    └────┬────┘            │ ROJO          │
         │                 │ Reintentar    │
         │                 └───────────────┘
         ▼
    ✓ VALIDAR:
      userData != null
         │
         ▼
    await signInAnonymously(auth)
    → Crea sesión anónima en Firebase
         │
         ▼
    localStorage.setItem(
      'participantData',
      JSON.stringify(userData)
    )
    localStorage.setItem(
      'participantUID',
      userData.uid
    )
         │
         ▼
    navigate('/')
    → Redirige a dashboard
         │
         ▼
    ┌─────────────────────────────────────────┐
    │ App.js → onAuthChange se dispara        │
    │                                         │
    │ currentUser ≠ null ✓                   │
    │ userData.role = 'participant' ✓        │
    │                                         │
    │ → Renderiza ParticipantDashboard ✓     │
    └─────────────────────────────────────────┘
```

---

## 4️⃣ ESTRUCTURA DE DATOS: QR en Firestore

```
┌─────────────────────────────────────────────────────────┐
│ USUARIOS EN FIRESTORE                                   │
│ /users collection                                       │
└─────────────────────────────────────────────────────────┘

Document 1:
┌─────────────────────────────────────────────────────────┐
│ uid: "user123..."                                       │
│ name: "Juan Pérez"                                      │
│ email: "juan@email.com"                                 │
│ role: "participant"                                     │
│ ┌───────────────────────────────────────────────────┐  │
│ │ qrId: "550e8400-e29b-41d4-a716-446655440000"    │  │ ← KEY PARA BUSCAR
│ └───────────────────────────────────────────────────┘  │
│ phoneNumber: "+34123456789"                             │
│ createdAt: Timestamp                                    │
│ updatedAt: Timestamp                                    │
│ mealCheckIns: {                                         │
│   breakfast: [...],                                     │
│   lunch: [...],                                         │
│   dinner: [...]                                         │
│ }                                                       │
└─────────────────────────────────────────────────────────┘

Document 2:
┌─────────────────────────────────────────────────────────┐
│ uid: "staff456..."                                      │
│ name: "María López"                                     │
│ email: "maria@email.com"                                │
│ role: "staff"                                           │
│ ┌───────────────────────────────────────────────────┐  │
│ │ qrId: "660f8400-e29b-41d4-a716-446655440001"    │  │
│ └───────────────────────────────────────────────────┘  │
│ phoneNumber: "+34987654321"                             │
│ createdAt: Timestamp                                    │
│ updatedAt: Timestamp                                    │
│ mealCheckIns: { ... }                                   │
└─────────────────────────────────────────────────────────┘

Document N...
```

---

## 5️⃣ TABLA COMPARATIVA DE AUTENTICACIÓN

```
┌──────────────┬──────────────────┬──────────────────┬─────────────────┐
│ ASPECTO      │ QR SCAN          │ QR MANUAL        │ EMAIL/PASSWORD  │
├──────────────┼──────────────────┼──────────────────┼─────────────────┤
│ USUARIO      │ Participante      │ Participante     │ Staff/Admin     │
├──────────────┼──────────────────┼──────────────────┼─────────────────┤
│ INPUT        │ Cámara (auto)    │ Copiar/Pegar     │ Email + pwd     │
├──────────────┼──────────────────┼──────────────────┼─────────────────┤
│ BÚSQUEDA     │ WHERE qrId == X  │ WHERE qrId == X  │ Firebase Auth   │
├──────────────┼──────────────────┼──────────────────┼─────────────────┤
│ RESULTADO    │ userData obj     │ userData obj     │ Firebase User   │
├──────────────┼──────────────────┼──────────────────┼─────────────────┤
│ AUTH METHOD  │ signInAnon()     │ signInAnon()     │ signInWithEmail()
├──────────────┼──────────────────┼──────────────────┼─────────────────┤
│ GUARDAR      │ localStorage     │ localStorage     │ Firestore query │
├──────────────┼──────────────────┼──────────────────┼─────────────────┤
│ VELOCIDAD    │ Rápido           │ Medio            │ Lento (búsqueda)│
├──────────────┼──────────────────┼──────────────────┼─────────────────┤
│ DASHBOARD    │ Participant      │ Participant      │ Staff           │
└──────────────┴──────────────────┴──────────────────┴─────────────────┘
```

---

## 6️⃣ CICLO COMPLETO: Usuario Participante

```
INICIO
  │
  ▼
┌─────────────────────────────────────┐
│ Usuario abre app en smartphone      │
│ Está en campamento                  │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ currentUser == null (primera vez)   │
│ App.js renderiza Login              │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Usuario ve pantalla Login            │
│ • Cámara activada                   │
│ • Botón "📝 Ingresar manualmente"   │
│ • Footer con "🔑 Acceso alternativo"│
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Usuario levanta manilla al frente   │
│ de la cámara (tiene QR impreso)     │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ QR se detecta automáticamente        │
│ Html5QrcodeScanner lo decodifica     │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Spinner aparece: "Verificando..."   │
│ loginByQR(qrId) busca en Firestore  │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ ¿Usuario existe con ese qrId?       │
└─────────────────────────────────────┘
  │
  ├─→ SI: userData retornado
  │       │
  │       ▼
  │   signInAnonymously()
  │       │
  │       ▼
  │   localStorage guardado
  │       │
  │       ▼
  │   ✓ LOGIN EXITOSO
  │       │
  │       ▼
  │   ParticipantDashboard
  │       │
  │       └─→ Ver cronograma
  │       │
  │       └─→ Ver mi QR (código mostrado)
  │       │
  │       └─→ Check-ins de comidas
  │
  └─→ NO: Error mostrado
          │
          ▼
      "Usuario no encontrado"
      ¿Reintentar?
          │
          ├─→ Vuelve a LOGIN
          │
          └─→ Intenta con manual input
```

---

## 7️⃣ CICLO COMPLETO: Usuario Staff

```
INICIO
  │
  ▼
┌─────────────────────────────────────┐
│ Staff abre app en desktop/tablet    │
│ No tiene manilla QR                 │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ currentUser == null                 │
│ App.js renderiza Login              │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Staff ve Login                      │
│ • Cámara (no le sirve)              │
│ • Footer: "🔑 Acceso alternativo"   │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Staff hace click en footer          │
│ emailLogin = true                   │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Aparece formulario:                 │
│ • Email field                       │
│ • Password field                    │
│ • Botones: Entrar, Volver           │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Staff ingresa:                      │
│ email: staff@campamento.com         │
│ password: ••••••••                  │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ handleEmailSubmit()                 │
│ loginUser(email, password)          │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Firebase Auth verifica credenciales │
│ en base de datos de usuarios        │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ ¿Válidas?                           │
└─────────────────────────────────────┘
  │
  ├─→ SI: Firebase retorna user
  │       │
  │       ▼
  │   onAuthChange → App.js
  │       │
  │       ▼
  │   getCurrentUserData(uid)
  │       │
  │       ▼
  │   userData.role = "staff" ✓
  │       │
  │       ▼
  │   ✓ LOGIN EXITOSO
  │       │
  │       ▼
  │   StaffDashboard
  │       │
  │       ├─→ QR Scanner (escanear otros)
  │       │
  │       ├─→ Gestionar Usuarios
  │       │
  │       ├─→ Crear Eventos
  │       │
  │       ├─→ Check-in de Comidas
  │       │
  │       └─→ Reportes
  │
  └─→ NO: Error mostrado
          │
          ▼
      "Credenciales inválidas"
      ¿Reintentar?
```

---

## 8️⃣ VARIABLES DE ESTADO CRÍTICAS

```
┌─────────────────────────────────────────────────────────────────┐
│ LOGIN.JS STATE VARIABLES                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ scanned: boolean                                                │
│ └─ true → Mostrar spinner "Procesando"                         │
│ └─ false → Mostrar cámara o formulario                         │
│                                                                 │
│ loading: boolean                                                │
│ └─ true → Desactivar botones, mostrar "⏳"                     │
│ └─ false → Botones activos, mostrar "✓"                       │
│                                                                 │
│ manualInput: boolean                                            │
│ └─ false → QR Scanner (cámara)                                 │
│ └─ true → QR Manual (pegar código)                             │
│                                                                 │
│ emailLogin: boolean                                             │
│ └─ false → Interfaz QR                                         │
│ └─ true → Interfaz Email/Password                              │
│                                                                 │
│ error: string                                                   │
│ └─ "" → No mostrar                                              │
│ └─ "mensaje" → Mostrar alerta roja                             │
│                                                                 │
│ qrInput: string                                                 │
│ └─ Contenido del GUID pegado                                   │
│                                                                 │
│ formData: { email, password }                                   │
│ └─ Credenciales de staff                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ APP.JS STATE VARIABLES                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ currentUser: FirebaseUser | null                                │
│ └─ null → Renderizar Login                                      │
│ └─ objeto → Usuario autenticado                                │
│                                                                 │
│ userData: object | null                                         │
│ └─ null → Esperando cargar                                      │
│ └─ { role, name, email... } → Datos cargados                   │
│                                                                 │
│ loading: boolean                                                │
│ └─ true → Mostrar spinner completo                             │
│ └─ false → Renderizar componentes                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9️⃣ FLUJO DE ERRORES

```
ERROR 1: QR No Encontrado
┌────────────────────────────────────────────┐
│ Escanea un QR que NO existe en BD         │
│ getUserByQRId() retorna null              │
│ → Valida: if (!userData)                  │
│ → throw Error("Usuario no encontrado")    │
│ → catch(err) setError(err.message)        │
│ → Muestra alerta roja                     │
│ → Usuario puede reintentar               │
└────────────────────────────────────────────┘

ERROR 2: Credenciales Inválidas
┌────────────────────────────────────────────┐
│ Staff ingresa email/pwd incorrecto        │
│ signInWithEmailAndPassword() falla        │
│ → Firebase lanza error                    │
│ → catch(err) setError(err.message)        │
│ → Muestra alerta roja                     │
│ → Usuario puede reintentar               │
└────────────────────────────────────────────┘

ERROR 3: Falla en Carga de Datos
┌────────────────────────────────────────────┐
│ App.js intenta getCurrentUserData()        │
│ Firestore no responde                     │
│ → console.error()                         │
│ → setUserData(null)                       │
│ → Usuario redirigido a login              │
└────────────────────────────────────────────┘

ERROR 4: No es Staff (en StaffDashboard)
┌────────────────────────────────────────────┐
│ Usuario con role='participant' intenta    │
│ acceder a StaffDashboard                  │
│ → Valida: if (data?.role !== 'staff')     │
│ → navigate('/participant-dashboard')      │
│ → Redirige a su verdadero dashboard      │
└────────────────────────────────────────────┘
```

---

## 🔟 RESUMEN VISUAL: Qué Ve Cada Usuario

```
╔════════════════════════════════════════════════════════════════╗
║ PARTICIPANTE                                                   ║
║ (Autenticado por QR)                                           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║ ┌──────────────────────────────────────────────────────────┐  ║
║ │ 🏕️ Campamento App - Dashboard Participante              │  ║
║ ├──────────────────────────────────────────────────────────┤  ║
║ │ ☰ Menu                                                   │  ║
║ │                                                          │  ║
║ │ Tabs:                                                    │  ║
║ │ ┌────────────┐ ┌────────────┐ ┌────────────┐           │  ║
║ │ │ 📅 Horario │ │ 📱 Mi QR   │ │ ✅ Check-in│           │  ║
║ │ └────────────┘ └────────────┘ └────────────┘           │  ║
║ │                                                          │  ║
║ │ Contenido: (depende tab)                                 │  ║
║ │ • Cronograma de eventos                                 │  ║
║ │ • Mi código QR (imagen mostrada)                        │  ║
║ │ • Historial de check-ins (breakfast/lunch/dinner)      │  ║
║ │                                                          │  ║
║ │ [Cerrar Sesión]                                         │  ║
║ └──────────────────────────────────────────────────────────┘  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════╗
║ STAFF                                                          ║
║ (Autenticado por Email/Password)                               ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║ ┌──────────────────────────────────────────────────────────┐  ║
║ │ 🏕️ Campamento App - Dashboard Staff                     │  ║
║ ├──────────────────────────────────────────────────────────┤  ║
║ │ ☰ Menu                                                   │  ║
║ │                                                          │  ║
║ │ Tabs:                                                    │  ║
║ │ ┌─────────────┐ ┌──────────────┐ ┌───────────────────┐ │  ║
║ │ │ 📱 Scanner  │ │ 👥 Usuarios  │ │ 📅 Cronograma   │ │  ║
║ │ └─────────────┘ └──────────────┘ └───────────────────┘ │  ║
║ │                                                          │  ║
║ │ ┌─────────────┐ ┌──────────────┐                        │  ║
║ │ │ 🍽️ Check-in │ │ 📊 Reportes  │                        │  ║
║ │ └─────────────┘ └──────────────┘                        │  ║
║ │                                                          │  ║
║ │ Funciones:                                               │  ║
║ │ • Escanear QR de participantes                          │  ║
║ │ • Ver/Editar datos de usuarios                          │  ║
║ │ • Crear y editar eventos                                │  ║
║ │ • Registrar check-ins (comidas)                         │  ║
║ │ • Registrar nuevos participantes                        │  ║
║ │                                                          │  ║
║ │ [Cerrar Sesión]                                         │  ║
║ └──────────────────────────────────────────────────────────┘  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Conclusión

La aplicación usa un **flujo de autenticación en dos capas**:
1. **Capa de Autenticación**: Firebase Auth (email/pwd) o Anónimo (QR)
2. **Capa de Datos**: Firestore con búsqueda por `qrId` o por `uid`

El sistema es **flexible, seguro y eficiente** porque:
- ✅ Participantes entran con QR (rápido)
- ✅ Staff entra con credenciales (seguro)
- ✅ Roles determinan permisos
- ✅ Datos centralizados en Firestore
- ✅ localStorage optimiza QR login
