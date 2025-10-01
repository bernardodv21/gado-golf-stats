'use client';

import { useState, useEffect } from 'react';
import { Trophy, Calendar, MapPin, Target, Star, Zap, TrendingUp, Clock } from 'lucide-react';

interface GameCardEpicProps {
  game: {
    id: string;
    playerName: string;
    playerId: string;
    playerSexo: string;
    categoria: string;
    club: string;
    scoreTotal: number;
    scoreRelative: number;
    par: number;
    holes: number;
    date: string;
    eventName: string;
    roundName: string;
    courseName: string;
    city: string;
    state: string;
    badgeColor: string;
    isNew: boolean;
    completionTime: string;
  };
  index: number;
}

export default function GameCardEpic({ game, index }: GameCardEpicProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Animación de entrada escalonada
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    // Animación de pulso para rondas nuevas
    if (game.isNew) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [game.isNew]);

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

  // Función para obtener el ícono de rendimiento
  const getPerformanceIcon = (scoreRelative: number) => {
    if (scoreRelative <= 0) return Star;
    if (scoreRelative <= 5) return TrendingUp;
    return Target;
  };

  // Función para obtener el color del texto de rendimiento
  const getPerformanceColor = (scoreRelative: number) => {
    if (scoreRelative <= 0) return 'text-green-600';
    if (scoreRelative <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const PerformanceIcon = getPerformanceIcon(game.scoreRelative);

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 
        border border-gray-200 overflow-hidden group
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${isAnimating ? 'animate-pulse ring-4 ring-blue-300' : ''}
      `}
    >
      {/* Header con avatar y información del jugador */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className={`w-12 h-12 ${getAvatarColor(game.playerSexo)} rounded-full flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-lg">
              {game.playerName.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Información del jugador */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {game.playerName}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getCategoryBadgeColor(game.categoria)}`}>
                {game.categoria}
              </span>
              <span className="text-sm text-gray-600">{game.club}</span>
            </div>
          </div>

          {/* Badge de score épico */}
          <div className={`${game.badgeColor} text-white px-4 py-2 rounded-full shadow-lg font-bold text-lg`}>
            {game.scoreTotal}
          </div>
        </div>
      </div>

      {/* Información del juego */}
      <div className="p-4 space-y-3">
        {/* Fecha y evento */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">{game.date}</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{game.roundName}</p>
            <p className="text-xs text-gray-600">{game.eventName}</p>
          </div>
        </div>

        {/* Lugar */}
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {game.courseName}
            {game.city && game.state && `, ${game.city}, ${game.state}`}
          </span>
        </div>

        {/* Estadísticas del juego */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
          {/* Par del campo */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Par del Campo</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{game.par}</p>
          </div>

          {/* Holes jugados */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Holes</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{game.holes}</p>
          </div>
        </div>

        {/* Rendimiento relativo al par */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PerformanceIcon className={`h-5 w-5 ${getPerformanceColor(game.scoreRelative)}`} />
              <span className="text-sm font-medium text-gray-600">Rendimiento</span>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${getPerformanceColor(game.scoreRelative)}`}>
                {game.scoreRelative > 0 ? `+${game.scoreRelative}` : game.scoreRelative} vs par
              </p>
              <p className="text-xs text-gray-500">
                {game.scoreRelative <= 0 ? '¡Excelente!' : 
                 game.scoreRelative <= 5 ? 'Buen juego' : 'Sigue practicando'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con notificación de nueva ronda */}
      {game.isNew && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 border-t border-green-200">
          <div className="flex items-center justify-center space-x-2">
            <Zap className="h-4 w-4 text-green-500" />
            <span className="text-sm font-semibold text-green-700">¡Ronda completada recientemente!</span>
            <Zap className="h-4 w-4 text-green-500" />
          </div>
        </div>
      )}
    </div>
  );
}
