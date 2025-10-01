# 🔗 Configurar Google Sheets - Guía Paso a Paso

## 📋 **Resumen**
Actualmente la aplicación usa **datos de ejemplo**. Para conectar con tus datos reales de Google Sheets, sigue estos pasos:

## 🚀 **Paso 1: Crear Credenciales de Google Cloud**

### 1.1 Ir a Google Cloud Console
- Ve a: https://console.cloud.google.com/
- Inicia sesión con tu cuenta de Google

### 1.2 Crear o Seleccionar Proyecto
- Crea un nuevo proyecto o selecciona uno existente
- Nombra el proyecto: "GADO Golf Stats" (o el nombre que prefieras)

### 1.3 Habilitar Google Sheets API
- En el menú lateral, ve a "APIs y servicios" > "Biblioteca"
- Busca "Google Sheets API"
- Haz clic en "Habilitar"

### 1.4 Crear Service Account
- Ve a "APIs y servicios" > "Credenciales"
- Haz clic en "Crear credenciales" > "Cuenta de servicio"
- Nombre: "gado-golf-stats"
- Descripción: "Service account para GADO Golf Stats"
- Haz clic en "Crear y continuar"

### 1.5 Descargar Credenciales
- En la lista de cuentas de servicio, haz clic en la que acabas de crear
- Ve a la pestaña "Claves"
- Haz clic en "Agregar clave" > "Crear nueva clave"
- Selecciona "JSON" y haz clic en "Crear"
- **Guarda el archivo JSON** (lo necesitarás en el siguiente paso)

## 🔑 **Paso 2: Configurar Variables de Entorno**

### 2.1 Crear archivo .env.local
En la raíz del proyecto, crea un archivo llamado `.env.local`:

```bash
# Google Sheets API Configuration
GOOGLE_CLIENT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1LzcnLPCtTxE_ZVtXnL_hyZjzNegPM8DAY7v8GEKA3Mc
```

### 2.2 Obtener los Valores
Del archivo JSON que descargaste:
- **GOOGLE_CLIENT_EMAIL**: Copia el valor de `client_email`
- **GOOGLE_PRIVATE_KEY**: Copia el valor de `private_key` (incluyendo las comillas y \n)

## 🔐 **Paso 3: Compartir Google Sheet**

### 3.1 Dar Permisos a la Service Account
- Abre tu Google Sheet: https://docs.google.com/spreadsheets/d/1LzcnLPCtTxE_ZVtXnL_hyZjzNegPM8DAY7v8GEKA3Mc
- Haz clic en "Compartir" (esquina superior derecha)
- En "Agregar personas y grupos", pega el `client_email` de tu service account
- Selecciona "Editor" como rol
- **IMPORTANTE**: Desmarca "Notificar a las personas"
- Haz clic en "Compartir"

## 🧪 **Paso 4: Probar la Conexión**

### 4.1 Reiniciar el Servidor
```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar
npm run dev
```

### 4.2 Verificar en la Consola
- Abre http://localhost:3000
- Abre las herramientas de desarrollador (F12)
- Ve a la pestaña "Console"
- Deberías ver: "📊 Conectando con Google Sheets..."

### 4.3 Verificar Datos Reales
- Los jugadores deberían mostrar los datos reales de tu Google Sheet
- Las frases motivacionales deberían venir de la tabla "motivaciones"

## 🐛 **Solución de Problemas**

### Error: "The caller does not have permission"
- Verifica que compartiste el Google Sheet con el `client_email`
- Asegúrate de que el rol sea "Editor"

### Error: "Invalid credentials"
- Verifica que copiaste correctamente el `private_key`
- Asegúrate de incluir las comillas y los `\n`

### Error: "Sheet not found"
- Verifica que el `GOOGLE_SHEET_ID` sea correcto
- Asegúrate de que las pestañas tengan los nombres exactos:
  - `players`
  - `motivaciones`
  - `courses`
  - etc.

## ✅ **Verificación Final**

Una vez configurado correctamente, deberías ver:
- ✅ Datos reales de jugadores en lugar de los de ejemplo
- ✅ Frases motivacionales de tu tabla "motivaciones"
- ✅ Mensaje en consola: "📊 Conectando con Google Sheets..."

## 📞 **¿Necesitas Ayuda?**

Si tienes problemas con algún paso, compárteme:
1. El error exacto que ves
2. En qué paso te quedaste
3. Si ya creaste el archivo .env.local

¡Con esto tendrás tus datos reales funcionando! 🎉
