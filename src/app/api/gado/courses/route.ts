import { NextResponse } from 'next/server';
import { getGadoCourses } from '@/lib/gadoSheets';

export async function GET() {
  try {
    // Verificar si las credenciales de Google Sheets están configuradas
    const hasCredentials = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    
    if (hasCredentials) {
      // Usar datos reales de Google Sheets
      console.log('📊 Conectando con Google Sheets para cursos...');
      const courses = await getGadoCourses();
      return NextResponse.json(courses);
    } else {
      // Usar datos mock si no hay credenciales
      console.log('⚠️ Usando datos de ejemplo. Configura Google Sheets para datos reales.');
      
      const mockCourses = [
        {
          course_id: 'C001',
          nombre_campo: 'Club de Golf Los Pinos',
          ciudad: 'Ciudad de México',
          estado: 'CDMX',
          pais: 'México'
        }
      ];
      
      return NextResponse.json(mockCourses);
    }
  } catch (error) {
    console.error('Error fetching GADO courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GADO courses' },
      { status: 500 }
    );
  }
}
