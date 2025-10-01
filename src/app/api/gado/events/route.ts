import { NextResponse } from 'next/server';
import { getGadoEvents } from '@/lib/gadoSheets';

export async function GET() {
  try {
    // Verificar si las credenciales de Google Sheets están configuradas
    const hasCredentials = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    
    if (hasCredentials) {
      // Usar datos reales de Google Sheets
      console.log('📊 Conectando con Google Sheets para eventos...');
      const events = await getGadoEvents();
      return NextResponse.json(events);
    } else {
      // Usar datos mock si no hay credenciales
      console.log('⚠️ Usando datos de ejemplo. Configura Google Sheets para datos reales.');
      
      const mockEvents = [
        {
          event_id: 'E001',
          nombre_evento: 'Torneo Primavera GADO',
          sede: 'Club de Golf Los Pinos',
          fecha_inicio: '2024-10-15',
          fecha_fin: '2024-10-17',
          course_id: 'C001'
        }
      ];
      
      return NextResponse.json(mockEvents);
    }
  } catch (error) {
    console.error('Error fetching GADO events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GADO events' },
      { status: 500 }
    );
  }
}
