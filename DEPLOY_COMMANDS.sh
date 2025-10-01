#!/bin/bash

# 🚀 GADO Golf Stats - Deploy Commands
# Este archivo contiene los comandos para deploy

echo "🎯 GADO Golf Stats - Preparación para Deploy"
echo "============================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encontró package.json${NC}"
    echo "Por favor ejecuta este script desde la raíz del proyecto"
    exit 1
fi

echo -e "${GREEN}✅ Directorio correcto detectado${NC}"
echo ""

# Paso 1: Verificar Node.js
echo "📦 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js instalado: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Por favor instala Node.js desde https://nodejs.org"
    exit 1
fi

echo ""

# Paso 2: Instalar dependencias
echo "📥 Instalando dependencias..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi

echo ""

# Paso 3: Verificar variables de entorno
echo "🔐 Verificando variables de entorno..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ Archivo .env.local encontrado${NC}"
    
    # Verificar que las variables críticas existan
    if grep -q "GOOGLE_SHEET_ID" .env.local && \
       grep -q "GOOGLE_CLIENT_EMAIL" .env.local && \
       grep -q "GOOGLE_PRIVATE_KEY" .env.local; then
        echo -e "${GREEN}✅ Variables de entorno configuradas${NC}"
    else
        echo -e "${YELLOW}⚠️  Faltan algunas variables de entorno${NC}"
        echo "Asegúrate de tener:"
        echo "  - GOOGLE_SHEET_ID"
        echo "  - GOOGLE_CLIENT_EMAIL"
        echo "  - GOOGLE_PRIVATE_KEY"
    fi
else
    echo -e "${RED}❌ No se encontró .env.local${NC}"
    echo "Copia env.example a .env.local y configura tus variables"
    exit 1
fi

echo ""

# Paso 4: Build de prueba
echo "🔨 Construyendo proyecto (esto puede tardar 1-2 minutos)..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build exitoso${NC}"
else
    echo -e "${RED}❌ Error en build${NC}"
    echo "Revisa los errores arriba y corrígelos antes de hacer deploy"
    exit 1
fi

echo ""

# Paso 5: Verificar Git
echo "📂 Verificando Git..."
if command -v git &> /dev/null; then
    echo -e "${GREEN}✅ Git instalado${NC}"
    
    if [ -d ".git" ]; then
        echo -e "${GREEN}✅ Repositorio Git inicializado${NC}"
    else
        echo -e "${YELLOW}⚠️  Git no inicializado${NC}"
        echo ""
        echo "Para inicializar Git, ejecuta:"
        echo "  git init"
        echo "  git add ."
        echo "  git commit -m 'Initial commit'"
    fi
else
    echo -e "${RED}❌ Git no está instalado${NC}"
    echo "Instala Git desde https://git-scm.com"
fi

echo ""
echo "============================================="
echo -e "${GREEN}🎉 ¡Preparación completa!${NC}"
echo ""
echo "📝 PRÓXIMOS PASOS:"
echo ""
echo "1. Si Git no está inicializado:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'GADO Golf Stats - v1.0'"
echo ""
echo "2. Crear repositorio en GitHub:"
echo "   - Ir a github.com"
echo "   - New repository"
echo "   - Nombre: gado-golf-stats"
echo "   - Privado"
echo "   - Create repository"
echo ""
echo "3. Conectar repositorio:"
echo "   git remote add origin https://github.com/TU-USUARIO/gado-golf-stats.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Deploy en Vercel:"
echo "   - Ir a vercel.com"
echo "   - Sign up con GitHub"
echo "   - Import Project > gado-golf-stats"
echo "   - Agregar variables de entorno (GOOGLE_*)"
echo "   - Deploy"
echo ""
echo "============================================="
echo ""
echo -e "${GREEN}¿Necesitas más ayuda? Lee:${NC}"
echo "  - RESUMEN_FINAL.md"
echo "  - DEPLOYMENT_PLAN.md"
echo "  - OPTIMIZATIONS_TODO.md"
echo ""

