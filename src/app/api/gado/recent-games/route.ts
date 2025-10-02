import { NextResponse } from 'next/server';
import { getGadoSummaryRounds, getGadoPlayers, getGadoEvents, getGadoRounds, getGadoCourses, getHole18CaptureDates } from '@/lib/gadoSheets';

export async function GET() {
  try {
    const summaryRounds = await getGadoSummaryRounds();
    const players = await getGadoPlayers();
    const events = await getGadoEvents();
    const rounds = await getGadoRounds();
    const courses = await getGadoCourses();
    const hole18CaptureDates = await getHole18CaptureDates();

    // Filtrar solo rondas completas
    const completedRounds = summaryRounds.filter(round => round.status_ronda === 'completa');
    console.log(`Total summary rounds: ${summaryRounds.length}`);
    console.log(`Completed rounds: ${completedRounds.length}`);
    console.log(`Recent completed rounds:`, completedRounds.slice(-5).map(r => ({ 
      player: r.player_id, 
      round: r.round_id, 
      status: r.status_ronda,
      date: r.summary_key 
    })));

    // Enriquecer con fechas de captura del hoyo 18 y ordenar por fecha de captura
    const roundsWithCaptureDates = completedRounds
      .map(round => {
        const captureDate = hole18CaptureDates.get(round.summary_key);
        const roundData = rounds.find(r => r.round_id === round.round_id);
        // Usar fecha de captura del hoyo 18 si existe, sino usar fecha del evento de la tabla rounds
        const finalDate = captureDate || roundData?.fecha || new Date(0).toISOString();
        console.log(`Round ${round.summary_key}: captureDate=${captureDate}, eventDate=${roundData?.fecha}, finalDate=${finalDate}`);
        return {
          ...round,
          captureDate: finalDate
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.captureDate).getTime();
        const dateB = new Date(b.captureDate).getTime();
        return dateB - dateA; // Más reciente primero
      })
      .slice(0, 8); // Tomar solo las últimas 8

    // Enriquecer con información detallada
    const recentGames = roundsWithCaptureDates.map(round => {
      const player = players.find(p => p.player_id === round.player_id);
      const roundData = rounds.find(r => r.round_id === round.round_id);
      const event = roundData ? events.find(e => e.event_id === roundData.event_id) : null;
      const course = courses.find(c => c.course_id === round.course_id);

      // Calcular score relativo al par
      const par = parseInt(round.tee_set?.toString() || '72') || 72;
      const scoreTotal = parseInt(round.score_total.toString()) || 0;
      const scoreRelative = scoreTotal - par;

      // Determinar el color del badge según el rendimiento
      let badgeColor = 'bg-gray-500'; // Por defecto
      if (scoreRelative <= 0) {
        badgeColor = 'bg-green-500'; // Par o mejor
      } else if (scoreRelative <= 5) {
        badgeColor = 'bg-yellow-500'; // 1-5 sobre par
      } else {
        badgeColor = 'bg-red-500'; // Más de 5 sobre par
      }

      // Formatear fecha
      const formatDate = (dateStr: string) => {
        if (!dateStr || dateStr === 'undefined') return 'Fecha no disponible';
        try {
          const [day, month, year] = dateStr.split('-');
          if (!day || !month || !year) return 'Fecha no disponible';
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
        } catch (error) {
          return 'Fecha no disponible';
        }
      };

      return {
        id: round.summary_key,
        playerName: player?.display_name || 'Jugador no encontrado',
        playerId: round.player_id,
        playerSexo: player?.sexo || round.sexo || 'M',
        categoria: round.categoria || 'Categoría no disponible',
        club: round.club || 'Club no disponible',
        scoreTotal,
        scoreRelative,
        par,
        holes: parseInt(round.holes?.toString() || '18'),
        date: roundData?.fecha || '',
        eventName: event?.nombre_evento || 'Evento no encontrado',
        roundName: roundData?.ronda_name || 'Ronda no encontrada',
        courseName: course?.nombre_campo || 'Campo no encontrado',
        city: course?.ciudad || '',
        state: course?.estado || '',
        badgeColor,
        isNew: false, // Se puede usar para marcar rondas muy recientes
        completionTime: new Date().toISOString() // Para animaciones
      };
    });

    return NextResponse.json({
      games: recentGames,
      total: recentGames.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching recent games:', error);
    return NextResponse.json({ error: 'Failed to fetch recent games' }, { status: 500 });
  }
}
