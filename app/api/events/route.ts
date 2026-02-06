import { NextResponse } from 'next/server';
import { GraphQLClient, gql } from 'graphql-request';
import type { Event } from '@/lib/types/event';

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

if (!GRAPHQL_ENDPOINT) {
  throw new Error('GRAPHQL_ENDPOINT is not defined in environment variables');
}

const gqlClient = new GraphQLClient(GRAPHQL_ENDPOINT);

const GET_ALL_EVENTS = gql`
  query GetAllEvents {
    sampleEvents {
      id
      name
      event_type
      permission
      start_time
      end_time
      description
      speakers {
        name
      }
      public_url
      private_url
      related_events
    }
  }
`;

interface GetAllEventsResponse {
  sampleEvents: Event[];
}

export async function GET() {
  try {
    const data = await gqlClient.request<GetAllEventsResponse>(GET_ALL_EVENTS);
    return NextResponse.json(data.sampleEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
