'use client';

import { useState, useEffect } from 'react';
import { ActiveRound, Round, HoleScore, generateEmptyScores, calculateRoundStats } from '@/lib/roundsData';
import { X, Save, ArrowLeft, ArrowRight, Target, Flag } from 'lucide-react';

interface RoundScoreFormProps {
  round: ActiveRound;
  onClose: () => void;
  onRoundComplete: (completedRound: Round) => void;
}

export default function RoundScoreForm({ round, onClose, onRoundComplete }: RoundScoreFormProps) {
  const [scores, setScores] = useState<HoleScore[]>([]);
  const [currentHole, setCurrentHole] = useState(round.currentHole - 1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Inicializar scores vacíos
    const emptyScores = generateEmptyScores(round.par, round.holes);
    setScores(emptyScores);
  }, [round]);

  const handleScoreChange = (holeIndex: number, field: keyof HoleScore, value: string | number | boolean) => {
    setScores(prev => prev.map((score, index) => 
      index === holeIndex 
        ? { ...score, [field]: value }
        : score
    ));
  };

  const handleNextHole = () => {
    if (currentHole < round.holes - 1) {
      setCurrentHole(currentHole + 1);
    }
  };

  const handlePrevHole = () => {
    if (currentHole > 0) {
      setCurrentHole(currentHole - 1);
    }
  };

  const handleSaveRound = async () => {
    setIsSaving(true);
    
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const stats = calculateRoundStats(scores);
    const completedRound: Round = {
      id: round.id,
      playerId: round.playerId,
      courseId: round.courseName === 'Club de Golf Los Pinos' ? 'course_1' : 'course_2',
      tee: round.tee,
      date: round.startDate,
      status: 'completed',
      scores,
      totalScore: stats.totalScore,
      par: round.par,
      weather: '',
      notes: '',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };
    
    onRoundComplete(completedRound);
    setIsSaving(false);
  };

  const currentScore = scores[currentHole];
  const stats = calculateRoundStats(scores);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{round.playerName}</h2>
              <p className="text-green-100">{round.courseName} - Tee {round.tee}</p>
            </div>
            <button
              onClick={onClose}
              className="text-green-100 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Progreso */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Hoyo {currentHole + 1} de {round.holes}
            </span>
            <span className="text-sm text-gray-500">
              Par {currentScore?.par || 0}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentHole + 1) / round.holes) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulario del hoyo actual */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  Hoyo {currentHole + 1}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Score
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={currentScore?.score || ''}
                      onChange={(e) => handleScoreChange(currentHole, 'score', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Putts
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={currentScore?.putts || ''}
                      onChange={(e) => handleScoreChange(currentHole, 'putts', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Penalties
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={currentScore?.penalties || ''}
                      onChange={(e) => handleScoreChange(currentHole, 'penalties', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Par del Hoyo
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="6"
                      value={currentScore?.par || ''}
                      onChange={(e) => handleScoreChange(currentHole, 'par', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="fairway"
                      checked={currentScore?.fairwayHit || false}
                      onChange={(e) => handleScoreChange(currentHole, 'fairwayHit', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="fairway" className="ml-2 text-sm text-gray-700">
                      Fairway golpeado
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="gir"
                      checked={currentScore?.greenInRegulation || false}
                      onChange={(e) => handleScoreChange(currentHole, 'greenInRegulation', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="gir" className="ml-2 text-sm text-gray-700">
                      Green en regulación
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas del hoyo
                  </label>
                  <textarea
                    value={currentScore?.notes || ''}
                    onChange={(e) => handleScoreChange(currentHole, 'notes', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Notas sobre este hoyo..."
                  />
                </div>
              </div>

              {/* Navegación entre hoyos */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevHole}
                  disabled={currentHole === 0}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Anterior
                </button>
                
                <button
                  onClick={handleNextHole}
                  disabled={currentHole === round.holes - 1}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Resumen de la ronda */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Flag className="h-5 w-5 mr-2 text-blue-600" />
                  Resumen de la Ronda
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Score Total:</span>
                    <span className="ml-2 font-semibold">{stats.totalScore}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Score vs Par:</span>
                    <span className={`ml-2 font-semibold ${stats.scoreToPar > 0 ? 'text-red-600' : stats.scoreToPar < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {stats.scoreToPar > 0 ? '+' : ''}{stats.scoreToPar}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Putts Total:</span>
                    <span className="ml-2 font-semibold">{stats.totalPutts}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Promedio Putts:</span>
                    <span className="ml-2 font-semibold">{stats.averagePutts}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fairways:</span>
                    <span className="ml-2 font-semibold">{stats.fairwaysHitPercentage}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">GIR:</span>
                    <span className="ml-2 font-semibold">{stats.greensInRegulationPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <button
                  onClick={handleSaveRound}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Ronda
                    </>
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
