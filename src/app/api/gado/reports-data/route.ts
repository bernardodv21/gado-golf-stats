import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function GET(request: Request) {
  try {
    const startTime = Date.now();
    const { searchParams } = new URL(request.url);
    const playerIds = searchParams.get('playerIds')?.split(',') || [];
    const categoria = searchParams.get('categoria');
    const sexo = searchParams.get('sexo');
    const club = searchParams.get('club');

    console.log('📊 Obteniendo datos para reportes avanzados...');

    const auth = await google.auth.getClient({
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

    // Obtener datos de players
    const playersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'players!A:K',
    });
    const playersData = playersResponse.data.values || [];
    const playersRows = playersData.slice(1);

    // Obtener datos de stats_hole para análisis detallado
    const statsHoleResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'stats_hole!A:V',
    });
    const statsHoleData = statsHoleResponse.data.values || [];
    const statsHoleRows = statsHoleData.slice(1);

    // Filtrar jugadores según criterios
    let filteredPlayers = playersRows;
    
    if (playerIds.length > 0) {
      filteredPlayers = playersRows.filter(row => playerIds.includes(row[0]));
    } else {
      if (categoria) {
        filteredPlayers = filteredPlayers.filter(row => row[4] === categoria);
      }
      if (sexo) {
        filteredPlayers = filteredPlayers.filter(row => row[6] === sexo);
      }
      if (club) {
        filteredPlayers = filteredPlayers.filter(row => row[9] === club);
      }
    }

    // Procesar datos de cada jugador
    const playersData_processed = filteredPlayers.map(playerRow => {
      const player_id = playerRow[0];
      const display_name = playerRow[3];
      const categoria = playerRow[4];
      const sexo = playerRow[6];
      const edad = playerRow[8];
      const club = playerRow[9];

      // Filtrar rondas completadas de este jugador
      const playerRounds = summaryRows.filter(summaryRow => 
        summaryRow[1] === player_id && summaryRow[28] === 'completa'
      );

      // Filtrar stats de hoyos de este jugador
      const playerHoleStats = statsHoleRows.filter(holeRow => 
        holeRow[2] === player_id
      );

      // Calcular estadísticas agregadas
      const totalRounds = playerRounds.length;
      
      if (totalRounds === 0) {
        return {
          player_id,
          display_name,
          categoria,
          sexo,
          edad: parseInt(edad) || 0,
          club,
          totalRounds: 0,
          stats: null
        };
      }

      // Calcular promedios y totales
      const scores = playerRounds.map(r => parseInt(r[13]) || 0);
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const bestScore = Math.min(...scores);
      const worstScore = Math.max(...scores);

      const firPercentages = playerRounds.map(r => parseFloat((r[15] || '0').toString().replace(',', '.')) || 0);
      const averageFIR = firPercentages.reduce((a, b) => a + b, 0) / firPercentages.length;

      const girPercentages = playerRounds.map(r => parseFloat((r[16] || '0').toString().replace(',', '.')) || 0);
      const averageGIR = girPercentages.reduce((a, b) => a + b, 0) / girPercentages.length;

      const puttsAvgs = playerRounds.map(r => parseFloat((r[18] || '0').toString().replace(',', '.')) || 0);
      const averagePutts = puttsAvgs.reduce((a, b) => a + b, 0) / puttsAvgs.length;

      const scramblingPercentages = playerRounds.map(r => parseFloat((r[19] || '0').toString().replace(',', '.')) || 0);
      const averageScrambling = scramblingPercentages.reduce((a, b) => a + b, 0) / scramblingPercentages.length;

      // Calcular totales de resultados
      const totalEagles = playerRounds.reduce((sum, r) => sum + (parseInt(r[22]) || 0), 0);
      const totalBirdies = playerRounds.reduce((sum, r) => sum + (parseInt(r[23]) || 0), 0);
      const totalPars = playerRounds.reduce((sum, r) => sum + (parseInt(r[24]) || 0), 0);
      const totalBogeys = playerRounds.reduce((sum, r) => sum + (parseInt(r[25]) || 0), 0);
      const totalDoubleBogeys = playerRounds.reduce((sum, r) => sum + (parseInt(r[26]) || 0), 0);
      const totalWorse = playerRounds.reduce((sum, r) => sum + (parseInt(r[27]) || 0), 0);

      // Análisis por tipo de hoyo (stats_hole)
      const par3Holes = playerHoleStats.filter(h => parseInt(h[7]) === 3);
      const par4Holes = playerHoleStats.filter(h => parseInt(h[7]) === 4);
      const par5Holes = playerHoleStats.filter(h => parseInt(h[7]) === 5);

      const par3Avg = par3Holes.length > 0 
        ? par3Holes.reduce((sum, h) => sum + (parseInt(h[8]) || 0), 0) / par3Holes.length 
        : 0;
      const par4Avg = par4Holes.length > 0 
        ? par4Holes.reduce((sum, h) => sum + (parseInt(h[8]) || 0), 0) / par4Holes.length 
        : 0;
      const par5Avg = par5Holes.length > 0 
        ? par5Holes.reduce((sum, h) => sum + (parseInt(h[8]) || 0), 0) / par5Holes.length 
        : 0;

      // Análisis de tendencias (últimas 5 rondas vs primeras 5)
      const sortedRounds = playerRounds.sort((a, b) => {
        const dateA = new Date(a[1]); // Asumiendo que la fecha está en columna 1
        const dateB = new Date(b[1]);
        return dateA.getTime() - dateB.getTime();
      });

      const firstFiveRounds = sortedRounds.slice(0, Math.min(5, sortedRounds.length));
      const lastFiveRounds = sortedRounds.slice(Math.max(0, sortedRounds.length - 5));

      const firstFiveAvg = firstFiveRounds.length > 0
        ? firstFiveRounds.reduce((sum, r) => sum + (parseInt(r[13]) || 0), 0) / firstFiveRounds.length
        : 0;
      const lastFiveAvg = lastFiveRounds.length > 0
        ? lastFiveRounds.reduce((sum, r) => sum + (parseInt(r[13]) || 0), 0) / lastFiveRounds.length
        : 0;

      const improvement = firstFiveAvg > 0 ? firstFiveAvg - lastFiveAvg : 0;

      // Identificar fortalezas y debilidades
      const strengths = [];
      const weaknesses = [];

      if (averageGIR > 50) strengths.push({ area: 'Juego Largo', value: averageGIR, metric: 'GIR%' });
      else if (averageGIR < 30) weaknesses.push({ area: 'Juego Largo', value: averageGIR, metric: 'GIR%' });

      if (averageFIR > 50) strengths.push({ area: 'Precisión Tee', value: averageFIR, metric: 'FIR%' });
      else if (averageFIR < 30) weaknesses.push({ area: 'Precisión Tee', value: averageFIR, metric: 'FIR%' });

      if (averagePutts < 1.9) strengths.push({ area: 'Putting', value: averagePutts, metric: 'Putts/Hoyo' });
      else if (averagePutts > 2.1) weaknesses.push({ area: 'Putting', value: averagePutts, metric: 'Putts/Hoyo' });

      if (averageScrambling > 40) strengths.push({ area: 'Juego Corto', value: averageScrambling, metric: 'Scrambling%' });
      else if (averageScrambling < 20) weaknesses.push({ area: 'Juego Corto', value: averageScrambling, metric: 'Scrambling%' });

      // Distribución de scores
      const scoreDistribution = {
        eagles: totalEagles,
        birdies: totalBirdies,
        pars: totalPars,
        bogeys: totalBogeys,
        doubleBogeys: totalDoubleBogeys,
        worse: totalWorse
      };

      return {
        player_id,
        display_name,
        categoria,
        sexo,
        edad: parseInt(edad) || 0,
        club,
        totalRounds,
        stats: {
          scoring: {
            averageScore: Math.round(averageScore * 10) / 10,
            bestScore,
            worstScore,
            improvement: Math.round(improvement * 10) / 10,
            firstFiveAvg: Math.round(firstFiveAvg * 10) / 10,
            lastFiveAvg: Math.round(lastFiveAvg * 10) / 10,
          },
          ballStriking: {
            averageFIR: Math.round(averageFIR * 10) / 10,
            averageGIR: Math.round(averageGIR * 10) / 10,
            par3Avg: Math.round(par3Avg * 100) / 100,
            par4Avg: Math.round(par4Avg * 100) / 100,
            par5Avg: Math.round(par5Avg * 100) / 100,
          },
          shortGame: {
            averagePutts: Math.round(averagePutts * 100) / 100,
            averageScrambling: Math.round(averageScrambling * 10) / 10,
          },
          scoreDistribution,
          strengths,
          weaknesses,
        }
      };
    });

    // Filtrar solo jugadores con rondas
    const playersWithRounds = playersData_processed.filter(p => p.totalRounds > 0);

    const elapsed = Date.now() - startTime;
    console.log('✅ Datos de reportes procesados:', playersWithRounds.length, 'jugadores en', elapsed, 'ms');

    return NextResponse.json({
      players: playersWithRounds,
      totalPlayers: playersWithRounds.length,
      filters: {
        categoria: categoria || null,
        sexo: sexo || null,
        club: club || null,
      },
      performance: {
        elapsed,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error fetching reports data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

