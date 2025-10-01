'use client';

import { useState, useEffect } from 'react';
import { Trophy, Calendar, MapPin, Clock, Star, Zap } from 'lucide-react';

export default function NextEventEpic() {
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNextEvent() {
      try {
        const response = await fetch('/api/gado/next-event');
        const data = await response.json();
        setNextEvent(data);
      } catch (error) {
        console.error('Error fetching next event:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNextEvent();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white">Cargando próximo evento...</span>
        </div>
      </div>
    );
  }

  if (!nextEvent) {
    return (
      <div className="bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No hay eventos próximos</h3>
          <p className="text-gray-300">Los próximos eventos aparecerán aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Fondo épico con gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl shadow-2xl"></div>
      
      {/* Efecto de partículas animadas */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-8 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-8 right-6 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1500"></div>
        <div className="absolute top-1/2 left-6 w-1 h-1 bg-white/25 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-1/3 right-4 w-1.5 h-1.5 bg-white/35 rounded-full animate-pulse delay-3000"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 p-4 sm:p-6 md:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          
          {/* Información del club - Lado izquierdo (PRINCIPAL) */}
          <div className="flex-1">
            {/* Header con ícono y título */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1">Próximo Evento</h2>
                <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"></div>
              </div>
            </div>

            {/* NOMBRE DEL CLUB - ELEMENTO PRINCIPAL */}
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 leading-tight">
              {nextEvent.courseName}
            </h3>

            {/* Ubicación del club */}
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
              <span className="text-white/90 text-sm sm:text-base md:text-lg font-medium">
                {nextEvent.city && nextEvent.state ? `${nextEvent.city}, ${nextEvent.state}` : 'Ubicación no disponible'}
              </span>
            </div>

            {/* Etapa del evento - Secundario */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/80 text-sm sm:text-base font-semibold">
                {nextEvent.eventName}
              </span>
            </div>
          </div>

          {/* Tarjeta de fechas - Lado derecho - Más compacta */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-5 shadow-xl min-w-0 lg:min-w-[240px] xl:min-w-[260px]">
            <h4 className="text-xs sm:text-sm font-bold text-gray-800 mb-3 text-center uppercase tracking-wider">
              Fechas del Evento
            </h4>
            
            <div className="space-y-2">
              {/* Fecha de inicio */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 sm:p-3 text-center">
                <p className="text-xs font-medium text-white/90 mb-1">Inicio</p>
                <p className="text-sm sm:text-base md:text-lg font-black text-white">
                  {nextEvent.startDate}
                </p>
              </div>

              {/* Separador */}
              <div className="w-full h-px bg-gray-300"></div>

              {/* Fecha de finalización */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-2 sm:p-3 text-center">
                <p className="text-xs font-medium text-white/90 mb-1">Finalización</p>
                <p className="text-sm sm:text-base md:text-lg font-black text-white">
                  {nextEvent.endDate}
                </p>
              </div>
            </div>

            {/* Estado del evento */}
            <div className="mt-3 flex items-center justify-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-green-600">Evento Activo</span>
            </div>
          </div>
        </div>

        {/* Información adicional en móvil */}
        <div className="mt-4 lg:hidden">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Próximamente</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-semibold">¡No te lo pierdas!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Efecto de brillo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full animate-pulse"></div>
    </div>
  );
}
