import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { backendURL, CROSSFI_API_TESTNET, MARKETPLACE_ADDRESS } from "@/utils/configs";
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
import { useMemo } from "react";
import { CollectionsQueryResponse, SingleCollectionQueryResponse } from "@/utils/types/collection";
import { NFTActivityResponse } from "@/utils/types/global";

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

  const { data: allListings } = useFilteredAllListingsQuery({
    contractAddress,
  });

  const { data: newListings } = useFilteredNewListingsQuery({
    contractAddress,
  });

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

  /**
   * GETTING COLLECTION OFFERS DATA
   */

  const { data: newOffers } = useFilteredNewOffersQuery({
    contractAddress,
  });

  const { data: allOffers } = useFilteredAllOffersQuery({
    contractAddress,
  });

  const { data: acceptedOffers } = useFilteredAcceptedOffersQuery({
    contractAddress,
  });

  const totalListingVolume = useMemo(() => {
    return newSaleListings?.reduce((acc, listing) => {
      const price = parseFloat(decimalOffChain(listing.totalPricePaid) || "0");
      return acc + price;
    }, 0);
  }, [newSaleListings]);

  const formattedTotalVolume = useMemo(
    () => to3DP(totalListingVolume || 0),
    [totalListingVolume]
  );

  const floorPrice = useMemo(() => {
    let floor = Infinity;
    for (const listing of allListings || []) {
      const price = decimalOffChain(listing.pricePerToken) || "0";
      const listingPrice = parseFloat(price);
      floor = Math.min(floor, listingPrice);
    }
    return floor;
  }, [allListings]);

  return useQuery({
    queryKey: [queryKeys.collection.single, contractAddress],
    queryFn: async () => {
      const [
        collectionResponse,
        tokenTransfersResponse,
        collectionFee,
        marketplaceFee,
      ] = await Promise.all([
        axios.get<SingleCollectionQueryResponse>(
          `${backendURL}/collection/${contractAddress}`
        ),
        axios.get<NFTActivityResponse>(
          `${CROSSFI_API_TESTNET}/token-transfers?contractAddress=${contractAddress}&tokenType=CFC-721&page=1&limit=20000&sort=-blockNumber`
        ),
        getPlatformFeeInfoCustom({ contractAddress }).catch(() => ({})),
        getPlatformFeeInfoCustom({
          contractAddress: MARKETPLACE_ADDRESS,
        }).catch(() => ({})),
      ]);

      const collection = collectionResponse.data;
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

      return {
        collection,
        newSaleListings,
        tokenTransfers: updatedTokenTransfers,
        totalVolume: formattedTotalVolume,
        floorPrice,
        marketplaceFee,
        collectionFee,
        collectionOffers: {
          newOffers: newOffers || [],
          allOffers: allOffers || [],
          acceptedOffers: acceptedOffers || [],
        },
        collectionAuctions: {
          auctionClosed: auctionClosed || [],
          newAuctions: newAuctions || [],
          allAuctions: allAuctions || [],
        },
        collectionListings: {
          allListings: allListings || [],
          newListings: newListings || [],
          newSaleListings: newSaleListings || [],
        },
      };
    },
    refetchInterval: 50000000,
  });
}
