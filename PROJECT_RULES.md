# Reglas del Proyecto - Gado Golf Stats 🏌️‍♂️

## 📋 **Estructura de Datos del Proyecto**

### **Tablas Principales**

#### 1. **motivaciones**
- **Propósito**: Frases aleatorias para mostrar en el HOME
- **Uso**: Reemplazar "Dashboard" por "HOME" con mensajes motivacionales
- **Columnas**: Frases motivacionales para jugadores infantiles

#### 2. **home_table**
- **Propósito**: Estructura de la página de bienvenida
- **Uso**: Apartado superior en el HOME con información general
- **Columnas**: Datos para mostrar en la sección principal del HOME

#### 3. **resumen_rondas**
- **Propósito**: Lista de jugadores infantiles de la gira GADO por categoría
- **Columnas**: 
  - `player_id` - ID único del jugador
  - `display_name` - Nombre para mostrar
  - `edad` - Edad del jugador
  - `categoria` - Categoría de competencia
  - `club` - Club de origen

#### 4. **resumen_rondas_detalle**
- **Propósito**: Detalles de las rondas jugadas por cada jugador
- **Columnas**:
  - `player_id` - ID del jugador
  - `display_name` - Nombre para mostrar
  - `round_id` - ID de la ronda
  - `round_name_custom` - Nombre personalizado de la ronda
  - `score_total` - Score total de la ronda
  - `holes` - Número de hoyos jugados
  - `status_ronda` - Estado de la ronda

#### 5. **players**
- **Propósito**: Datos personales completos de todos los jugadores
- **Columnas**:
  - `player_id` - ID único del jugador
  - `nombre` - Nombre del jugador
  - `apellido` - Apellido del jugador
  - `display_name` - Nombre para mostrar
  - `categoria` - Categoría de competencia
  - `tee_id_default` - Tee de salida por defecto
  - `sexo` - Género del jugador
  - `fecha_nacimiento` - Fecha de nacimiento
  - `edad` - Edad actual
  - `club` - Club de origen
  - `CURP` - CURP del jugador

#### 6. **courses**
- **Propósito**: Campos de golf donde se juega la gira
- **Columnas**:
  - `course_id` - ID único del campo
  - `nombre_campo` - Nombre del campo
  - `ciudad` - Ciudad del campo
  - `estado` - Estado del campo
  - `pais` - País del campo

#### 7. **course_tee**
- **Propósito**: Información de tees de salida por campo
- **Columnas**:
  - `tee_id` - ID único del tee
  - `course_id` - ID del campo
  - `tee_set` - Conjunto de tees (Azul, Blanco, Rojo, etc.)
  - `par_total` - Par total del campo
  - `yardas_total` - Yardas totales
  - `rating_hombres` - Rating para hombres
  - `slope_hombres` - Slope para hombres
  - `rating_mujeres` - Rating para mujeres
  - `slope_mujeres` - Slope para mujeres

#### 8. **holes**
- **Propósito**: Información detallada de cada hoyo por campo
- **Columnas**:
  - `course_id` - ID del campo
  - `hoyo` - Número del hoyo
  - `par` - Par del hoyo
  - `handicap_hoyo` - Handicap del hoyo
  - `hole_id` - ID único del hoyo

#### 9. **events**
- **Propósito**: Etapas/eventos de la gira GADO
- **Columnas**:
  - `event_id` - ID único del evento
  - `nombre_evento` - Nombre del evento
  - `sede` - Sede del evento
  - `fecha_inicio` - Fecha de inicio
  - `fecha_fin` - Fecha de fin
  - `course_id` - Campo donde se juega

#### 10. **rounds**
- **Propósito**: Rondas de cada evento
- **Columnas**:
  - `round_id` - ID único de la ronda
  - `ronda_name` - Nombre de la ronda
  - `event_id` - ID del evento
  - `fecha` - Fecha de la ronda
  - `numero_ronda` - Número de ronda en el evento
  - `course_id` - Campo donde se juega
  - `activa` - Si la ronda está activa (columna clave)

#### 11. **round_entries**
- **Propósito**: Inscripciones de jugadores a rondas
- **Columnas**:
  - `entry_id` - ID único de la inscripción
  - `round_id` - ID de la ronda
  - `player_id` - ID del jugador
  - `display_name` - Nombre para mostrar
  - `tee_id` - Tee asignado
  - `tee_time` - Hora de salida
  - `starting_hole` - Hoyo de inicio
  - `notas` - Notas adicionales

#### 12. **summary_round**
- **Propósito**: Resumen estadístico completo de cada ronda
- **Columnas**:
  - `summary_key` - Clave única del resumen
  - `player_id` - ID del jugador
  - `player_name` - Nombre del jugador
  - `sexo` - Género
  - `club` - Club de origen
  - `round_id` - ID de la ronda
  - `course_id` - ID del campo
  - `course_name` - Nombre del campo
  - `categoria` - Categoría del jugador
  - `tee_id_usado` - Tee utilizado
  - `tee_set` - Conjunto de tees
  - `yardas_total` - Yardas totales
  - `holes` - Número de hoyos
  - `score_total` - Score total
  - `to_par_total` - Score vs par
  - `FIR_%` - Porcentaje de fairways hit
  - `GIR_%` - Porcentaje de greens in regulation
  - `putts_totales` - Total de putts
  - `putts promedio` - Promedio de putts por hoyo
  - `scrambling_%` - Porcentaje de scrambling
  - `sand_save_%` - Porcentaje de sand saves
  - `penalties` - Penalties totales
  - `eagles` - Número de eagles
  - `birdies` - Número de birdies
  - `pars` - Número de pars
  - `bogeys` - Número de bogeys
  - `dobles` - Número de dobles
  - `triple_o_mas` - Número de triples o más
  - `status_ronda` - Estado de la ronda
  - `status_personalizado` - Estado personalizado

#### 13. **stats_hole**
- **Propósito**: Estadísticas detalladas por hoyo
- **Columnas**:
  - `id` - ID único del registro
  - `timestamp` - Marca de tiempo
  - `jugador` - ID del jugador
  - `player_name` - Nombre del jugador
  - `round_id` - ID de la ronda
  - `tee_id` - ID del tee
  - `hoyo` - Número del hoyo
  - `par` - Par del hoyo
  - `strokes` - Strokes del hoyo
  - `score_relativo` - Score vs par del hoyo
  - `resultado` - Resultado del hoyo
  - `putts` - Putts del hoyo
  - `palo_salida` - Palo de salida
  - `fairway_hit` - Si golpeó el fairway
  - `green_in_regulation` - Si llegó al green en regulación
  - `bunker` - Si estuvo en bunker
  - `penalty_ob` - Penalty out of bounds
  - `penalty_agua` - Penalty en agua
  - `first_putt_dist_m` - Distancia del primer putt en metros
  - `up_down_intento` - Intentos de up and down
  - `up_down_exito` - Éxitos de up and down
  - `notas` - Notas del hoyo
  - `summary_key` - Clave del resumen

## 🎯 **Objetivos del Proyecto**

### **Fase 1: Integración de Datos Reales (Actual)**
- [x] Crear estructura base de la aplicación
- [x] Implementar sistema de rondas
- [ ] Conectar con Google Sheets reales
- [ ] Mostrar datos reales de jugadores y rondas
- [ ] Cambiar "Dashboard" por "HOME" con frases motivacionales

### **Fase 2: Mejoras de Diseño**
- [ ] Optimizar interfaz basada en datos reales
- [ ] Mejorar experiencia de usuario
- [ ] Ajustar colores y branding de GADO

### **Fase 3: Funcionalidades de Escritura**
- [ ] Implementar captura de scores en tiempo real
- [ ] Sistema de inscripción a rondas
- [ ] Actualización de estadísticas automática
- [ ] Notificaciones y alertas

## 🔧 **Reglas Técnicas**

### **Estructura de Archivos**
- `/src/lib/googleSheets.ts` - Integración con Google Sheets
- `/src/lib/roundsData.ts` - Modelos de datos de rondas
- `/src/lib/mockData.ts` - Datos de ejemplo (temporal)
- `/src/components/` - Componentes reutilizables
- `/src/app/` - Páginas de la aplicación

### **Convenciones de Naming**
- **Componentes**: PascalCase (ej: `PlayerCard.tsx`)
- **Archivos de utilidades**: camelCase (ej: `googleSheets.ts`)
- **Interfaces**: PascalCase (ej: `Player`, `Round`)
- **Variables**: camelCase (ej: `playerName`, `totalScore`)

### **Estructura de Datos**
- **IDs**: Siempre usar `player_id`, `round_id`, `course_id`
- **Nombres**: Usar `display_name` para mostrar
- **Fechas**: Formato ISO 8601
- **Estados**: Usar `status_ronda` para controlar rondas activas

## 📱 **Funcionalidades por Implementar**

### **HOME (Antes Dashboard)**
- Mostrar frases motivacionales aleatorias
- Información general de la gira GADO
- Estadísticas principales de la temporada
- Próximos eventos

### **Sistema de Rondas**
- Rondas activas basadas en columna `activa`
- Captura de scores por hoyo usando `stats_hole`
- Cálculo automático de estadísticas
- Integración con `round_entries`

### **Reportes**
- Análisis por categoría
- Comparación entre jugadores
- Estadísticas por campo
- Evolución temporal

## 🚀 **Próximos Pasos**

1. **Integrar Google Sheets reales** con las 13 tablas
2. **Adaptar modelos de datos** a la estructura real
3. **Implementar HOME** con frases motivacionales
4. **Conectar sistema de rondas** con datos reales
5. **Optimizar interfaz** basada en datos reales

---

**Nota**: Este documento se actualizará conforme avance el proyecto y se definan nuevas reglas y convenciones.
