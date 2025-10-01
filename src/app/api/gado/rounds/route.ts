import { NextResponse } from 'next/server';
import { getGadoRounds } from '@/lib/gadoSheets';

export async function GET() {
  try {
    // Verificar si las credenciales de Google Sheets están configuradas
    const hasCredentials = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    
    if (hasCredentials) {
      // Usar datos reales de Google Sheets
      console.log('📊 Conectando con Google Sheets para rondas...');
      const rounds = await getGadoRounds();
      return NextResponse.json(rounds);
    } else {
      // Usar datos mock si no hay credenciales
      console.log('⚠️ Usando datos de ejemplo. Configura Google Sheets para datos reales.');
      
      const mockRounds = [
        {
          round_id: 'R001',
          ronda_name: 'Ronda 1 - Torneo Primavera',
          event_id: 'E001',
          fecha: '2024-10-15',
          numero_ronda: 1,
          course_id: 'C001',
          activa: true
        }
      ];
      
      return NextResponse.json(mockRounds);
    }
  } catch (error) {
    console.error('Error fetching GADO rounds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GADO rounds' },
      { status: 500 }
    );
  }
}
