import request from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { indexerEndpoint } from "@/utils/graphql";
import { queryKeys } from "../query-keys";
import {
  allAuctionsQuery,
  auctionClosedQuery,
  completedAuctionsQuery,
  filteredAllAuctionsQuery,
  filteredAuctionClosedQuery,
  filteredAuctionPayoutClaimedQuery,
  filteredAuctionPendingPayoutQuery,
  filteredCompletedAuctionsQuery,
  filteredNewAuctionsQuery,
  filteredUserNewBidsQuery,
  newAuctionsQuery,
  newBidsQuery,
  singleAuctionQuery,
} from "@/utils/graphql/queries/auction.queries";
import {
  AllAuctionsQueryResponse,
  AuctionClosedQueryResponse,
  CompletedAuctionsQueryResponse,
  NewAuctionsQueryResponse,
  NewBidsQueryResponse,
  NewBidsUserQueryResponse,
  SingleAuctionQueryResponse,
} from "@/utils/types/graphql";
import { formatBlockchainTimestamp } from "@/utils/functions";

export function useAllAuctionsQuery({ limit = 50 }: { limit?: number }) {
  return useQuery({
    queryKey: [queryKeys.auction.all],
    queryFn: async () => {
      const response = await request<AllAuctionsQueryResponse>(
        indexerEndpoint,
        allAuctionsQuery,
        { limit }
      );

      // const updatedAuctions = response.allAuctions.filter((auction) => {
      //   const { endTimestamp } = auction;
      //   const endTime = formatBlockchainTimestamp(endTimestamp);
      //   const endTimeFormatted = new Date(endTime).getTime();
      //   const currentTime = new Date().getTime();

      //   return endTimeFormatted > currentTime;
      // });

      // return updatedAuctions;

      return response.allAuctions;
    },
    enabled: !!limit,
    // refetchInterval: 60 * 60 * 1000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useFilteredAllAuctionsQuery({
  contractAddress = "",
  address = "",
}: {
  contractAddress?: string;
  address?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.auction.filteredAll],
    queryFn: async () => {
      const response = await request<AllAuctionsQueryResponse>(
        indexerEndpoint,
        filteredAllAuctionsQuery,
        {
          contractAddress,
          address,
        }
      );

      const updatedAuctions = response.allAuctions.filter((auction) => {
        const { endTimestamp } = auction;
        const endTime = formatBlockchainTimestamp(endTimestamp);
        const endTimeFormatted = new Date(endTime).getTime();
        const currentTime = new Date().getTime();

        return endTimeFormatted > currentTime;
      });

      return updatedAuctions;
    },
    enabled: !!address || !!contractAddress,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useSingleAuctionQuery({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) {
  return useQuery({
    queryKey: [queryKeys.auction.single],
    queryFn: async () => {
      const response = await request<SingleAuctionQueryResponse>(
        indexerEndpoint,
        singleAuctionQuery,
        {
          contractAddress,
          tokenId,
        }
      );

      const updatedAuction = response.allAuctions.filter((auction) => {
        const { endTimestamp } = auction;
        const endTime = formatBlockchainTimestamp(endTimestamp);
        const endTimeFormatted = new Date(endTime).getTime();
        const currentTime = new Date().getTime();

        // looking for active listings
        return { ...auction, expired: endTimeFormatted < currentTime };
      });

      return updatedAuction;
    },
    enabled: !!contractAddress || !!tokenId,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
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

export function useFilteredCompletedAuctionsQuery({
  contractAddress = "",
  address = "",
}: {
  contractAddress?: string;
  address?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.auction.completed],
    queryFn: async () => {
      const response = await request<CompletedAuctionsQueryResponse>(
        indexerEndpoint,
        filteredCompletedAuctionsQuery,
        {
          contractAddress,
          address,
        }
      );
      return response.completedAuctions;
    },
    enabled: !!address || !!contractAddress,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useNewAuctionsQuery({ limit = 50 }: { limit?: number }) {
  return useQuery({
    queryKey: [queryKeys.auction.new],
    queryFn: async () => {
      const response = await request<NewAuctionsQueryResponse>(
        indexerEndpoint,
        newAuctionsQuery,
        { limit }
      );
      return response.newAuctions;
    },
    enabled: !!limit,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useFilteredNewAuctionsQuery({
  contractAddress = "",
  address = "",
}: {
  contractAddress?: string;
  address?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.auction.filteredNew],
    queryFn: async () => {
      const response = await request<NewAuctionsQueryResponse>(
        indexerEndpoint,
        filteredNewAuctionsQuery,
        {
          contractAddress,
          address,
        }
      );
      return response.newAuctions;
    },
    enabled: !!address || !!contractAddress,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useAuctionClosedQuery({ limit = 50 }: { limit?: number }) {
  return useQuery({
    queryKey: [queryKeys.auction.closed],
    queryFn: async () => {
      const response = await request<AuctionClosedQueryResponse>(
        indexerEndpoint,
        auctionClosedQuery,
        { limit }
      );

      return response.auctionCloseds;
    },
    enabled: !!limit,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useFilteredAuctionClosedQuery({
  contractAddress = "",
  address = "",
}: {
  contractAddress?: string;
  address?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.auction.filteredClosed],
    queryFn: async () => {
      const response = await request<AuctionClosedQueryResponse>(
        indexerEndpoint,
        filteredAuctionClosedQuery,
        {
          contractAddress,
          address,
        }
      );

      return response.auctionCloseds;
    },
    enabled: !!address || !!contractAddress,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useFilteredAuctionPendingPayoutQuery({
  contractAddress = "",
  tokenId = "",
}: {
  contractAddress?: string;
  tokenId?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.auction.pendingPayout],
    queryFn: async () => {
      const response = await request<AuctionClosedQueryResponse>(
        indexerEndpoint,
        filteredAuctionPendingPayoutQuery,
        {
          contractAddress,
          tokenId,
        }
      );

      return response.auctionCloseds;
    },
    enabled: !!tokenId || !!contractAddress,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useFilteredAuctionPayoutClaimedQuery({
  contractAddress = "",
  tokenId = "",
}: {
  contractAddress?: string;
  tokenId?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.auction.payoutClaimed],
    queryFn: async () => {
      const response = await request<AuctionClosedQueryResponse>(
        indexerEndpoint,
        filteredAuctionPayoutClaimedQuery,
        {
          contractAddress,
          tokenId,
        }
      );

      return response.auctionCloseds;
    },
    enabled: !!tokenId || !!contractAddress,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useNewBidsQuery({ limit = 50 }: { limit?: number }) {
  return useQuery({
    queryKey: [queryKeys.auction.newBids],
    queryFn: async () => {
      const response = await request<NewBidsQueryResponse>(
        indexerEndpoint,
        newBidsQuery,
        { limit }
      );

      return response.newBids;
    },
    enabled: !!limit,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useFilteredUserNewBidsQuery({
  address = "",
}: {
  address?: string;
}) {
  return useQuery({
    queryKey: [queryKeys.auction.newBidsUser],
    queryFn: async () => {
      const response = await request<NewBidsUserQueryResponse>(
        indexerEndpoint,
        filteredUserNewBidsQuery,
        {
          address,
        }
      );

      return response.newBids;
    },
    enabled: !!address,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
