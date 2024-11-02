import request from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { indexerEndpoint } from "@/utils/graphql";
import { queryKeys } from "../query-keys";
import {
  allAuctionsQuery,
  auctionClosedQuery,
  completedAuctionsQuery,
  newAuctionsQuery,
} from "@/utils/graphql/queries/auction.queries";

export function useAllAuctionsQuery() {
  return useQuery({
    queryKey: [queryKeys.auction.all],
    queryFn: async () => {
      const response = await request<AllAuctionsQueryResponse>(
        indexerEndpoint,
        allAuctionsQuery
      );
      return response.allAuctions;
    },
    refetchInterval: 100000,
  });
}

// export function useCompletedAuctionsQuery() {
//   return useQuery({
//     queryKey: [queryKeys.auction.completed],
//     queryFn: async () => {
//       const response = await request<CompletedAuctionsQueryResponse>(
//         indexerEndpoint,
//         completedAuctionsQuery
//       );
//       return response.completedAuctions;
//     },
//     refetchInterval: 100000,
//   });
// }

export function useNewAuctionsQuery() {
  return useQuery({
    queryKey: [queryKeys.auction.new],
    queryFn: async () => {
      const response = await request<NewAuctionsQueryResponse>(
        indexerEndpoint,
        newAuctionsQuery
      );
      return response.newAuctions;
    },
    refetchInterval: 100000,
  });
}

export function useAuctionClosedQuery() {
  return useQuery({
    queryKey: [queryKeys.auction.closed],
    queryFn: async () => {
      const response = await request<AuctionClosedQueryResponse>(
        indexerEndpoint,
        auctionClosedQuery
      );

      return response.auctionCloseds;
    },
    refetchInterval: 100000,
  });
}
