🚀 GUÍA DE DESPLIEGUE A PRODUCCIÓN (Netlify + Twilio)

═════════════════════════════════════════════════════════════════════════════

PASO 1: PREPARAR EL PROYECTO LOCAL
═════════════════════════════════════════════════════════════════════════════

1. Verifica que todo funcione localmente:
   npm start
   # Prueba: Regístrate y verifica WhatsApp

2. Asegúrate que .env tenga las credenciales Twilio CORRECTAS:
   cat .env

3. Crea un archivo .env.production (para documentación):
   # NO lo subas a GitHub
   # REACT_APP_TWILIO_ACCOUNT_SID=ACxxxxxxxx
   # REACT_APP_TWILIO_AUTH_TOKEN=xxxxxxxx
   # REACT_APP_TWILIO_WHATSAPP_NUMBER=+1415238886

4. Actualiza .gitignore para NO subir .env:
   # Verifica que .env esté en .gitignore
   cat .gitignore | grep ".env"
   # Deberías ver: .env

5. Haz un build local para verificar:
   npm run build
   # Debe crear carpeta: build/


PASO 2: CREAR CUENTA EN NETLIFY
═════════════════════════════════════════════════════════════════════════════

1. Ve a: https://app.netlify.com/signup
   • Click: "Sign up with GitHub" (recomendado)
   • Autoriza acceso a GitHub

2. Conecta tu repositorio:
   • "New site from Git"
   • Selecciona: GitHub
   • Busca: campamento (tu repo)
   • Click: "Install and Authorize"


PASO 3: CONFIGURAR SITIO EN NETLIFY
═════════════════════════════════════════════════════════════════════════════

1. Netlify mostrará opciones de deploy:

   Deploy settings:
   ├─ Owner: Tu cuenta
   ├─ Repository: tu-usuario/campamento
   ├─ Branch to deploy: main
   ├─ Build command: npm run build
   └─ Publish directory: build


2. Click: "Save & Deploy"
   → Netlify empezará a compilar
   → Espera 2-3 minutos


PASO 4: CONFIGURAR VARIABLES DE ENTORNO EN NETLIFY
═════════════════════════════════════════════════════════════════════════════

1. Ve a tu sitio en Netlify: https://app.netlify.com/sites/tu-sitio

2. Click: "Site settings"

3. En el menú izquierdo: "Build & deploy" → "Environment"

4. Click: "Edit variables"

5. Agrega las 3 variables de Twilio:

   REACT_APP_TWILIO_ACCOUNT_SID
   Valor: ACb9c05a7fde7fa3ca70c83c6cf6dbf36a

   REACT_APP_TWILIO_AUTH_TOKEN
   Valor: 760c4b9eedd8dc77646bf12161c7f70e

   REACT_APP_TWILIO_WHATSAPP_NUMBER
   Valor: +14155238886

6. Click: "Save"

7. Fuerza un redeploy:
   • "Deploys" → "Trigger deploy" → "Deploy site"
   • Espera a que termine


PASO 5: CONFIGURAR TWILIO PARA PRODUCCIÓN
═════════════════════════════════════════════════════════════════════════════

Tu cuenta Twilio actual está en SANDBOX (prueba gratuita).

Para producción, necesitas:

OPCIÓN A: Mantener Sandbox (GRATIS - recomendado para test)
────────────────────────────────────────────────────────────

Solo funciona con números previamente agregados:

1. Ve a: https://www.twilio.com/console/sms/whatsapp/sandbox
2. "Participant Numbers" 
3. Agrega los números de tus usuarios (ej: +56912345678)
4. ✅ Listo - funcionará en producción también

LIMITACIONES Sandbox:
- Solo 50 números máximo
- Números expiran después de cierto tiempo
- Bueno para MVP o testing


OPCIÓN B: Pasar a Twilio Production (PAGO - para escala)
─────────────────────────────────────────────────────────

1. Ve a: https://www.twilio.com/console

2. Busca: "WhatsApp Business" o "Get Approval"

3. Necesitas:
   • Número de teléfono real
   • Política de privacidad
   • Términos de servicio
   • Información del negocio
   • Tarjeta de crédito

4. Solicita Approval (toma 24-48 horas)

5. Una vez aprobado:
   • Tu Account SID y Auth Token cambian
   • Tienes WhatsApp Number dedicado
   • Puedes enviar a cualquier número
   • Costo: ~$0.003-0.01 por mensaje


RECOMENDACIÓN: Usa Sandbox primero (OPCIÓN A)


PASO 6: PROBAR EN PRODUCCIÓN
═════════════════════════════════════════════════════════════════════════════

1. Tu sitio estará en: https://tu-sitio.netlify.app

2. Prueba registro:
   • Abre: https://tu-sitio.netlify.app
   • Click: "Regístrate"
   • Usa un número que agregaste en Sandbox
   • ✅ Deberías recibir WhatsApp en 5-10 segundos

3. Verifica consola de Twilio:
   • Ve a: https://www.twilio.com/console
   • "Message Logs" → Verifica que se envió
   • "Webhook Logs" → Verifica respuestas


PASO 7: CONFIGURAR DOMINIO PERSONALIZADO (OPCIONAL)
═════════════════════════════════════════════════════════════════════════════

1. En Netlify: "Site settings" → "Domain management"

2. Click: "Add custom domain"

3. Ingresa: campamento.com (o tu dominio)

4. Sigue las instrucciones para cambiar DNS

5. Espera 24-48 horas para propagación


PASO 8: CONFIGURAR HTTPS/SSL (AUTOMÁTICO EN NETLIFY)
═════════════════════════════════════════════════════════════════════════════

✅ Netlify incluye SSL gratis automáticamente

Tu sitio será: https://tu-sitio.netlify.app (con cerrito verde)


═════════════════════════════════════════════════════════════════════════════

CHECKLIST DE DESPLIEGUE
═════════════════════════════════════════════════════════════════════════════

Local:
☐ npm run build funciona sin errores
☐ .env NO está en GitHub
☐ .gitignore contiene .env

GitHub:
☐ Repositorio público en GitHub
☐ .env no está en el historial
☐ Todos los cambios hacen push a main

Netlify:
☐ Cuenta creada
☐ Repositorio conectado
☐ Variables de entorno configuradas
☐ Build completó exitosamente
☐ Sitio es accesible

Twilio:
☐ Credenciales correctas en Netlify
☐ Números de prueba agregados en Sandbox
☐ Prueba de WhatsApp funciona

Producción:
☐ Sitio accesible por HTTPS
☐ Registro funciona
☐ WhatsApp se recibe
☐ QR es una imagen


═════════════════════════════════════════════════════════════════════════════

CAMBIOS A HACER EN EL CÓDIGO (SI ES NECESARIO)
═════════════════════════════════════════════════════════════════════════════

Ya NO necesitas cambios. El código ya está optimizado.

✅ src/firebase/twilio.js - Usa variables de entorno
✅ .env - Credenciales (no committed a GitHub)
✅ netlify.toml - Configuración automática


═════════════════════════════════════════════════════════════════════════════

TROUBLESHOOTING PRODUCCIÓN
═════════════════════════════════════════════════════════════════════════════

❌ "Build failed en Netlify"
─────────────────────────
1. Ve a: Deploys → Ver logs
2. Busca el error (rojo)
3. Soluciones comunes:
   • Variables de entorno faltando
   • Dependencias npm faltando
   • Errores de sintaxis en código

Solución: 
   npm install
   npm run build (local)
   git push origin main

❌ "WhatsApp no llega en producción"
─────────────────────────────────
1. Verifica credenciales en Netlify:
   • Site settings → Environment
   • Compara con .env local

2. ¿El número está en Sandbox?
   • Ve a: https://www.twilio.com/console/sms/whatsapp/sandbox
   • Agrega tu número si falta

3. Revisa Twilio logs:
   • Console.twilio.com → Message Logs
   • Busca el error

❌ "CORS error - No llega WhatsApp"
──────────────────────────────────
Twilio API está siendo bloqueada. Solución:

1. Verifica que Basic Auth esté correcto en twilio.js
2. Headers debe incluir: Authorization: Basic [base64]
3. Si persiste, usa proxy de Netlify Functions


═════════════════════════════════════════════════════════════════════════════

PASOS RÁPIDOS (COPY-PASTE)
═════════════════════════════════════════════════════════════════════════════

1. CONSTRUIR:
   npm run build

2. VERIFICAR .gitignore:
   echo ".env" >> .gitignore
   git add .gitignore
   git commit -m "Agregar .env a gitignore"

3. SUBIR A GITHUB:
   git push origin main

4. CREAR ACCOUNT NETLIFY:
   https://app.netlify.com/signup

5. CONECTAR GITHUB EN NETLIFY:
   New site from Git → GitHub → tu-repo

6. CONFIGURAR VARIABLES (EN NETLIFY):
   Site settings → Build & deploy → Environment
   
   REACT_APP_TWILIO_ACCOUNT_SID = ACb9c05a7fde7fa3ca70c83c6cf6dbf36a
   REACT_APP_TWILIO_AUTH_TOKEN = 760c4b9eedd8dc77646bf12161c7f70e
   REACT_APP_TWILIO_WHATSAPP_NUMBER = +14155238886

7. TRIGGER REDEPLOY:
   Netlify → Deploys → Trigger deploy

8. PROBAR:
   https://tu-sitio.netlify.app

═════════════════════════════════════════════════════════════════════════════

COSTOS (IMPORTANTE)
═════════════════════════════════════════════════════════════════════════════

NETLIFY:
• Plan Starter: GRATIS (bueno para MVP)
• Plan Pro: $19/mes (con analytics y más)

TWILIO:
• Sandbox: GRATIS (pruebas)
• Production: $0.003-0.01 por SMS/WhatsApp
  Ejemplo: 1000 mensajes = $3-10

FIREBASE:
• Plan Spark: GRATIS (incluye Firestore)
• Plan Blaze: Pago por uso (recomendado si escala)

TOTAL INICIAL: ~$0 (con Netlify + Twilio Sandbox)


═════════════════════════════════════════════════════════════════════════════

¿DUDAS?
═════════════════════════════════════════════════════════════════════════════

Revisa logs en:
• Netlify: Deploys → Build log
• Twilio: Console → Message Logs
• Browser: F12 → Console

Si hay error específico, comparte y ayudo a resolver.

═════════════════════════════════════════════════════════════════════════════
