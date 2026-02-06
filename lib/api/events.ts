import type { Event } from '@/lib/types/event';

export type { Event, Speaker } from '@/lib/types/event';

export const fetchAllEvents = async (): Promise<Event[]> => {
  const response = await fetch('/api/events');

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  return response.json();
};

export const fetchEventById = async (id: number): Promise<Event> => {
  const response = await fetch(`/api/events/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Event not found');
    }
    throw new Error('Failed to fetch event');
  }

  return response.json();
};
