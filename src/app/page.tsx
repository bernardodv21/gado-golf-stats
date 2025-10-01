import { Suspense } from 'react';
import HomePage from '@/components/HomePage';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
                <div className="mb-12 text-center">
                  <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 mb-4 tracking-tight">
                    GADO Temporada 2025-2026
                  </h1>
                  <p className="text-2xl font-semibold text-gray-700 mb-2">
                    Golf Amateur de Occidente
                  </p>
                  <p className="text-xl text-gray-600 mb-6">
                    Gira Infantil/Juvenil
                  </p>
                  <div className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg">
                    Desempeño de Jugadores
                  </div>
                </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <HomePage />
        </Suspense>
      </div>
    </main>
  );
}