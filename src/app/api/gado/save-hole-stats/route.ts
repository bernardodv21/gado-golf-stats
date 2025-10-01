import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { randomUUID } from 'crypto';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// Función para formatear fecha como DD/MM/AAAA HH:MM:SS
function formatTimestamp(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Función para convertir Sí/No a TRUE/FALSE
function convertToBoolean(value: string): string {
  if (value === 'Sí' || value === 'Yes' || value === 'true' || value === 'TRUE') {
    return 'TRUE';
  }
  return 'FALSE';
}

export async function POST(request: Request) {
  try {
    const hasCredentials = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    
    if (!hasCredentials) {
      return NextResponse.json(
        { error: 'Google Sheets credentials not configured' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    const { holeStats } = body;
    
    if (!holeStats || !Array.isArray(holeStats)) {
      return NextResponse.json(
        { error: 'Invalid hole stats data' },
        { status: 400 }
      );
    }
    
    console.log('📊 Guardando estadísticas de hoyos en Google Sheets...');
    
    // Configurar autenticación
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Preparar datos para escribir en la tabla stats_hole
    // MEJORADO: Con UUID, formato de fecha, TRUE/FALSE, y lógica up_down
    const rowsToAppend = holeStats.map(stat => {
      const currentTime = new Date();
      const strokes = parseInt(stat.strokes || '0');
      const putts = parseInt(stat.putts || '0');
      const par = parseInt(stat.par || '0');
      const scoreRelativo = parseInt(stat.score_relativo || '0');
      
      // Calcular up_down_intento: TRUE si GIR es FALSE
      const girIsFalse = stat.green_in_regulation === 'No' || stat.green_in_regulation === 'FALSE';
      const upDownIntento = girIsFalse ? 'TRUE' : 'FALSE';
      
      // Calcular up_down_exito: TRUE si up_down_intento es TRUE y score_relativo <= 0
      const upDownExito = (upDownIntento === 'TRUE' && scoreRelativo <= 0) ? 'TRUE' : 'FALSE';
      
      return [
        randomUUID(), // A: id (UUID generado)
        formatTimestamp(currentTime), // B: timestamp (DD/MM/AAAA HH:MM:SS)
        stat.jugador || '', // C: jugador (player_id)
        stat.player_name || '', // D: player_name
        stat.round_id || '', // E: round_id
        '', // F: tee_id (se llenará con fórmula después)
        stat.hoyo || '', // G: hoyo
        stat.par || '', // H: par
        stat.strokes || '', // I: strokes
        stat.score_relativo || '', // J: score_relativo
        stat.resultado || '', // K: resultado
        stat.putts || '', // L: putts
        stat.palo_salida || '', // M: palo_salida
        convertToBoolean(stat.fairway_hit || ''), // N: fairway_hit (TRUE/FALSE)
        convertToBoolean(stat.green_in_regulation || ''), // O: green_in_regulation (TRUE/FALSE)
        convertToBoolean(stat.bunker || ''), // P: bunker (TRUE/FALSE)
        stat.penalty_ob || '', // Q: penalty_ob
        stat.penalty_agua || '', // R: penalty_agua
        upDownIntento, // S: up_down_intento (calculado) - CORREGIDO
        upDownExito, // T: up_down_exito (calculado) - CORREGIDO
        stat.notas || '', // U: notas - CORREGIDO
        '' // V: summary_key (se llenará con fórmula después) - CORREGIDO
      ];
    });
    
    // Escribir en la tabla stats_hole (agregar al final, sin borrar datos existentes)
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'stats_hole!A:V', // Todas las columnas de stats_hole (A-V)
      valueInputOption: 'USER_ENTERED', // USER_ENTERED para que se interpreten las fórmulas
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: rowsToAppend
      }
    });
    
    // Actualizar las columnas F (tee_id) y V (summary_key) con fórmulas
    if (response.data.updates?.updatedRange) {
      const range = response.data.updates.updatedRange;
      const startRow = parseInt(range.split('!')[1].split(':')[0].replace(/\D/g, ''));
      const endRow = parseInt(range.split('!')[1].split(':')[1].replace(/\D/g, ''));
      
      // Crear fórmulas para la columna F (tee_id)
      // Busca por player_id (C) Y round_id (E) en round_entries
      // IMPORTANTE: Fórmulas en español para Google Sheets
      const teeIdFormulas = [];
      for (let i = startRow; i <= endRow; i++) {
        // Fórmula CORRECTA: Busca por player_id (C) y round_id (B)
        // stats_hole.jugador = round_entries.player_id Y stats_hole.round_id = round_entries.round_id
        // IMPORTANTE: Usar punto y coma (;) para separar argumentos en Google Sheets español
        teeIdFormulas.push([`=INDICE(FILTER(round_entries!E:E;(round_entries!C:C=C${i})*(round_entries!B:B=E${i}));1)`]);
      }
      
      // Crear fórmulas para la columna V (summary_key) - CORREGIDO
      const summaryKeyFormulas = [];
      for (let i = startRow; i <= endRow; i++) {
        summaryKeyFormulas.push([`=C${i}&":"&E${i}`]);
      }
      
      // Actualizar la columna F con las fórmulas
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `stats_hole!F${startRow}:F${endRow}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: teeIdFormulas
        }
      });
      
      // Actualizar la columna V con las fórmulas - CORREGIDO
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `stats_hole!V${startRow}:V${endRow}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: summaryKeyFormulas
        }
      });
    }
    
    console.log(`✅ Guardadas ${holeStats.length} estadísticas de hoyos exitosamente`);
    
    // NOTA: NO escribimos en summary_round porque tiene fórmulas configuradas
    // que se actualizan automáticamente cuando se llenan los datos en stats_hole
    
    return NextResponse.json({
      success: true,
      message: `Se guardaron ${holeStats.length} estadísticas de hoyos`,
      updatedRows: response.data.updates?.updatedRows || 0
    });
    
  } catch (error) {
    console.error('Error saving hole stats:', error);
    return NextResponse.json(
      { error: 'Failed to save hole stats' },
      { status: 500 }
    );
  }
}
