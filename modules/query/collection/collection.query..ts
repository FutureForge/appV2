import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import {
  backendURL,
  CROSSFI_API_TESTNET,
  MARKETPLACE_ADDRESS_TESTNET,
} from "@/utils/configs";
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
import {
  decimalOffChain,
  getContractCustom,
  getIsAuctionExpired,
} from "@/modules/blockchain";
import { to3DP } from "@/utils/functions";
import { getNFT } from "thirdweb/extensions/erc721";
import { useMemo } from "react";
import {
  CollectionsQueryResponse,
  SingleCollection,
} from "@/utils/types/collection/collection.type";
import { NFTActivityResponse } from "@/utils/types/global";
import {
  AllListingsQueryResponse,
  NewSaleListingsQueryResponse,
} from "@/utils/types/graphql";
import request from "graphql-request";
import { indexerEndpoint } from "@/utils/graphql";
import {
  filteredAllListingsQuery,
  filteredNewSaleListingsQuery,
} from "@/utils/graphql/queries/listing.queries";

// syntax
export function useAllCollectionsQuery() {
  return useQuery({
    queryKey: [queryKeys.collection.all],
    queryFn: async () => {
      const response = await axios.get<CollectionsQueryResponse>(
        `${backendURL}/collection`
      );

      for (const collection of response.data.collections) {
        try {
          const [newListingResponse, allListingsResponse] = await Promise.all([
            request<NewSaleListingsQueryResponse>(
              indexerEndpoint,
              filteredNewSaleListingsQuery,
              {
                contractAddress: collection.collectionAddress.toLowerCase(),
                address: "",
              }
            ),
            request<AllListingsQueryResponse>(
              indexerEndpoint,
              filteredAllListingsQuery,
              {
                contractAddress: collection.collectionAddress.toLowerCase(),
                address: "",
              }
            ),
          ]);

          const newSaleListings = newListingResponse.newSaleListings;
          const allListings = allListingsResponse.allListings;

          const totalListingVolume =
            newSaleListings?.reduce((acc, listing) => {
              const price = parseFloat(
                decimalOffChain(listing.totalPricePaid) || "0"
              );
              return acc + price;
            }, 0) ?? 0;

          const formattedTotalVolume = to3DP(totalListingVolume || 0);

          const floorPrice = (() => {
            let floor = 0;
            for (const listing of allListings || []) {
              const price = decimalOffChain(listing.pricePerToken) || "0";
              const listingPrice = parseFloat(price);
              floor = Math.min(floor, listingPrice);
            }
            return floor;
          })();

          collection.floorPrice = floorPrice;
          collection.totalVolume = Number(formattedTotalVolume);
        } catch (error) {}
      }

      return response.data.collections;
    },
    refetchInterval: 5000,
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
  const { data: newSaleListings, isLoading: isLoadingNewSaleListings } =
    useFilteredNewSaleListingsQuery({
      contractAddress,
    });

  const { data: allListings, isLoading: isLoadingAllListings } =
    useFilteredAllListingsQuery({
      contractAddress,
    });

  const { data: newListings, isLoading: isLoadingNewListings } =
    useFilteredNewListingsQuery({
      contractAddress,
    });

  const { data: completedListings, isLoading: isLoadingCompletedListings } =
    useFilteredCompletedListingsQuery({
      contractAddress,
    });

  /**
   * GETTING COLLECTION AUCTION DATA
   */

  const { data: auctionClosed, isLoading: isLoadingAuctionClosed } =
    useFilteredAuctionClosedQuery({
      contractAddress,
    });

  const { data: newAuctions, isLoading: isLoadingNewAuctions } =
    useFilteredNewAuctionsQuery({
      contractAddress,
    });

  const { data: allAuctions, isLoading: isLoadingAllAuctions } =
    useFilteredAllAuctionsQuery({
      contractAddress,
    });

  /**
   * GETTING COLLECTION OFFERS DATA
   */

  const { data: newOffers, isLoading: isLoadingNewOffers } =
    useFilteredNewOffersQuery({
      contractAddress,
    });

  const { data: allOffers, isLoading: isLoadingAllOffers } =
    useFilteredAllOffersQuery({
      contractAddress,
    });

  const { data: acceptedOffers, isLoading: isLoadingAcceptedOffers } =
    useFilteredAcceptedOffersQuery({
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
        collectionTransfersResponse,
        collectionDetailsResponse,
        collectionFee,
        marketplaceFee,
      ] = await Promise.all([
        axios.get<SingleCollection>(
          `${backendURL}/collection/${contractAddress}`
        ),
        axios.get<NFTActivityResponse>(
          `${CROSSFI_API_TESTNET}/token-transfers?contractAddress=${contractAddress}&tokenType=CFC-721&page=1&limit=20000&sort=-blockNumber`
        ),
        axios.get(`${CROSSFI_API_TESTNET}/tokens/${contractAddress}`),
        getPlatformFeeInfoCustom({ contractAddress }).catch(() => ({})),
        getPlatformFeeInfoCustom({
          contractAddress: MARKETPLACE_ADDRESS_TESTNET,
        }).catch(() => ({})),
      ]);

      const { collection, nftLength } = collectionResponse.data;
      const tokenTransfers = collectionTransfersResponse.data.docs;

      const totalSupply = collectionDetailsResponse.data.totalSupply;
      const listedNFTs = allListings?.length;
      const auctionedNFTs = allAuctions?.length;
      const percentageOfListed = ((listedNFTs ?? 0) / totalSupply) * 100;
      const percentageOfAuctioned = ((auctionedNFTs ?? 0) / totalSupply) * 100;

      const collectionDetails = {
        listedNFTs,
        auctionedNFTs,
        percentageOfListed,
        percentageOfAuctioned,
        holderCount: collectionDetailsResponse.data.holderCount,
        totalVolume: formattedTotalVolume,
        totalSupply,
        floorPrice,
      };

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

      const updatedAllAuctions = await Promise.all(
        (allAuctions ?? []).map(async (auction) => {
          const isExpired = await getIsAuctionExpired({
            auctionId: BigInt(auction.auctionId),
          });

          // Inverting the result to correct the naming mismatch
          const isAuctionExpired = !isExpired;

          return { ...auction, isAuctionExpired };
        })
      );

      const updatedNewAuctions = await Promise.all(
        (newAuctions ?? []).map(async (auction) => {
          const isExpired = await getIsAuctionExpired({
            auctionId: BigInt(auction.auctionId),
          });

          // Inverting the result to correct the naming mismatch
          const isAuctionExpired = !isExpired;

          return { ...auction, isAuctionExpired };
        })
      );

      const updatedAuctionClosed = await Promise.all(
        (auctionClosed ?? []).map(async (auction) => {
          const isExpired = await getIsAuctionExpired({
            auctionId: BigInt(auction.auctionId),
          });

          // Inverting the result to correct the naming mismatch
          const isAuctionExpired = !isExpired;

          return { ...auction, isAuctionExpired };
        })
      );

      return {
        collection,
        tokenTransfers: updatedTokenTransfers,
        marketplaceFee,
        collectionDetails,
        collectionFee,
        collectionOffers: {
          newOffers: newOffers || [],
          allOffers: allOffers || [],
          acceptedOffers: acceptedOffers || [],
        },
        collectionAuctions: {
          auctionClosed: updatedAuctionClosed || [],
          newAuctions: updatedNewAuctions || [],
          allAuctions: updatedAllAuctions || [],
        },
        collectionListings: {
          allListings: allListings || [],
          newListings: newListings || [],
          newSaleListings: newSaleListings?.slice(0, 20) || [],
          completedListings: completedListings || [],
        },
      };
    },
    enabled:
      !!contractAddress &&
      !isLoadingNewSaleListings &&
      !isLoadingAllListings &&
      !isLoadingNewListings &&
      !isLoadingAuctionClosed &&
      !isLoadingNewAuctions &&
      !isLoadingAllAuctions &&
      !isLoadingNewOffers &&
      !isLoadingAllOffers &&
      !isLoadingAcceptedOffers,
    // enabled:
    //   !!contractAddress &&
    //   (!!isLoadingNewSaleListings ||
    //     !!isLoadingAllListings ||
    //     !!isLoadingNewListings ||
    //     !!isLoadingAuctionClosed ||
    //     !!isLoadingNewAuctions ||
    //     !!isLoadingAllAuctions ||
    //     !!isLoadingNewOffers ||
    //     !!isLoadingAllOffers ||
    //     !!isLoadingAcceptedOffers),
    refetchInterval: 5000,
  });
}
