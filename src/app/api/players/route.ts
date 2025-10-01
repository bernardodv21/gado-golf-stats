import { NextResponse } from 'next/server';
import { getGadoPlayers } from '@/lib/gadoSheets';

export async function GET() {
  try {
    // Verificar si las credenciales de Google Sheets están configuradas
    const hasCredentials = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    
    if (hasCredentials) {
      // Usar datos reales de Google Sheets
      console.log('📊 Conectando con Google Sheets para jugadores...');
      const players = await getGadoPlayers();
      return NextResponse.json(players);
    } else {
      // Usar datos mock si no hay credenciales
      console.log('⚠️ Usando datos de ejemplo. Configura Google Sheets para datos reales.');
      
      const mockPlayers = [
        {
          player_id: 'mock-1',
          display_name: 'Jugador de Ejemplo',
          edad: 15,
          categoria: '16-18',
          club: 'Club de Ejemplo'
        }
      ];
      
      return NextResponse.json(mockPlayers);
    }
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}
