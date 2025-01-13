import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { getAllAuctions } from "@/modules/blockchain";
import { StatusType } from "@/utils/enums/messages/index.enum";
import { fetchNFT, formatAuctionData } from "../utils/index.utils.query";
import { formatBlockchainTimestamp } from "@/utils/functions";
import { useUserChainInfo } from "../user/user.query";

type AuctionQueryType =
  | "new-auction"
  | "live-auction"
  | "completed-auction"
  | "live-auction-collection"
  | "completed-auction-collection";
type UserAuctionQueryType = "active-auction" | "expired-auction";

// Base query to fetch and cache all auctions
export function useAllAuctionsBaseQuery() {
  return useQuery({
    queryKey: [queryKeys.auction.blockchain],
    queryFn: getAllAuctions,
    staleTime: 1000 * 60 * 30, // Consider data fresh for 1 minute
    gcTime: 1000 * 60 * 5 * 30, // Keep in cache for 5 minutes
  });
}

export function useAllAuctionsBlockchainQuery({
  limit = 50,
  type = "live-auction",
  contractAddress,
}: {
  limit?: number;
  type?: AuctionQueryType;
  contractAddress?: string;
}) {
  const allAuctionsQuery = useAllAuctionsBaseQuery();

  return useQuery({
    queryKey: [queryKeys.auction.filtered, { type, limit, contractAddress }],
    queryFn: async () => {
      if (!allAuctionsQuery.data) return [];

      // Filter auctions based on type
      const filteredAuctions = (() => {
        const isCreated = (auction: any) =>
          auction.status === StatusType.CREATED;
        const isCompleted = (auction: any) =>
          auction.status === StatusType.COMPLETED;

        switch (type) {
          case "live-auction":
            return allAuctionsQuery.data.filter(isCreated).slice(0, limit);

          case "completed-auction":
            return allAuctionsQuery.data.filter(isCompleted).slice(0, limit);

          case "new-auction":
            return allAuctionsQuery.data
              .filter(isCreated)
              .reverse()
              .slice(0, limit);

          case "live-auction-collection":
            return allAuctionsQuery.data.filter((auction) => {
              return (
                auction.status === StatusType.CREATED &&
                auction.assetContract.toLowerCase() ===
                  contractAddress?.toLowerCase()
              );
            });

          case "completed-auction-collection":
            return allAuctionsQuery.data.filter((auction) => {
              return (
                auction.status === StatusType.COMPLETED &&
                auction.assetContract.toLowerCase() ===
                  contractAddress?.toLowerCase()
              );
            });

          default:
            return [];
        }
      })();

      // Format auctions in parallel
      const formattedData = await Promise.all(
        filteredAuctions.map(async (auction) => {
          const nft = await fetchNFT({
            assetContract: auction.assetContract,
            tokenId: auction.tokenId,
          });

          return formatAuctionData(auction, nft);
        })
      );

      return formattedData;

      //   return formattedData.filter((data) => {
      //     return !data.isAuctionExpired;
      //   });
    },
    enabled: !!allAuctionsQuery.data && (!!limit || !!type),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

export function useUserAuctionBlockchainQuery({
  limit = 50,
  type = "active-auction",
}: {
  limit?: number;
  type?: UserAuctionQueryType;
}) {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const allAuctionsQuery = useAllAuctionsBaseQuery();

  return useQuery({
    queryKey: [queryKeys.auction.userBlockchain, { type, limit }],
    queryFn: async () => {
      if (!allAuctionsQuery.data) return [];

      const userAuction = allAuctionsQuery.data.filter((auction) => {
        return (
          auction.status === StatusType.CREATED &&
          auction.auctionCreator.toLowerCase() === userAddress?.toLowerCase()
        );
      });

      const filteredAuction = (() => {
        switch (type) {
          case "active-auction":
            return userAuction
              .filter((auction) => {
                const endTime = formatBlockchainTimestamp(
                  auction.endTimestamp.toString()
                );
                const endTimeFormatted = new Date(endTime).getTime();
                const currentTime = new Date().getTime();

                const isNotExpired = currentTime <= endTimeFormatted;
                return isNotExpired;
              })
              .slice(0, limit);

          case "expired-auction":
            return userAuction
              .filter((auction) => {
                const endTime = formatBlockchainTimestamp(
                  auction.endTimestamp.toString()
                );
                const endTimeFormatted = new Date(endTime).getTime();
                const currentTime = new Date().getTime();

                const isExpired = currentTime > endTimeFormatted;
                return isExpired;
              })
              .slice(0, limit);
          default:
            return [];
        }
      })();

      const formattedData = await Promise.all(
        filteredAuction.map(async (auction) => {
          const nft = await fetchNFT({
            assetContract: auction.assetContract,
            tokenId: auction.tokenId,
          });

          return formatAuctionData(auction, nft);
        })
      );

      return formattedData;
    },
    enabled: !!allAuctionsQuery.data && (!!limit || !!type) && !!userAddress,
    staleTime: 1000 * 60 * 30, // Data remains fresh for 30 minutes
    gcTime: 1000 * 60 * 30, // Cache is kept for 30 minutes
    refetchOnMount: true, // Refetch when component mounts if data is stale
    refetchOnWindowFocus: true, // Refetch when window regains focus if data is stale
  });
}
