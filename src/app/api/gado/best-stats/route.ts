import { NextResponse } from 'next/server';
import { getGadoSummaryRounds, getGadoPlayers, getGadoEvents, getGadoRounds, getGadoCourses } from '@/lib/gadoSheets';

export async function GET() {
  try {
    const summaryRounds = await getGadoSummaryRounds();
    const players = await getGadoPlayers();
    const events = await getGadoEvents();
    const rounds = await getGadoRounds();
    const courses = await getGadoCourses();

    // Filtrar solo rondas completas y válidas
    const completedRounds = summaryRounds.filter(round => 
      round.status_ronda === 'completa' && 
      round.score_total && 
      !isNaN(parseInt(round.score_total.toString()))
    );

    if (completedRounds.length === 0) {
      return NextResponse.json({
        bestScore: null,
        bestFIR: null,
        bestGIR: null,
        bestPutts: null,
        message: 'No hay rondas completas registradas'
      });
    }

    // Función para convertir fecha DD-MM-AAAA a formato legible
    const formatDate = (dateStr: string) => {
      if (!dateStr) return 'Fecha no disponible';
      const [day, month, year] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

    // Función para obtener detalles de una ronda
    const getRoundDetails = (round: any) => {
      const player = players.find(p => p.player_id === round.player_id);
      const roundData = rounds.find(r => r.round_id === round.round_id);
      const event = roundData ? events.find(e => e.event_id === roundData.event_id) : null;
      const course = courses.find(c => c.course_id === round.course_id);

      return {
        playerName: player?.display_name || 'Jugador no encontrado',
        playerId: round.player_id,
        eventName: event?.nombre_evento || 'Evento no encontrado',
        roundName: roundData?.ronda_name || 'Ronda no encontrada',
        courseName: course?.nombre_campo || 'Campo no encontrado',
        city: course?.ciudad || '',
        state: course?.estado || '',
        date: event ? formatDate(event.fecha_inicio) : 'Fecha no disponible',
        categoria: round.categoria || 'Categoría no disponible',
        club: round.club || 'Club no disponible',
        sexo: player?.sexo || round.sexo || 'No especificado'
      };
    };

    // 1. Mejor Score (menor número) - manejar empates
    const bestScoreValue = Math.min(...completedRounds.map(round => parseInt(round.score_total.toString())));
    const bestScoreRounds = completedRounds.filter(round => 
      parseInt(round.score_total.toString()) === bestScoreValue
    );

    // 2. Mejor FIR% (mayor porcentaje) - manejar empates
    const validFIRRounds = completedRounds.filter(round => round.FIR_percent && round.FIR_percent.toString().trim() !== '');
    const bestFIRValue = Math.max(...validFIRRounds.map(round => {
      const firStr = round.FIR_percent.toString().replace(',', '.');
      return parseFloat(firStr);
    }));
    const bestFIRRounds = validFIRRounds.filter(round => {
      const firStr = round.FIR_percent.toString().replace(',', '.');
      return parseFloat(firStr) === bestFIRValue;
    });

    // 3. Mejor GIR% (mayor porcentaje) - manejar empates
    const validGIRRounds = completedRounds.filter(round => round.GIR_percent && round.GIR_percent.toString().trim() !== '');
    const bestGIRValue = Math.max(...validGIRRounds.map(round => {
      const girStr = round.GIR_percent.toString().replace(',', '.');
      return parseFloat(girStr);
    }));
    const bestGIRRounds = validGIRRounds.filter(round => {
      const girStr = round.GIR_percent.toString().replace(',', '.');
      return parseFloat(girStr) === bestGIRValue;
    });

    // 4. Mejores Putts Promedio (menor número) - manejar empates
    const validPuttsRounds = completedRounds.filter(round => round.putts_promedio && round.putts_promedio.toString().trim() !== '');
    const bestPuttsValue = Math.min(...validPuttsRounds.map(round => {
      const puttsStr = round.putts_promedio.toString().replace(',', '.');
      return parseFloat(puttsStr);
    }));
    const bestPuttsRounds = validPuttsRounds.filter(round => {
      const puttsStr = round.putts_promedio.toString().replace(',', '.');
      return parseFloat(puttsStr) === bestPuttsValue;
    });

    // 5. Más Eagles por ronda (mayor número) - manejar empates
    const bestEaglesValue = Math.max(...completedRounds.map(round => parseInt(round.eagles.toString()) || 0));
    const bestEaglesRounds = completedRounds.filter(round => 
      parseInt(round.eagles.toString()) === bestEaglesValue
    );

    // 6. Más Birdies por ronda (mayor número) - manejar empates
    const bestBirdiesValue = Math.max(...completedRounds.map(round => parseInt(round.birdies.toString()) || 0));
    const bestBirdiesRounds = completedRounds.filter(round => 
      parseInt(round.birdies.toString()) === bestBirdiesValue
    );

    // Crear detalles para jugadores empatados
    const bestScoreDetails = bestScoreRounds.length > 0 ? {
      score: bestScoreValue,
      players: bestScoreRounds.map(round => getRoundDetails(round))
    } : null;

    const bestFIRDetails = bestFIRRounds.length > 0 ? {
      fir: bestFIRValue,
      players: bestFIRRounds.map(round => getRoundDetails(round))
    } : null;

    const bestGIRDetails = bestGIRRounds.length > 0 ? {
      gir: bestGIRValue,
      players: bestGIRRounds.map(round => getRoundDetails(round))
    } : null;

    const bestPuttsDetails = bestPuttsRounds.length > 0 ? {
      putts: bestPuttsValue,
      players: bestPuttsRounds.map(round => getRoundDetails(round))
    } : null;

    const bestEaglesDetails = bestEaglesRounds.length > 0 ? {
      eagles: bestEaglesValue,
      players: bestEaglesRounds.map(round => getRoundDetails(round))
    } : null;

    const bestBirdiesDetails = bestBirdiesRounds.length > 0 ? {
      birdies: bestBirdiesValue,
      players: bestBirdiesRounds.map(round => getRoundDetails(round))
    } : null;

    return NextResponse.json({
      bestScore: bestScoreDetails,
      bestFIR: bestFIRDetails,
      bestGIR: bestGIRDetails,
      bestPutts: bestPuttsDetails,
      bestEagles: bestEaglesDetails,
      bestBirdies: bestBirdiesDetails,
      totalRounds: completedRounds.length
    });

  } catch (error) {
    console.error('Error fetching best stats:', error);
    return NextResponse.json({ error: 'Failed to fetch best stats' }, { status: 500 });
  }
}
