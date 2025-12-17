✅ CHECKLIST PRE-DEPLOYMENT

═════════════════════════════════════════════════════════════════════════════

ANTES DE DESPLEGAR A NETLIFY:
═════════════════════════════════════════════════════════════════════════════

LOCAL - CÓDIGO:
☐ npm run build ejecuta sin errores
☐ No hay archivos sin guardar
☐ Todos los cambios están en git

LOCAL - SEGURIDAD:
☐ .env NO está versionado en git
  └─ git status (no debe aparecer .env)
☐ .env está en .gitignore
  └─ cat .gitignore | grep ".env"
☐ No hay credenciales hardcoded en el código
☐ No hay logs de credenciales en console

GITHUB:
☐ Repositorio es público (o privado, tu elección)
☐ Todos los cambios están en main branch
  └─ git log --oneline (último commit visible)
☐ .env está en .gitignore (no en histórico)
  └─ git log --name-status | grep ".env" (no debe aparecer)

TWILIO:
☐ Credenciales están correctas:
  ├─ REACT_APP_TWILIO_ACCOUNT_SID = ACb9c05a7fde7fa3ca70c83c6cf6dbf36a
  ├─ REACT_APP_TWILIO_AUTH_TOKEN = 760c4b9eedd8dc77646bf12161c7f70e
  └─ REACT_APP_TWILIO_WHATSAPP_NUMBER = +14155238886
☐ Tienes créditos en Twilio o Sandbox configurado
☐ WhatsApp Sandbox está activo (si usas versión gratis)

FIREBASE:
☐ Firestore está activa
☐ Authentication está activa
☐ Proyecto está configurado en .env local

═════════════════════════════════════════════════════════════════════════════

DURANTE EL DESPLIEGUE:
═════════════════════════════════════════════════════════════════════════════

Netlify Setup:
☐ Cuenta creada en Netlify
☐ GitHub conectado a Netlify
☐ Repositorio "campamento" visible en Netlify

Netlify Build Settings:
☐ Build command: npm run build
☐ Publish directory: build
☐ Deploy button mostrando progreso

Netlify Environment Variables:
☐ REACT_APP_TWILIO_ACCOUNT_SID configurado
☐ REACT_APP_TWILIO_AUTH_TOKEN configurado
☐ REACT_APP_TWILIO_WHATSAPP_NUMBER configurado
☐ Todas 3 variables guardadas

Deploy Progress:
☐ Build terminó exitosamente (verde)
☐ Sitio está en vivo en https://[nombre].netlify.app
☐ HTTPS funciona (candado verde)

═════════════════════════════════════════════════════════════════════════════

DESPUÉS DEL DESPLIEGUE:
═════════════════════════════════════════════════════════════════════════════

Twilio Sandbox (si es versión gratis):
☐ Tu número de teléfono agregado en:
  https://www.twilio.com/console/sms/whatsapp/sandbox
☐ Confirmación enviada a WhatsApp y respondida

Verificación Inicial:
☐ Sitio abre en navegador: https://[nombre].netlify.app
☐ Ver "Regístrate aquí" funciona
☐ Formulario de registro carga correctamente
☐ Firebase auth está funcionando (puedes crear usuario)

Prueba de WhatsApp:
☐ Regístrate con tu número real
☐ En 5-10 segundos recibes WhatsApp
☐ Imagen del QR está en el mensaje
☐ Puedes descargar la imagen

Verificar Logs:
☐ F12 (Developer tools) → Console
  └─ No hay errores rojos
  └─ Ves "✅ WhatsApp enviado correctamente" (si se envió)
☐ Netlify Deploys
  └─ Último deploy dice "Published"
☐ Twilio Message Logs
  └─ Ves el mensaje que se envió

═════════════════════════════════════════════════════════════════════════════

COSAS QUE NO DEBES HACER:
═════════════════════════════════════════════════════════════════════════════

❌ NO compartas el contenido de .env
❌ NO subas .env a GitHub
❌ NO pongas credenciales en el código
❌ NO uses credenciales de Twilio sandbox en producción sin control
❌ NO desactives HTTPS
❌ NO dejes sitio sin monitorear


COSAS QUE DEBES HACER:
═════════════════════════════════════════════════════════════════════════════

✅ SÍ mantén .env en .gitignore
✅ SÍ configura variables en Netlify Environment
✅ SÍ usa HTTPS siempre (Netlify lo hace automático)
✅ SÍ monitorea Twilio logs regularmente
✅ SÍ revisa Netlify Analytics
✅ SÍ mantén GitHub actualizado con cambios
✅ SÍ prueba después de cada cambio
✅ SÍ documenta lo que cambies


═════════════════════════════════════════════════════════════════════════════

PROBLEMAS COMUNES AL DESPLEGAR:
═════════════════════════════════════════════════════════════════════════════

❌ Build error en Netlify
   → Revisa "Deploys" → "Build log"
   → Soluciona localmente con npm run build
   → Haz push a GitHub

❌ WhatsApp no llega en producción
   → ¿Variables están en Netlify?
   → ¿Tu número está en Twilio Sandbox?
   → ¿Tienes créditos/saldo en Twilio?

❌ Sitio muestra error 404
   → Revisa Publish directory = build
   → netlify.toml tiene redirects configurado?

❌ CORS error en console
   → Normal a veces en desarrollo
   → En producción las credenciales están en servidor
   → No debería ser problema


═════════════════════════════════════════════════════════════════════════════

PRUEBAS FINALES:
═════════════════════════════════════════════════════════════════════════════

Test 1: Registro Normal
├─ Abre sitio en navegador
├─ Click "Regístrate aquí"
├─ Rellena con datos reales
├─ Recibe WhatsApp ✓

Test 2: QR es Imagen
├─ Recibe WhatsApp
├─ ¿Es imagen (PNG) o enlace (link)?
├─ Debe ser imagen (podés descargarla)

Test 3: Staff Registra
├─ Inicia sesión como staff
├─ Click "Registrar Participante"
├─ Rellena formulario
├─ Participante recibe WhatsApp ✓

Test 4: Datos en Firebase
├─ Abre: https://console.firebase.google.com
├─ Firestore → Colección "users"
├─ Verifica nuevos usuarios están allí ✓

Test 5: Seguridad
├─ F12 → Network
├─ Ver solicitudes a Twilio
├─ ¿Auth header tiene Token? (debe estar encriptado)
├─ No debe ver credenciales en clear text


═════════════════════════════════════════════════════════════════════════════

DESPUÉS DE LANZAMIENTO:
═════════════════════════════════════════════════════════════════════════════

Día 1:
☐ Monitorea actividad
☐ Revisa Twilio logs
☐ Revisa Firebase usuarios

Semana 1:
☐ Revisa costos Twilio
☐ Revisa Netlify analytics
☐ Verifica estabilidad

Mensual:
☐ Revisa facturaciones
☐ Revisa performance
☐ Revisa errores
☐ Backup Firestore


═════════════════════════════════════════════════════════════════════════════

¿LISTO PARA DESPLEGAR?

Marca todas las casillas y comienza:

ANTES:    ☐ ☐ ☐ ☐ ☐
DURANTE:  ☐ ☐ ☐ ☐ ☐
DESPUÉS:  ☐ ☐ ☐ ☐ ☐

¡VAMOS! 🚀

═════════════════════════════════════════════════════════════════════════════
