'use client';

import { useState, useMemo } from 'react';
import { Calendar, MapPin, Target, Trophy, TrendingUp, Eye, Award, Zap, Star, Search, Filter, ChevronDown, X } from 'lucide-react';

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

interface RoundHistoryProps {
  rounds: CompletedRound[];
  players: any[];
}

export default function RoundHistory({ rounds }: RoundHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(10);

  // Obtener categorías y clubes únicos para los filtros
  const categories = useMemo(() => {
    const cats = [...new Set(rounds.map(round => round.playerCategory))];
    return cats.sort();
  }, [rounds]);

  const clubs = useMemo(() => {
    const clubList = [...new Set(rounds.map(round => round.playerClub))];
    return clubList.sort();
  }, [rounds]);

  // Filtrar y ordenar rondas
  const filteredRounds = useMemo(() => {
    let filtered = rounds.filter(round => {
      const matchesSearch = round.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           round.courseName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || round.playerCategory === selectedCategory;
      const matchesClub = !selectedClub || round.playerClub === selectedClub;
      
      return matchesSearch && matchesCategory && matchesClub;
    });

    // Ordenar
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
        break;
      case 'score':
        filtered.sort((a, b) => a.totalScore - b.totalScore);
        break;
      case 'player':
        filtered.sort((a, b) => a.playerName.localeCompare(b.playerName));
        break;
      case 'course':
        filtered.sort((a, b) => a.courseName.localeCompare(b.courseName));
        break;
    }

    return filtered;
  }, [rounds, searchTerm, selectedCategory, selectedClub, sortBy]);

  const displayedRounds = filteredRounds.slice(0, displayLimit);
  const hasMore = filteredRounds.length > displayLimit;

  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + 10, filteredRounds.length));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedClub('');
    setSortBy('recent');
    setDisplayLimit(10);
  };

  const getScoreColor = (scoreToPar: number) => {
    if (scoreToPar <= 0) return 'text-green-600 bg-green-100';
    if (scoreToPar <= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (scoreToPar: number) => {
    if (scoreToPar <= 0) return <Trophy className="h-5 w-5" />;
    if (scoreToPar <= 5) return <Star className="h-5 w-5" />;
    return <Target className="h-5 w-5" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (rounds.length === 0) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-xl p-12 border border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="relative text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Trophy className="h-12 w-12 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No hay rondas completadas</h3>
          <p className="text-lg text-gray-600 mb-6">
            Las rondas completadas aparecerán aquí con estadísticas detalladas
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <Trophy className="h-5 w-5 mr-2" />
            Ver Estadísticas
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del historial */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">🏆 Historial de Rondas</h3>
            <p className="text-blue-100">
              {filteredRounds.length} de {rounds.length} rondas mostradas
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Award className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros inteligentes */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por jugador o campo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Filtros avanzados */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtros
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="recent">Más recientes</option>
              <option value="score">Mejor score</option>
              <option value="player">Por jugador</option>
              <option value="course">Por campo</option>
            </select>
          </div>
        </div>

        {/* Filtros expandibles */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Club</label>
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los clubes</option>
                  {clubs.map(club => (
                    <option key={club} value={club}>{club}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Botón limpiar filtros */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista de rondas completadas */}
      <div className="space-y-4">
        {displayedRounds.map((round, index) => (
          <div
            key={`${round.id}-${round.playerId}-${index}`}
            className="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            {/* Gradiente de fondo */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-purple-50/0 group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-300"></div>
            
            <div className="relative p-6">
              {/* Header de la tarjeta */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {round.playerName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${round.playerSexo === 'M' ? 'bg-blue-500' : 'bg-pink-500'}`}></span>
                        {round.playerCategory}
                      </span>
                      <span>{round.playerClub}</span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(round.scoreToPar)}`}>
                  {getScoreIcon(round.scoreToPar)}
                  <span className="ml-1">
                    {round.scoreToPar > 0 ? `+${round.scoreToPar}` : round.scoreToPar}
                  </span>
                </div>
              </div>

              {/* Información del campo y fecha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-semibold">{round.courseName}</p>
                      <p className="text-sm text-gray-500">{round.courseCity}, {round.courseState}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-3 text-purple-600" />
                    <span className="font-semibold">{formatDate(round.endDate)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Target className="h-5 w-5 mr-3 text-green-600" />
                    <span className="font-semibold">Par {round.par} • {round.holes} hoyos</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Trophy className="h-5 w-5 mr-3 text-orange-600" />
                    <span className="font-semibold">Score Total: {round.totalScore}</span>
                  </div>
                </div>
              </div>

              {/* Estadísticas detalladas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">{round.putts}</div>
                  <div className="text-sm text-green-700 font-medium">Putts</div>
                  <div className="text-xs text-green-600">{round.puttsPromedio.toFixed(1)} prom</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{round.firPercentage.toFixed(0)}%</div>
                  <div className="text-sm text-blue-700 font-medium">FIR</div>
                  <div className="text-xs text-blue-600">{round.fairwaysHit}/{round.fairwaysTotal}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{round.girPercentage.toFixed(0)}%</div>
                  <div className="text-sm text-purple-700 font-medium">GIR</div>
                  <div className="text-xs text-purple-600">{round.greensHit}/{round.greensTotal}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{round.birdies}</div>
                  <div className="text-sm text-orange-700 font-medium">Birdies</div>
                  <div className="text-xs text-orange-600">{round.eagles} eagles</div>
                </div>
              </div>

              {/* Resumen de scores */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="font-medium">{round.eagles} Eagles</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="font-medium">{round.birdies} Birdies</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                    <span className="font-medium">{round.pars} Pars</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="font-medium">{round.bogeys} Bogeys</span>
                  </div>
                </div>
                <button className="flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón cargar más */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Zap className="h-5 w-5 mr-2" />
            Cargar más rondas ({filteredRounds.length - displayLimit} restantes)
          </button>
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {filteredRounds.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron rondas</h3>
          <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}