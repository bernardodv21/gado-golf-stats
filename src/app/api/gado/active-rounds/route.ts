import { NextResponse } from 'next/server';
import { getActiveRoundsWithDetails } from '@/lib/gadoSheets';

export async function GET() {
  try {
    // Verificar si las credenciales de Google Sheets están configuradas
    const hasCredentials = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    
    if (hasCredentials) {
      // Usar datos reales de Google Sheets
      console.log('📊 Obteniendo rondas activas...');
      const activeRounds = await getActiveRoundsWithDetails();
      console.log('✅ Rondas activas encontradas:', activeRounds.length);
      return NextResponse.json(activeRounds);
    } else {
      // Usar datos mock si no hay credenciales
      console.log('⚠️ Usando datos de ejemplo. Configura Google Sheets para datos reales.');
      
      const mockActiveRounds = [
        {
          round_id: 'R001',
          ronda_name: 'Ronda 1 - Torneo Primavera',
          event_id: 'E001',
          fecha: '2024-10-15',
          numero_ronda: 1,
          course_id: 'C001',
          activa: true,
          event_name: 'Torneo Primavera GADO',
          course_name: 'Club de Golf Los Pinos',
          course_city: 'Ciudad de México',
          course_state: 'CDMX'
        }
      ];
      
      return NextResponse.json(mockActiveRounds);
    }
  } catch (error) {
    console.error('❌ Error fetching active rounds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active rounds', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

