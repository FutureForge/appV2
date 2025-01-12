import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { StatusType } from "@/utils/enums/messages/index.enum";
import { fetchNFT, formatOfferData } from "../utils/index.utils.query";
import { getAllOffers } from "@/modules/blockchain";
import { formatBlockchainTimestamp } from "@/utils/functions";
import { useUserChainInfo } from "../user/user.query";

type OfferQueryType =
  | "new-offer"
  | "live-offer"
  | "completed-offer"
  | "live-offer-collection"
  | "completed-offer-collection";
type UserOfferQueryType = "active-offer" | "expired-offer";

export function useAllOffersBaseQuery() {
  return useQuery({
    queryKey: [queryKeys.offers.blockchain],
    queryFn: getAllOffers,
    staleTime: 1000 * 60 * 39, // Consider data fresh for 30 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });
}

export function useAllOffersBlockchainQuery({
  limit = 50,
  type = "live-offer",
  contractAddress,
}: {
  limit?: number;
  type?: OfferQueryType;
  contractAddress?: string;
}) {
  const allOfferQuery = useAllOffersBaseQuery();

  return useQuery({
    queryKey: [queryKeys.offers.filtered, { type, limit }],
    queryFn: async () => {
      if (!allOfferQuery.data) return [];

      const filteredOffer = (() => {
        const isCreated = (offer: any) => offer.status === StatusType.CREATED;
        const isCompleted = (offer: any) =>
          offer.status === StatusType.COMPLETED;

        switch (type) {
          case "live-offer":
            return allOfferQuery.data.filter(isCreated).slice(0, limit);

          case "completed-offer":
            return allOfferQuery.data.filter(isCompleted).slice(0, limit);

          case "new-offer":
            return allOfferQuery.data
              .filter(isCreated)
              .reverse()
              .slice(0, limit);

          case "live-offer-collection":
            return allOfferQuery.data.filter((auction) => {
              return (
                auction.status === StatusType.CREATED &&
                auction.assetContract.toLowerCase() ===
                  contractAddress?.toLowerCase()
              );
            });

          case "completed-offer-collection":
            return allOfferQuery.data.filter((auction) => {
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
        filteredOffer.map(async (offer) => {
          const nft = await fetchNFT({
            assetContract: offer.assetContract,
            tokenId: offer.tokenId,
          });
          return formatOfferData(offer, nft);
        })
      );

      return formattedData;

      //   return formattedData.filter((data) => {
      //     return !data.isOfferExpired;
      //   });
    },
    enabled: !!allOfferQuery.data && (!!limit || !!type),
    staleTime: 1000 * 60 * 30, // Data remains fresh for 30 minutes
    gcTime: 1000 * 60 * 30, // Cache is kept for 30 minutes
    refetchOnMount: true, // Refetch when component mounts if data is stale
    refetchOnWindowFocus: true, // Refetch when window regains focus if data is stale
  });
}

export function useUserOfferBlockchainQuery({
  limit = 50,
  type = "active-offer",
}: {
  limit?: number;
  type?: UserOfferQueryType;
}) {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const allOffersQuery = useAllOffersBaseQuery();

  return useQuery({
    queryKey: [queryKeys.offers.userBlockchain, { type, limit }],
    queryFn: async () => {
      if (!allOffersQuery.data) return [];

      const userOffer = allOffersQuery.data.filter((auction) => {
        return (
          auction.status === StatusType.CREATED &&
          auction.offeror.toLowerCase() === userAddress?.toLowerCase()
        );
      });

      const filteredAuction = (() => {
        switch (type) {
          case "active-offer":
            return userOffer
              .filter((auction) => {
                const endTime = formatBlockchainTimestamp(
                  auction.expirationTimestamp.toString()
                );
                const endTimeFormatted = new Date(endTime).getTime();
                const currentTime = new Date().getTime();

                const isNotExpired = currentTime <= endTimeFormatted;
                return isNotExpired;
              })
              .slice(0, limit);

          case "expired-offer":
            return userOffer
              .filter((auction) => {
                const endTime = formatBlockchainTimestamp(
                  auction.expirationTimestamp.toString()
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

          return formatOfferData(auction, nft);
        })
      );

      return formattedData;
    },
    enabled: !!allOffersQuery.data && (!!limit || !!type) && !!userAddress,
    staleTime: 1000 * 60 * 30, // Data remains fresh for 30 minutes
    gcTime: 1000 * 60 * 30, // Cache is kept for 30 minutes
    refetchOnMount: true, // Refetch when component mounts if data is stale
    refetchOnWindowFocus: true, // Refetch when window regains focus if data is stale
  });
}
