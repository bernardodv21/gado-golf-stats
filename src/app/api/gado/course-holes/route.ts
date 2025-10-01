import { NextResponse } from 'next/server';
import { getGadoHoles, getGadoCourseTees } from '@/lib/gadoSheets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    const hasCredentials = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    
    if (hasCredentials) {
      console.log(`📊 Conectando con Google Sheets para hoyos del campo ${courseId}...`);
      
      const [holes, courseTees] = await Promise.all([
        getGadoHoles(),
        getGadoCourseTees()
      ]);
      
      // Filtrar hoyos del campo específico
      const courseHoles = holes.filter(hole => hole.course_id === courseId);
      
      // Obtener información de tees para este campo
      const courseTeesData = courseTees.filter(tee => tee.course_id === courseId);
      
      // Ordenar hoyos por número
      const sortedHoles = courseHoles.sort((a, b) => parseInt(a.hoyo) - parseInt(b.hoyo));
      
      return NextResponse.json({
        course_id: courseId,
        holes: sortedHoles,
        tees: courseTeesData
      });
    } else {
      console.log('⚠️ Usando datos de ejemplo para hoyos del campo.');
      
      // Datos de ejemplo para un campo de 18 hoyos
      const mockHoles = Array.from({ length: 18 }, (_, index) => ({
        course_id: courseId,
        hoyo: (index + 1).toString(),
        par: index < 4 ? 4 : index < 8 ? 3 : 5, // Mix de pars
        handicap_hoyo: (index + 1).toString(),
        hole_id: `hole-${courseId}-${index + 1}`
      }));
      
      const mockTees = [
        {
          tee_id: 'tee-1',
          course_id: courseId,
          tee_set: 'Azules',
          par_total: 72,
          yardas_total: 6500,
          rating_hombres: 72.1,
          slope_hombres: 135,
          rating_mujeres: 75.2,
          slope_mujeres: 140
        },
        {
          tee_id: 'tee-2',
          course_id: courseId,
          tee_set: 'Blancas',
          par_total: 72,
          yardas_total: 6200,
          rating_hombres: 70.5,
          slope_hombres: 130,
          rating_mujeres: 73.8,
          slope_mujeres: 135
        }
      ];
      
      return NextResponse.json({
        course_id: courseId,
        holes: mockHoles,
        tees: mockTees
      });
    }
  } catch (error) {
    console.error('Error fetching course holes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course holes' },
      { status: 500 }
    );
  }
}
