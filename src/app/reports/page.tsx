import { Suspense } from 'react';
import ReportsNew from '@/components/ReportsNew';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <ReportsNew />
        </Suspense>
      </div>
    </main>
  );
}
