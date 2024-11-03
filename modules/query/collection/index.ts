import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import axios from "axios";
import { backendURL, CROSSFI_API, MARKETPLACE_ADDRESS } from "@/utils/configs";
import { getPlatformFeeInfoCustom } from "@/modules/blockchain/global/global.blockchain";
import {
  useFilteredAllListingsQuery,
  useFilteredCompletedListingsQuery,
  useFilteredNewListingsQuery,
  useFilteredNewSaleListingsQuery,
  useFilteredAuctionClosedQuery,
  useFilteredNewAuctionsQuery,
  useFilteredAllAuctionsQuery,
  useFilteredCompletedAuctionsQuery,
  useFilteredNewOffersQuery,
  useFilteredAllOffersQuery,
  useFilteredCompletedOffersQuery,
  useFilteredAcceptedOffersQuery,
} from "..";
import { decimalOffChain, getContractCustom } from "@/modules/blockchain";
import { ensureSerializable, to3DP } from "@/utils/functions";
import { getNFT } from "thirdweb/extensions/erc721";

// syntax
export function useAllCollectionsQuery() {
  return useQuery({
    queryKey: [queryKeys.collection.all],
    queryFn: async () => {
      const response = await axios.get<CollectionsQueryResponse>(
        `${backendURL}/collection`
      );
      return response.data.collections;
    },
    refetchInterval: 10000,
  });
}

export function useSingleCollectionQuery({
  contractAddress,
}: {
  contractAddress: string;
}) {
  /**
   * GETTING COLLECTION LISTING DATA
   */
  const { data: newSaleListings } = useFilteredNewSaleListingsQuery({
    contractAddress,
  });

  //   const { data: completedListings } = useFilteredCompletedListingsQuery({
  //     contractAddress,
  //   });

  const { data: allListings } = useFilteredAllListingsQuery({
    contractAddress,
  });

  const { data: newListings } = useFilteredNewListingsQuery({
    contractAddress,
  });

  console.log({ newSaleListings, allListings, newListings });

  /**
   * GETTING COLLECTION AUCTION DATA
   */

  const { data: auctionClosed } = useFilteredAuctionClosedQuery({
    contractAddress,
  });

  const { data: newAuctions } = useFilteredNewAuctionsQuery({
    contractAddress,
  });

  const { data: allAuctions } = useFilteredAllAuctionsQuery({
    contractAddress,
  });

  //   const { data: completedAuctions } = useFilteredCompletedAuctionsQuery({
  //     contractAddress,
  //   });

  console.log({ auctionClosed, newAuctions, allAuctions });

  /**
   * GETTING COLLECTION OFFERS DATA
   */

  const { data: newOffers } = useFilteredNewOffersQuery({
    contractAddress,
  });

  const { data: completedOffers } = useFilteredCompletedOffersQuery({
    contractAddress,
  });

  const { data: allOffers } = useFilteredAllOffersQuery({
    contractAddress,
  });

  const { data: acceptedOffers } = useFilteredAcceptedOffersQuery({
    contractAddress,
  });

  console.log({ newOffers, completedOffers, allOffers, acceptedOffers });

  return useQuery({
    queryKey: [queryKeys.collection.single, contractAddress],
    queryFn: async () => {
      const response = await axios.get<SingleCollectionQueryResponse>(
        `${backendURL}/collection/${contractAddress}`
      );

      const collection = response.data;

      let collectionFee = {};
      let marketplaceFee = {};

      try {
        collectionFee = await getPlatformFeeInfoCustom({
          contractAddress: contractAddress,
        });
      } catch (error) {
        // console.log("error fetching collection fee", error);
      }

      try {
        marketplaceFee = await getPlatformFeeInfoCustom({
          contractAddress: MARKETPLACE_ADDRESS,
        });
      } catch (error) {
        // console.log("error fetching marketplace fee", error);
      }

      const tokenTransfersResponse = await axios.get<NFTActivityResponse>(
        `${CROSSFI_API}/token-transfers?contractAddress=${contractAddress}&tokenType=CFC-721&page=1&limit=20000&sort=-blockNumber`
      );
      const tokenTransfers = tokenTransfersResponse.data.docs;

      const updatedTokenTransfers = tokenTransfers.map((transfer) => {
        const contract = getContractCustom({
          contractAddress: contractAddress,
        });

        const nft = getNFT({
          contract,
          tokenId: BigInt(transfer.tokenId),
          includeOwner: true,
        });

        return {
          ...transfer,
          nft,
        };
      });

      const totalListingVolume = newSaleListings?.reduce((acc, listing) => {
        const price = parseFloat(
          decimalOffChain(listing.totalPricePaid) || "0"
        );
        return acc + price;
      }, 0);

      const formattedTotalVolume = to3DP(totalListingVolume || 0);

      let floorPrice = Infinity;
      for (const listing of allListings || []) {
        const price = decimalOffChain(listing.pricePerToken) || "0";
        const listingPrice = parseFloat(price);

        floorPrice = Math.min(floorPrice, listingPrice);
      }

      return {
        collection,
        newSaleListings,
        tokenTransfers: updatedTokenTransfers,
        totalVolume: formattedTotalVolume,
        floorPrice,
        marketplaceFee,
        collectionFee,
        collectionOffers: {
          newOffers,
          allOffers,
          acceptedOffers,
        },
        collectionAuctions: {
          auctionClosed,
          newAuctions,
          allAuctions,
        },
        collectionListings: {
          allListings,
          newListings,
          newSaleListings,
        },
      };
    },
    refetchInterval: 5000,
  });
}
