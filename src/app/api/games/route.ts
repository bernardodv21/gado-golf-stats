import { NextResponse } from 'next/server';
import { getGadoRounds, getGadoRoundEntries } from '@/lib/gadoSheets';

export async function GET() {
  try {
    // Verificar si las credenciales de Google Sheets están configuradas
    const hasCredentials = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    
    if (hasCredentials) {
      // Usar datos reales de Google Sheets
      console.log('📊 Conectando con Google Sheets para juegos...');
      const [rounds, roundEntries] = await Promise.all([
        getGadoRounds(),
        getGadoRoundEntries()
      ]);
      
      // Convertir rounds y roundEntries a formato de games
      const games = roundEntries.map(entry => {
        const round = rounds.find(r => r.round_id === entry.round_id);
        return {
          id: entry.entry_id,
          playerId: entry.player_id,
          playerName: entry.display_name,
          course: round?.ronda_name || 'Campo desconocido',
          date: round?.fecha || new Date().toISOString().split('T')[0],
          score: Math.floor(Math.random() * 20) + 70, // Placeholder hasta tener datos reales
          par: 72,
          teeTime: entry.tee_time,
          startingHole: entry.starting_hole,
          notes: entry.notas
        };
      });
      
      return NextResponse.json(games);
    } else {
      // Usar datos mock si no hay credenciales
      console.log('⚠️ Usando datos de ejemplo. Configura Google Sheets para datos reales.');
      
      const mockGames = [
        {
          id: 'mock-game-1',
          playerId: 'mock-1',
          playerName: 'Jugador de Ejemplo',
          course: 'Campo de Ejemplo',
          date: '2024-10-15',
          score: 85,
          par: 72,
          teeTime: '08:00',
          startingHole: 1,
          notes: 'Juego de ejemplo'
        }
      ];
      
      return NextResponse.json(mockGames);
    }
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
