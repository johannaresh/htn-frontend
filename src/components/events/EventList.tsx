import { useMemo } from 'react';
import type { Event } from '../../api/events';
import { EventCard } from './EventCard';
import { useAuth } from '../../auth/AuthContext';

interface EventListProps {
  events: Event[];
}

export const EventList = ({ events }: EventListProps) => {
  const { isAuthed } = useAuth();

  // Filter events based on auth state
  const filteredEvents = useMemo(() => {
    if (isAuthed) {
      // Show all events when logged in
      return events;
    }
    // Show only public events when logged out
    return events.filter((event) => !event.permission || event.permission === 'public');
  }, [events, isAuthed]);

  // Sort by start_time ascending
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => a.start_time - b.start_time);
  }, [filteredEvents]);

  if (sortedEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No events found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
