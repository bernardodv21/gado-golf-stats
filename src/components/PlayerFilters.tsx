'use client';

import { useState } from 'react';
import { Filter, X, Users, Trophy, MapPin } from 'lucide-react';

interface PlayerFiltersProps {
  players: any[];
  onFilterChange: (filteredPlayers: any[]) => void;
}

export default function PlayerFilters({ players, onFilterChange }: PlayerFiltersProps) {
  const [filters, setFilters] = useState({
    categoria: '',
    genero: '',
    club: '',
    minPartidas: 0,
    minScore: 0,
    maxScore: 200
  });

  const [showFilters, setShowFilters] = useState(false);

  // Obtener opciones únicas para los filtros
  const categorias = [...new Set(players.map(p => p.categoria))].sort();
  const generos = [...new Set(players.map(p => p.sexo))].sort();
  const clubs = [...new Set(players.map(p => p.club))].sort();

  const applyFilters = () => {
    let filtered = [...players];

    if (filters.categoria) {
      filtered = filtered.filter(p => p.categoria === filters.categoria);
    }

    if (filters.genero) {
      filtered = filtered.filter(p => p.sexo === filters.genero);
    }

    if (filters.club) {
      filtered = filtered.filter(p => p.club === filters.club);
    }

    if (filters.minPartidas > 0) {
      filtered = filtered.filter(p => p.partidasJugadas >= filters.minPartidas);
    }

    if (filters.minScore > 0) {
      filtered = filtered.filter(p => p.scorePromedio >= filters.minScore);
    }

    if (filters.maxScore < 200) {
      filtered = filtered.filter(p => p.scorePromedio <= filters.maxScore);
    }

    onFilterChange(filtered);
  };

  const clearFilters = () => {
    setFilters({
      categoria: '',
      genero: '',
      club: '',
      minPartidas: 0,
      minScore: 0,
      maxScore: 200
    });
    onFilterChange(players);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categoria) count++;
    if (filters.genero) count++;
    if (filters.club) count++;
    if (filters.minPartidas > 0) count++;
    if (filters.minScore > 0) count++;
    if (filters.maxScore < 200) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header con botón de filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros Inteligentes</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {getActiveFiltersCount()} activos
            </span>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
        </button>
      </div>

      {/* Filtros expandibles */}
      {showFilters && (
        <div className="space-y-4">
          {/* Filtros principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Trophy className="h-4 w-4 inline mr-1" />
                Categoría
              </label>
              <select
                value={filters.categoria}
                onChange={(e) => setFilters({...filters, categoria: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Género
              </label>
              <select
                value={filters.genero}
                onChange={(e) => setFilters({...filters, genero: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los géneros</option>
                {generos.map(gen => (
                  <option key={gen} value={gen}>
                    {gen === 'M' ? 'Masculino' : gen === 'F' ? 'Femenino' : gen}
                  </option>
                ))}
              </select>
            </div>

            {/* Club */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Club
              </label>
              <select
                value={filters.club}
                onChange={(e) => setFilters({...filters, club: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los clubs</option>
                {clubs.map(club => (
                  <option key={club} value={club}>{club}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtros avanzados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mínimo de partidas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mín. Partidas Jugadas
              </label>
              <input
                type="number"
                min="0"
                value={filters.minPartidas}
                onChange={(e) => setFilters({...filters, minPartidas: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>

            {/* Rango de score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Score Mínimo
              </label>
              <input
                type="number"
                min="0"
                value={filters.minScore}
                onChange={(e) => setFilters({...filters, minScore: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Score Máximo
              </label>
              <input
                type="number"
                min="0"
                value={filters.maxScore}
                onChange={(e) => setFilters({...filters, maxScore: parseInt(e.target.value) || 200})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="200"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar Filtros
            </button>
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
