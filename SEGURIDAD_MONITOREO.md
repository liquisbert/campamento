🔒 SEGURIDAD Y MONITOREO EN PRODUCCIÓN

═════════════════════════════════════════════════════════════════════════════

✅ CHECKLIST DE SEGURIDAD
═════════════════════════════════════════════════════════════════════════════

CREDENCIALES:
☐ .env NO está en GitHub (git rm --cached .env)
☐ .env está en .gitignore
☐ Credenciales Twilio SOLO en Netlify (Environment variables)
☐ Firebase config es pública (está en el HTML, es normal)


CONFIGURACIÓN NETLIFY:
☐ HTTPS habilitado (automático, Netlify lo hace)
☐ Build command: npm run build
☐ Publish: build
☐ Environment variables: 3 variables Twilio configuradas


CÓDIGO:
☐ No hay logs con credenciales en console.log()
☐ Todos los errores están manejados (try-catch)
☐ No hay credenciales hardcoded


FIREBASE:
☐ Reglas de Firestore están restrictivas
☐ Solo usuarios autenticados pueden leer/escribir sus datos
☐ URL de Firebase es pública (es como una API, está bien)


═════════════════════════════════════════════════════════════════════════════

🔍 MONITOREO EN PRODUCCIÓN
═════════════════════════════════════════════════════════════════════════════

DIARIAMENTE:

1. Netlify Dashboard
   URL: https://app.netlify.com
   
   Qué revisar:
   ├─ Deploys: ¿Últimos deployments exitosos?
   ├─ Analytics: ¿Tráfico normal?
   └─ Builds: ¿Algún error?


2. Twilio Console
   URL: https://www.twilio.com/console
   
   Qué revisar:
   ├─ Message Logs: ¿WhatsApps se enviaron?
   ├─ Errors: ¿Algún error al enviar?
   └─ Balance: ¿Suficientes créditos?


3. Firebase Console
   URL: https://console.firebase.google.com
   
   Qué revisar:
   ├─ Firestore: ¿Nuevos usuarios?
   ├─ Authentication: ¿Registros correctos?
   └─ Storage: ¿Uso de cuota?


═════════════════════════════════════════════════════════════════════════════

🚨 ERRORES COMUNES EN PRODUCCIÓN
═════════════════════════════════════════════════════════════════════════════

ERROR 1: "WhatsApp no llega"
──────────────────────────

Soluciones:
1. ¿El número está en Twilio Sandbox?
   https://www.twilio.com/console/sms/whatsapp/sandbox
   → Agrega el número

2. ¿Credenciales están en Netlify?
   Netlify → Site settings → Build & deploy → Environment
   → Verifica 3 variables

3. ¿Es error de internet del usuario?
   → Pídele que intente de nuevo

4. ¿El formato del número es correcto?
   ✅ +56912345678
   ❌ 912345678
   ❌ 56912345678


ERROR 2: "Build failed"
───────────────────────

1. Ve a Netlify → Deploys → Click en deploy rojo
2. Busca error en "Build log"
3. Soluciona localmente:
   npm run build
4. Haz push a GitHub:
   git add .
   git commit -m "Fix build error"
   git push origin main
5. Netlify redeploy automáticamente


ERROR 3: "CORS error en console"
────────────────────────────────

Esto es normal en desarrollo local a veces. En producción:
1. Las credenciales están en environment
2. La llamada a Twilio API se hace desde Netlify (no desde navegador)
3. ✅ No debería haber error


ERROR 4: "Twilio Error: Invalid number"
───────────────────────────────────────

Formato incorrecto. Solución:
✅ +56912345678
❌ +0056912345678
❌ 0912345678


═════════════════════════════════════════════════════════════════════════════

📊 MÉTRICAS PARA MONITOREAR
═════════════════════════════════════════════════════════════════════════════

MENSUAL:

1. Usuarios registrados
   Firebase → Authentication → Ver cantidad

2. WhatsApps enviados
   Twilio → Message Logs → Ver "Total messages"
   Cálculo de costo: Total messages × $0.003-0.01

3. Errores
   Netlify: Algún build fallido?
   Twilio: Algún error en Message Logs?
   Firebase: Algún error en Firestore?


SEMANAL:

1. Website latency
   Netlify → Analytics → Espera a que se actualice

2. Error rate
   Netlify → Logs (si tienes plan Pro)


═════════════════════════════════════════════════════════════════════════════

🔐 ACTUALIZACIONES Y MANTENIMIENTO
═════════════════════════════════════════════════════════════════════════════

ACTUALIZACIONES DE CÓDIGO:

1. Haces cambios localmente
2. Pruebas: npm start
3. Construyes: npm run build
4. Subes a GitHub:
   git add .
   git commit -m "Descripción del cambio"
   git push origin main
5. Netlify redeploy automáticamente (5 minutos)
6. Tu sitio se actualiza

NO necesitas hacer nada más. Netlify lo hace automáticamente.


ACTUALIZAR VARIABLES TWILIO:

Si cambias credenciales en Twilio:
1. Netlify → Site settings → Build & deploy → Environment
2. Edita las 3 variables
3. Click Save
4. Trigger deploy manualmente si es necesario


═════════════════════════════════════════════════════════════════════════════

💰 COSTOS MENSUALES ESTIMADOS
═════════════════════════════════════════════════════════════════════════════

ESCENARIO 1: MVP (50 usuarios/mes)
├─ Netlify: $0 (Plan gratis)
├─ Twilio: 50 mensajes × $0.01 = $0.50
├─ Firebase: $0 (Plan Spark con límites)
└─ TOTAL: ~$0.50/mes


ESCENARIO 2: Pequeño campamento (500 usuarios/mes)
├─ Netlify: $0 (Plan gratis, o $19/Pro)
├─ Twilio: 500 mensajes × $0.01 = $5
├─ Firebase: ~$1-5 (Plan Spark o Blaze)
└─ TOTAL: ~$5-25/mes


ESCENARIO 3: Campamento grande (5000 usuarios/mes)
├─ Netlify: $19 (Pro)
├─ Twilio: 5000 mensajes × $0.01 = $50
├─ Firebase: ~$10-50 (Plan Blaze)
└─ TOTAL: ~$80-120/mes


═════════════════════════════════════════════════════════════════════════════

✅ CHECKLIST MENSUAL
═════════════════════════════════════════════════════════════════════════════

Primer día del mes:

☐ Revisar facturación Netlify
☐ Revisar facturación Twilio
☐ Revisar facturación Firebase
☐ Revisar uptime (Netlify Analytics)
☐ Revisar errores (Logs)
☐ Backup de datos Firestore (exportar)


═════════════════════════════════════════════════════════════════════════════

🆘 SOPORTE
═════════════════════════════════════════════════════════════════════════════

Si algo falla:

1. Revisa logs:
   - Netlify: Build logs y Runtime logs
   - Twilio: Message Logs
   - Firebase: Error logs

2. Verifica credenciales:
   - ¿Variables en Netlify están correctas?
   - ¿.env local tiene el mismo valor?

3. Prueba localmente:
   - npm start (desarrollo)
   - npm run build (producción)

4. Si persiste:
   - Documenta el error exacto
   - Timestamp del evento
   - Número de usuario (si es aplicable)


═════════════════════════════════════════════════════════════════════════════

¡ESTÁS EN PRODUCCIÓN! 🎉

Monitorea regularmente y mantén todo actualizado.

═════════════════════════════════════════════════════════════════════════════
