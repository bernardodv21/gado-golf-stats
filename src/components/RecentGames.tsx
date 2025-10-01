'use client';

// Los datos se obtienen desde las API routes
import { Calendar, MapPin, Target } from 'lucide-react';

interface RecentGamesProps {
  games: any[];
  players: any[];
}

export default function RecentGames({ games, players }: RecentGamesProps) {
  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.player_id === playerId);
    return player ? player.display_name : 'Jugador desconocido';
  };

  const getScoreColor = (score: number, par: number) => {
    const diff = score - par;
    if (diff <= 5) return 'text-green-600';
    if (diff <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number, par: number) => {
    const diff = score - par;
    if (diff <= 5) return 'bg-green-100 text-green-800';
    if (diff <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (games.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Juegos Recientes
        </h2>
        <p className="text-gray-500 text-center py-8">
          No hay juegos registrados aún
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Juegos Recientes ({games.length})
      </h2>
      
      <div className="space-y-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {getPlayerName(game.playerId)}
                  </h3>
                  <span className="text-xs text-gray-500">•</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {game.course}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(game.date).toLocaleDateString('es-ES')}
                  </div>
                  <span>Tee: {game.tee}</span>
                  <span>Par: {game.par}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {game.score} strokes
                </div>
                <div className={`text-xs ${getScoreColor(game.score, game.par)}`}>
                  {game.score > game.par ? '+' : ''}{game.score - game.par} vs par
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadgeColor(game.score, game.par)}`}>
                {game.score}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
