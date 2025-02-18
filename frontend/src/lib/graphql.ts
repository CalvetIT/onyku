import { GraphQLClient } from 'graphql-request'

const API_URL = 'http://localhost:4000/graphql'

export const graphqlClient = new GraphQLClient(API_URL, {
  headers: {
    // Add any headers if needed
  },
}) 