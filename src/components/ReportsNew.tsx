'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Users, TrendingUp, TrendingDown, Target, Award, BarChart3,
  Filter, Search, Download, Share2, ChevronDown, ChevronUp,
  Zap, Activity, Crosshair, Flag, CircleDot, X, Check,
  ArrowUp, ArrowDown, Minus, Eye, EyeOff, RefreshCw
} from 'lucide-react';

interface PlayerStats {
  player_id: string;
  display_name: string;
  categoria: string;
  sexo: string;
  edad: number;
  club: string;
  totalRounds: number;
  stats: {
    scoring: {
      averageScore: number;
      bestScore: number;
      worstScore: number;
      improvement: number;
      firstFiveAvg: number;
      lastFiveAvg: number;
    };
    ballStriking: {
      averageFIR: number;
      averageGIR: number;
      par3Avg: number;
      par4Avg: number;
      par5Avg: number;
    };
    shortGame: {
      averagePutts: number;
      averageScrambling: number;
    };
    scoreDistribution: {
      eagles: number;
      birdies: number;
      pars: number;
      bogeys: number;
      doubleBogeys: number;
      worse: number;
    };
    strengths: Array<{ area: string; value: number; metric: string }>;
    weaknesses: Array<{ area: string; value: number; metric: string }>;
  } | null;
}

interface ReportsData {
  players: PlayerStats[];
  totalPlayers: number;
  filters: {
    categoria: string | null;
    sexo: string | null;
    club: string | null;
  };
}

export default function ReportsNew() {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'individual' | 'comparison' | 'group'>('individual');
  
  // Filtros
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Comparación
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);

  // Análisis detallado
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    fetchAllPlayers();
  }, []);

  const fetchAllPlayers = async () => {
    try {
      const response = await fetch('/api/gado/players');
      if (response.ok) {
        const data = await response.json();
        setAllPlayers(data);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('categoria', selectedCategory);
      if (selectedGender) params.append('sexo', selectedGender);
      if (selectedClub) params.append('club', selectedClub);
      if (selectedPlayers.length > 0) params.append('playerIds', selectedPlayers.join(','));

      const response = await fetch(`/api/gado/reports-data?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReportsData(data);
      }
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedGender, selectedClub, selectedPlayers]);

  // Obtener listas únicas para filtros
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(allPlayers.map(p => p.categoria))];
    return uniqueCategories.sort();
  }, [allPlayers]);

  const clubs = useMemo(() => {
    const uniqueClubs = [...new Set(allPlayers.map(p => p.club))];
    return uniqueClubs.sort();
  }, [allPlayers]);

  // Filtrar jugadores por búsqueda (usar allPlayers en lugar de reportsData.players)
  const filteredPlayersForSelection = useMemo(() => {
    if (allPlayers.length === 0) return [];
    return allPlayers.filter(player =>
      player.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.club.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPlayers, searchTerm]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedGender('');
    setSelectedClub('');
    setSelectedPlayers([]);
    setSearchTerm('');
  };

  const togglePlayerSelection = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      if (selectedPlayers.length < 7) {
        setSelectedPlayers([...selectedPlayers, playerId]);
      }
    }
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 1) return <ArrowDown className="h-4 w-4 text-green-600" />;
    if (improvement < -1) return <ArrowUp className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getImprovementText = (improvement: number) => {
    if (improvement > 1) return `Mejorando ${Math.abs(improvement).toFixed(1)} strokes`;
    if (improvement < -1) return `Subiendo ${Math.abs(improvement).toFixed(1)} strokes`;
    return 'Estable';
  };

  const getScoreColor = (avg: number, par: number) => {
    const diff = avg - par;
    if (diff < 0) return 'text-blue-600';
    if (diff === 0) return 'text-green-600';
    if (diff <= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading && !reportsData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando reportes avanzados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header épico */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl shadow-2xl p-8 border border-indigo-100">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                REPORTES AVANZADOS
              </h1>
              <p className="text-gray-600 text-lg">Análisis profesional de rendimiento • Insights inteligentes</p>
            </div>
            <div className="flex gap-3">
              <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                <Download className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={fetchData}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs de vista */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveView('individual')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeView === 'individual'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Individual</span>
              </div>
            </button>
            <button
              onClick={() => setActiveView('comparison')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeView === 'comparison'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span>Comparación</span>
              </div>
            </button>
            <button
              onClick={() => setActiveView('group')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeView === 'group'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <span>Análisis Grupal</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros inteligentes */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">Filtros Inteligentes</h3>
          </div>
          {(selectedCategory || selectedGender || selectedClub || selectedPlayers.length > 0) && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Filtro por género */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          {/* Filtro por club */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Club</label>
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los clubes</option>
              {clubs.map(club => (
                <option key={club} value={club}>{club}</option>
              ))}
            </select>
          </div>

          {/* Selector de jugadores para comparación */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jugadores para comparar ({selectedPlayers.length}/7)
            </label>
            <button
              onClick={() => setShowPlayerSelector(!showPlayerSelector)}
              className={`w-full px-4 py-2 border-2 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all ${
                selectedPlayers.length > 0 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
              }`}
            >
              <span className={selectedPlayers.length > 0 ? 'text-indigo-700 font-medium' : 'text-gray-500'}>
                {selectedPlayers.length === 0 ? 'Seleccionar jugadores...' : `${selectedPlayers.length} jugador${selectedPlayers.length > 1 ? 'es' : ''} seleccionado${selectedPlayers.length > 1 ? 's' : ''}`}
              </span>
              {showPlayerSelector ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {selectedPlayers.length > 0 && !showPlayerSelector && (
              <p className="text-xs text-gray-500 mt-1">
                Haz clic para {selectedPlayers.length < 7 ? 'agregar más o ' : ''}ver seleccionados
              </p>
            )}

            {showPlayerSelector && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-96 overflow-hidden">
                {/* Header con búsqueda */}
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar jugador..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  {selectedPlayers.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <span className="text-gray-600">Seleccionados:</span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                        {selectedPlayers.length} de 7
                      </span>
                    </div>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredPlayersForSelection.length > 0 ? (
                    filteredPlayersForSelection.map(player => (
                      <button
                        key={player.player_id}
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlayerSelection(player.player_id);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors ${
                          selectedPlayers.includes(player.player_id) ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                        }`}
                      >
                        <div>
                          <p className="font-medium text-gray-900">{player.display_name}</p>
                          <p className="text-sm text-gray-500">{player.categoria} • {player.club}</p>
                        </div>
                        {selectedPlayers.includes(player.player_id) && (
                          <Check className="h-5 w-5 text-indigo-600" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">
                        {allPlayers.length === 0 ? 'Cargando jugadores...' : 'No se encontraron jugadores'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido según vista activa */}
      {reportsData && reportsData.players.length > 0 ? (
        <>
          {activeView === 'individual' && (
            <IndividualView 
              players={reportsData.players}
              expandedPlayer={expandedPlayer}
              setExpandedPlayer={setExpandedPlayer}
              getImprovementIcon={getImprovementIcon}
              getImprovementText={getImprovementText}
              getScoreColor={getScoreColor}
            />
          )}

          {activeView === 'comparison' && selectedPlayers.length >= 2 && (
            <ComparisonView 
              players={reportsData.players.filter(p => selectedPlayers.includes(p.player_id))}
            />
          )}

          {activeView === 'comparison' && selectedPlayers.length < 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Selecciona al menos 2 jugadores para comparar
              </h3>
              <p className="text-gray-600">
                Usa el filtro "Jugadores" arriba para seleccionar entre 2 y 7 jugadores
              </p>
            </div>
          )}

          {activeView === 'group' && (
            <GroupAnalysisView players={reportsData.players} />
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No hay datos disponibles
          </h3>
          <p className="text-gray-600">
            Ajusta los filtros para ver reportes de jugadores con rondas completadas
          </p>
        </div>
      )}
    </div>
  );
}

// Componente para vista individual
function IndividualView({ 
  players, 
  expandedPlayer, 
  setExpandedPlayer,
  getImprovementIcon,
  getImprovementText,
  getScoreColor 
}: any) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {players.map((player: PlayerStats) => (
        <div key={player.player_id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header del jugador */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                  player.sexo === 'M' ? 'bg-blue-500' : 'bg-pink-500'
                }`}>
                  {player.display_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{player.display_name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      player.sexo === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {player.categoria}
                    </span>
                    <span className="text-gray-600">{player.club}</span>
                    <span className="text-gray-400">• {player.edad} años</span>
                    <span className="text-gray-400">• {player.totalRounds} rondas</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setExpandedPlayer(expandedPlayer === player.player_id ? null : player.player_id)}
                className="p-2 hover:bg-white rounded-lg transition-all"
              >
                {expandedPlayer === player.player_id ? (
                  <EyeOff className="h-5 w-5 text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Stats resumidas */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Score Promedio */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-blue-600" />
                  <p className="text-xs font-medium text-blue-900">Score Promedio</p>
                </div>
                <p className="text-3xl font-black text-blue-600">{player.stats?.scoring.averageScore || 0}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getImprovementIcon(player.stats?.scoring.improvement || 0)}
                  <p className="text-xs text-gray-600">{getImprovementText(player.stats?.scoring.improvement || 0)}</p>
                </div>
              </div>

              {/* FIR% */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Crosshair className="h-4 w-4 text-green-600" />
                  <p className="text-xs font-medium text-green-900">FIR%</p>
                </div>
                <p className="text-3xl font-black text-green-600">{player.stats?.ballStriking.averageFIR.toFixed(1) || 0}%</p>
                <p className="text-xs text-gray-600 mt-1">Precisión Tee</p>
              </div>

              {/* GIR% */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Flag className="h-4 w-4 text-purple-600" />
                  <p className="text-xs font-medium text-purple-900">GIR%</p>
                </div>
                <p className="text-3xl font-black text-purple-600">{player.stats?.ballStriking.averageGIR.toFixed(1) || 0}%</p>
                <p className="text-xs text-gray-600 mt-1">Greens en Regulación</p>
              </div>

              {/* Putts */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CircleDot className="h-4 w-4 text-orange-600" />
                  <p className="text-xs font-medium text-orange-900">Putts/Hoyo</p>
                </div>
                <p className="text-3xl font-black text-orange-600">{player.stats?.shortGame.averagePutts.toFixed(2) || 0}</p>
                <p className="text-xs text-gray-600 mt-1">Promedio</p>
              </div>
            </div>

            {/* Fortalezas y Debilidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fortalezas */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-5 w-5 text-green-600" />
                  <h4 className="font-bold text-green-900">Fortalezas</h4>
                </div>
                {(player.stats?.strengths?.length || 0) > 0 ? (
                  <div className="space-y-2">
                    {player.stats?.strengths.map((strength: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-900">{strength.area}</span>
                        <span className="text-sm font-bold text-green-600">
                          {strength.value.toFixed(1)} {strength.metric}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-700">Aún no se identifican fortalezas claras</p>
                )}
              </div>

              {/* Debilidades */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-5 w-5 text-red-600" />
                  <h4 className="font-bold text-red-900">Áreas de Mejora</h4>
                </div>
                {(player.stats?.weaknesses?.length || 0) > 0 ? (
                  <div className="space-y-2">
                    {player.stats?.weaknesses.map((weakness: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-red-900">{weakness.area}</span>
                        <span className="text-sm font-bold text-red-600">
                          {weakness.value.toFixed(1)} {weakness.metric}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-red-700">No se identifican debilidades significativas</p>
                )}
              </div>
            </div>

            {/* Detalles expandidos */}
            {expandedPlayer === player.player_id && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  Análisis Detallado
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Distribución de scores */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="font-bold text-gray-900 mb-3 text-sm">Distribución de Scores</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Eagles</span>
                        <span className="text-sm font-bold text-blue-600">{player.stats?.scoreDistribution.eagles || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Birdies</span>
                        <span className="text-sm font-bold text-green-600">{player.stats?.scoreDistribution.birdies || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Pars</span>
                        <span className="text-sm font-bold text-gray-600">{player.stats?.scoreDistribution.pars || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Bogeys</span>
                        <span className="text-sm font-bold text-yellow-600">{player.stats?.scoreDistribution.bogeys || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Dobles+</span>
                        <span className="text-sm font-bold text-red-600">
                          {(player.stats?.scoreDistribution.doubleBogeys || 0) + (player.stats?.scoreDistribution.worse || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance por tipo de hoyo */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="font-bold text-gray-900 mb-3 text-sm">Promedio por Par</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Par 3</span>
                        <span className={`text-sm font-bold ${getScoreColor(player.stats?.ballStriking.par3Avg || 3, 3)}`}>
                          {player.stats?.ballStriking.par3Avg.toFixed(2) || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Par 4</span>
                        <span className={`text-sm font-bold ${getScoreColor(player.stats?.ballStriking.par4Avg || 4, 4)}`}>
                          {player.stats?.ballStriking.par4Avg.toFixed(2) || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Par 5</span>
                        <span className={`text-sm font-bold ${getScoreColor(player.stats?.ballStriking.par5Avg || 5, 5)}`}>
                          {player.stats?.ballStriking.par5Avg.toFixed(2) || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tendencia */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="font-bold text-gray-900 mb-3 text-sm">Tendencia</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Primeras 5 rondas</span>
                        <span className="text-sm font-bold text-gray-600">{player.stats?.scoring.firstFiveAvg || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Últimas 5 rondas</span>
                        <span className="text-sm font-bold text-indigo-600">{player.stats?.scoring.lastFiveAvg || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Mejor score</span>
                        <span className="text-sm font-bold text-green-600">{player.stats?.scoring.bestScore || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Scrambling%</span>
                        <span className="text-sm font-bold text-purple-600">
                          {player.stats?.shortGame.averageScrambling.toFixed(1) || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente para comparación
function ComparisonView({ players }: { players: PlayerStats[] }) {
  const metrics = [
    { key: 'averageScore', label: 'Score Promedio', path: 'scoring.averageScore', format: (v: number) => v.toFixed(1), lower: true },
    { key: 'improvement', label: 'Mejora', path: 'scoring.improvement', format: (v: number) => v.toFixed(1), lower: false },
    { key: 'averageFIR', label: 'FIR%', path: 'ballStriking.averageFIR', format: (v: number) => `${v.toFixed(1)}%`, lower: false },
    { key: 'averageGIR', label: 'GIR%', path: 'ballStriking.averageGIR', format: (v: number) => `${v.toFixed(1)}%`, lower: false },
    { key: 'averagePutts', label: 'Putts/Hoyo', path: 'shortGame.averagePutts', format: (v: number) => v.toFixed(2), lower: true },
    { key: 'averageScrambling', label: 'Scrambling%', path: 'shortGame.averageScrambling', format: (v: number) => `${v.toFixed(1)}%`, lower: false },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((curr, key) => curr?.[key], obj.stats);
  };

  const getBestPlayer = (metric: any) => {
    const values = players.map(p => ({
      playerId: p.player_id,
      value: getNestedValue(p, metric.path)
    }));

    if (metric.lower) {
      return values.reduce((min, curr) => curr.value < min.value ? curr : min).playerId;
    } else {
      return values.reduce((max, curr) => curr.value > max.value ? curr : max).playerId;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-indigo-600" />
          Comparación de Jugadores
        </h3>
        <p className="text-gray-600 mt-1">Análisis comparativo de {players.length} jugadores</p>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-bold text-gray-900">Métrica</th>
                {players.map(player => (
                  <th key={player.player_id} className="text-center py-4 px-4">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold ${
                      player.sexo === 'M' ? 'bg-blue-500' : 'bg-pink-500'
                    }`}>
                      {player.display_name.charAt(0)}
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{player.display_name.split(' ')[0]}</p>
                    <p className="text-xs text-gray-500">{player.categoria}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, idx) => {
                const bestPlayerId = getBestPlayer(metric);
                return (
                  <tr key={metric.key} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-4 px-4 font-medium text-gray-900">{metric.label}</td>
                    {players.map(player => {
                      const value = getNestedValue(player, metric.path);
                      const isBest = player.player_id === bestPlayerId;
                      return (
                        <td key={player.player_id} className="py-4 px-4 text-center">
                          <span className={`font-bold ${
                            isBest ? 'text-green-600 bg-green-50 px-3 py-1 rounded-full' : 'text-gray-700'
                          }`}>
                            {metric.format(value)}
                          </span>
                          {isBest && <Award className="h-4 w-4 text-green-600 inline ml-1" />}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Componente para análisis grupal
function GroupAnalysisView({ players }: { players: PlayerStats[] }) {
  // Calcular promedios del grupo
  const groupAvg = {
    score: players.reduce((sum, p) => sum + (p.stats?.scoring.averageScore || 0), 0) / players.length,
    fir: players.reduce((sum, p) => sum + (p.stats?.ballStriking.averageFIR || 0), 0) / players.length,
    gir: players.reduce((sum, p) => sum + (p.stats?.ballStriking.averageGIR || 0), 0) / players.length,
    putts: players.reduce((sum, p) => sum + (p.stats?.shortGame.averagePutts || 0), 0) / players.length,
    scrambling: players.reduce((sum, p) => sum + (p.stats?.shortGame.averageScrambling || 0), 0) / players.length,
  };

  // Identificar mejores y peores en cada categoría
  const bestScore = players.reduce((best, curr) => 
    (curr.stats?.scoring.averageScore || 999) < (best.stats?.scoring.averageScore || 999) ? curr : best
  );
  const worstScore = players.reduce((worst, curr) => 
    (curr.stats?.scoring.averageScore || 0) > (worst.stats?.scoring.averageScore || 0) ? curr : worst
  );

  const bestImprovement = players.reduce((best, curr) => 
    (curr.stats?.scoring.improvement || 0) > (best.stats?.scoring.improvement || 0) ? curr : best
  );

  return (
    <div className="space-y-6">
      {/* Resumen del grupo */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
          <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Target className="h-6 w-6 text-indigo-600" />
            Análisis Grupal
          </h3>
          <p className="text-gray-600 mt-1">Estadísticas consolidadas de {players.length} jugadores</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <p className="text-xs font-medium text-blue-900 mb-1">Score Promedio</p>
              <p className="text-3xl font-black text-blue-600">{groupAvg.score.toFixed(1)}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <p className="text-xs font-medium text-green-900 mb-1">FIR%</p>
              <p className="text-3xl font-black text-green-600">{groupAvg.fir.toFixed(1)}%</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <p className="text-xs font-medium text-purple-900 mb-1">GIR%</p>
              <p className="text-3xl font-black text-purple-600">{groupAvg.gir.toFixed(1)}%</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              <p className="text-xs font-medium text-orange-900 mb-1">Putts/Hoyo</p>
              <p className="text-3xl font-black text-orange-600">{groupAvg.putts.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4">
              <p className="text-xs font-medium text-pink-900 mb-1">Scrambling%</p>
              <p className="text-3xl font-black text-pink-600">{groupAvg.scrambling.toFixed(1)}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mejor Score */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-green-600" />
                <h4 className="font-bold text-green-900">Mejor Score Promedio</h4>
              </div>
              <p className="font-black text-2xl text-green-600 mb-1">{bestScore.display_name}</p>
              <p className="text-sm text-green-700">{bestScore.stats?.scoring.averageScore.toFixed(1) || 0} strokes</p>
            </div>

            {/* Mayor Mejora */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h4 className="font-bold text-blue-900">Mayor Mejora</h4>
              </div>
              <p className="font-black text-2xl text-blue-600 mb-1">{bestImprovement.display_name}</p>
              <p className="text-sm text-blue-700">
                {(bestImprovement.stats?.scoring.improvement || 0) > 0 ? '-' : '+'}{Math.abs(bestImprovement.stats?.scoring.improvement || 0).toFixed(1)} strokes
              </p>
            </div>

            {/* Más rondas */}
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <h4 className="font-bold text-purple-900">Más Activo</h4>
              </div>
              <p className="font-black text-2xl text-purple-600 mb-1">
                {players.reduce((most, curr) => curr.totalRounds > most.totalRounds ? curr : most).display_name}
              </p>
              <p className="text-sm text-purple-700">
                {players.reduce((most, curr) => curr.totalRounds > most.totalRounds ? curr : most).totalRounds} rondas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-amber-200">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-amber-100 rounded-xl">
            <Zap className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 text-lg mb-2">Recomendaciones para el Grupo</h4>
            <ul className="space-y-2 text-amber-900">
              {groupAvg.fir < 40 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Enfocarse en precisión de tee shots - FIR% grupal está bajo el promedio</span>
                </li>
              )}
              {groupAvg.gir < 40 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Trabajar en juego de aproximación - GIR% grupal necesita mejora</span>
                </li>
              )}
              {groupAvg.putts > 2.0 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Practicar putting - Promedio de putts por hoyo está elevado</span>
                </li>
              )}
              {groupAvg.scrambling < 30 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Mejorar juego corto - Scrambling% grupal está por debajo del objetivo</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Continuar monitoreando progreso individual y grupal para identificar tendencias</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

