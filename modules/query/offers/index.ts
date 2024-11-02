import request from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { indexerEndpoint } from "@/utils/graphql";
import { queryKeys } from "../query-keys";
import {
  acceptedOffersQuery,
  allOffersQuery,
  completedOffersQuery,
  newOffersQuery,
} from "@/utils/graphql/queries/offers.queries";

export function useAllOffersQuery() {
  return useQuery({
    queryKey: [queryKeys.offers.all],
    queryFn: async () => {
      const response = await request<AllOffersQueryResponse>(
        indexerEndpoint,
        allOffersQuery
      );
      return response.allOffers;
    },
    refetchInterval: 100000,
  });
}

export function useAcceptedOffersQuery() {
  return useQuery({
    queryKey: [queryKeys.offers.accepted],
    queryFn: async () => {
      const response = await request<AcceptedOffersQueryResponse>(
        indexerEndpoint,
        acceptedOffersQuery
      );
      return response.acceptedOffers;
    },
    refetchInterval: 100000,
  });
}

// export function useCompletedOffersQuery() {
//   return useQuery({
//     queryKey: [queryKeys.offers.completed],
//     queryFn: async () => {
//       const response = await request<CompletedOffersQueryResponse>(
//         indexerEndpoint,
//         completedOffersQuery
//       );
//       return response.completedOffers;
//     },
//     refetchInterval: 100000,
//   });
// }

export function useNewOffersQuery() {
  return useQuery({
    queryKey: [queryKeys.offers.new],
    queryFn: async () => {
      const response = await request<NewOffersQueryResponse>(
        indexerEndpoint,
        newOffersQuery
      );
      return response.newOffers;
    },
    refetchInterval: 100000,
  });
}
