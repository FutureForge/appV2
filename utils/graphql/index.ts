if (!process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT) {
  throw new Error("NEXT_PUBLIC_GRAPHQL_ENDPOINT is not set");
}

export const indexerEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
