import { gqlClient } from './gqlClient';
import { GET_ALL_EVENTS, GET_EVENT_BY_ID } from './queries';

export interface Speaker {
  name: string;
  profile_pic?: string;
}

export interface Event {
  id: number;
  name: string;
  event_type: 'workshop' | 'activity' | 'tech_talk';
  permission?: 'public' | 'private';
  start_time: number;
  end_time: number;
  description?: string;
  speakers: Speaker[];
  public_url?: string;
  private_url: string;
  related_events: number[];
}

interface GetAllEventsResponse {
  sampleEvents: Event[];
}

interface GetEventByIdResponse {
  sampleEvent: Event;
}

export const fetchAllEvents = async (): Promise<Event[]> => {
  try {
    console.log('Fetching all events from GraphQL...');
    const data = await gqlClient.request<GetAllEventsResponse>(GET_ALL_EVENTS);
    console.log('Events received:', data.sampleEvents.length);
    return data.sampleEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchEventById = async (id: number): Promise<Event> => {
  try {
    console.log('Fetching event by ID:', id);
    const data = await gqlClient.request<GetEventByIdResponse>(GET_EVENT_BY_ID, { id });
    console.log('Event received:', data.sampleEvent);
    return data.sampleEvent;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};
