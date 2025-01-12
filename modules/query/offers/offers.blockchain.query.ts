import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { StatusType } from "@/utils/enums/messages/index.enum";
import { fetchNFT, formatOfferData } from "../utils/index.utils.query";
import { getAllOffers } from "@/modules/blockchain";

type OfferQueryType = "new-offer" | "live-offer" | "completed-offer";

export function useAllOffersBaseQuery() {
  return useQuery({
    queryKey: [queryKeys.offers.blockchain],
    queryFn: getAllOffers,
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });
}

export function useAllOffersBlockchainQuery({
  limit = 50,
  type = "live-offer",
}: {
  limit?: number;
  type?: OfferQueryType;
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
    staleTime: 1000 * 60,
    refetchInterval: 5000,
  });
}
