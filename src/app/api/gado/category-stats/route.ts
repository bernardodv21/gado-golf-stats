import { NextResponse } from 'next/server';
import { getGadoSummaryRounds, getGadoPlayers } from '@/lib/gadoSheets';

export async function GET() {
  try {
    const summaryRounds = await getGadoSummaryRounds();
    const players = await getGadoPlayers();

    // Filtrar solo rondas completas y válidas
    const completedRounds = summaryRounds.filter(round => 
      round.status_ronda === 'completa' && 
      round.score_total && 
      !isNaN(parseInt(round.score_total.toString()))
    );

    if (completedRounds.length === 0) {
      return NextResponse.json({
        overallAverage: 0,
        categoryStats: [],
        message: 'No hay rondas completas registradas'
      });
    }

    // Calcular promedio general
    const overallAverage = Math.round(
      (completedRounds.reduce((sum, round) => sum + parseInt(round.score_total.toString()), 0) / completedRounds.length) * 10
    ) / 10;

    // Obtener información de jugadores para género
    const playerMap = new Map();
    players.forEach(player => {
      playerMap.set(player.player_id, player);
    });

    // Agrupar por categoría y género
    const categoryGroups = new Map();

    completedRounds.forEach(round => {
      const player = playerMap.get(round.player_id);
      if (!player) return;

      const key = `${round.categoria}-${player.sexo}`;
      if (!categoryGroups.has(key)) {
        categoryGroups.set(key, {
          categoria: round.categoria,
          genero: player.sexo,
          scores: [],
          totalRounds: 0
        });
      }

      const score = parseInt(round.score_total.toString());
      categoryGroups.get(key).scores.push(score);
      categoryGroups.get(key).totalRounds++;
    });

    // Calcular promedios por categoría y género
    const categoryStats = Array.from(categoryGroups.values()).map(group => {
      const average = group.scores.length > 0 
        ? Math.round((group.scores.reduce((sum: number, score: number) => sum + score, 0) / group.scores.length) * 10) / 10
        : 0;

      // Contar jugadores únicos en esta categoría y género
      const uniquePlayers = new Set();
      completedRounds.forEach(round => {
        const player = playerMap.get(round.player_id);
        if (player && 
            round.categoria === group.categoria && 
            player.sexo === group.genero &&
            round.status_ronda === 'completa') {
          uniquePlayers.add(round.player_id);
        }
      });

      return {
        categoria: group.categoria,
        genero: group.genero,
        generoDisplay: group.genero === 'M' ? 'Varonil' : 'Femenil',
        averageScore: average,
        totalRounds: group.totalRounds,
        uniquePlayers: uniquePlayers.size,
        minScore: Math.min(...group.scores),
        maxScore: Math.max(...group.scores)
      };
    }).sort((a, b) => {
      // Ordenar por categoría y luego por género
      const categoriaOrder = ['10-11', '12-13', '14-15', '16-18'];
      const aCatIndex = categoriaOrder.indexOf(a.categoria);
      const bCatIndex = categoriaOrder.indexOf(b.categoria);
      
      if (aCatIndex !== bCatIndex) {
        return aCatIndex - bCatIndex;
      }
      
      return a.genero === 'M' ? -1 : 1; // Varonil primero
    });

    return NextResponse.json({
      overallAverage,
      categoryStats,
      totalRounds: completedRounds.length,
      totalPlayers: players.length
    });

  } catch (error) {
    console.error('Error fetching category stats:', error);
    return NextResponse.json({ error: 'Failed to fetch category stats' }, { status: 500 });
  }
}
