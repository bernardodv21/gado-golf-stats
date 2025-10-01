import { NextResponse } from 'next/server';
import { getGadoPlayers, getGadoSummaryRounds } from '@/lib/gadoSheets';

export async function GET() {
  try {
    const players = await getGadoPlayers();
    const summaryRounds = await getGadoSummaryRounds();

    // Calcular estadísticas por jugador
    const playerStats = players.map(player => {
      // Filtrar rondas completas del jugador
      const playerRounds = summaryRounds.filter(round => 
        round.player_id === player.player_id && 
        round.status_ronda === 'completa'
      );

      if (playerRounds.length === 0) {
        return {
          ...player,
          partidasJugadas: 0,
          scorePromedio: 0,
          mejorScore: 0,
          firPromedio: 0,
          girPromedio: 0,
          puttsPromedio: 0,
          mejora: 0,
          tieneEstadisticas: false
        };
      }

      // Calcular estadísticas básicas
      const scores = playerRounds.map(round => parseInt(round.score_total.toString()));
      const partidasJugadas = playerRounds.length;
      const scorePromedio = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
      const mejorScore = Math.min(...scores);

      // Calcular promedios solo si tiene 2 o más rondas
      let firPromedio: number | null = 0;
      let girPromedio: number | null = 0;
      let puttsPromedio: number | null = 0;

      if (partidasJugadas >= 2) {
        // FIR% promedio
        const firValues = playerRounds
          .filter(round => round.FIR_percent && round.FIR_percent.toString().trim() !== '')
          .map(round => parseFloat(round.FIR_percent.toString().replace(',', '.')));
        
        if (firValues.length > 0) {
          firPromedio = Math.round((firValues.reduce((sum, fir) => sum + fir, 0) / firValues.length) * 100) / 100;
        }

        // GIR% promedio
        const girValues = playerRounds
          .filter(round => round.GIR_percent && round.GIR_percent.toString().trim() !== '')
          .map(round => parseFloat(round.GIR_percent.toString().replace(',', '.')));
        
        if (girValues.length > 0) {
          girPromedio = Math.round((girValues.reduce((sum, gir) => sum + gir, 0) / girValues.length) * 100) / 100;
        }

        // Putts promedio
        const puttsValues = playerRounds
          .filter(round => round.putts_promedio && round.putts_promedio.toString().trim() !== '')
          .map(round => parseFloat(round.putts_promedio.toString().replace(',', '.')));
        
        if (puttsValues.length > 0) {
          puttsPromedio = Math.round((puttsValues.reduce((sum, putts) => sum + putts, 0) / puttsValues.length) * 100) / 100;
        }
      } else {
        // Si no tiene suficientes rondas, no mostrar estadísticas avanzadas
        firPromedio = null;
        girPromedio = null;
        puttsPromedio = null;
      }

      // Calcular mejora (diferencia entre últimas 2 rondas si tiene 2 o más)
      let mejora = 0;
      if (partidasJugadas >= 2) {
        const ultimasDosRondas = playerRounds
          .slice(-2); // Últimas 2 rondas
        
        if (ultimasDosRondas.length === 2) {
          const scoreReciente = parseInt(ultimasDosRondas[1].score_total.toString());
          const scoreAnterior = parseInt(ultimasDosRondas[0].score_total.toString());
          mejora = scoreAnterior - scoreReciente; // Positivo = mejora
        }
      }

      return {
        ...player,
        partidasJugadas,
        scorePromedio,
        mejorScore,
        firPromedio,
        girPromedio,
        puttsPromedio,
        mejora,
        tieneEstadisticas: partidasJugadas >= 2
      };
    });

    // Filtrar solo jugadores con al menos una partida
    const jugadoresConPartidas = playerStats.filter(player => player.partidasJugadas > 0);

    return NextResponse.json({
      players: jugadoresConPartidas,
      total: jugadoresConPartidas.length
    });

  } catch (error) {
    console.error('Error fetching player stats:', error);
    return NextResponse.json({ error: 'Failed to fetch player stats' }, { status: 500 });
  }
}
