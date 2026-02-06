import { NextResponse } from 'next/server';
import { GraphQLClient, gql } from 'graphql-request';
import type { Event } from '@/lib/types/event';

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

if (!GRAPHQL_ENDPOINT) {
  throw new Error('GRAPHQL_ENDPOINT is not defined in environment variables');
}

const gqlClient = new GraphQLClient(GRAPHQL_ENDPOINT);

const GET_EVENT_BY_ID = gql`
  query GetEventById($id: Float!) {
    sampleEvent(id: $id) {
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

interface GetEventByIdResponse {
  sampleEvent: Event;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid event ID' },
      { status: 400 }
    );
  }

  try {
    const data = await gqlClient.request<GetEventByIdResponse>(GET_EVENT_BY_ID, { id });

    if (!data.sampleEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data.sampleEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}
