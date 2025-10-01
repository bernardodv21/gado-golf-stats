'use client';

import { TrendingUp, TrendingDown, Target, Flag, MousePointer, Trophy, Star } from 'lucide-react';

interface PlayerCardNewProps {
  player: {
    player_id: string;
    display_name: string;
    categoria: string;
    club: string;
    sexo: string;
    edad: number;
    partidasJugadas: number;
    scorePromedio: number;
    mejorScore: number;
    firPromedio: number;
    girPromedio: number;
    puttsPromedio: number;
    mejora: number;
    tieneEstadisticas: boolean;
  };
}

export default function PlayerCardNew({ player }: PlayerCardNewProps) {
  // Función para obtener el color del avatar según el género
  const getAvatarColor = (sexo: string) => {
    if (sexo?.toLowerCase() === 'femenino' || sexo?.toLowerCase() === 'f') {
      return 'bg-gradient-to-br from-pink-400 to-rose-500';
    }
    return 'bg-gradient-to-br from-blue-400 to-cyan-500';
  };

  // Función para obtener el color del badge de categoría
  const getCategoryBadgeColor = (categoria: string) => {
    const colors = {
      '10-11': 'bg-gradient-to-r from-yellow-400 to-orange-500',
      '12-13': 'bg-gradient-to-r from-green-400 to-emerald-500',
      '14-15': 'bg-gradient-to-r from-blue-400 to-indigo-500',
      '16-18': 'bg-gradient-to-r from-purple-400 to-pink-500'
    };
    return colors[categoria as keyof typeof colors] || 'bg-gradient-to-r from-gray-400 to-gray-500';
  };

  // Función para obtener el ícono y color de mejora
  const getImprovementDisplay = (mejora: number) => {
    if (mejora > 0) {
      return {
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        text: `+${mejora}`
      };
    } else if (mejora < 0) {
      return {
        icon: TrendingDown,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        text: mejora.toString()
      };
    } else {
      return {
        icon: TrendingUp,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        text: '0'
      };
    }
  };

  const improvement = getImprovementDisplay(player.mejora);
  const ImprovementIcon = improvement.icon;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 overflow-hidden group">
      {/* Header con avatar y nombre */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className={`w-12 h-12 ${getAvatarColor(player.sexo)} rounded-full flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-lg">
              {player.display_name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Información básica */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {player.display_name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getCategoryBadgeColor(player.categoria)}`}>
                {player.categoria}
              </span>
              <span className="text-sm text-gray-600">{player.edad} años</span>
            </div>
          </div>
        </div>
        
        {/* Club */}
        <div className="mt-3">
          <span className="text-sm text-gray-600 font-medium">{player.club}</span>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="p-4 space-y-3">
        {/* Partidas jugadas */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Partidas Jugadas</span>
          <span className="text-lg font-bold text-gray-900">{player.partidasJugadas}</span>
        </div>

        {/* Score promedio */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Score Promedio</span>
          <span className="text-lg font-bold text-blue-600">{player.scorePromedio}</span>
        </div>

        {/* Mejor Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Mejor Score</span>
          <div className="flex items-center space-x-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-lg font-bold text-green-600">{player.mejorScore}</span>
          </div>
        </div>

        {/* Estadísticas avanzadas (solo si tiene 2+ rondas) */}
        {player.tieneEstadisticas && player.partidasJugadas >= 2 && player.firPromedio !== null ? (
          <>
            {/* FIR% Promedio */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">FIR% Promedio</span>
              <div className="flex items-center space-x-1">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-lg font-bold text-green-600">{player.firPromedio}%</span>
              </div>
            </div>

            {/* GIR% Promedio */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">GIR% Promedio</span>
              <div className="flex items-center space-x-1">
                <Flag className="h-4 w-4 text-blue-500" />
                <span className="text-lg font-bold text-blue-600">{player.girPromedio}%</span>
              </div>
            </div>

            {/* Putts Promedio */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Putts Promedio</span>
              <div className="flex items-center space-x-1">
                <MousePointer className="h-4 w-4 text-purple-500" />
                <span className="text-lg font-bold text-purple-600">{player.puttsPromedio}</span>
              </div>
            </div>
          </>
        ) : player.partidasJugadas === 1 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-1 text-blue-600">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-medium">¡Juega una ronda más para ver estadísticas avanzadas!</span>
            </div>
          </div>
        ) : null}

        {/* Mejora */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Mejora</span>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${improvement.bgColor}`}>
              <ImprovementIcon className={`h-4 w-4 ${improvement.color}`} />
              <span className={`text-sm font-bold ${improvement.color}`}>
                {improvement.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con estrella si es destacado */}
      {player.mejorScore <= 75 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 border-t border-yellow-200">
          <div className="flex items-center justify-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-700">¡Jugador Destacado!</span>
            <Star className="h-4 w-4 text-yellow-500" />
          </div>
        </div>
      )}
    </div>
  );
}
