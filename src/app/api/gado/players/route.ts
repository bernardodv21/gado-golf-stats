import { NextResponse } from 'next/server';
import { getGadoPlayers } from '@/lib/gadoSheets';

export async function GET() {
  try {
    // Verificar si las credenciales de Google Sheets están configuradas
    const hasCredentials = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    
    if (hasCredentials) {
      // Usar datos reales de Google Sheets
      console.log('📊 Conectando con Google Sheets...');
      const players = await getGadoPlayers();
      return NextResponse.json(players);
    } else {
      // Usar datos mock si no hay credenciales
      console.log('⚠️ Usando datos de ejemplo. Configura Google Sheets para datos reales.');
      
      const mockPlayers = [
        {
          player_id: 'P001',
          nombre: 'Santiago',
          apellido: 'García',
          display_name: 'Santiago García',
          categoria: '10-12',
          tee_id_default: 'T001',
          sexo: 'M',
          fecha_nacimiento: '2012-05-15',
          edad: 12,
          club: 'Club de Golf Los Pinos',
          CURP: 'GAS120515HDFRCN01'
        },
        {
          player_id: 'P002',
          nombre: 'Valentina',
          apellido: 'López',
          display_name: 'Valentina López',
          categoria: '10-12',
          tee_id_default: 'T002',
          sexo: 'F',
          fecha_nacimiento: '2013-08-22',
          edad: 11,
          club: 'Campo de Golf El Roble',
          CURP: 'LOV130822MDFLPN02'
        },
        {
          player_id: 'P003',
          nombre: 'Diego',
          apellido: 'Martínez',
          display_name: 'Diego Martínez',
          categoria: '13-15',
          tee_id_default: 'T001',
          sexo: 'M',
          fecha_nacimiento: '2010-03-10',
          edad: 14,
          club: 'Club de Golf Los Pinos',
          CURP: 'MAD100310HDFRNG03'
        }
      ];
      
      return NextResponse.json(mockPlayers);
    }
  } catch (error) {
    console.error('Error fetching GADO players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GADO players' },
      { status: 500 }
    );
  }
}
