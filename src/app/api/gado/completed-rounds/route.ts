import { NextResponse } from 'next/server';
import { getGadoSummaryRounds } from '@/lib/gadoSheets';

export async function GET() {
  try {
    const hasCredentials = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    
    if (hasCredentials) {
      console.log('📊 Conectando con Google Sheets para rondas completas...');
      
      const summaryRounds = await getGadoSummaryRounds();
      
      // Contar rondas completas (status_ronda = "completa")
      const completedRounds = summaryRounds.filter(round => 
        round.status_ronda && round.status_ronda.toLowerCase() === 'completa'
      );
      
      return NextResponse.json({
        total: completedRounds.length,
        rounds: completedRounds
      });
    } else {
      console.log('⚠️ Usando datos de ejemplo para rondas completas.');
      
      return NextResponse.json({
        total: 0,
        rounds: []
      });
    }
  } catch (error) {
    console.error('Error fetching completed rounds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch completed rounds' },
      { status: 500 }
    );
  }
}
