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

// ID de tu Google Sheet
const SPREADSHEET_ID = '1LzcnLPCtTxE_ZVtXnL_hyZjzNegPM8DAY7v8GEKA3Mc';

// Interfaces para los datos
export interface Player {
  id: string;
  name: string;
  age: number;
  handicap: number;
  joinDate: string;
  email?: string;
  phone?: string;
}

export interface Game {
  id: string;
  playerId: string;
  course: string;
  tee: string;
  date: string;
  score: number;
  par: number;
  holes: number;
  weather?: string;
  notes?: string;
}

export interface Course {
  id: string;
  name: string;
  par: number;
  holes: number;
  tees: string[];
}

// Función para obtener datos de jugadores
export async function getPlayers(): Promise<Player[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Players!A:F', // Ajusta según tus columnas
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).map((row, index) => ({
      id: `player_${index + 1}`,
      name: row[0] || '',
      age: parseInt(row[1]) || 0,
      handicap: parseFloat(row[2]) || 0,
      joinDate: row[3] || '',
      email: row[4] || '',
      phone: row[5] || '',
    }));
  } catch (error) {
    console.error('Error fetching players:', error);
    return [];
  }
}

// Función para obtener datos de partidas
export async function getGames(): Promise<Game[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Games!A:H', // Ajusta según tus columnas
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).map((row, index) => ({
      id: `game_${index + 1}`,
      playerId: row[0] || '',
      course: row[1] || '',
      tee: row[2] || '',
      date: row[3] || '',
      score: parseInt(row[4]) || 0,
      par: parseInt(row[5]) || 72,
      holes: parseInt(row[6]) || 18,
      weather: row[7] || '',
      notes: row[8] || '',
    }));
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
}

// Función para obtener datos de cursos
export async function getCourses(): Promise<Course[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Courses!A:D', // Ajusta según tus columnas
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).map((row, index) => ({
      id: `course_${index + 1}`,
      name: row[0] || '',
      par: parseInt(row[1]) || 72,
      holes: parseInt(row[2]) || 18,
      tees: row[3] ? row[3].split(',').map((t: string) => t.trim()) : [],
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

// Función para calcular estadísticas de un jugador
export function calculatePlayerStats(player: Player, games: Game[]) {
  const playerGames = games.filter(game => game.playerId === player.id);
  
  if (playerGames.length === 0) {
    return {
      totalGames: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      improvement: 0,
      recentGames: [],
    };
  }

  const scores = playerGames.map(game => game.score);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const bestScore = Math.min(...scores);
  const worstScore = Math.max(...scores);
  
  // Calcular mejora (comparar últimos 5 juegos con los primeros 5)
  const recentGames = playerGames.slice(-5);
  const earlyGames = playerGames.slice(0, 5);
  
  const recentAverage = recentGames.length > 0 
    ? recentGames.reduce((sum, game) => sum + game.score, 0) / recentGames.length 
    : 0;
  const earlyAverage = earlyGames.length > 0 
    ? earlyGames.reduce((sum, game) => sum + game.score, 0) / earlyGames.length 
    : 0;
  
  const improvement = earlyAverage - recentAverage;

  return {
    totalGames: playerGames.length,
    averageScore: Math.round(averageScore * 10) / 10,
    bestScore,
    worstScore,
    improvement: Math.round(improvement * 10) / 10,
    recentGames: recentGames.slice(-3), // Últimos 3 juegos
  };
}
