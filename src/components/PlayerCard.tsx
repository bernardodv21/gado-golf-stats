'use client';

// Los datos se obtienen desde las API routes
import { User, Target, TrendingUp, TrendingDown } from 'lucide-react';

interface PlayerStats {
  totalGames: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  improvement: number;
  recentGames: any[];
}

interface PlayerCardProps {
  player: any;
  stats: PlayerStats;
  isHighlighted?: boolean;
}

export default function PlayerCard({ player, stats, isHighlighted = false }: PlayerCardProps) {
  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return 'text-green-600';
    if (improvement < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return TrendingUp;
    if (improvement < 0) return TrendingDown;
    return Target;
  };

  const ImprovementIcon = getImprovementIcon(stats.improvement);

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${
      isHighlighted 
        ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' 
        : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
            <User className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
            <p className="text-sm text-gray-500">Edad: {player.age} años</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Handicap</p>
          <p className="text-lg font-semibold text-gray-900">{player.handicap}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Partidas jugadas</span>
          <span className="font-medium text-gray-900">{stats.totalGames}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Score promedio</span>
          <span className="font-medium text-gray-900">{stats.averageScore}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Mejor score</span>
          <span className="font-medium text-green-600">{stats.bestScore}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Peor score</span>
          <span className="font-medium text-red-600">{stats.worstScore}</span>
        </div>
        
        {stats.totalGames > 1 && (
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-500">Mejora</span>
            <div className="flex items-center">
              <ImprovementIcon className={`h-4 w-4 mr-1 ${getImprovementColor(stats.improvement)}`} />
              <span className={`font-medium ${getImprovementColor(stats.improvement)}`}>
                {stats.improvement > 0 ? '+' : ''}{stats.improvement}
              </span>
            </div>
          </div>
        )}
      </div>

      {stats.recentGames.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Últimos juegos</p>
          <div className="flex space-x-2">
            {stats.recentGames.map((game, index) => (
              <div
                key={index}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  game.score <= game.par + 5
                    ? 'bg-green-100 text-green-800'
                    : game.score <= game.par + 10
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {game.score}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
