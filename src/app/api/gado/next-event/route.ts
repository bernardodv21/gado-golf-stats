import { NextResponse } from 'next/server';
import { getGadoRounds, getGadoEvents, getGadoCourses } from '@/lib/gadoSheets';

export async function GET() {
  try {
    const hasCredentials = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    
    if (hasCredentials) {
      console.log('📊 Conectando con Google Sheets para próximo evento...');
      
      const [rounds, events, courses] = await Promise.all([
        getGadoRounds(),
        getGadoEvents(),
        getGadoCourses()
      ]);
      
      // Encontrar la ronda activa
      const activeRound = rounds.find(round => round.activa === true);
      
      if (activeRound) {
        // Encontrar el evento correspondiente
        const event = events.find(e => e.event_id === activeRound.event_id);
        // Encontrar el curso correspondiente
        const course = courses.find(c => c.course_id === activeRound.course_id);
        
        if (event && course) {
          // Función para convertir DD-MM-AAAA a DD-MMM-AAAA
          const convertDateFormat = (dateStr: string) => {
            if (!dateStr) return null;
            const [day, month, year] = dateStr.split('-');
            // Crear fecha en zona horaria local para evitar desfases
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            
            // Formatear a DD-MMM-AAAA
            const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                           'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const monthName = months[date.getMonth()];
            const dayFormatted = day.padStart(2, '0');
            
            return `${dayFormatted}-${monthName}-${year}`;
          };

          return NextResponse.json({
            eventName: event.nombre_evento,
            courseName: course.nombre_campo,
            city: course.ciudad,
            state: course.estado,
            startDate: convertDateFormat(event.fecha_inicio),
            endDate: convertDateFormat(event.fecha_fin),
            roundName: activeRound.ronda_name
          });
        }
      }
      
      // Si no hay evento activo, devolver datos por defecto
      return NextResponse.json({
        eventName: 'Torneo Primavera 2025',
        courseName: 'Club de Golf Los Pinos',
        city: 'Ciudad de México',
        state: 'CDMX',
        startDate: '15-Mar-2025',
        endDate: '16-Mar-2025',
        roundName: 'Ronda 1'
      });
    } else {
      console.log('⚠️ Usando datos de ejemplo para próximo evento.');
      
      return NextResponse.json({
        eventName: 'Torneo Primavera 2025',
        courseName: 'Club de Golf Los Pinos',
        city: 'Ciudad de México',
        state: 'CDMX',
        startDate: '15-Mar-2025',
        endDate: '16-Mar-2025',
        roundName: 'Ronda 1'
      });
    }
  } catch (error) {
    console.error('Error fetching next event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch next event' },
      { status: 500 }
    );
  }
}
