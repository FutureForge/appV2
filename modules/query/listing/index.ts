import request from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import {
  allListingsQuery,
  completedListingsQuery,
  newListingsQuery,
} from "@/utils/graphql/queries/listing.queries";
import { indexerEndpoint } from "@/utils/graphql";
import { queryKeys } from "../query-keys";

export function useAllListingsQuery() {
  return useQuery({
    queryKey: [queryKeys.listing.all],
    queryFn: async () => {
      const response = await request<AllListingsQueryResponse>(
        indexerEndpoint,
        allListingsQuery
      );
      return response.allListings;
    },
    refetchInterval: 100000,
  });
}

export function useCompletedListingsQuery() {
  return useQuery({
    queryKey: [queryKeys.listing.completed],
    queryFn: async () => {
      const response = await request<CompletedListingsQueryResponse>(
        indexerEndpoint,
        completedListingsQuery
      );
      return response.completedListings;
    },
    refetchInterval: 100000,
  });
}

export function useNewListingsQuery() {
  return useQuery({
    queryKey: [queryKeys.listing.new],
    queryFn: async () => {
      const response = await request<NewListingsQueryResponse>(
        indexerEndpoint,
        newListingsQuery
      );
      return response.newListings;
    },
    refetchInterval: 100000,
  });
}
