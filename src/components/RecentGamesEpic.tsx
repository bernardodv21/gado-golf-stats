'use client';

import { useState, useEffect } from 'react';
import { Trophy, Calendar, Star, Zap, TrendingUp, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import GameCardEpic from './GameCardEpic';

export default function RecentGamesEpic() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [newCompletions, setNewCompletions] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const gamesPerPage = 6;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function fetchRecentGames() {
      try {
        const response = await fetch('/api/gado/recent-games');
        const data = await response.json();
        
        // Marcar rondas muy recientes (últimas 2 horas) como nuevas
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        
        const gamesWithNewFlag = data.games.map((game: any) => ({
          ...game,
          isNew: new Date(game.completionTime) > twoHoursAgo
        }));

        setGames(gamesWithNewFlag);
        setLastUpdate(data.lastUpdated);
        setNewCompletions(gamesWithNewFlag.filter((g: any) => g.isNew).length);
      } catch (error) {
        console.error('Error fetching recent games:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentGames();

    // Actualizar cada 30 segundos para detectar nuevas rondas
    const interval = setInterval(fetchRecentGames, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gado/recent-games');
      const data = await response.json();
      
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      
      const gamesWithNewFlag = data.games.map((game: any) => ({
        ...game,
        isNew: new Date(game.completionTime) > twoHoursAgo
      }));

      setGames(gamesWithNewFlag);
      setLastUpdate(data.lastUpdated);
      setNewCompletions(gamesWithNewFlag.filter((g: any) => g.isNew).length);
    } catch (error) {
      console.error('Error refreshing games:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(games.length / gamesPerPage);
  const startIndex = currentPage * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const currentGames = games.slice(startIndex, endIndex);

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando juegos recientes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header épico */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          {/* Ícono circular centrado */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full shadow-lg mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          
          {/* Título centrado con íconos de golf */}
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2 flex items-center justify-center">
            <span className="mr-2">🏌️‍♂️</span>
            JUEGOS RECIENTES
            <span className="ml-2">🏌️‍♀️</span>
          </h2>
          
          {/* Subtítulo centrado */}
          <p className="text-lg text-gray-600 font-medium mb-4">
            Últimas Rondas Completadas de 18 Hoyos
          </p>
          
          {/* Botón de actualización centrado */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Juegos</p>
                <p className="text-lg font-bold text-blue-700">{games.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Nuevas Completadas</p>
                <p className="text-lg font-bold text-green-700">{newCompletions}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Última Actualización</p>
                <p className="text-sm font-bold text-purple-700">
                  {lastUpdate ? new Date(lastUpdate).toLocaleTimeString('es-ES') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-32 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full mx-auto mt-4"></div>
      </div>

      {/* Grid de juegos épicos con carrusel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {games.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay juegos recientes</h3>
            <p className="text-gray-500">Los juegos aparecerán aquí cuando los jugadores completen sus rondas</p>
          </div>
        ) : (
          <>
            {/* Controles de navegación móvil */}
            <div className="md:hidden flex items-center justify-between mb-4">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className={`p-2 rounded-lg ${
                  currentPage === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                } transition-all`}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <span className="text-sm font-semibold text-gray-600">
                Página {currentPage + 1} de {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                } transition-all`}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Grid de juegos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(isMobile ? currentGames : games).map((game, index) => (
                <GameCardEpic key={game.id} game={game} index={index} />
              ))}
            </div>

            {/* Indicador de página móvil */}
            <div className="md:hidden flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPage
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-6'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Notificación de nuevas rondas */}
      {newCompletions > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200 animate-pulse">
          <div className="text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg">
              <Zap className="h-5 w-5 mr-2" />
              <span className="font-bold">
                ¡{newCompletions} {newCompletions === 1 ? 'ronda' : 'rondas'} completada{newCompletions === 1 ? '' : 's'} recientemente!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer motivacional */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
        <div className="text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg">
            <TrendingUp className="h-5 w-5 mr-2" />
            <span className="font-bold">¡Cada ronda es una oportunidad de mejorar y superarse!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
