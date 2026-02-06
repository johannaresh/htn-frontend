'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchEventById, fetchAllEvents } from '@/lib/api/events';
import type { Event } from '@/lib/types/event';
import { EventDetail } from '@/components/events/EventDetail';
import { RelatedEvents } from '@/components/events/RelatedEvents';

interface EventPageProps {
  eventId: string;
}

export const EventPage = ({ eventId }: EventPageProps) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        setError(null);
        const [eventData, eventsData] = await Promise.all([
          fetchEventById(parseInt(eventId, 10)),
          fetchAllEvents(),
        ]);
        setEvent(eventData);
        setAllEvents(eventsData);
      } catch (err) {
        setError('Failed to load event. Please try again later.');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-4">{error || 'Event not found'}</p>
          <Link
            href="/events"
            className="inline-block px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/events" className="text-cyan-400 hover:text-cyan-300 mb-6 inline-block">
        &larr; Back to Events
      </Link>
      <EventDetail event={event} />
      {event.related_events.length > 0 && (
        <RelatedEvents relatedEventIds={event.related_events} allEvents={allEvents} />
      )}
    </div>
  );
};
