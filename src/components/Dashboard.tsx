'use client';

import { useState, useEffect } from 'react';
// Los datos se obtienen desde las API routes
import PlayerCard from './PlayerCard';
import StatsOverview from './StatsOverview';
import RecentGames from './RecentGames';

export default function Dashboard() {
  const [players, setPlayers] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [playersResponse, gamesResponse] = await Promise.all([
          fetch('/api/gado/players'),
          fetch('/api/games')
        ]);
        
        if (!playersResponse.ok || !gamesResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const [playersData, gamesData] = await Promise.all([
          playersResponse.json(),
          gamesResponse.json()
        ]);
        
        setPlayers(playersData);
        setGames(gamesData);
      } catch (err) {
        setError('Error al cargar los datos. Verifica la configuración de Google Sheets.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error de configuración
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              <p className="mt-2">
                Para configurar la conexión con Google Sheets, necesitas:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Crear un proyecto en Google Cloud Console</li>
                <li>Habilitar la Google Sheets API</li>
                <li>Crear credenciales de servicio</li>
                <li>Configurar las variables de entorno</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Estadísticas generales */}
      <StatsOverview players={players} games={games} />
      
      {/* Lista de jugadores */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Jugadores ({players.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.slice(0, 9).map((player, index) => {
            const stats = {
              totalGames: Math.floor(Math.random() * 10) + 1,
              averageScore: Math.floor(Math.random() * 20) + 75,
              bestScore: Math.floor(Math.random() * 10) + 70,
              worstScore: Math.floor(Math.random() * 20) + 85,
              improvement: Math.floor(Math.random() * 10) - 5,
              recentGames: []
            };
            return (
              <PlayerCard
                key={player.player_id}
                player={{
                  id: player.player_id,
                  name: player.display_name,
                  age: player.edad,
                  handicap: 0,
                  joinDate: player.fecha_nacimiento
                }}
                stats={stats}
                isHighlighted={index < 3}
              />
            );
          })}
        </div>
      </div>

      {/* Juegos recientes */}
      <RecentGames games={games.slice(-10)} players={players} />
    </div>
  );
}
