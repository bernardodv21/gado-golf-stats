'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Filter, User, Users } from 'lucide-react';

interface Player {
  player_id: string;
  display_name: string;
  categoria: string;
  sexo: string;
  club: string;
  edad: number;
}

interface PlayerSelectorProps {
  players: Player[];
  onPlayerSelect: (player: Player) => void;
  selectedPlayer: Player | null;
}

export default function PlayerSelector({ players, onPlayerSelect, selectedPlayer }: PlayerSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Obtener valores únicos para los filtros
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(players.map(p => p.categoria))];
    return uniqueCategories.sort();
  }, [players]);

  const genders = useMemo(() => {
    const uniqueGenders = [...new Set(players.map(p => p.sexo))];
    return uniqueGenders.sort();
  }, [players]);

  const clubs = useMemo(() => {
    const uniqueClubs = [...new Set(players.map(p => p.club))];
    return uniqueClubs.sort();
  }, [players]);

  // Filtrar jugadores
  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const matchesSearch = player.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           player.club.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || player.categoria === selectedCategory;
      const matchesGender = !selectedGender || player.sexo === selectedGender;
      const matchesClub = !selectedClub || player.club === selectedClub;
      
      return matchesSearch && matchesCategory && matchesGender && matchesClub;
    });
  }, [players, searchTerm, selectedCategory, selectedGender, selectedClub]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedGender('');
    setSelectedClub('');
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedGender || selectedClub;

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="space-y-4">
      {/* Selector de jugador */}
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Jugador
        </label>
        
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`w-full px-4 py-3 bg-white border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left flex items-center justify-between ${
            isOpen ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'
          }`}
        >
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-3" />
            <span className={selectedPlayer ? 'text-gray-900' : 'text-gray-500'}>
              {selectedPlayer ? selectedPlayer.display_name : 'Selecciona un jugador...'}
            </span>
          </div>
          <svg className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown con búsqueda y filtros */}
        {isOpen && (
          <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {/* Barra de búsqueda */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o club..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Filtros</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-green-600 hover:text-green-700 font-medium"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Filtro por categoría */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* Filtro por género */}
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Todos los géneros</option>
                  {genders.map(gender => (
                    <option key={gender} value={gender}>
                      {gender === 'M' ? 'Masculino' : 'Femenino'}
                    </option>
                  ))}
                </select>

                {/* Filtro por club */}
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Todos los clubes</option>
                  {clubs.map(club => (
                    <option key={club} value={club}>{club}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lista de jugadores */}
            <div className="max-h-60 overflow-y-auto">
              {filteredPlayers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No se encontraron jugadores</p>
                </div>
              ) : (
                filteredPlayers.map(player => (
                  <button
                    key={player.player_id}
                    onClick={() => {
                      onPlayerSelect(player);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{player.display_name}</p>
                        <p className="text-sm text-gray-500">
                          {player.categoria} • {player.sexo === 'M' ? 'Masculino' : 'Femenino'} • {player.club}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {player.edad} años
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Información del jugador seleccionado */}
      {selectedPlayer && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold mr-3 ${
              selectedPlayer.sexo === 'M' ? 'bg-blue-500' : 'bg-pink-500'
            }`}>
              {selectedPlayer.display_name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedPlayer.display_name}</h3>
              <p className="text-sm text-gray-600">
                {selectedPlayer.categoria} • {selectedPlayer.sexo === 'M' ? 'Masculino' : 'Femenino'} • {selectedPlayer.club}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
