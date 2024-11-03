import request from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import {
  allListingsQuery,
  completedListingsQuery,
  filteredAllListingsQuery,
  filteredCompletedListingsQuery,
  filteredNewListingsQuery,
  filteredNewSaleListingsQuery,
  newListingsQuery,
  newSaleListingsQuery,
  singleListingQuery,
} from "@/utils/graphql/queries/listing.queries";
import { indexerEndpoint } from "@/utils/graphql";
import { queryKeys } from "../query-keys";
import {
  AllListingsQueryResponse,
  CompletedListingsQueryResponse,
  NewListingsQueryResponse,
  NewSaleListingsQueryResponse,
  SingleListingQueryResponse,
} from "@/utils/types/graphql";

export function useAllListingsQuery({ limit = 50 }: { limit?: number }) {
  return useQuery({
    queryKey: [queryKeys.listing.all],
    queryFn: async () => {
      const response = await request<AllListingsQueryResponse>(
        indexerEndpoint,
        allListingsQuery,
        { limit }
      );
      return response.allListings;
    },
    enabled: !!limit || limit === 0 || limit === 50,
    refetchInterval: 100000,
  });
}

export function useFilteredAllListingsQuery({
  contractAddress = "",
  address = "",
}: {
  contractAddress?: string;
  address?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.listing.all],
    queryFn: async () => {
      const response = await request<AllListingsQueryResponse>(
        indexerEndpoint,
        filteredAllListingsQuery,
        {
          contractAddress,
          address,
        }
      );
      return response.allListings;
    },
    enabled: !!address || !!contractAddress,
    refetchInterval: 100000,
  });
}

export function useSingleListingQuery({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) {
  return useQuery({
    queryKey: [queryKeys.listing.single],
    queryFn: async () => {
      const response = await request<SingleListingQueryResponse>(
        indexerEndpoint,
        singleListingQuery,
        { contractAddress, tokenId }
      );
      return response.allListings;
    },
    enabled: !!contractAddress || !!tokenId,
    refetchInterval: 5000,
  });
}

// export function useCompletedListingsQuery() {
//   return useQuery({
//     queryKey: [queryKeys.listing.completed],
//     queryFn: async () => {
//       const response = await request<CompletedListingsQueryResponse>(
//         indexerEndpoint,
//         completedListingsQuery
//       );
//       return response.completedListings;
//     },
//     refetchInterval: 100000,
//   });
// }

export function useFilteredCompletedListingsQuery({
  contractAddress = "",
  address = "",
}: {
  contractAddress?: string;
  address?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.listing.completed],
    queryFn: async () => {
      const response = await request<CompletedListingsQueryResponse>(
        indexerEndpoint,
        filteredCompletedListingsQuery,
        {
          contractAddress,
          address,
        }
      );
      return response.completedListings;
    },
    enabled: !!address || !!contractAddress,
    refetchInterval: 100000,
  });
}

export function useNewListingsQuery({ limit = 50 }: { limit?: number }) {
  return useQuery({
    queryKey: [queryKeys.listing.new],
    queryFn: async () => {
      const response = await request<NewListingsQueryResponse>(
        indexerEndpoint,
        newListingsQuery,
        { limit }
      );
      return response.newListings;
    },
    enabled: !!limit,
    refetchInterval: 100000,
  });
}

export function useFilteredNewListingsQuery({
  contractAddress = "",
  address = "",
}: {
  contractAddress?: string;
  address?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.listing.new],
    queryFn: async () => {
      const response = await request<NewListingsQueryResponse>(
        indexerEndpoint,
        filteredNewListingsQuery,
        {
          contractAddress,
          address,
        }
      );
      return response.newListings;
    },
    enabled: !!address || !!contractAddress,
    refetchInterval: 100000,
  });
}

export function useNewSaleListingsQuery({ limit = 50 }: { limit?: number }) {
  return useQuery({
    queryKey: [queryKeys.listing.newSale],
    queryFn: async () => {
      const response = await request<NewSaleListingsQueryResponse>(
        indexerEndpoint,
        newSaleListingsQuery,
        { limit }
      );
      return response.newSaleListings;
    },
    enabled: !!limit,
    refetchInterval: 100000,
  });
}

export function useFilteredNewSaleListingsQuery({
  contractAddress = "",
  address = "",
}: {
  contractAddress?: string;
  address?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.listing.newSale],
    queryFn: async () => {
      const response = await request<NewSaleListingsQueryResponse>(
        indexerEndpoint,
        filteredNewSaleListingsQuery,
        {
          contractAddress,
          address,
        }
      );
      return response.newSaleListings;
    },
    enabled: !!address || !!contractAddress,
    refetchInterval: 100000,
  });
}
