'use client';

import { useState, useEffect } from 'react';
import { Trophy, Target, Flag, MousePointer, Star, Zap, Crown } from 'lucide-react';

interface BestStatsDetails {
  playerName: string;
  playerId: string;
  eventName: string;
  roundName: string;
  courseName: string;
  city: string;
  state: string;
  date: string;
  categoria: string;
  club: string;
  sexo?: string; // Agregado para determinar color del badge
}

interface BestScoreDetails {
  score: number;
  players: BestStatsDetails[];
}

interface BestFIRDetails {
  fir: number;
  players: BestStatsDetails[];
}

interface BestGIRDetails {
  gir: number;
  players: BestStatsDetails[];
}

interface BestPuttsDetails {
  putts: number;
  players: BestStatsDetails[];
}

interface BestEaglesDetails {
  eagles: number;
  players: BestStatsDetails[];
}

interface BestBirdiesDetails {
  birdies: number;
  players: BestStatsDetails[];
}

interface BestStatsData {
  bestScore: BestScoreDetails | null;
  bestFIR: BestFIRDetails | null;
  bestGIR: BestGIRDetails | null;
  bestPutts: BestPuttsDetails | null;
  bestEagles: BestEaglesDetails | null;
  bestBirdies: BestBirdiesDetails | null;
  totalRounds: number;
}

export default function RecordsSection() {
  const [bestStatsData, setBestStatsData] = useState<BestStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestStats() {
      try {
        const response = await fetch('/api/gado/best-stats');
        if (response.ok) {
          const data = await response.json();
          setBestStatsData(data);
        }
      } catch (error) {
        console.error('Error fetching best stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBestStats();
  }, []);

  // Función para obtener el color del badge según el género
  const getGenderBadgeColor = (sexo?: string) => {
    if (sexo?.toLowerCase() === 'femenino' || sexo?.toLowerCase() === 'f') {
      return 'bg-gradient-to-r from-pink-500 to-rose-500';
    }
    return 'bg-gradient-to-r from-blue-500 to-cyan-500';
  };

  // Componente para tarjeta de récord épica con jugadores empatados
  const EpicRecordCard = ({ 
    title, 
    icon: Icon, 
    bgGradient, 
    borderColor, 
    glowColor,
    details,
    rank = "🥇"
  }: {
    title: string;
    icon: any;
    bgGradient: string;
    borderColor: string;
    glowColor: string;
    details: { value: number | string; valueLabel: string; valueIcon: any; players: BestStatsDetails[] };
    rank?: string;
  }) => (
    <div className={`relative ${bgGradient} rounded-2xl p-8 border-2 ${borderColor} shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden`}>
      {/* Efecto de brillo animado */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${glowColor}/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000`}></div>
      
      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Header con rango y título */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="text-4xl mr-3">{rank}</div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-1">{title}</h3>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
            </div>
          </div>
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
            <Icon className="h-8 w-8 text-gray-700" />
          </div>
        </div>
        
        {/* Valor del récord - ÉPICO */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full mb-4 border-4 border-white/50">
            <details.valueIcon className="h-10 w-10 text-gray-800" />
          </div>
          <p className="text-5xl font-black text-gray-900 mb-2">
            {details.value}
          </p>
          <p className="text-lg font-bold text-gray-700 uppercase tracking-wider">
            {details.valueLabel}
          </p>
        </div>

        {/* Información de jugadores empatados - ÉPICA */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 shadow-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
            
            {/* Lista de jugadores empatados */}
            <div className="space-y-4">
              {details.players.map((player, index) => (
                <div key={`${player.playerId}-${index}`} className="text-center">
                  <h4 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
                    {player.playerName}
                  </h4>
                  <div className={`inline-flex items-center ${getGenderBadgeColor(player.sexo)} text-white px-4 py-2 rounded-full shadow-lg`}>
                    <span className="text-sm font-bold">{player.categoria}</span>
                    <span className="mx-2 text-white/80">•</span>
                    <span className="text-sm font-semibold">{player.club}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-sm">
            {/* Evento + Lugar en una línea */}
            <div className="flex items-center">
              <Trophy className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-medium text-gray-700">Evento:</span>
                <span className="ml-2 text-gray-900 font-semibold">{details.players[0]?.eventName}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="font-medium text-gray-700">Lugar:</span>
                <span className="ml-1 text-gray-900 font-semibold">
                  {details.players[0]?.courseName}
                  {details.players[0]?.city && details.players[0]?.state && `, ${details.players[0].city}, ${details.players[0].state}`}
                </span>
              </div>
            </div>

            {/* Fecha abajo */}
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Fecha:</span>
              <span className="ml-2 text-gray-900 font-semibold">{details.players[0]?.date}</span>
            </div>

            {/* Empates si hay más de un jugador */}
            {details.players.length > 1 && (
              <div className="flex items-center">
                <span className="font-medium text-gray-700">Empatados:</span>
                <span className="ml-2 text-gray-900 font-semibold">{details.players.length} jugadores</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header épico */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
          <Star className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 mb-2">
          🏆 SALÓN DE LA FAMA 🏆
        </h2>
        <p className="text-lg text-gray-600 font-medium">Records Históricos de la Gira GADO</p>
        <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mx-auto mt-4"></div>
      </div>

      {/* Grid de records épicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Mejor Score */}
        {bestStatsData?.bestScore && (
          <EpicRecordCard
            title="RÉCORD DEL MEJOR SCORE"
            icon={Trophy}
            bgGradient="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50"
            borderColor="border-yellow-300"
            glowColor="yellow"
            rank="🥇"
            details={{
              value: bestStatsData.bestScore.score,
              valueLabel: "STROKES",
              valueIcon: Trophy,
              players: bestStatsData.bestScore.players
            }}
          />
        )}

        {/* Mejores Putts */}
        {bestStatsData?.bestPutts && (
          <EpicRecordCard
            title="MAESTRO DEL PUTT"
            icon={MousePointer}
            bgGradient="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50"
            borderColor="border-purple-300"
            glowColor="purple"
            rank="🎯"
            details={{
              value: bestStatsData.bestPutts.putts.toFixed(2),
              valueLabel: "PUTTS PROMEDIO",
              valueIcon: MousePointer,
              players: bestStatsData.bestPutts.players
            }}
          />
        )}

        {/* Mejor FIR% */}
        {bestStatsData?.bestFIR && (
          <EpicRecordCard
            title="FAIRWAYS IN REGULACIÓN"
            icon={Target}
            bgGradient="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"
            borderColor="border-green-300"
            glowColor="green"
            rank="🎯"
            details={{
              value: `${bestStatsData.bestFIR.fir}%`,
              valueLabel: "FAIRWAYS IN REGULACIÓN",
              valueIcon: Target,
              players: bestStatsData.bestFIR.players
            }}
          />
        )}

        {/* Mejor GIR% */}
        {bestStatsData?.bestGIR && (
          <EpicRecordCard
            title="PRECISIÓN A GREEN"
            icon={Flag}
            bgGradient="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
            borderColor="border-blue-300"
            glowColor="blue"
            rank="🚩"
            details={{
              value: `${bestStatsData.bestGIR.gir}%`,
              valueLabel: "GREENS IN REGULATION",
              valueIcon: Flag,
              players: bestStatsData.bestGIR.players
            }}
          />
        )}

        {/* Más Eagles */}
        {bestStatsData?.bestEagles && (
          <EpicRecordCard
            title="REY DE LOS EAGLES"
            icon={Star}
            bgGradient="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50"
            borderColor="border-amber-300"
            glowColor="amber"
            rank="🦅"
            details={{
              value: bestStatsData.bestEagles.eagles,
              valueLabel: "EAGLES",
              valueIcon: Star,
              players: bestStatsData.bestEagles.players
            }}
          />
        )}

        {/* Más Birdies */}
        {bestStatsData?.bestBirdies && (
          <EpicRecordCard
            title="MAESTRO DE LOS BIRDIES"
            icon={Zap}
            bgGradient="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50"
            borderColor="border-cyan-300"
            glowColor="cyan"
            rank="🐦"
            details={{
              value: bestStatsData.bestBirdies.birdies,
              valueLabel: "BIRDIES",
              valueIcon: Zap,
              players: bestStatsData.bestBirdies.players
            }}
          />
        )}
      </div>

      {/* Footer épico */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-full shadow-lg">
          <Zap className="h-5 w-5 mr-2 text-yellow-400" />
          <span className="font-bold">¡Estos records están hechos para ser superados!</span>
        </div>
      </div>
    </div>
  );
}
