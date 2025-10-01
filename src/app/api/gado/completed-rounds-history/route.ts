import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Obtener datos de summary_round (rondas completadas)
    const summaryResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'summary_round!A:AC',
    });

    const summaryData = summaryResponse.data.values || [];
    const summaryRows = summaryData.slice(1);

    // Obtener datos de courses para información adicional
    const coursesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'courses!A:H',
    });

    const coursesData = coursesResponse.data.values || [];
    const coursesRows = coursesData.slice(1);

    // Crear mapa de courses para búsquedas rápidas
    const coursesMap = new Map();
    coursesRows.forEach(row => {
      const courseId = row[0];
      coursesMap.set(courseId, {
        course_id: row[0],
        course_name: row[1],
        city: row[2],
        state: row[3],
        country: row[4],
        par: row[5],
        holes: row[6],
        website: row[7]
      });
    });

    // Procesar rondas completadas
    const completedRounds = [];
    
    for (const summaryRow of summaryRows) {
      // Según PROJECT_RULES.md, summary_round tiene estas columnas:
      // 0: summary_key, 1: player_id, 2: player_name, 3: sexo, 4: club, 5: round_id, etc.
      const playerId = summaryRow[1]; // player_id
      const playerName = summaryRow[2]; // player_name
      const playerSexo = summaryRow[3]; // sexo
      const playerClub = summaryRow[4]; // club
      const roundId = summaryRow[5]; // round_id
      const courseId = summaryRow[6]; // course_id
      const courseName = summaryRow[7]; // course_name
      const playerCategory = summaryRow[8]; // categoria
      const statusRonda = summaryRow[28]; // status_ronda
      const totalScore = parseInt(summaryRow[13]) || 0; // score_total
      
      // Solo procesar rondas que estén completadas y tengan score > 0
      if (statusRonda === 'completa' && totalScore > 0) {
        const course = coursesMap.get(courseId);
        
        if (course) {
          completedRounds.push({
            id: roundId,
            playerId: playerId,
            playerName: playerName,
            playerCategory: playerCategory,
            playerClub: playerClub,
            playerSexo: playerSexo,
            courseName: courseName,
            courseCity: course.city,
            courseState: course.state,
            par: parseInt(course.par) || 72,
            holes: parseInt(summaryRow[12]) || 18, // holes
            totalScore: totalScore,
            scoreToPar: parseInt(summaryRow[14]) || 0, // to_par_total
            putts: parseInt(summaryRow[17]) || 0, // putts_totales
            puttsPromedio: parseFloat((summaryRow[18] || '0').toString().replace(',', '.')) || 0, // putts_promedio
            fairwaysHit: 0, // No disponible en summary_round
            fairwaysTotal: 0, // No disponible en summary_round
            firPercentage: parseFloat((summaryRow[15] || '0').toString().replace(',', '.')) || 0, // FIR_%
            greensHit: 0, // No disponible en summary_round
            greensTotal: 0, // No disponible en summary_round
            girPercentage: parseFloat((summaryRow[16] || '0').toString().replace(',', '.')) || 0, // GIR_%
            bunkers: 0, // No disponible en summary_round
            penalties: parseInt(summaryRow[21]) || 0, // penalties
            eagles: parseInt(summaryRow[22]) || 0, // eagles
            birdies: parseInt(summaryRow[23]) || 0, // birdies
            pars: parseInt(summaryRow[24]) || 0, // pars
            bogeys: parseInt(summaryRow[25]) || 0, // bogeys
            doubleBogeys: parseInt(summaryRow[26]) || 0, // dobles
            worse: parseInt(summaryRow[27]) || 0, // triple_o_mas
            startDate: '', // No disponible en summary_round
            endDate: '', // No disponible en summary_round
            weather: '', // No disponible en summary_round
            notes: '', // No disponible en summary_round
            status: statusRonda
          });
        }
      }
    }

    // Ordenar por score total (mejores scores primero)
    completedRounds.sort((a, b) => a.totalScore - b.totalScore);

    return NextResponse.json(completedRounds);

  } catch (error) {
    console.error('Error fetching completed rounds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch completed rounds' },
      { status: 500 }
    );
  }
}