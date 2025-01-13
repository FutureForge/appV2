import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { StatusType } from "@/utils/enums/messages/index.enum";
import { fetchNFT, formatListingData } from "../utils/index.utils.query";
import { getAllListing } from "@/modules/blockchain";
import { useUserChainInfo } from "../user/user.query";
import { formatBlockchainTimestamp } from "@/utils/functions";

type ListingQueryType =
  | "new-listing"
  | "live-listing"
  | "completed-listing"
  | "live-listing-collection"
  | "completed-listing-collection";
type UserListingQueryType = "active-listing" | "expired-listing";

export function useAllListingBaseQuery() {
  return useQuery({
    queryKey: [queryKeys.listing.blockchain],
    queryFn: getAllListing,
    staleTime: 1000 * 60 * 30, // Consider data fresh for 1 minute
    gcTime: 1000 * 60 * 5 * 30, // Keep in cache for 5 minutes
  });
}

export function useAllListingBlockchainQuery({
  limit = 50,
  type = "live-listing",
  contractAddress,
}: {
  limit?: number;
  type?: ListingQueryType;
  contractAddress?: string;
}) {
  const allListingQuery = useAllListingBaseQuery();

//   console.log({ allListingQuery });

  return useQuery({
    queryKey: [queryKeys.listing.filtered, { type, limit, contractAddress }],
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

          case "live-listing-collection":
            return allListingQuery.data.filter((auction) => {
              return (
                auction.status === StatusType.CREATED &&
                auction.assetContract.toLowerCase() ===
                  contractAddress?.toLowerCase()
              );
            });

          case "completed-listing-collection":
            return allListingQuery.data.filter((auction) => {
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

      //   return formattedData.filter((data) => {
      //     return !data.isListingExpired;
      //   });
    },
    enabled: !!allListingQuery.data && (!!limit || !!type),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

export function useUserListingBlockchainQuery({
  limit = 50,
  type = "active-listing",
}: {
  limit?: number;
  type?: UserListingQueryType;
}) {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const allListingQuery = useAllListingBaseQuery();

  return useQuery({
    queryKey: [queryKeys.listing.userBlockchain, { type, limit }],
    queryFn: async () => {
      if (!allListingQuery.data) return [];

      const userListing = allListingQuery.data.filter((listing) => {
        return (
          listing.status === StatusType.CREATED &&
          listing.listingCreator.toLowerCase() === userAddress?.toLowerCase()
        );
      });

      const filteredListing = (() => {
        switch (type) {
          case "active-listing":
            return userListing
              .filter((listing) => {
                const endTime = formatBlockchainTimestamp(
                  listing.endTimestamp.toString()
                );
                const endTimeFormatted = new Date(endTime).getTime();
                const currentTime = new Date().getTime();

                const isNotExpired = currentTime <= endTimeFormatted;
                return isNotExpired;
              })
              .slice(0, limit);

          case "expired-listing":
            return userListing
              .filter((listing) => {
                const endTime = formatBlockchainTimestamp(
                  listing.endTimestamp.toString()
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
    enabled: !!allListingQuery.data && (!!limit || !!type) && !!userAddress,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}
