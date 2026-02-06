'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { Event } from '@/lib/types/event';
import { Badge, formatEventType } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth/AuthContext';

interface RelatedEventsProps {
  relatedEventIds: number[];
  allEvents: Event[];
}

export const RelatedEvents = ({ relatedEventIds, allEvents }: RelatedEventsProps) => {
  const { isAuthed } = useAuth();

  // Find and filter related events
  const relatedEvents = useMemo(() => {
    const events = relatedEventIds
      .map((id) => allEvents.find((e) => e.id === id))
      .filter((e): e is Event => e !== undefined);

    // Filter out private events if user is not authenticated
    if (!isAuthed) {
      return events.filter((e) => !e.permission || e.permission === 'public');
    }

    return events;
  }, [relatedEventIds, allEvents, isAuthed]);

  if (relatedEvents.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">Related Events</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {relatedEvents.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="block p-3 bg-gray-800 border border-gray-700 rounded hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-sm font-medium text-white flex-1 min-w-0">{event.name}</h3>
              <Badge variant={event.event_type}>{formatEventType(event.event_type)}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
