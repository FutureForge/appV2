import { useQueries, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { getAllAuctions } from "@/modules/blockchain";
import { StatusType } from "@/utils/enums/messages/index.enum";
import { NFT as ThirdwebNFTType } from "thirdweb";
import {
  fetchNFT,
  formatAuctionData,
  formatListingData,
} from "../utils/index.utils.query";
import { getAllListing } from "@/modules/blockchain";

type ListingQueryType = "new-listing" | "live-listing" | "completed-listing";

export function useAllListingBaseQuery() {
  return useQuery({
    queryKey: [queryKeys.listing.blockchain],
    queryFn: getAllListing,
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });
}

export function useAllListingBlockchainQuery({
  limit = 50,
  type = "live-listing",
}: {
  limit?: number;
  type?: ListingQueryType;
}) {
  const allListingQuery = useAllListingBaseQuery();

  return useQuery({
    queryKey: [queryKeys.auction.filtered, { type, limit }],
    queryFn: async () => {
      if (!allListingQuery.data) return [];

      const filteredListing = (() => {
        const isCreated = (listing: any) =>
          listing.status === StatusType.CREATED;
        const isCompleted = (listing: any) =>
          listing.status === StatusType.COMPLETED;

        switch (type) {
          case "live-listing":
            return allListingQuery.data.filter(isCreated).slice(0, limit);
          case "completed-listing":
            return allListingQuery.data.filter(isCompleted).slice(0, limit);
          case "new-listing":
            return allListingQuery.data
              .filter(isCreated)
              .reverse()
              .slice(0, limit);
          default:
            return [];
        }
      })();

      console.log({ filteredListing });

      const formattedData = await Promise.all(
        filteredListing.map(async (listing) => {
          const nft = await fetchNFT({
            assetContract: listing.assetContract,
            tokenId: listing.tokenId,
          });

          return formatListingData(listing, nft);
        })
      );

      return formattedData;
    },
    enabled: !!allListingQuery.data && (!!limit || !!type),
    staleTime: 1000 * 60,
    refetchInterval: 5000,
  });
}
