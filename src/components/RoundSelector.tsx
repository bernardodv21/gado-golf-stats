'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Trophy } from 'lucide-react';

interface ActiveRound {
  round_id: string;
  ronda_name: string;
  event_id: string;
  fecha: string;
  numero_ronda: number;
  course_id: string;
  activa: boolean;
  event_name: string;
  course_name: string;
  course_city: string;
  course_state: string;
}

interface RoundSelectorProps {
  onRoundSelect: (round: ActiveRound) => void;
  selectedRound: ActiveRound | null;
}

export default function RoundSelector({ onRoundSelect, selectedRound }: RoundSelectorProps) {
  const [activeRounds, setActiveRounds] = useState<ActiveRound[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveRounds() {
      try {
        const response = await fetch('/api/gado/active-rounds');
        const data = await response.json();
        setActiveRounds(data);
      } catch (error) {
        console.error('Error fetching active rounds:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActiveRounds();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const [day, month, year] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Seleccionar Ronda Activa
        </label>
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (activeRounds.length === 0) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Seleccionar Ronda Activa
        </label>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-yellow-800 font-medium">No hay rondas activas</p>
          <p className="text-yellow-600 text-sm">Contacta al administrador para activar una ronda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Seleccionar Ronda Activa
      </label>
      
      <div className="grid gap-3">
        {activeRounds.map((round) => (
          <button
            key={round.round_id}
            onClick={() => onRoundSelect(round)}
            className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
              selectedRound?.round_id === round.round_id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-green-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Trophy className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">{round.ronda_name}</h3>
                  {selectedRound?.round_id === round.round_id && (
                    <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      Seleccionada
                    </span>
                  )}
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(round.fecha)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{round.course_name}, {round.course_city}, {round.course_state}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Evento: {round.event_name}
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
