// Modelos de datos para el sistema de rondas
export interface Round {
  id: string;
  playerId: string;
  courseId: string;
  tee: string;
  date: string;
  status: 'active' | 'completed' | 'cancelled';
  scores: HoleScore[];
  totalScore: number;
  par: number;
  weather?: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface HoleScore {
  holeNumber: number;
  par: number;
  score: number;
  putts: number;
  fairwayHit: boolean;
  greenInRegulation: boolean;
  penalties: number;
  notes?: string;
}

export interface ActiveRound {
  id: string;
  courseName: string;
  tee: string;
  par: number;
  holes: number;
  playerName: string;
  playerId: string;
  startDate: string;
  currentHole: number;
  isActive: boolean;
}

// Datos de ejemplo para rondas activas
export const mockActiveRounds: ActiveRound[] = [
  {
    id: 'round_1',
    courseName: 'Club de Golf Los Pinos',
    tee: 'Azul',
    par: 72,
    holes: 18,
    playerName: 'Santiago García',
    playerId: 'player_1',
    startDate: '2024-09-29',
    currentHole: 1,
    isActive: true
  },
  {
    id: 'round_2',
    courseName: 'Campo de Golf El Roble',
    tee: 'Blanco',
    par: 72,
    holes: 18,
    playerName: 'Valentina López',
    playerId: 'player_2',
    startDate: '2024-09-29',
    currentHole: 5,
    isActive: true
  }
];

// Datos de ejemplo para rondas completadas
export const mockCompletedRounds: Round[] = [
  {
    id: 'round_3',
    playerId: 'player_3',
    courseId: 'course_1',
    tee: 'Azul',
    date: '2024-09-28',
    status: 'completed',
    scores: [
      { holeNumber: 1, par: 4, score: 4, putts: 2, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 2, par: 3, score: 3, putts: 1, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 3, par: 5, score: 5, putts: 2, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 4, par: 4, score: 4, putts: 2, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 5, par: 3, score: 3, putts: 1, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 6, par: 4, score: 4, putts: 2, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 7, par: 5, score: 5, putts: 2, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 8, par: 3, score: 3, putts: 1, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 9, par: 4, score: 4, putts: 2, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 10, par: 4, score: 4, putts: 2, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 11, par: 3, score: 3, putts: 1, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 12, par: 5, score: 5, putts: 2, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 13, par: 4, score: 4, putts: 2, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 14, par: 3, score: 3, putts: 1, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 15, par: 4, score: 4, putts: 2, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 16, par: 5, score: 5, putts: 2, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 17, par: 3, score: 3, putts: 1, fairwayHit: true, greenInRegulation: true, penalties: 0 },
      { holeNumber: 18, par: 4, score: 4, putts: 2, fairwayHit: true, greenInRegulation: true, penalties: 0 }
    ],
    totalScore: 72,
    par: 72,
    weather: 'Soleado',
    notes: 'Excelente ronda, muy consistente',
    createdAt: '2024-09-28T08:00:00Z',
    completedAt: '2024-09-28T12:30:00Z'
  }
];

// Función para calcular estadísticas de una ronda
export function calculateRoundStats(scores: HoleScore[]) {
  const totalScore = scores.reduce((sum, hole) => sum + hole.score, 0);
  const totalPar = scores.reduce((sum, hole) => sum + hole.par, 0);
  const totalPutts = scores.reduce((sum, hole) => sum + hole.putts, 0);
  const fairwaysHit = scores.filter(hole => hole.fairwayHit).length;
  const greensInRegulation = scores.filter(hole => hole.greenInRegulation).length;
  const totalPenalties = scores.reduce((sum, hole) => sum + hole.penalties, 0);
  
  const birdies = scores.filter(hole => hole.score < hole.par).length;
  const pars = scores.filter(hole => hole.score === hole.par).length;
  const bogeys = scores.filter(hole => hole.score === hole.par + 1).length;
  const doubleBogeys = scores.filter(hole => hole.score >= hole.par + 2).length;

  return {
    totalScore,
    totalPar,
    scoreToPar: totalScore - totalPar,
    totalPutts,
    fairwaysHit,
    fairwaysHitPercentage: Math.round((fairwaysHit / scores.length) * 100),
    greensInRegulation,
    greensInRegulationPercentage: Math.round((greensInRegulation / scores.length) * 100),
    totalPenalties,
    birdies,
    pars,
    bogeys,
    doubleBogeys,
    averagePutts: Math.round((totalPutts / scores.length) * 10) / 10
  };
}

// Función para generar scores vacíos para una ronda
export function generateEmptyScores(par: number, holes: number): HoleScore[] {
  const scores: HoleScore[] = [];
  for (let i = 1; i <= holes; i++) {
    scores.push({
      holeNumber: i,
      par: par / holes, // Distribución simple del par
      score: 0,
      putts: 0,
      fairwayHit: false,
      greenInRegulation: false,
      penalties: 0,
      notes: ''
    });
  }
  return scores;
}
