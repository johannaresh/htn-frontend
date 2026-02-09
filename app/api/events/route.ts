/**
 * Server-side API route that proxies GraphQL requests to the external API.
 *
 * Architecture decision: We use Next.js API routes as a proxy layer to hide the
 * GraphQL endpoint URL from the client bundle. In the previous Vite setup, the
 * endpoint was exposed in the frontend JavaScript, visible in Network tab and
 * browser DevTools. Now the external API URL only exists in .env.local (server-only).
 *
 * Frontend calls /api/events → This route calls external GraphQL → Returns JSON
 */
import { NextResponse } from 'next/server';
import { GraphQLClient, gql } from 'graphql-request';
import type { Event } from '@/lib/types/event';

// process.env.GRAPHQL_ENDPOINT is server-only because it lacks the NEXT_PUBLIC_ prefix.
// This ensures the URL never appears in the client-side JavaScript bundle.
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
