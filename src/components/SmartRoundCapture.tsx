'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, CheckCircle, AlertCircle, Trophy, Target, Zap } from 'lucide-react';
import GolfLogicHelper from './GolfLogicHelper';

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

interface SmartRoundCaptureProps {
  player: Player;
  round: ActiveRound;
  onBack: () => void;
  onComplete: () => void;
}

export default function SmartRoundCapture({ player, round, onBack, onComplete }: SmartRoundCaptureProps) {
  const [holes, setHoles] = useState<Hole[]>([]);
  const [tees, setTees] = useState<Tee[]>([]);
  const [selectedTee, setSelectedTee] = useState<Tee | null>(null);
  const [startingHole, setStartingHole] = useState(1);
  const [currentHole, setCurrentHole] = useState(1);
  const [holeStats, setHoleStats] = useState<HoleStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
        
        // Inicializar estadísticas de hoyos con valores inteligentes
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
          fairway_hit: hole.par === '3' ? 'N/A' : '', // Par 3 no tiene fairway
          green_in_regulation: '',
          bunker: 'No', // Valor por defecto
          penalty_ob: '0',
          penalty_agua: '0',
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

  // Lógica inteligente de golf con auto-completado
  const validateGolfLogic = (stats: HoleStats, holeData: Hole): { errors: string[], autoComplete: Partial<HoleStats> } => {
    const errors: string[] = [];
    const autoComplete: Partial<HoleStats> = {};
    const strokes = parseInt(stats.strokes);
    const putts = parseInt(stats.putts);
    const par = parseInt(holeData.par);

    // Validaciones básicas
    if (strokes < 1) errors.push('Los golpes deben ser al menos 1');
    if (strokes > 10) errors.push('Los golpes no pueden ser más de 10');
    if (putts < 0) errors.push('Los putts no pueden ser negativos');
    if (putts > 4) errors.push('Los putts no pueden ser más de 4');
    if (putts > strokes) errors.push('Los putts no pueden ser más que los golpes totales');

    // Lógica específica de golf con auto-completado
    if (strokes > 0 && putts > 0) {
      const approachShots = strokes - putts;
      
      // Si llegó al green en regulación (strokes - putts = par - 2)
      const isGIR = approachShots === (par - 2);
      
      // Auto-completar Green in Regulation
      if (stats.green_in_regulation === '') {
        autoComplete.green_in_regulation = isGIR ? 'Sí' : 'No';
      }
      
      if (isGIR && stats.green_in_regulation === 'No') {
        errors.push('Si llegó al green en regulación, debe marcar "Sí" en GIR');
      }
      
      if (!isGIR && stats.green_in_regulation === 'Sí') {
        errors.push('No llegó al green en regulación según los golpes');
      }

      // Auto-completar Fairway Hit para Par 4 y 5
      if (par !== 3 && stats.fairway_hit === '') {
        if (isGIR) {
          autoComplete.fairway_hit = 'Sí';
        } else {
          autoComplete.fairway_hit = 'No';
        }
      }

      // Si llegó al green en regulación, no puede estar en bunker
      if (isGIR && stats.bunker === 'Sí') {
        errors.push('Si llegó al green en regulación, no puede estar en bunker');
        autoComplete.bunker = 'No';
      }

      // Si llegó al green en regulación, debe haber golpeado el fairway (excepto par 3)
      if (isGIR && par !== 3 && stats.fairway_hit === 'No') {
        errors.push('Si llegó al green en regulación, debe haber golpeado el fairway');
        autoComplete.fairway_hit = 'Sí';
      }

      // Si no llegó al green en regulación, puede estar en bunker
      if (!isGIR && stats.bunker === 'Sí' && stats.green_in_regulation === 'Sí') {
        errors.push('Si está en bunker, no puede haber llegado al green en regulación');
        autoComplete.green_in_regulation = 'No';
      }

      // Validación de penalties
      const totalPenalties = parseInt(stats.penalty_ob) + parseInt(stats.penalty_agua);
      if (totalPenalties > 0 && approachShots < totalPenalties) {
        errors.push('Los penalties no pueden ser más que los golpes de aproximación');
      }
    }

    return { errors, autoComplete };
  };

  const updateHoleStat = (holeNumber: number, field: keyof HoleStats, value: string) => {
    setHoleStats(prev => {
      const updated = prev.map(stat => 
        stat.hoyo === holeNumber.toString() 
          ? { ...stat, [field]: value }
          : stat
      );
      
      // Validar lógica de golf y aplicar auto-completado
      const currentStat = updated.find(stat => stat.hoyo === holeNumber.toString());
      const currentHoleData = holes.find(hole => hole.hoyo === holeNumber.toString());
      
      if (currentStat && currentHoleData) {
        const { errors, autoComplete } = validateGolfLogic(currentStat, currentHoleData);
        setValidationErrors(errors);
        
        // Aplicar auto-completado si hay campos para completar
        if (Object.keys(autoComplete).length > 0) {
          const finalUpdated = updated.map(stat => 
            stat.hoyo === holeNumber.toString() 
              ? { ...stat, ...autoComplete }
              : stat
          );
          return finalUpdated;
        }
      }
      
      return updated;
    });
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

  const getScoreToPar = () => {
    const completedHoles = holeStats.filter(stat => stat.strokes && stat.strokes !== '');
    const totalPar = completedHoles.reduce((total, stat) => {
      const holeData = holes.find(hole => hole.hoyo === stat.hoyo);
      return total + parseInt(holeData?.par || '4');
    }, 0);
    return getTotalScore() - totalPar;
  };

  const canSave = () => {
    const completedHoles = holeStats.filter(stat => stat.strokes && stat.strokes !== '');
    return completedHoles.length >= 9 && validationErrors.length === 0;
  };

  // Función eliminada: No se permiten rondas incompletas

  const canChangeHole = () => {
    const currentStats = getCurrentHoleStats();
    if (!currentStats || !currentStats.strokes || !currentStats.putts) {
      return true; // Si no hay datos básicos, puede cambiar
    }

    // Verificar campos obligatorios
    const requiredFields = ['strokes', 'putts'];
    const missingFields = requiredFields.filter(field => !currentStats[field as keyof HoleStats]);
    
    if (missingFields.length > 0) {
      return true; // Puede cambiar si faltan campos básicos
    }

    // Verificar si hay errores de validación
    return validationErrors.length === 0;
  };

  const handleHoleChange = (newHole: number) => {
    if (!canChangeHole()) {
      alert('Por favor completa los campos obligatorios y corrige los errores antes de cambiar de hoyo');
      return;
    }
    setCurrentHole(newHole);
  };

  const handleSave = async () => {
    if (!canSave()) {
      alert('Debes completar al menos 9 hoyos sin errores para guardar la ronda');
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
        alert('Ronda completa guardada exitosamente');
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

  // Función eliminada: No se permiten rondas incompletas para evitar duplicados

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const currentHoleData = holes.find(hole => hole.hoyo === currentHole.toString());
  const currentStats = getCurrentHoleStats();
  const isPar3 = currentHoleData?.par === '3';

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
      {/* Header Épico OPTIMIZADO PARA MÓVIL */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl md:rounded-3xl shadow-2xl text-white p-4 md:p-8">
        {/* Primera fila: Botón volver y progreso */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-white/80 hover:text-white transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Volver</span>
          </button>
          
          <div className="text-right">
            <p className="text-white/80 text-xs md:text-sm">Progreso</p>
            <p className="text-lg md:text-2xl font-bold">
              {getCompletedHoles()}/{holes.length}
            </p>
          </div>
        </div>

        {/* Título centrado */}
        <div className="text-center mb-3 md:mb-6">
          <h2 className="text-lg md:text-3xl font-black mb-1 md:mb-2">CAPTURA INTELIGENTE</h2>
          <p className="text-white/90 text-xs md:text-lg">{round.ronda_name}</p>
          <p className="text-white/80 text-xs md:text-base">{round.course_name}</p>
        </div>

        {/* Información del jugador con score - OPTIMIZADO */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 space-y-3 md:space-y-0">
          {/* Jugador */}
          <div className="flex items-center justify-center md:justify-start">
            <div className={`w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white text-base md:text-2xl font-bold mr-2 md:mr-4 ${
              player.sexo === 'M' ? 'bg-blue-500' : 'bg-pink-500'
            }`}>
              {player.display_name.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-base md:text-2xl font-bold">{player.display_name}</h3>
              <p className="text-white/80 text-xs md:text-base">
                {player.categoria} • {player.club}
              </p>
            </div>
          </div>
          
          {/* Score en tiempo real - ÉPICO Y COMPACTO */}
          <div className="border-t border-white/20 pt-3 md:pt-0 md:border-t-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4">
              <div className="flex items-center justify-center space-x-4 md:space-x-8">
                <div className="text-center">
                  <p className="text-white/80 text-xs md:text-sm font-medium mb-1">SCORE TOTAL</p>
                  <p className="text-2xl md:text-4xl font-black">{getTotalScore()}</p>
                </div>
                <div className="w-px h-12 md:h-16 bg-white/30"></div>
                <div className="text-center">
                  <p className="text-white/80 text-xs md:text-sm font-medium mb-1">VS PAR</p>
                  <p className={`text-2xl md:text-4xl font-black ${getScoreToPar() <= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {getScoreToPar() > 0 ? '+' : ''}{getScoreToPar()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2 mt-2 md:mt-3">
                <Trophy className="h-4 w-4 md:h-5 md:w-5 text-yellow-300" />
                <span className="text-xs md:text-sm font-medium">Score en Tiempo Real</span>
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-yellow-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de tee y hoyo de inicio */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selector de tee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="h-4 w-4 inline mr-2" />
              Tee de Salida
            </label>
            <select
              value={selectedTee?.tee_id || ''}
              onChange={(e) => {
                const tee = tees.find(t => t.tee_id === e.target.value);
                setSelectedTee(tee || null);
              }}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
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
              <Trophy className="h-4 w-4 inline mr-2" />
              Hoyo de Inicio
            </label>
            <select
              value={startingHole}
              onChange={(e) => {
                const hole = parseInt(e.target.value);
                setStartingHole(hole);
                setCurrentHole(hole);
              }}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
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

      {/* Captura inteligente del hoyo actual */}
      {currentHoleData && currentStats && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-8">
          <div className="text-center mb-4 md:mb-8">
            <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-2">
              Hoyo {currentHole} - Par {currentHoleData.par}
            </h3>
            <p className="text-gray-600 text-lg">Handicap: {currentHoleData.handicap_hoyo}</p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Strokes */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏌️ Golpes
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={currentStats.strokes}
                onChange={(e) => {
                  const strokes = e.target.value;
                  updateHoleStat(currentHole, 'strokes', strokes);
                  
                  if (strokes) {
                    const par = parseInt(currentHoleData.par);
                    const scoreRelative = parseInt(strokes) - par;
                    updateHoleStat(currentHole, 'score_relativo', scoreRelative.toString());
                    
                    // Determinar resultado automáticamente
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
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg md:text-xl text-center font-bold"
                placeholder="Golpes"
              />
            </div>

            {/* Putts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 Putts
              </label>
              <input
                type="number"
                min="0"
                max="4"
                value={currentStats.putts}
                onChange={(e) => updateHoleStat(currentHole, 'putts', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg md:text-xl text-center font-bold"
                placeholder="Putts"
              />
            </div>

            {/* Palo de salida */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏌️‍♂️ Palo de Salida
              </label>
              <select
                value={currentStats.palo_salida}
                onChange={(e) => updateHoleStat(currentHole, 'palo_salida', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Seleccionar...</option>
                <option value="Driver">Driver</option>
                <option value="3 Wood">3 Wood</option>
                <option value="5 Wood">5 Wood</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Iron 2">Iron 2</option>
                <option value="Iron 3">Iron 3</option>
                <option value="Iron 4">Iron 4</option>
                <option value="Iron 5">Iron 5</option>
                <option value="Iron 6">Iron 6</option>
                <option value="Iron 7">Iron 7</option>
                <option value="Iron 8">Iron 8</option>
                <option value="Iron 9">Iron 9</option>
                <option value="PW">PW</option>
                <option value="52°">52°</option>
                <option value="54°">54°</option>
                <option value="56°">56°</option>
                <option value="58°">58°</option>
                <option value="60°">60°</option>
                <option value="62°">62°</option>
                <option value="64°">64°</option>
                <option value="Manual">Manual (escribir)</option>
              </select>
            </div>

            {/* Campo manual para palo personalizado */}
            {currentStats.palo_salida === 'Manual' && (
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ✏️ Palo Personalizado
                </label>
                <input
                  type="text"
                  placeholder="Ej: 7 Iron, Wedge 56°, etc."
                  onChange={(e) => updateHoleStat(currentHole, 'palo_salida', e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}

            {/* Fairway Hit - Solo para Par 4 y 5 */}
            {!isPar3 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 Fairway Hit
                </label>
                <select
                  value={currentStats.fairway_hit}
                  onChange={(e) => updateHoleStat(currentHole, 'fairway_hit', e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
            )}

            {/* Green in Regulation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏌️‍♀️ Green in Regulation
              </label>
              <select
                value={currentStats.green_in_regulation}
                onChange={(e) => updateHoleStat(currentHole, 'green_in_regulation', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Seleccionar...</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Bunker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏖️ Bunker
              </label>
              <select
                value={currentStats.bunker}
                onChange={(e) => updateHoleStat(currentHole, 'bunker', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>

            {/* Penalties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⚠️ Penalty OB
              </label>
              <input
                type="number"
                min="0"
                max="3"
                value={currentStats.penalty_ob}
                onChange={(e) => updateHoleStat(currentHole, 'penalty_ob', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💧 Penalty Agua
              </label>
              <input
                type="number"
                min="0"
                max="3"
                value={currentStats.penalty_agua}
                onChange={(e) => updateHoleStat(currentHole, 'penalty_agua', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center"
                placeholder="0"
              />
            </div>

            {/* Notas */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Notas
              </label>
              <textarea
                value={currentStats.notas}
                onChange={(e) => updateHoleStat(currentHole, 'notas', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="Notas adicionales del hoyo..."
              />
            </div>
          </div>

          {/* Sugerencias inteligentes al final */}
          {currentStats.strokes && currentStats.putts && (
            <div className="mt-8">
              <GolfLogicHelper
                strokes={parseInt(currentStats.strokes)}
                putts={parseInt(currentStats.putts)}
                par={parseInt(currentHoleData.par)}
                fairwayHit={currentStats.fairway_hit}
                greenInRegulation={currentStats.green_in_regulation}
                bunker={currentStats.bunker}
                penaltyOb={parseInt(currentStats.penalty_ob)}
                penaltyAgua={parseInt(currentStats.penalty_agua)}
              />
            </div>
          )}

          {/* Errores de validación - Movidos debajo de Sugerencias Inteligentes */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <h4 className="font-semibold text-red-800">Errores de Validación</h4>
              </div>
              <ul className="text-red-700 text-sm space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Navegación épica - OPTIMIZADA PARA MÓVIL */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 md:p-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between space-y-3 md:space-y-0">
          {/* Botón Anterior */}
          <button
            onClick={() => handleHoleChange(Math.max(1, currentHole - 1))}
            disabled={currentHole === 1}
            className="flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm md:text-base"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Anterior
          </button>

          {/* Selector de hoyos - ADAPTATIVO */}
          <div className="flex flex-wrap justify-center gap-1 md:gap-2 max-w-full overflow-x-auto px-2">
            {holes.map((_, index) => {
              const holeNumber = index + 1;
              const isCompleted = holeStats.find(stat => stat.hoyo === holeNumber.toString())?.strokes !== '';
              const isCurrent = holeNumber === currentHole;
              
              return (
                <button
                  key={holeNumber}
                  onClick={() => handleHoleChange(holeNumber)}
                  className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all ${
                    isCurrent
                      ? 'bg-green-500 text-white shadow-lg scale-110'
                      : isCompleted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {holeNumber}
                </button>
              );
            })}
          </div>

          {/* Botón Siguiente */}
          <button
            onClick={() => handleHoleChange(Math.min(holes.length, currentHole + 1))}
            disabled={currentHole === holes.length}
            className="flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm md:text-base"
          >
            Siguiente
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Botones de acción épicos - OPTIMIZADOS PARA MÓVIL */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 md:p-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between space-y-3 md:space-y-0">
          <div className="text-xs md:text-sm text-gray-600 text-center md:text-left">
            <p className="font-semibold">Hoyos completados: {getCompletedHoles()}/{holes.length}</p>
            <p className="font-semibold">Score total: {getTotalScore()} ({getScoreToPar() > 0 ? '+' : ''}{getScoreToPar()})</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <button
              onClick={() => setShowSummary(true)}
              className="flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold text-sm md:text-base"
            >
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Ver Resumen
            </button>
            
            {/* Botón "Guardar Incompleta" eliminado - Solo se permiten rondas completas */}
            
            <button
              onClick={handleSave}
              disabled={!canSave() || saving}
              className="flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm md:text-base"
            >
              <Save className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>

      {/* Resumen épico */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-black text-gray-900">🏆 Resumen de la Ronda</h3>
              <button
                onClick={() => setShowSummary(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6 text-sm">
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
              
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-700 mb-4 text-lg">Hoyos Completados:</h4>
                <div className="grid grid-cols-6 gap-3 text-xs">
                  {holes.map(hole => {
                    const stats = holeStats.find(stat => stat.hoyo === hole.hoyo);
                    const isCompleted = stats?.strokes !== '';
                    
                    return (
                      <div
                        key={hole.hoyo}
                        className={`p-3 rounded-xl text-center ${
                          isCompleted ? 'bg-green-100 text-green-800 border-2 border-green-300' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <div className="font-bold text-lg">Hoyo {hole.hoyo}</div>
                        <div className="text-sm">Par {hole.par}</div>
                        {isCompleted && (
                          <>
                            <div className="font-black text-xl">{stats?.strokes} golpes</div>
                            <div className="text-xs">{stats?.resultado}</div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Score Total:</span>
                  <span className="text-green-600">{getTotalScore()}</span>
                </div>
                <div className="flex justify-between text-xl font-semibold mt-2">
                  <span>Vs Par:</span>
                  <span className={getScoreToPar() <= 0 ? 'text-green-600' : 'text-red-600'}>
                    {getScoreToPar() > 0 ? '+' : ''}{getScoreToPar()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowSummary(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowSummary(false);
                  handleSave();
                }}
                disabled={!canSave() || saving}
                className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
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
