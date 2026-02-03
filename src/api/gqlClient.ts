import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = 'https://api.hackthenorth.com/v3/frontend-challenge';

export const gqlClient = new GraphQLClient(GRAPHQL_ENDPOINT);
