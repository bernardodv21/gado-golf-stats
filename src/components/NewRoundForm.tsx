'use client';

import { useState } from 'react';
import { Plus, User, Calendar, MapPin } from 'lucide-react';
import PlayerSelector from './PlayerSelector';
import RoundSelector from './RoundSelector';
import SmartRoundCapture from './SmartRoundCapture';

interface Player {
  player_id: string;
  display_name: string;
  edad: number;
  categoria: string;
  club: string;
  sexo: string;
}

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

interface NewRoundFormProps {
  players: Player[];
  onRoundCreated: (round: any) => void;
}

export default function NewRoundForm({ players, onRoundCreated }: NewRoundFormProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedRound, setSelectedRound] = useState<ActiveRound | null>(null);
  const [step, setStep] = useState<'player' | 'round' | 'capture'>('player');

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setStep('round');
  };

  const handleRoundSelect = (round: ActiveRound) => {
    setSelectedRound(round);
    setStep('capture');
  };

  const handleBack = () => {
    if (step === 'capture') {
      setStep('round');
    } else if (step === 'round') {
      setStep('player');
    }
  };

  const handleComplete = () => {
    // La ronda se ha completado y guardado
    onRoundCreated({
      id: selectedRound?.round_id,
      courseName: selectedRound?.course_name,
      playerName: selectedPlayer?.display_name,
      playerId: selectedPlayer?.player_id,
      startDate: new Date().toISOString().split('T')[0],
      currentHole: 1,
      isActive: false,
      scores: []
    });
    
    // Reset form
    setSelectedPlayer(null);
    setSelectedRound(null);
    setStep('player');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-[500px] md:min-h-[600px]">
      <div className="flex items-center mb-4 md:mb-6">
        <Plus className="h-5 w-5 md:h-6 md:w-6 text-green-600 mr-2 md:mr-3" />
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">Nueva Ronda</h2>
      </div>

      {/* Indicador de progreso */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-center space-x-2 md:space-x-4">
          <div className={`flex items-center ${step === 'player' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
              step === 'player' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <User className="h-3 w-3 md:h-4 md:w-4" />
            </div>
            <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium">Jugador</span>
          </div>
          
          <div className={`w-4 md:w-8 h-0.5 ${step === 'round' || step === 'capture' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          
          <div className={`flex items-center ${step === 'round' ? 'text-green-600' : step === 'capture' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
              step === 'round' || step === 'capture' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
            </div>
            <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium">Ronda</span>
          </div>
          
          <div className={`w-4 md:w-8 h-0.5 ${step === 'capture' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          
          <div className={`flex items-center ${step === 'capture' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
              step === 'capture' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <MapPin className="h-3 w-3 md:h-4 md:w-4" />
            </div>
            <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium">Captura</span>
          </div>
        </div>
      </div>

      {/* Contenido según el paso */}
      {step === 'player' && (
        <PlayerSelector
          players={players}
          onPlayerSelect={handlePlayerSelect}
          selectedPlayer={selectedPlayer}
        />
      )}

      {step === 'round' && selectedPlayer && (
        <RoundSelector
          onRoundSelect={handleRoundSelect}
          selectedRound={selectedRound}
        />
      )}

      {step === 'capture' && selectedPlayer && selectedRound && (
        <SmartRoundCapture
          player={selectedPlayer}
          round={selectedRound}
          onBack={handleBack}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}