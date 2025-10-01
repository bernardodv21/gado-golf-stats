'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, CheckCircle, AlertCircle } from 'lucide-react';

interface Player {
  player_id: string;
  display_name: string;
  categoria: string;
  sexo: string;
  club: string;
  edad: number;
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

interface Hole {
  course_id: string;
  hoyo: string;
  par: string;
  handicap_hoyo: string;
  hole_id: string;
}

interface Tee {
  tee_id: string;
  course_id: string;
  tee_set: string;
  par_total: string;
  yardas_total: string;
  rating_hombres: string;
  slope_hombres: string;
  rating_mujeres: string;
  slope_mujeres: string;
}

interface HoleStats {
  jugador: string;
  player_name: string;
  round_id: string;
  tee_id: string;
  hoyo: string;
  par: string;
  strokes: string;
  score_relativo: string;
  resultado: string;
  putts: string;
  palo_salida: string;
  fairway_hit: string;
  green_in_regulation: string;
  bunker: string;
  penalty_ob: string;
  penalty_agua: string;
  first_putt_dist_m: string;
  up_down_intento: string;
  up_down_exito: string;
  notas: string;
  summary_key: string;
}

interface RoundCaptureProps {
  player: Player;
  round: ActiveRound;
  onBack: () => void;
  onComplete: () => void;
}

export default function RoundCapture({ player, round, onBack, onComplete }: RoundCaptureProps) {
  const [holes, setHoles] = useState<Hole[]>([]);
  const [tees, setTees] = useState<Tee[]>([]);
  const [selectedTee, setSelectedTee] = useState<Tee | null>(null);
  const [startingHole, setStartingHole] = useState(1);
  const [currentHole, setCurrentHole] = useState(1);
  const [holeStats, setHoleStats] = useState<HoleStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const response = await fetch(`/api/gado/course-holes?courseId=${round.course_id}`);
        const data = await response.json();
        setHoles(data.holes);
        setTees(data.tees);
        
        // Seleccionar el primer tee por defecto
        if (data.tees.length > 0) {
          setSelectedTee(data.tees[0]);
        }
        
        // Inicializar estadísticas de hoyos
        const initialStats: HoleStats[] = data.holes.map((hole: Hole) => ({
          jugador: player.player_id,
          player_name: player.display_name,
          round_id: round.round_id,
          tee_id: data.tees[0]?.tee_id || '',
          hoyo: hole.hoyo,
          par: hole.par,
          strokes: '',
          score_relativo: '',
          resultado: '',
          putts: '',
          palo_salida: '',
          fairway_hit: '',
          green_in_regulation: '',
          bunker: '',
          penalty_ob: '',
          penalty_agua: '',
          first_putt_dist_m: '',
          up_down_intento: '',
          up_down_exito: '',
          notas: '',
          summary_key: `${player.player_id}-${round.round_id}-${hole.hoyo}`
        }));
        setHoleStats(initialStats);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData();
  }, [player, round]);

  const updateHoleStat = (holeNumber: number, field: keyof HoleStats, value: string) => {
    setHoleStats(prev => prev.map(stat => 
      stat.hoyo === holeNumber.toString() 
        ? { ...stat, [field]: value }
        : stat
    ));
  };

  const getCurrentHoleStats = () => {
    return holeStats.find(stat => stat.hoyo === currentHole.toString());
  };

  const getCompletedHoles = () => {
    return holeStats.filter(stat => stat.strokes && stat.strokes !== '').length;
  };

  const getTotalScore = () => {
    const completedHoles = holeStats.filter(stat => stat.strokes && stat.strokes !== '');
    return completedHoles.reduce((total, stat) => total + parseInt(stat.strokes), 0);
  };

  const canSave = () => {
    const completedHoles = holeStats.filter(stat => stat.strokes && stat.strokes !== '');
    return completedHoles.length >= 9; // Mínimo 9 hoyos para guardar
  };

  const handleSave = async () => {
    if (!canSave()) {
      alert('Debes completar al menos 9 hoyos para guardar la ronda');
      return;
    }

    setSaving(true);
    try {
      const completedStats = holeStats.filter(stat => stat.strokes && stat.strokes !== '');
      
      const response = await fetch('/api/gado/save-hole-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ holeStats: completedStats }),
      });

      if (response.ok) {
        alert('Ronda guardada exitosamente');
        onComplete();
      } else {
        throw new Error('Error al guardar la ronda');
      }
    } catch (error) {
      console.error('Error saving round:', error);
      alert('Error al guardar la ronda. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const currentHoleData = holes.find(hole => hole.hoyo === currentHole.toString());
  const currentStats = getCurrentHoleStats();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Captura de Ronda</h2>
            <p className="text-gray-600">{round.ronda_name} - {round.course_name}</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Progreso</p>
            <p className="text-lg font-semibold text-green-600">
              {getCompletedHoles()}/{holes.length} hoyos
            </p>
          </div>
        </div>

        {/* Información del jugador */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4 ${
              player.sexo === 'M' ? 'bg-blue-500' : 'bg-pink-500'
            }`}>
              {player.display_name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{player.display_name}</h3>
              <p className="text-sm text-gray-600">
                {player.categoria} • {player.sexo === 'M' ? 'Masculino' : 'Femenino'} • {player.club}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de tee y hoyo de inicio */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selector de tee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tee de Salida
            </label>
            <select
              value={selectedTee?.tee_id || ''}
              onChange={(e) => {
                const tee = tees.find(t => t.tee_id === e.target.value);
                setSelectedTee(tee || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {tees.map(tee => (
                <option key={tee.tee_id} value={tee.tee_id}>
                  {tee.tee_set} - {tee.yardas_total} yardas (Par {tee.par_total})
                </option>
              ))}
            </select>
          </div>

          {/* Selector de hoyo de inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hoyo de Inicio
            </label>
            <select
              value={startingHole}
              onChange={(e) => {
                const hole = parseInt(e.target.value);
                setStartingHole(hole);
                setCurrentHole(hole);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {holes.map(hole => (
                <option key={hole.hoyo} value={hole.hoyo}>
                  Hoyo {hole.hoyo} (Par {hole.par})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Captura del hoyo actual */}
      {currentHoleData && currentStats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Hoyo {currentHole} - Par {currentHoleData.par}
            </h3>
            <p className="text-gray-600">Handicap: {currentHoleData.handicap_hoyo}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strokes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strokes
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={currentStats.strokes}
                onChange={(e) => {
                  const strokes = e.target.value;
                  updateHoleStat(currentHole, 'strokes', strokes);
                  
                  if (strokes) {
                    const par = parseInt(currentHoleData.par);
                    const scoreRelative = parseInt(strokes) - par;
                    updateHoleStat(currentHole, 'score_relativo', scoreRelative.toString());
                    
                    // Determinar resultado
                    let resultado = '';
                    if (scoreRelative <= -2) resultado = 'Eagle o mejor';
                    else if (scoreRelative === -1) resultado = 'Birdie';
                    else if (scoreRelative === 0) resultado = 'Par';
                    else if (scoreRelative === 1) resultado = 'Bogey';
                    else if (scoreRelative === 2) resultado = 'Doble Bogey';
                    else resultado = 'Triple o peor';
                    
                    updateHoleStat(currentHole, 'resultado', resultado);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Número de golpes"
              />
            </div>

            {/* Putts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Putts
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={currentStats.putts}
                onChange={(e) => updateHoleStat(currentHole, 'putts', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Número de putts"
              />
            </div>

            {/* Palo de salida */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palo de Salida
              </label>
              <select
                value={currentStats.palo_salida}
                onChange={(e) => updateHoleStat(currentHole, 'palo_salida', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Seleccionar...</option>
                <option value="Driver">Driver</option>
                <option value="3 Wood">3 Wood</option>
                <option value="5 Wood">5 Wood</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Iron 3">Iron 3</option>
                <option value="Iron 4">Iron 4</option>
                <option value="Iron 5">Iron 5</option>
                <option value="Iron 6">Iron 6</option>
                <option value="Iron 7">Iron 7</option>
                <option value="Iron 8">Iron 8</option>
                <option value="Iron 9">Iron 9</option>
                <option value="PW">PW</option>
                <option value="SW">SW</option>
                <option value="LW">LW</option>
              </select>
            </div>

            {/* Fairway Hit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fairway Hit
              </label>
              <select
                value={currentStats.fairway_hit}
                onChange={(e) => updateHoleStat(currentHole, 'fairway_hit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Seleccionar...</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
                <option value="N/A">N/A (Par 3)</option>
              </select>
            </div>

            {/* Green in Regulation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Green in Regulation
              </label>
              <select
                value={currentStats.green_in_regulation}
                onChange={(e) => updateHoleStat(currentHole, 'green_in_regulation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Seleccionar...</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Bunker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bunker
              </label>
              <select
                value={currentStats.bunker}
                onChange={(e) => updateHoleStat(currentHole, 'bunker', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Seleccionar...</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Penalties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Penalty OB
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={currentStats.penalty_ob}
                onChange={(e) => updateHoleStat(currentHole, 'penalty_ob', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Penalty Agua
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={currentStats.penalty_agua}
                onChange={(e) => updateHoleStat(currentHole, 'penalty_agua', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0"
              />
            </div>

            {/* Notas */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                value={currentStats.notas}
                onChange={(e) => updateHoleStat(currentHole, 'notas', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="Notas adicionales del hoyo..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Navegación */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentHole(Math.max(1, currentHole - 1))}
            disabled={currentHole === 1}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </button>

          <div className="flex space-x-2">
            {holes.map((_, index) => {
              const holeNumber = index + 1;
              const isCompleted = holeStats.find(stat => stat.hoyo === holeNumber.toString())?.strokes !== '';
              const isCurrent = holeNumber === currentHole;
              
              return (
                <button
                  key={holeNumber}
                  onClick={() => setCurrentHole(holeNumber)}
                  className={`w-10 h-10 rounded-full text-sm font-medium ${
                    isCurrent
                      ? 'bg-green-500 text-white'
                      : isCompleted
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {holeNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentHole(Math.min(holes.length, currentHole + 1))}
            disabled={currentHole === holes.length}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <p>Hoyos completados: {getCompletedHoles()}/{holes.length}</p>
            <p>Score total: {getTotalScore()}</p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowSummary(true)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Ver Resumen
            </button>
            
            <button
              onClick={handleSave}
              disabled={!canSave() || saving}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar Ronda'}
            </button>
          </div>
        </div>
      </div>

      {/* Resumen */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Resumen de la Ronda</h3>
              <button
                onClick={() => setShowSummary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Jugador:</p>
                  <p className="text-gray-600">{player.display_name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Ronda:</p>
                  <p className="text-gray-600">{round.ronda_name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Campo:</p>
                  <p className="text-gray-600">{round.course_name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Tee:</p>
                  <p className="text-gray-600">{selectedTee?.tee_set}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-2">Hoyos Completados:</h4>
                <div className="grid grid-cols-6 gap-2 text-xs">
                  {holes.map(hole => {
                    const stats = holeStats.find(stat => stat.hoyo === hole.hoyo);
                    const isCompleted = stats?.strokes !== '';
                    
                    return (
                      <div
                        key={hole.hoyo}
                        className={`p-2 rounded text-center ${
                          isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <div className="font-medium">Hoyo {hole.hoyo}</div>
                        <div>Par {hole.par}</div>
                        {isCompleted && (
                          <>
                            <div className="font-bold">{stats?.strokes} golpes</div>
                            <div className="text-xs">{stats?.resultado}</div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Score Total:</span>
                  <span className="text-green-600">{getTotalScore()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowSummary(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowSummary(false);
                  handleSave();
                }}
                disabled={!canSave() || saving}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Guardando...' : 'Confirmar y Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
