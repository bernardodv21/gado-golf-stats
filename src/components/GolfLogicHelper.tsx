'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface GolfLogicHelperProps {
  strokes: number;
  putts: number;
  par: number;
  fairwayHit: string;
  greenInRegulation: string;
  bunker: string;
  penaltyOb: number;
  penaltyAgua: number;
}

export default function GolfLogicHelper({
  strokes,
  putts,
  par,
  fairwayHit,
  greenInRegulation,
  bunker,
  penaltyOb,
  penaltyAgua
}: GolfLogicHelperProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const newSuggestions: string[] = [];
    const newWarnings: string[] = [];

    if (strokes > 0 && putts > 0) {
      const approachShots = strokes - putts;
      const totalPenalties = penaltyOb + penaltyAgua;
      
      // Lógica inteligente de golf
      if (approachShots === (par - 2)) {
        // Llegó al green en regulación
        if (greenInRegulation !== 'Sí') {
          newSuggestions.push('¡Llegaste al green en regulación! Marca "Sí" en GIR');
        }
        
        if (par !== 3 && fairwayHit !== 'Sí') {
          newSuggestions.push('Si llegaste al green en regulación, probablemente golpeaste el fairway');
        }
        
        if (bunker === 'Sí') {
          newWarnings.push('No puedes estar en bunker si llegaste al green en regulación');
        }
      } else {
        // No llegó al green en regulación
        if (greenInRegulation === 'Sí') {
          newWarnings.push('No llegaste al green en regulación según los golpes');
        }
      }

      // Validaciones de penalties
      if (totalPenalties > 0 && approachShots < totalPenalties) {
        newWarnings.push('Los penalties no pueden ser más que los golpes de aproximación');
      }

      // Sugerencias inteligentes
      if (approachShots === 1 && par === 4) {
        newSuggestions.push('¡Excelente! Un solo golpe de aproximación en un par 4');
      }
      
      if (approachShots === 2 && par === 5) {
        newSuggestions.push('¡Muy bien! Dos golpes de aproximación en un par 5');
      }

      // Validación de putts
      if (putts > strokes) {
        newWarnings.push('Los putts no pueden ser más que los golpes totales');
      }

      if (putts === 0 && strokes > 1) {
        newWarnings.push('Si no hiciste putts, debes haber embocado de un golpe');
      }
    }

    setSuggestions(newSuggestions);
    setWarnings(newWarnings);
  }, [strokes, putts, par, fairwayHit, greenInRegulation, bunker, penaltyOb, penaltyAgua]);

  if (suggestions.length === 0 && warnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Sugerencias */}
      {suggestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Lightbulb className="h-5 w-5 text-blue-500 mr-2" />
            <h4 className="font-semibold text-blue-800">💡 Sugerencias Inteligentes</h4>
          </div>
          <ul className="text-blue-700 text-sm space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Advertencias */}
      {warnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h4 className="font-semibold text-red-800">⚠️ Advertencias</h4>
          </div>
          <ul className="text-red-700 text-sm space-y-1">
            {warnings.map((warning, index) => (
              <li key={index} className="flex items-start">
                <Target className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
