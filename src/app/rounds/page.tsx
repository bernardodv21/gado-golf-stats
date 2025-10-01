import { Suspense } from 'react';
import RoundsPage from '@/components/RoundsPage';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Rounds() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Rondas de Golf
          </h1>
          <p className="text-lg text-gray-600">
            Captura y gestiona las rondas de tus jugadores
          </p>
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <RoundsPage />
        </Suspense>
      </div>
    </main>
  );
}
