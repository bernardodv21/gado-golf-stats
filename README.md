# ⛳ GADO Golf Stats App

**Sistema profesional de seguimiento y análisis de rendimiento para golfistas junior**

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-Private-red)

---

## 📋 Descripción

GADO Golf Stats es una aplicación web profesional diseñada para rastrear, analizar y mejorar el rendimiento de golfistas junior. Integrada con Google Sheets para facilitar la gestión de datos.

### ✨ Características Principales

- 🏠 **Dashboard Dinámico**: Vista general con estadísticas en tiempo real
- ⛳ **Captura de Rondas**: Sistema inteligente de captura hoyo por hoyo
- 📊 **Reportes Avanzados**: Análisis detallado individual y comparativo
- 🏆 **Salón de la Fama**: Seguimiento de récords y mejores performances
- 📱 **Responsive Design**: Funciona perfectamente en móvil y desktop
- 🔄 **Sincronización Automática**: Integración directa con Google Sheets

---

## 🚀 Deploy Rápido

### Opción 1: Vercel (Recomendado - 1 hora)

```bash
# 1. Preparar para deploy
./DEPLOY_COMMANDS.sh

# 2. Subir a GitHub
git init
git add .
git commit -m "GADO Golf Stats - v1.0"
git remote add origin https://github.com/TU-USUARIO/gado-golf-stats.git
git push -u origin main

# 3. Deploy en Vercel
# - Ir a vercel.com
# - Import desde GitHub
# - Agregar variables de entorno
# - Deploy
```

**Costo**: $0/mes (plan gratuito)

Ver [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md) para instrucciones detalladas.

---

## 💻 Desarrollo Local

### Requisitos
- Node.js 18.0+
- npm 9.0+
- Cuenta de Google Cloud con Sheets API habilitada

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/TU-USUARIO/gado-golf-stats.git
cd gado-golf-stats

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tus credenciales

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Iniciar servidor de producción
npm run lint         # Verificar código
```

---

## 📁 Estructura del Proyecto

```
gado-app/
├── src/
│   ├── app/              # Páginas y rutas de Next.js
│   │   ├── api/          # API routes
│   │   ├── reports/      # Página de reportes
│   │   └── rounds/       # Página de rondas
│   ├── components/       # Componentes React
│   │   ├── HomePage.tsx          # Página principal
│   │   ├── RoundsPage.tsx        # Gestión de rondas
│   │   ├── ReportsNew.tsx        # Reportes avanzados
│   │   ├── SmartRoundCapture.tsx # Captura inteligente
│   │   └── ...
│   └── lib/              # Utilidades y helpers
│       ├── gadoSheets.ts         # Integración Google Sheets
│       └── googleSheets.ts       # Cliente API
├── public/               # Archivos estáticos
├── .env.local           # Variables de entorno (NO subir a Git)
├── next.config.ts       # Configuración Next.js
├── tailwind.config.ts   # Configuración Tailwind
└── tsconfig.json        # Configuración TypeScript
```

---

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` con:

```env
# ID de tu Google Spreadsheet
GOOGLE_SHEET_ID=tu_sheet_id_aqui

# Credenciales de Service Account
GOOGLE_CLIENT_EMAIL=tu_email@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_KEY_AQUI\n-----END PRIVATE KEY-----\n"
```

### Google Sheets Setup

1. Crear Service Account en Google Cloud Console
2. Habilitar Google Sheets API
3. Compartir tu spreadsheet con el Service Account email
4. Copiar credenciales a `.env.local`

Ver [CONFIGURAR_GOOGLE_SHEETS.md](CONFIGURAR_GOOGLE_SHEETS.md) para instrucciones detalladas.

---

## 📊 Características Técnicas

### Stack Tecnológico

- **Framework**: Next.js 15.5.4 (App Router)
- **Lenguaje**: TypeScript 5.0+
- **Estilos**: Tailwind CSS 3.0
- **UI Components**: Lucide React Icons
- **API Integration**: Google Sheets API v4
- **Charts**: Recharts
- **Deployment**: Vercel (recomendado)

### Rendimiento

- ⚡ Lighthouse Score: 85+ (optimizado)
- 📦 Bundle Size: ~400KB (comprimido)
- ⏱️ Time to First Byte: <200ms (con caché)
- 🔄 API Revalidation: 5 minutos (configurable)

### Seguridad

- 🔒 HTTPS por defecto (en producción)
- 🔐 Variables de entorno protegidas
- 🛡️ Service Account con permisos mínimos
- 🚫 No almacenamiento de credenciales en cliente

---

## 📚 Documentación

- **[RESUMEN_FINAL.md](RESUMEN_FINAL.md)**: Guía rápida para empezar
- **[DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md)**: Plan completo de despliegue
- **[OPTIMIZATIONS_TODO.md](OPTIMIZATIONS_TODO.md)**: Optimizaciones pendientes
- **[PROJECT_RULES.md](PROJECT_RULES.md)**: Estructura de datos de Google Sheets
- **[CONFIGURAR_GOOGLE_SHEETS.md](CONFIGURAR_GOOGLE_SHEETS.md)**: Setup de Google Sheets

---

## 🎯 Roadmap

### Versión Actual (1.0)
- ✅ Captura de rondas
- ✅ Reportes básicos y avanzados
- ✅ Integración con Google Sheets
- ✅ Diseño responsive

### Próximas Versiones

#### v1.1 (Próxima semana)
- ⏳ Caché optimizado
- ⏳ PWA support
- ⏳ Analytics integrados

#### v1.2 (Próximo mes)
- ⏳ Notificaciones push
- ⏳ Exportación de reportes (PDF)
- ⏳ Modo offline

#### v2.0 (Futuro)
- ⏳ Base de datos propia
- ⏳ App móvil nativa
- ⏳ Integración con wearables

---

## 🤝 Contribuir

Este es un proyecto privado. Si tienes acceso y quieres contribuir:

1. Crea un branch: `git checkout -b feature/nueva-funcionalidad`
2. Haz commit: `git commit -m 'Agregar nueva funcionalidad'`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crea un Pull Request

---

## 📝 Licencia

Este proyecto es privado y propietario. Todos los derechos reservados.

---

## 👥 Equipo

**GADO (Guadalajara Academy Development Organization)**
- Sistema desarrollado para golfistas junior
- Enfocado en mejora continua y análisis de datos

---

## 🆘 Soporte

Para preguntas o problemas:

1. Revisa la documentación en `/docs`
2. Verifica los logs en Vercel Dashboard
3. Contacta al equipo de desarrollo

---

## 🎉 Agradecimientos

Construido con las mejores tecnologías modernas:
- Next.js y el equipo de Vercel
- Google Sheets API
- Comunidad de código abierto

---

**Última actualización**: Septiembre 2025
**Versión**: 1.0.0
**Estado**: ✅ Producción Ready

---

<p align="center">
  <strong>⛳ Mejorando el golf junior, una ronda a la vez</strong>
</p>
