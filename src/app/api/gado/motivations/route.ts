import { NextResponse } from 'next/server';
import { getMotivations } from '@/lib/gadoSheets';

export async function GET() {
  try {
    // Verificar si las credenciales de Google Sheets están configuradas
    const hasCredentials = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    
    if (hasCredentials) {
      // Usar datos reales de Google Sheets
      console.log('📊 Conectando con Google Sheets para frases motivacionales...');
      const motivations = await getMotivations();
      return NextResponse.json(motivations);
    } else {
      // Usar datos mock si no hay credenciales
      console.log('⚠️ Usando frases de ejemplo. Configura Google Sheets para frases reales.');
      
      const mockMotivations = [
        { frase: "¡Cada hoyo es una nueva oportunidad de brillar! ⛳" },
        { frase: "El golf te enseña paciencia, concentración y respeto. ¡Sigue practicando! 🏌️‍♂️" },
        { frase: "Los grandes golfistas no nacieron grandes, ¡practicaron mucho! 💪" },
        { frase: "Cada swing te acerca más a tu mejor juego. ¡No te rindas! ⭐" },
        { frase: "El golf es 90% mental y 10% físico. ¡Mantén la mente positiva! 🧠" },
        { frase: "Los errores son lecciones disfrazadas. ¡Aprende y mejora! 📚" },
        { frase: "La consistencia es la clave del éxito en el golf. ¡Sigue practicando! 🎯" },
        { frase: "Cada ronda es una aventura nueva. ¡Disfruta el viaje! 🌟" },
        { frase: "El golf te enseña a ser honesto contigo mismo. ¡Sé tu mejor versión! ✨" },
        { frase: "Los campeones se hacen en la práctica, no solo en el campo. ¡Entrena duro! 🏆" }
      ];
      
      return NextResponse.json(mockMotivations);
    }
  } catch (error) {
    console.error('Error fetching motivations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch motivations' },
      { status: 500 }
    );
  }
}
