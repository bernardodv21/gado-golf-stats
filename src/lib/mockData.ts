// Datos de ejemplo para demostrar la aplicación
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

// Datos de ejemplo
export const mockPlayers: Player[] = [
  {
    id: 'player_1',
    name: 'Santiago García',
    age: 12,
    handicap: 18,
    joinDate: '2024-01-15',
    email: 'santiago@example.com',
    phone: '+52 555-0101'
  },
  {
    id: 'player_2',
    name: 'Valentina López',
    age: 11,
    handicap: 22,
    joinDate: '2024-02-01',
    email: 'valentina@example.com',
    phone: '+52 555-0102'
  },
  {
    id: 'player_3',
    name: 'Diego Martínez',
    age: 13,
    handicap: 15,
    joinDate: '2024-01-20',
    email: 'diego@example.com',
    phone: '+52 555-0103'
  },
  {
    id: 'player_4',
    name: 'Isabella Rodríguez',
    age: 10,
    handicap: 25,
    joinDate: '2024-03-01',
    email: 'isabella@example.com',
    phone: '+52 555-0104'
  },
  {
    id: 'player_5',
    name: 'Mateo Hernández',
    age: 12,
    handicap: 20,
    joinDate: '2024-02-15',
    email: 'mateo@example.com',
    phone: '+52 555-0105'
  }
];

export const mockGames: Game[] = [
  {
    id: 'game_1',
    playerId: 'player_1',
    course: 'Club de Golf Los Pinos',
    tee: 'Azul',
    date: '2024-09-25',
    score: 85,
    par: 72,
    holes: 18,
    weather: 'Soleado',
    notes: 'Excelente juego, muy consistente'
  },
  {
    id: 'game_2',
    playerId: 'player_2',
    course: 'Club de Golf Los Pinos',
    tee: 'Blanco',
    date: '2024-09-24',
    score: 92,
    par: 72,
    holes: 18,
    weather: 'Parcialmente nublado',
    notes: 'Mejoró en el back nine'
  },
  {
    id: 'game_3',
    playerId: 'player_3',
    course: 'Campo de Golf El Roble',
    tee: 'Azul',
    date: '2024-09-23',
    score: 78,
    par: 72,
    holes: 18,
    weather: 'Soleado',
    notes: 'Personal best!'
  },
  {
    id: 'game_4',
    playerId: 'player_1',
    course: 'Club de Golf Los Pinos',
    tee: 'Azul',
    date: '2024-09-22',
    score: 88,
    par: 72,
    holes: 18,
    weather: 'Ventoso',
    notes: 'Condiciones difíciles'
  },
  {
    id: 'game_5',
    playerId: 'player_4',
    course: 'Campo de Golf El Roble',
    tee: 'Blanco',
    date: '2024-09-21',
    score: 95,
    par: 72,
    holes: 18,
    weather: 'Soleado',
    notes: 'Primera vez en este campo'
  },
  {
    id: 'game_6',
    playerId: 'player_5',
    course: 'Club de Golf Los Pinos',
    tee: 'Azul',
    date: '2024-09-20',
    score: 82,
    par: 72,
    holes: 18,
    weather: 'Soleado',
    notes: 'Muy buen putting'
  },
  {
    id: 'game_7',
    playerId: 'player_2',
    course: 'Campo de Golf El Roble',
    tee: 'Blanco',
    date: '2024-09-19',
    score: 89,
    par: 72,
    holes: 18,
    weather: 'Parcialmente nublado',
    notes: 'Mejoró 3 strokes'
  },
  {
    id: 'game_8',
    playerId: 'player_3',
    course: 'Club de Golf Los Pinos',
    tee: 'Azul',
    date: '2024-09-18',
    score: 76,
    par: 72,
    holes: 18,
    weather: 'Soleado',
    notes: 'Excelente driving'
  }
];

export const mockCourses: Course[] = [
  {
    id: 'course_1',
    name: 'Club de Golf Los Pinos',
    par: 72,
    holes: 18,
    tees: ['Azul', 'Blanco', 'Rojo']
  },
  {
    id: 'course_2',
    name: 'Campo de Golf El Roble',
    par: 72,
    holes: 18,
    tees: ['Azul', 'Blanco', 'Rojo']
  }
];

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
