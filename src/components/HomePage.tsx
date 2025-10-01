'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Award } from 'lucide-react';
import StatsOverview from './StatsOverview';
import RecordsSection from './RecordsSection';
import PlayersSectionNew from './PlayersSectionNew';
import RecentGamesEpic from './RecentGamesEpic';
import NextEventEpic from './NextEventEpic';

// Frases motivacionales por defecto (fallback)
const defaultMotivationalQuotes = [
  "¡Cada hoyo es una nueva oportunidad de brillar! ⛳",
  "El golf te enseña paciencia, concentración y respeto. ¡Sigue practicando! 🏌️‍♂️",
  "Los grandes golfistas no nacieron grandes, ¡practicaron mucho! 💪",
  "Cada swing te acerca más a tu mejor juego. ¡No te rindas! ⭐",
  "El golf es 90% mental y 10% físico. ¡Mantén la mente positiva! 🧠"
];

// Datos de ejemplo basados en la estructura real de GADO
const mockGadoData = {
  totalPlayers: 45,
  totalRounds: 127,
  activeRounds: 3,
  averageScore: 89.5,
  bestScore: 72,
  categories: ['Sub-10', '10-12', '13-15', '16-18'],
  nextEvent: {
    name: 'Torneo Primavera 2024',
    date: '2024-10-15',
    course: 'Club de Golf Los Pinos',
    city: 'Ciudad de México'
  }
};

export default function HomePage() {
  const [currentQuote, setCurrentQuote] = useState('');
  const [motivations, setMotivations] = useState<{frase: string}[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [completedRounds, setCompletedRounds] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos
    async function fetchData() {
      try {
        setLoading(true);
        const [motivationsResponse, playersResponse, gamesResponse, nextEventResponse, completedRoundsResponse] = await Promise.all([
          fetch('/api/gado/motivations'),
          fetch('/api/gado/players'),
          fetch('/api/games'),
          fetch('/api/gado/next-event'),
          fetch('/api/gado/completed-rounds-history')
        ]);
        
        if (motivationsResponse.ok) {
          const motivationsData = await motivationsResponse.json();
          setMotivations(motivationsData);
        }
        
        if (playersResponse.ok && gamesResponse.ok) {
          const [playersData, gamesData] = await Promise.all([
            playersResponse.json(),
            gamesResponse.json()
          ]);
          setPlayers(playersData);
          setGames(gamesData);
        }
        
        if (nextEventResponse.ok) {
          const nextEventData = await nextEventResponse.json();
          setNextEvent(nextEventData);
        }
        
        if (completedRoundsResponse.ok) {
          const completedRoundsData = await completedRoundsResponse.json();
          setCompletedRounds(completedRoundsData.length);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const quotes = motivations.length > 0 
      ? motivations.map(m => m.frase)
      : defaultMotivationalQuotes;
    
    // Función para obtener una frase aleatoria
    const getRandomQuote = () => {
      return quotes[Math.floor(Math.random() * quotes.length)];
    };
    
    // Establecer frase inicial
    setCurrentQuote(getRandomQuote());

    // Cambiar cada 30 segundos para demo (cambiar a 3600000 para cada hora)
    const quoteInterval = setInterval(() => {
      setCurrentQuote(getRandomQuote());
    }, 30000);

    return () => clearInterval(quoteInterval);
  }, [motivations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Frase motivacional - Estilo Apple */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 text-center mb-8 sm:mb-12">
        {/* Efecto de partículas de fondo */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 animate-pulse"></div>
        
        {/* Contenido principal */}
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-6 shadow-lg">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed italic mb-4">
            &quot;{currentQuote}&quot;
          </p>
          
          {/* Indicador de cambio */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
        
        {/* Efectos de brillo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
      </div>

      {/* Estadísticas Principales - Estilo Apple */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 md:p-8 mb-8 sm:mb-12">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2">
            Temporada 2025-2026
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">Estadísticas en Tiempo Real</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <div className="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-3 sm:p-4 md:p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-green-600 mb-1 sm:mb-2">{players.length}</div>
              <div className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wide">Jugadores</div>
            </div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-3 sm:p-4 md:p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-600 mb-1 sm:mb-2">4</div>
              <div className="text-xs sm:text-sm font-semibold text-blue-700 uppercase tracking-wide">Categorías</div>
            </div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-3 sm:p-4 md:p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-purple-600/10 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-purple-600 mb-1 sm:mb-2">7</div>
              <div className="text-xs sm:text-sm font-semibold text-purple-700 uppercase tracking-wide">Etapas</div>
            </div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-3 sm:p-4 md:p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-orange-600 mb-1 sm:mb-2">{completedRounds}</div>
              <div className="text-xs sm:text-sm font-semibold text-orange-700 uppercase tracking-wide">Rondas Capturadas</div>
            </div>
          </div>
        </div>

              {/* Próximo evento épico */}
              <div className="mt-8">
                <NextEventEpic />
              </div>
      </div>



              {/* Estadísticas generales */}
              <StatsOverview players={players} games={games} />
              
              {/* Salón de la Fama - Records */}
              <RecordsSection />
      
      {/* Módulo de jugadores épico */}
      <PlayersSectionNew />

      {/* Juegos recientes épicos */}
      <RecentGamesEpic />
    </div>
  );
}
