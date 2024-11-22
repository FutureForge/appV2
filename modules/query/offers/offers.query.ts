import request from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { indexerEndpoint } from "@/utils/graphql";
import { queryKeys } from "../query-keys";
import {
  acceptedOffersQuery,
  allOffersQuery,
  completedOffersQuery,
  filteredAcceptedOffersQuery,
  filteredAllOffersQuery,
  filteredCompletedOffersQuery,
  filteredNewOffersQuery,
  newOffersQuery,
  singleOfferQuery,
} from "@/utils/graphql/queries/offers.queries";
import {
  AcceptedOffersQueryResponse,
  AllOffersQueryResponse,
  CompletedOffersQueryResponse,
  NewOffersQueryResponse,
  SingleOfferQueryResponse,
} from "@/utils/types/graphql";
import { formatBlockchainTimestamp } from "@/utils/functions";

export function useAllOffersQuery({ limit = 50 }: { limit?: number }) {
  return useQuery({
    queryKey: [queryKeys.offers.all],
    queryFn: async () => {
      const response = await request<AllOffersQueryResponse>(
        indexerEndpoint,
        allOffersQuery,
        { limit }
      );

      const updatedOffers = response.allOffers.filter((offer) => {
        const { expirationTimestamp } = offer;
        const endTime = formatBlockchainTimestamp(expirationTimestamp);
        const endTimeFormatted = new Date(endTime).getTime();
        const currentTime = new Date().getTime();

        return endTimeFormatted > currentTime;
      });

      return updatedOffers;
    },
    enabled: !!limit, 
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useFilteredAllOffersQuery({
  contractAddress = "",
  address = "",
}: {
  contractAddress?: string;
  address?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.offers.all, contractAddress],
    queryFn: async () => {
      const response = await request<AllOffersQueryResponse>(
        indexerEndpoint,
        filteredAllOffersQuery,
        {
          contractAddress,
          address,
        }
      );

      const updatedOffers = response.allOffers.filter((offer) => {
        const { expirationTimestamp } = offer;
        const endTime = formatBlockchainTimestamp(expirationTimestamp);
        const endTimeFormatted = new Date(endTime).getTime();
        const currentTime = new Date().getTime();

        return endTimeFormatted > currentTime;
      });

      return updatedOffers;
    },
    enabled: !!address || !!contractAddress,
    // refetchInterval: 100000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useSingleOfferQuery({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) {
  return useQuery({
    queryKey: [queryKeys.offers.single],
    queryFn: async () => {
      const response = await request<SingleOfferQueryResponse>(
        indexerEndpoint,
        singleOfferQuery,
        {
          contractAddress,
          tokenId,
        }
      );
      const updatedOffers = response.allOffers.filter((offer) => {
        const { expirationTimestamp } = offer;
        const endTime = formatBlockchainTimestamp(expirationTimestamp);
        const endTimeFormatted = new Date(endTime).getTime();
        const currentTime = new Date().getTime();

        // looking for active listings
        return { ...offer, expired: endTimeFormatted < currentTime };
      });

      return updatedOffers;
    },
    enabled: !!contractAddress || !!tokenId,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useAcceptedOffersQuery({ limit = 50 }: { limit?: number }) {
  return useQuery({
    queryKey: [queryKeys.offers.accepted],
    queryFn: async () => {
      const response = await request<AcceptedOffersQueryResponse>(
        indexerEndpoint,
        acceptedOffersQuery,
        { limit }
      );
      return response.acceptedOffers;
    },
    enabled: !!limit,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useFilteredAcceptedOffersQuery({
  contractAddress = "",
  address = "",
}: {
  contractAddress?: string;
  address?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.offers.accepted, contractAddress],
    queryFn: async () => {
      const response = await request<AcceptedOffersQueryResponse>(
        indexerEndpoint,
        filteredAcceptedOffersQuery,
        {
          contractAddress,
          address,
        }
      );
      return response.acceptedOffers;
    },
    enabled: !!address || !!contractAddress,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
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

export function useFilteredCompletedOffersQuery({
  contractAddress = "",
  address = "",
}: {
  contractAddress?: string;
  address?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.offers.completed, contractAddress],
    queryFn: async () => {
      const response = await request<CompletedOffersQueryResponse>(
        indexerEndpoint,
        filteredCompletedOffersQuery,
        {
          contractAddress,
          address,
        }
      );
      return response.completedOffers;
    },
    enabled: !!address || !!contractAddress,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useNewOffersQuery({ limit = 50 }: { limit?: number }) {
  return useQuery({
    queryKey: [queryKeys.offers.new],
    queryFn: async () => {
      const response = await request<NewOffersQueryResponse>(
        indexerEndpoint,
        newOffersQuery,
        { limit }
      );

      const updatedOffers = response.newOffers.filter((offer) => {
        const { expirationTimestamp } = offer;
        const endTime = formatBlockchainTimestamp(expirationTimestamp);
        const endTimeFormatted = new Date(endTime).getTime();
        const currentTime = new Date().getTime();
        return endTimeFormatted > currentTime;
      });

      return updatedOffers;
    },
    enabled: !!limit,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useFilteredNewOffersQuery({
  contractAddress,
  address,
}: {
  contractAddress?: string;
  address?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.offers.new, contractAddress],
    queryFn: async () => {
      const response = await request<NewOffersQueryResponse>(
        indexerEndpoint,
        filteredNewOffersQuery,
        {
          contractAddress,
          address,
        }
      );

      const updatedOffers = response.newOffers.filter((offer) => {
        const { expirationTimestamp } = offer;
        const endTime = formatBlockchainTimestamp(expirationTimestamp);
        const endTimeFormatted = new Date(endTime).getTime();
        const currentTime = new Date().getTime();

        return endTimeFormatted > currentTime;
      });

      return updatedOffers;
    },
    enabled: !!address || !!contractAddress,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
