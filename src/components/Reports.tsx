'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
// Los datos se obtienen desde las API routes
import { TrendingUp, BarChart3, Users } from 'lucide-react';

export default function Reports() {
  const [players, setPlayers] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      try {
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

  // Preparar datos para gráficos
  const prepareLineChartData = () => {
    const filteredGames = selectedPlayer === 'all' 
      ? games 
      : games.filter(game => game.playerId === selectedPlayer);
    
    // Agrupar por fecha y calcular promedio
    const gamesByDate = filteredGames.reduce((acc, game) => {
      const date = new Date(game.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, scores: [], count: 0 };
      }
      acc[date].scores.push(game.score);
      acc[date].count += 1;
      return acc;
    }, {} as Record<string, { date: string; scores: number[]; count: number }>);

    return Object.values(gamesByDate)
      .map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        averageScore: Math.round((item.scores.reduce((sum: number, score: number) => sum + score, 0) / item.scores.length) * 10) / 10,
        totalGames: item.count
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const prepareBarChartData = () => {
    return players.map(player => {
      // Calcular estadísticas básicas para cada jugador
      const playerGames = games.filter(game => game.playerId === player.player_id);
      const totalGames = playerGames.length;
      const averageScore = totalGames > 0 
        ? Math.round((playerGames.reduce((sum, game) => sum + (game.score || 0), 0) / totalGames) * 10) / 10
        : 0;
      const improvement = Math.floor(Math.random() * 10) - 5; // Placeholder hasta tener datos reales
      
      return {
        name: player.display_name,
        averageScore,
        totalGames,
        improvement
      };
    }).sort((a, b) => b.improvement - a.improvement);
  };

  const lineChartData = prepareLineChartData();
  const barChartData = prepareBarChartData();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Reportes y Análisis
        </h2>
        
        {/* Filtro de jugador */}
        <div className="mb-6">
          <label htmlFor="player-select" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por jugador
          </label>
          <select
            id="player-select"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">Todos los jugadores</option>
            {players.map(player => (
              <option key={player.player_id} value={player.player_id}>
                {player.display_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gráfico de evolución de scores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Evolución de Scores Promedio
          </h3>
        </div>
        
        {lineChartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'averageScore' ? `${value} strokes` : value,
                    name === 'averageScore' ? 'Score Promedio' : 'Total Juegos'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="averageScore" 
                  stroke="#059669" 
                  strokeWidth={2}
                  dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            No hay suficientes datos para mostrar el gráfico
          </div>
        )}
      </div>

      {/* Gráfico de comparación de jugadores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Comparación de Jugadores
          </h3>
        </div>
        
        {barChartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'averageScore' ? `${value} strokes` : value,
                    name === 'averageScore' ? 'Score Promedio' : 'Total Juegos'
                  ]}
                />
                <Bar dataKey="averageScore" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            No hay datos de jugadores para mostrar
          </div>
        )}
      </div>

      {/* Tabla de mejoras */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Users className="h-6 w-6 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Ranking de Mejoras
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jugador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score Promedio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Juegos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mejora
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {barChartData.map((player, index) => (
                <tr key={player.name} className={index < 3 ? 'bg-green-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {player.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.averageScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.totalGames}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      player.improvement > 0 
                        ? 'bg-green-100 text-green-800' 
                        : player.improvement < 0 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {player.improvement > 0 ? '+' : ''}{player.improvement}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
