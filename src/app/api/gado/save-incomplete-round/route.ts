import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;

export async function POST(request: NextRequest) {
  try {
    const { holeStats, player, round } = await request.json();

    if (!SPREADSHEET_ID) {
      return NextResponse.json({ error: 'Google Sheets ID not configured' }, { status: 500 });
    }

    // Autenticación con Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Preparar datos para escribir en la tabla stats_hole
    const rowsToAppend = holeStats.map((stat: any) => [
      '', // A: id (se genera automáticamente)
      new Date().toISOString(), // B: timestamp
      stat.jugador || '', // C: jugador (player_id)
      stat.player_name || '', // D: player_name
      stat.round_id || '', // E: round_id
      '', // F: tee_id (se llena con fórmula)
      stat.hoyo || '', // G: hoyo
      stat.par || '', // H: par
      stat.strokes || '', // I: strokes
      stat.score_relativo || '', // J: score_relativo
      stat.resultado || '', // K: resultado
      stat.putts || '', // L: putts
      stat.palo_salida || '', // M: palo_salida
      stat.fairway_hit || '', // N: fairway_hit
      stat.green_in_regulation || '', // O: green_in_regulation
      stat.bunker || '', // P: bunker
      stat.penalty_ob || '', // Q: penalty_ob
      stat.penalty_agua || '', // R: penalty_agua
      stat.first_putt_dist_m || '', // S: first_putt_dist_m
      stat.up_down_intento || '', // T: up_down_intento
      stat.up_down_exito || '', // U: up_down_exito
      stat.notas || '', // V: notas
      '' // W: summary_key (se llena con fórmula)
    ]);
    
    // Escribir en la tabla stats_hole
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'stats_hole!A:W',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: rowsToAppend
      }
    });

    console.log(`✅ Guardadas ${holeStats.length} estadísticas de hoyos incompletos exitosamente`);

    return NextResponse.json({ 
      success: true, 
      message: `Ronda incompleta guardada con ${holeStats.length} hoyos`,
      updatedRows: response.data.updates?.updatedRows || 0
    });

  } catch (error) {
    console.error('Error saving incomplete round:', error);
    return NextResponse.json({ error: 'Error al guardar la ronda incompleta' }, { status: 500 });
  }
}
