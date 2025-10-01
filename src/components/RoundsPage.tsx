'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import RoundHistory from './RoundHistory';
import { Plus, History, Trophy, TrendingUp, Users, Calendar, MapPin } from 'lucide-react';

// Importar NewRoundForm dinámicamente para evitar problemas de hidratación
const NewRoundForm = dynamic(() => import('./NewRoundForm'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-200 border-t-green-600"></div>
    </div>
  )
});

interface CompletedRound {
  id: string;
  playerId: string;
  playerName: string;
  playerCategory: string;
  playerClub: string;
  playerSexo: string;
  courseName: string;
  courseCity: string;
  courseState: string;
  par: number;
  holes: number;
  totalScore: number;
  scoreToPar: number;
  putts: number;
  puttsPromedio: number;
  fairwaysHit: number;
  fairwaysTotal: number;
  firPercentage: number;
  greensHit: number;
  greensTotal: number;
  girPercentage: number;
  bunkers: number;
  penalties: number;
  eagles: number;
  birdies: number;
  pars: number;
  bogeys: number;
  doubleBogeys: number;
  worse: number;
  startDate: string;
  endDate: string;
  weather: string;
  notes: string;
  status: string;
}

function RoundsPageContent() {
  const [completedRounds, setCompletedRounds] = useState<CompletedRound[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'history' | 'new'>('new');
  const [stats, setStats] = useState({
    totalCompletedRounds: 0,
    totalPlayers: 0,
    averageScore: 0
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Cargar datos en paralelo
        const [completedRoundsResponse, playersResponse] = await Promise.all([
          fetch('/api/gado/completed-rounds-history'),
          fetch('/api/gado/players')
        ]);
        
        let completedRoundsData: CompletedRound[] = [];
        let playersData: any[] = [];
        
        if (completedRoundsResponse.ok) {
          completedRoundsData = await completedRoundsResponse.json();
          setCompletedRounds(completedRoundsData);
        }
        
        if (playersResponse.ok) {
          playersData = await playersResponse.json();
          setPlayers(playersData);
        }
        
        // Calcular estadísticas después de que todos los datos estén cargados
        const averageScore = completedRoundsData.length > 0 
          ? completedRoundsData.reduce((sum: number, round: CompletedRound) => sum + round.totalScore, 0) / completedRoundsData.length
          : 0;
        
        setStats({
          totalCompletedRounds: completedRoundsData.length,
          totalPlayers: playersData.length,
          averageScore: Math.round(averageScore)
        });
        
        setLoading(false);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando datos de rondas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header épico con estadísticas */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-3xl shadow-2xl p-4 md:p-8 border border-green-100">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2 md:mb-3">
                🏌️‍♂️ Centro de Control de Rondas
              </h2>
              <p className="text-sm md:text-xl text-gray-600 font-medium">
                Gestiona todas las rondas de la Gira GADO
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="p-2 md:p-3 bg-white/20 rounded-lg md:rounded-xl">
                    <Trophy className="h-4 w-4 md:h-6 md:w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-xs md:text-sm font-medium">Rondas Completadas</p>
                    <p className="text-2xl md:text-4xl font-bold">{completedRounds.length}</p>
                  </div>
                </div>
                <div className="flex items-center text-blue-100 text-xs md:text-sm">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  <span>Historial total</span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="p-2 md:p-3 bg-white/20 rounded-lg md:rounded-xl">
                    <Users className="h-4 w-4 md:h-6 md:w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-purple-100 text-xs md:text-sm font-medium">Jugadores Activos</p>
                    <p className="text-2xl md:text-4xl font-bold">{players.length}</p>
                  </div>
                </div>
                <div className="flex items-center text-purple-100 text-xs md:text-sm">
                  <Users className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  <span>En la gira</span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="p-2 md:p-3 bg-white/20 rounded-lg md:rounded-xl">
                    <TrendingUp className="h-4 w-4 md:h-6 md:w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-orange-100 text-xs md:text-sm font-medium">Score Promedio</p>
                    <p className="text-2xl md:text-4xl font-bold">{stats.averageScore}</p>
                  </div>
                </div>
                <div className="flex items-center text-orange-100 text-xs md:text-sm">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  <span>General</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación épicas */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 md:px-8 py-2">
          <nav className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0">
            {/* NUEVA RONDA - PRIMERO */}
            <button
              onClick={() => setActiveTab('new')}
              className={`py-3 md:py-8 px-3 md:px-8 border-b-3 font-bold text-base md:text-xl transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'new'
                  ? 'border-green-500 text-green-600 bg-white rounded-t-xl shadow-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-t-xl'
              }`}
            >
              <div className="flex items-center justify-center space-x-2 md:space-x-4">
                <div className={`p-1.5 md:p-3 rounded-lg md:rounded-xl ${activeTab === 'new' ? 'bg-green-100' : 'bg-gray-100'} shadow-lg`}>
                  <Plus className="h-4 w-4 md:h-6 md:w-6" />
                </div>
                <span className="text-base md:text-2xl font-black">+ NUEVA RONDA</span>
                <div className="hidden md:block bg-gradient-to-r from-green-500 to-green-600 text-white text-xs md:text-sm font-bold px-2 md:px-4 py-1 md:py-2 rounded-full shadow-lg animate-pulse">
                  ¡EMPEZAR!
                </div>
              </div>
            </button>

            {/* HISTORIAL - SEGUNDO */}
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 md:py-6 px-3 md:px-4 border-b-3 font-bold text-base md:text-lg transition-all duration-300 ${
                activeTab === 'history'
                  ? 'border-green-500 text-green-600 bg-white rounded-t-xl shadow-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-t-xl'
              }`}
            >
              <div className="flex items-center justify-center space-x-2 md:space-x-3">
                <div className={`p-1.5 md:p-2 rounded-lg ${activeTab === 'history' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <History className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <span>Historial</span>
                {completedRounds.length > 0 && (
                  <span className="bg-gray-500 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-lg">
                    {completedRounds.length}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>

        {/* Contenido de las tabs */}
        <div className="min-h-96 p-4 md:p-8">
          {activeTab === 'history' && (
            <RoundHistory 
              rounds={completedRounds} 
              players={players}
            />
          )}
          
          {activeTab === 'new' && (
            <NewRoundForm 
              players={players}
              onRoundCreated={(newRound) => {
                // No necesitamos manejar rondas activas
                setActiveTab('history');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Componente principal que se renderiza solo en el cliente
const RoundsPage = dynamic(() => Promise.resolve(RoundsPageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Cargando datos de rondas...</p>
      </div>
    </div>
  )
});

export default RoundsPage;