import { useQueries, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { getAllAuctions } from "@/modules/blockchain";
import { StatusType } from "@/utils/enums/messages/index.enum";
import { NFT as ThirdwebNFTType } from "thirdweb";
import { fetchNFT, formatAuctionData } from "../utils/index.utils.query";

type AuctionQueryType = "new-auction" | "live-auction" | "completed-auction";

// Base query to fetch and cache all auctions
export function useAllAuctionsBaseQuery() {
  return useQuery({
    queryKey: [queryKeys.auction.blockchain],
    queryFn: getAllAuctions,
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });
}

export function useAllAuctionsBlockchainQuery({
  limit = 50,
  type = "live-auction",
}: {
  limit?: number;
  type?: AuctionQueryType;
}) {
  const allAuctionsQuery = useAllAuctionsBaseQuery();

  return useQuery({
    queryKey: [queryKeys.auction.filtered, { type, limit }],
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
          default:
            return [];
        }
      })();

      // Format auctions in parallel
      const formattedData = await Promise.all(
        filteredAuctions.map(async (auction) => {
          //   const nft = await getNFT({
          //     contract,
          //     tokenId: auction.tokenId,
          //     includeOwner: true,
          //   });

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
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
  });
}
