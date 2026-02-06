import { Suspense } from 'react';
import { Events } from '@/components/pages/Events';

function EventsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsLoading />}>
      <Events />
    </Suspense>
  );
}
