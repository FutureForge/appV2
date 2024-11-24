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
import { formatBlockchainTimestamp, to3DP } from "@/utils/functions";
import { getNFT, isERC721 } from "thirdweb/extensions/erc721";
import { useMemo } from "react";
import {
  CollectionsQueryResponse,
  SingleCollection,
} from "@/utils/types/collection/collection.type";
import { NFTActivityResponse } from "@/utils/types/global";
import {
  AllAuctionsQueryResponse,
  AllListingsQueryResponse,
  AuctionClosedQueryResponse,
  NewSaleListingsQueryResponse,
} from "@/utils/types/graphql";
import request from "graphql-request";
import { indexerEndpoint } from "@/utils/graphql";
import {
  filteredAllListingsQuery,
  filteredNewSaleListingsQuery,
} from "@/utils/graphql/queries/listing.queries";
import {
  filteredAllAuctionsQuery,
  filteredAuctionClosedQuery,
} from "@/utils/graphql/queries/auction.queries";

export async function isNFTContract(contractAddress: string) {
  const contract = await getContractCustom({ contractAddress });
  const result = await isERC721({ contract });
  return result;
}

export function useCheckIfItsACollectionQuery({
  contractAddress,
}: {
  contractAddress: string;
}) {
  return useQuery({
    queryKey: [queryKeys.collection.checkContractIsACollection],
    queryFn: async () => {
      const response = await axios.get(
        `${CROSSFI_API_TESTNET}/contracts?contractAddress=${contractAddress}&page=1&limit=10&sort=-blockNumber`
      );
      const nftData = response.data.docs;

      const isCFC721 = nftData.some(
        (doc: { tokenType: string }) => doc.tokenType === "CFC-721"
      );

      return { isCFC721, nftData };
    },
    enabled: !!contractAddress,
    refetchInterval: 50000,
  });
}

export function useCheckCollectionExistsQuery({
  contractAddress,
}: {
  contractAddress: string;
}) {
  return useQuery({
    queryKey: [queryKeys.collection.checkCollectionExists],
    queryFn: async () => {
      const response = await axios.get(
        `${backendURL}/collection/check/${contractAddress}`
      );

      return response.data;
    },
    enabled: !!contractAddress,
    refetchInterval: 5000,
  });
}

export function useSingleCollectionWithoutNFTsQuery({
  contractAddress,
}: {
  contractAddress: string;
}) {
  return useQuery({
    queryKey: [queryKeys.collection.checkCollectionExists],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${backendURL}/collection/${contractAddress}/without-nfts`
        );

        return response.data;
      } catch (error) {}
    },
    enabled: !!contractAddress,
  });
}

async function getTotalVolumeAndFloorPrice({
  contractAddress,
}: {
  contractAddress: string;
}) {
  const [
    newSaleListingResponse,
    allListingsResponse,
    auctionClosedResponse,
    allAuctionsResponse,
  ] = await Promise.all([
    request<NewSaleListingsQueryResponse>(
      indexerEndpoint,
      filteredNewSaleListingsQuery,
      {
        contractAddress: contractAddress.toLowerCase(),
        address: "",
      }
    ),
    request<AllListingsQueryResponse>(
      indexerEndpoint,
      filteredAllListingsQuery,
      {
        contractAddress: contractAddress.toLowerCase(),
        address: "",
      }
    ),
    request<AuctionClosedQueryResponse>(
      indexerEndpoint,
      filteredAuctionClosedQuery,
      {
        contractAddress: contractAddress.toLowerCase(),
        address: "",
      }
    ),
    request<AllAuctionsQueryResponse>(
      indexerEndpoint,
      filteredAllAuctionsQuery,
      {
        contractAddress: contractAddress.toLowerCase(),
        address: "",
      }
    ),
  ]);

  const newSaleListings = newSaleListingResponse.newSaleListings;
  const allListings = allListingsResponse.allListings;
  const auctionClosed = auctionClosedResponse.auctionCloseds;
  const allAuctions = allAuctionsResponse.allAuctions;

  const updatedListings = allListings.filter((listing) => {
    const { endTimestamp } = listing;
    const endTime = formatBlockchainTimestamp(endTimestamp);
    const endTimeFormatted = new Date(endTime).getTime();
    const currentTime = new Date().getTime();

    // looking for active listings
    return endTimeFormatted > currentTime;
  });

  const updatedAllAuctions = allAuctions.filter((auction) => {
    const { endTimestamp } = auction;
    const endTime = formatBlockchainTimestamp(endTimestamp);
    const endTimeFormatted = new Date(endTime).getTime();
    const currentTime = new Date().getTime();

    // looking for active listings
    return endTimeFormatted > currentTime;
  });

  const totalListingVolume = newSaleListings?.reduce((acc, listing) => {
    const price = parseFloat(decimalOffChain(listing.totalPricePaid) || "0");
    return acc + price;
  }, 0);

  const totalAuctionVolume = auctionClosed?.reduce((acc, auction) => {
    const price = parseFloat(decimalOffChain(auction.bidAmount) || "0");
    return acc + price;
  }, 0);

  const totalVolume = (totalListingVolume ?? 0) + (totalAuctionVolume ?? 0);

  const formattedTotalVolume = to3DP(totalVolume || 0);

  const floorPrice = (() => {
    let floor = Infinity;

    for (const listing of updatedListings) {
      const price = decimalOffChain(listing.pricePerToken) || "0";
      const listingPrice = parseFloat(price);
      floor = Math.min(floor, listingPrice);
    }

    for (const auction of updatedAllAuctions) {
      const price = decimalOffChain(auction.minimumBidAmount) || "0";
      const auctionPrice = parseFloat(price);
      floor = Math.min(floor, auctionPrice);
    }

    return floor === Infinity ? 0 : floor;
  })();

  return {
    floorPrice: floorPrice,
    formattedTotalVolume: formattedTotalVolume,
  };
}

export function useAllCollectionsQuery({ limit = 10, page = 1 }) {
  return useQuery({
    queryKey: [queryKeys.collection.all],
    queryFn: async () => {
      const response = await axios.get<CollectionsQueryResponse>(
        `${backendURL}/collection?limit=${limit}&page=${page}`
      );

      for (const collection of response.data.collections) {
        try {
          const [collectionDetailsResponse] = await Promise.all([
            axios.get(
              `${CROSSFI_API_TESTNET}/tokens/${collection.collectionAddress}`
            ),
          ]);

          const holderCount = collectionDetailsResponse.data.holderCount;

          const { floorPrice, formattedTotalVolume } =
            await getTotalVolumeAndFloorPrice({
              contractAddress: collection.collectionAddress,
            });

          collection.floorPrice = floorPrice;
          collection.totalVolume = Number(formattedTotalVolume);
          collection.holderCount = holderCount;
        } catch (error) {}
      }

      return {
        collections: response.data.collections.reverse(),
        totalCount: response.data.totalCount,
      };
    },
    enabled: !!limit && !!page,
    // refetchInterval: 60000,
    staleTime: Infinity,
    gcTime: Infinity,
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

  // const totalListingVolume = newSaleListings?.reduce((acc, listing) => {
  //   const price = parseFloat(decimalOffChain(listing.totalPricePaid) || "0");
  //   return acc + price;
  // }, 0);

  // const totalAuctionVolume = auctionClosed?.reduce((acc, auction) => {
  //   const price = parseFloat(decimalOffChain(auction.bidAmount) || "0");
  //   return acc + price;
  // }, 0);

  // const totalVolume = (totalListingVolume ?? 0) + (totalAuctionVolume ?? 0);

  // const formattedTotalVolume = to3DP(totalVolume || 0);

  // const floorPrice = (() => {
  //   let floor = Infinity;

  //   // Check listing prices
  //   for (const listing of allListings || []) {
  //     const price = decimalOffChain(listing.pricePerToken) || "0";
  //     const listingPrice = parseFloat(price);
  //     floor = Math.min(floor, listingPrice);
  //   }

  //   // Check closed auction prices
  //   for (const auction of allAuctions || []) {
  //     const price = decimalOffChain(auction.minimumBidAmount) || "0";
  //     const auctionPrice = parseFloat(price);
  //     floor = Math.min(floor, auctionPrice);
  //   }

  //   return floor === Infinity ? 0 : floor;
  // })();

  return useQuery({
    queryKey: [queryKeys.collection.single, contractAddress],
    queryFn: async () => {
      const { floorPrice, formattedTotalVolume } =
        await getTotalVolumeAndFloorPrice({
          contractAddress: contractAddress,
        });

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

      const { collection, nftLength, nfts } = collectionResponse.data;
      const tokenTransfers = collectionTransfersResponse.data.docs;

      const updatedNFTs = nfts.filter((nft) => {
        return nft.owner !== undefined && nft.owner !== null;
      });

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
        totalNFTs: nftLength,
      };

      const updatedTokenTransfers = await Promise.all(
        tokenTransfers.map(async (transfer) => {
          try {
            const contract = getContractCustom({
              contractAddress: contractAddress,
            });

            const nft = await getNFT({
              contract,
              tokenId: BigInt(transfer.tokenId),
              includeOwner: true,
            });

            return {
              ...transfer,
              nft,
            };
          } catch (error) {
            return {
              ...transfer,
              nft: null,
            };
          }
        })
      );

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

      return {
        collection,
        collectionNFTs: updatedNFTs,
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
          auctionClosed: auctionClosed || [],
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
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
