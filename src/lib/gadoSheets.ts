import { google } from 'googleapis';

// Configuración de Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

// ID de tu Google Sheet de GADO
const SPREADSHEET_ID = '1LzcnLPCtTxE_ZVtXnL_hyZjzNegPM8DAY7v8GEKA3Mc';

// Interfaces basadas en la estructura real de GADO
export interface GadoPlayer {
  player_id: string;
  nombre: string;
  apellido: string;
  display_name: string;
  categoria: string;
  tee_id_default: string;
  sexo: string;
  fecha_nacimiento: string;
  edad: number;
  club: string;
  CURP: string;
}

export interface GadoCourse {
  course_id: string;
  nombre_campo: string;
  ciudad: string;
  estado: string;
  pais: string;
}

export interface GadoCourseTee {
  tee_id: string;
  course_id: string;
  tee_set: string;
  par_total: number;
  yardas_total: number;
  rating_hombres: number;
  slope_hombres: number;
  rating_mujeres: number;
  slope_mujeres: number;
}

export interface GadoHole {
  course_id: string;
  hoyo: string;
  par: string;
  handicap_hoyo: string;
  hole_id: string;
}

export interface GadoEvent {
  event_id: string;
  nombre_evento: string;
  sede: string;
  fecha_inicio: string;
  fecha_fin: string;
  course_id: string;
}

export interface GadoRound {
  round_id: string;
  ronda_name: string;
  event_id: string;
  fecha: string;
  numero_ronda: number;
  course_id: string;
  activa: boolean;
}

export interface GadoRoundEntry {
  entry_id: string;
  round_id: string;
  player_id: string;
  display_name: string;
  tee_id: string;
  tee_time: string;
  starting_hole: number;
  notas: string;
}

export interface GadoSummaryRound {
  summary_key: string;
  player_id: string;
  player_name: string;
  sexo: string;
  club: string;
  round_id: string;
  course_id: string;
  course_name: string;
  categoria: string;
  tee_id_usado: string;
  tee_set: string;
  yardas_total: number;
  holes: number;
  score_total: number;
  to_par_total: number;
  FIR_percent: number;
  GIR_percent: number;
  putts_totales: number;
  putts_promedio: number;
  scrambling_percent: number;
  sand_save_percent: number;
  penalties: number;
  eagles: number;
  birdies: number;
  pars: number;
  bogeys: number;
  dobles: number;
  triple_o_mas: number;
  status_ronda: string;
  status_personalizado: string;
}

export interface GadoStatsHole {
  id: string;
  timestamp: string;
  jugador: string;
  player_name: string;
  round_id: string;
  tee_id: string;
  hoyo: number;
  par: number;
  strokes: number;
  score_relativo: number;
  resultado: string;
  putts: number;
  palo_salida: string;
  fairway_hit: boolean;
  green_in_regulation: boolean;
  bunker: boolean;
  penalty_ob: boolean;
  penalty_agua: boolean;
  first_putt_dist_m: number;
  up_down_intento: number;
  up_down_exito: number;
  notas: string;
  summary_key: string;
}

export interface GadoMotivation {
  frase: string;
}

// Función para obtener frases motivacionales
export async function getMotivations(): Promise<GadoMotivation[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'motivaciones!A:A',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).map((row) => ({
      frase: row[0] || ''
    }));
  } catch (error) {
    console.error('Error fetching motivations:', error);
    return [];
  }
}

// Función para obtener jugadores
export async function getGadoPlayers(): Promise<GadoPlayer[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'players!A:K',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).map((row) => ({
      player_id: row[0] || '',
      nombre: row[1] || '',
      apellido: row[2] || '',
      display_name: row[3] || '',
      categoria: row[4] || '',
      tee_id_default: row[5] || '',
      sexo: row[6] || '',
      fecha_nacimiento: row[7] || '',
      edad: parseInt(row[8]) || 0,
      club: row[9] || '',
      CURP: row[10] || '',
    }));
  } catch (error) {
    console.error('Error fetching GADO players:', error);
    return [];
  }
}

// Función para obtener campos de golf
export async function getGadoCourses(): Promise<GadoCourse[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'courses!A:E',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).map((row) => ({
      course_id: row[0] || '',
      nombre_campo: row[1] || '',
      ciudad: row[2] || '',
      estado: row[3] || '',
      pais: row[4] || '',
    }));
  } catch (error) {
    console.error('Error fetching GADO courses:', error);
    return [];
  }
}

// Función para obtener tees de campos
export async function getGadoCourseTees(): Promise<GadoCourseTee[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'course_tee!A:I',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).map((row) => ({
      tee_id: row[0] || '',
      course_id: row[1] || '',
      tee_set: row[2] || '',
      par_total: parseInt(row[3]) || 72,
      yardas_total: parseInt(row[4]) || 0,
      rating_hombres: parseFloat(row[5]) || 0,
      slope_hombres: parseInt(row[6]) || 0,
      rating_mujeres: parseFloat(row[7]) || 0,
      slope_mujeres: parseInt(row[8]) || 0,
    }));
  } catch (error) {
    console.error('Error fetching GADO course tees:', error);
    return [];
  }
}

// Función para obtener hoyos de campos
export async function getGadoHoles(): Promise<GadoHole[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'holes!A:E',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).map((row) => ({
      course_id: row[0] || '',
      hoyo: row[1] || '',
      par: row[2] || '',
      handicap_hoyo: row[3] || '',
      hole_id: row[4] || '',
    }));
  } catch (error) {
    console.error('Error fetching GADO holes:', error);
    return [];
  }
}

// Función para obtener eventos
export async function getGadoEvents(): Promise<GadoEvent[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'events!A:F',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).map((row) => ({
      event_id: row[0] || '',
      nombre_evento: row[1] || '',
      sede: row[2] || '',
      fecha_inicio: row[3] || '',
      fecha_fin: row[4] || '',
      course_id: row[5] || '',
    }));
  } catch (error) {
    console.error('Error fetching GADO events:', error);
    return [];
  }
}

// Función para obtener rondas
export async function getGadoRounds(): Promise<GadoRound[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'rounds!A:G',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).map((row) => ({
      round_id: row[0] || '',
      ronda_name: row[1] || '',
      event_id: row[2] || '',
      fecha: row[3] || '',
      numero_ronda: parseInt(row[4]) || 1,
      course_id: row[5] || '',
      activa: row[6] === 'TRUE' || row[6] === 'true' || row[6] === '1',
    }));
  } catch (error) {
    console.error('Error fetching GADO rounds:', error);
    return [];
  }
}

// Función para obtener inscripciones a rondas
export async function getGadoRoundEntries(): Promise<GadoRoundEntry[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'round_entries!A:H',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).map((row) => ({
      entry_id: row[0] || '',
      round_id: row[1] || '',
      player_id: row[2] || '',
      display_name: row[3] || '',
      tee_id: row[4] || '',
      tee_time: row[5] || '',
      starting_hole: parseInt(row[6]) || 1,
      notas: row[7] || '',
    }));
  } catch (error) {
    console.error('Error fetching GADO round entries:', error);
    return [];
  }
}

// Función para obtener resúmenes de rondas
export async function getGadoSummaryRounds(): Promise<GadoSummaryRound[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'summary_round!A:AC',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).map((row) => ({
      summary_key: row[0] || '',
      player_id: row[1] || '',
      player_name: row[2] || '',
      sexo: row[3] || '',
      club: row[4] || '',
      round_id: row[5] || '',
      course_id: row[6] || '',
      course_name: row[7] || '',
      categoria: row[8] || '',
      tee_id_usado: row[9] || '',
      tee_set: row[10] || '',
      yardas_total: parseInt(row[11]) || 0,
      holes: parseInt(row[12]) || 18,
      score_total: parseInt(row[13]) || 0,
      to_par_total: parseInt(row[14]) || 0,
      FIR_percent: parseFloat((row[15] || '0').toString().replace(',', '.')) || 0,
      GIR_percent: parseFloat((row[16] || '0').toString().replace(',', '.')) || 0,
      putts_totales: parseInt(row[17]) || 0,
      putts_promedio: parseFloat((row[18] || '0').toString().replace(',', '.')) || 0,
      scrambling_percent: parseFloat((row[19] || '0').toString().replace(',', '.')) || 0,
      sand_save_percent: parseFloat((row[20] || '0').toString().replace(',', '.')) || 0,
      penalties: parseInt(row[21]) || 0,
      eagles: parseInt(row[22]) || 0,
      birdies: parseInt(row[23]) || 0,
      pars: parseInt(row[24]) || 0,
      bogeys: parseInt(row[25]) || 0,
      dobles: parseInt(row[26]) || 0,
      triple_o_mas: parseInt(row[27]) || 0,
      status_ronda: row[28] || '',
      status_personalizado: row[29] || '',
    }));
  } catch (error) {
    console.error('Error fetching GADO summary rounds:', error);
    return [];
  }
}

// Función para obtener la fecha de captura del hoyo 18 para cada ronda
export async function getHole18CaptureDates(): Promise<Map<string, string>> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'stats_hole!B:G:V', // Solo columnas B (timestamp), G (hoyo), V (summary_key)
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return new Map();

    const captureDates = new Map<string, string>();
    
    rows.slice(1).forEach((row) => {
      const timestamp = row[0]; // timestamp está en la columna B (índice 0 en el nuevo rango)
      const hole = row[1]; // hoyo está en la columna G (índice 1 en el nuevo rango)
      const summaryKey = row[2]; // summary_key está en la columna V (índice 2 en el nuevo rango)
      
      console.log(`Processing row: hole=${hole}, summaryKey=${summaryKey}, timestamp=${timestamp}`);
      
      // Solo procesar el hoyo 18 (verificar tanto string como número)
      if ((hole === '18' || hole === 18) && summaryKey && timestamp) {
        console.log(`Found hole 18 capture: ${summaryKey} -> ${timestamp}`);
        captureDates.set(summaryKey, timestamp);
      }
    });

    return captureDates;
  } catch (error) {
    console.error('Error fetching hole 18 capture dates:', error);
    return new Map();
  }
}

// Función para obtener estadísticas por hoyo
export async function getGadoStatsHole(): Promise<GadoStatsHole[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'stats_hole!A:Z',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).map((row) => ({
      id: row[0] || '',
      timestamp: row[1] || '',
      jugador: row[2] || '',
      player_name: row[3] || '',
      round_id: row[4] || '',
      tee_id: row[5] || '',
      hoyo: parseInt(row[6]) || 0,
      par: parseInt(row[7]) || 4,
      strokes: parseInt(row[8]) || 0,
      score_relativo: parseInt(row[9]) || 0,
      resultado: row[10] || '',
      putts: parseInt(row[11]) || 0,
      palo_salida: row[12] || '',
      fairway_hit: row[13] === 'TRUE' || row[13] === 'true' || row[13] === '1',
      green_in_regulation: row[14] === 'TRUE' || row[14] === 'true' || row[14] === '1',
      bunker: row[15] === 'TRUE' || row[15] === 'true' || row[15] === '1',
      penalty_ob: row[16] === 'TRUE' || row[16] === 'true' || row[16] === '1',
      penalty_agua: row[17] === 'TRUE' || row[17] === 'true' || row[17] === '1',
      first_putt_dist_m: parseFloat(row[18]) || 0,
      up_down_intento: parseInt(row[19]) || 0,
      up_down_exito: parseInt(row[20]) || 0,
      notas: row[21] || '',
      summary_key: row[22] || '',
    }));
  } catch (error) {
    console.error('Error fetching GADO stats hole:', error);
    return [];
  }
}

// Función para obtener rondas activas
export async function getActiveRounds(): Promise<GadoRound[]> {
  try {
    const rounds = await getGadoRounds();
    return rounds.filter(round => round.activa);
  } catch (error) {
    console.error('Error fetching active rounds:', error);
    return [];
  }
}

// Función para obtener jugadores por categoría
export async function getPlayersByCategory(categoria: string): Promise<GadoPlayer[]> {
  try {
    const players = await getGadoPlayers();
    return players.filter(player => player.categoria === categoria);
  } catch (error) {
    console.error('Error fetching players by category:', error);
    return [];
  }
}

// Función para obtener estadísticas de un jugador
export async function getPlayerStats(playerId: string): Promise<GadoSummaryRound[]> {
  try {
    const summaryRounds = await getGadoSummaryRounds();
    return summaryRounds.filter(round => round.player_id === playerId);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return [];
  }
}

// Función para obtener rondas activas con detalles de evento y curso
export async function getActiveRoundsWithDetails() {
  try {
    // Obtener todas las rondas
    const rounds = await getGadoRounds();
    
    // Filtrar solo las activas
    const activeRounds = rounds.filter(round => round.activa);
    
    if (activeRounds.length === 0) {
      return [];
    }
    
    // Obtener eventos y cursos
    const events = await getGadoEvents();
    const courses = await getGadoCourses();
    
    // Crear mapas para búsqueda rápida
    const eventsMap = new Map(events.map(e => [e.event_id, e]));
    const coursesMap = new Map(courses.map(c => [c.course_id, c]));
    
    // Enriquecer las rondas activas con datos de evento y curso
    return activeRounds.map(round => {
      const event = eventsMap.get(round.event_id);
      const course = coursesMap.get(round.course_id);
      
      return {
        ...round,
        event_name: event?.nombre_evento || 'Evento desconocido',
        course_name: course?.nombre_campo || 'Campo desconocido',
        course_city: course?.ciudad || '',
        course_state: course?.estado || '',
      };
    });
  } catch (error) {
    console.error('Error fetching active rounds with details:', error);
    return [];
  }
}
