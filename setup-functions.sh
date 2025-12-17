#!/bin/bash

echo "==================================="
echo "Instalando Cloud Functions"
echo "==================================="

cd functions

echo "📦 Instalando dependencias..."
npm install

echo ""
echo "✅ Instalación completada"
echo ""
echo "⚠️  PRÓXIMOS PASOS:"
echo ""
echo "1. Configura las variables de entorno:"
echo "   firebase functions:config:set gmail.email='tu-email@gmail.com' gmail.password='tu-app-password'"
echo "   firebase functions:config:set twilio.account_sid='tu-sid' twilio.auth_token='tu-token'"
echo ""
echo "2. Despliega las funciones:"
echo "   firebase deploy --only functions"
echo ""
echo "3. Verifica el despliegue en:"
echo "   https://console.firebase.google.com/project/[tu-proyecto]/functions"
echo ""
