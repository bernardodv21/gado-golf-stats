'use client';

import { useState, useEffect } from 'react';
import { Users, Trophy, Star, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import PlayerCardNew from './PlayerCardNew';
import PlayerFilters from './PlayerFilters';

export default function PlayersSectionNew() {
  const [players, setPlayers] = useState<any[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const playersPerPage = 6;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function fetchPlayerStats() {
      try {
        const response = await fetch('/api/gado/player-stats');
        const data = await response.json();
        setPlayers(data.players);
        setFilteredPlayers(data.players);
      } catch (error) {
        console.error('Error fetching player stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayerStats();
  }, []);

  const handleFilterChange = (filtered: any[]) => {
    setFilteredPlayers(filtered);
    setCurrentPage(0); // Reset to first page when filters change
  };

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  const startIndex = currentPage * playersPerPage;
  const endIndex = startIndex + playersPerPage;
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex);

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
          <span className="ml-3 text-gray-600">Cargando estadísticas de jugadores...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header épico */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 mb-2">
            🏌️‍♂️ JUGADORES DE LA GIRA GADO 🏌️‍♀️
          </h2>
          <p className="text-lg text-gray-600 font-medium mb-4">
            Estadísticas Empoderadoras de Nuestros Golfistas
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
              <span>{filteredPlayers.length} Jugadores</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-blue-500" />
              <span>{filteredPlayers.filter(p => p.mejorScore <= 75).length} Destacados</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span>{filteredPlayers.filter(p => p.mejora > 0).length} Mejorando</span>
            </div>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mx-auto mt-4"></div>
        </div>
      </div>

      {/* Filtros inteligentes */}
      <PlayerFilters 
        players={players} 
        onFilterChange={handleFilterChange} 
      />

      {/* Grid de jugadores con carrusel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron jugadores</h3>
            <p className="text-gray-500">Intenta ajustar los filtros para ver más resultados</p>
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

            {/* Grid de jugadores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(isMobile ? currentPlayers : filteredPlayers).map((player) => (
                <PlayerCardNew key={player.player_id} player={player} />
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

      {/* Footer motivacional */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg">
            <Trophy className="h-5 w-5 mr-2" />
            <span className="font-bold">¡Cada jugador es único y tiene su propio camino hacia la excelencia!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
