import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import {
  backendURL,
  CROSSFI_API_URL,
  MARKETPLACE_ADDRESS_TESTNET,
} from "@/utils/configs";
import { getPlatformFeeInfoCustom } from "@/modules/blockchain/global/global.blockchain";
import {
  decimalOffChain,
  getContractCustom,
  getIsAuctionExpired,
} from "@/modules/blockchain";
import { to3DP } from "@/utils/functions";
import { getNFT, isERC721 } from "thirdweb/extensions/erc721";
import {
  CollectionsQueryResponse,
  SingleCollection,
} from "@/utils/types/collection/collection.type";
import { NFTActivityResponse } from "@/utils/types/global";
import { useAllAuctionsBlockchainQuery } from "../auction/auction.blockchain.query";
import { useAllListingBlockchainQuery } from "../listing/listing.blockchain.query";
import { useAllOffersBlockchainQuery } from "../offers/offers.blockchain.query";
import { Auction, Listing } from "../utils/";

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
        `${CROSSFI_API_URL}/contracts?contractAddress=${contractAddress}&page=1&limit=10&sort=-blockNumber`
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

// function useCollectionVolumeData({
//   liveAuction = [],
//   completedAuction = [],
//   liveListing = [],
//   completedListing = [],
// }: {
//   liveAuction?: any[];
//   completedAuction?: any[];
//   liveListing?: any[];
//   completedListing?: any[];
// }) {
//   const totalListingVolume = completedListing.reduce((acc: number, listing) => {
//     const price = parseFloat(decimalOffChain(listing.pricePerToken) || "0");
//     return acc + price;
//   }, 0);

//   const totalAuctionVolume = completedAuction.reduce((acc, auction) => {
//     const price = parseFloat(
//       decimalOffChain(auction?.winningBid?.bidAmount!) || "0"
//     );
//     return acc + price;
//   }, 0);

//   const totalVolume = totalListingVolume + totalAuctionVolume;
//   const formattedTotalVolume = to3DP(totalVolume || 0);

//   const floorPrice = (() => {
//     let floor = Infinity;

//     for (const listing of liveListing) {
//       const price = decimalOffChain(listing.pricePerToken) || "0";
//       const listingPrice = parseFloat(price);
//       floor = Math.min(floor, listingPrice);
//     }

//     for (const auction of liveAuction) {
//       const price = decimalOffChain(auction.minimumBidAmount) || "0";
//       const auctionPrice = parseFloat(price);
//       floor = Math.min(floor, auctionPrice);
//     }

//     return floor === Infinity ? 0 : floor;
//   })();

//   return {
//     floorPrice: floorPrice,
//     formattedTotalVolume: Number(formattedTotalVolume),
//   };
// }

export function useAllCollectionsQuery({ limit = 10, page = 1 }) {
  return useQuery({
    queryKey: [queryKeys.collection.all, limit, page],
    queryFn: async () => {
      const response = await axios.get<CollectionsQueryResponse>(
        `${backendURL}/collection?limit=${limit}&page=${page}`
      );

      const updatedCollections = await Promise.all(
        response.data.collections.map(async (collection) => {
          try {
            const collectionDetailsResponse = await axios.get(
              `${CROSSFI_API_URL}/tokens/${collection.collectionAddress}`
            );

            const holderCount = collectionDetailsResponse.data.holderCount;

            return {
              ...collection,
              holderCount,
              floorPrice: 8,
              totalVolume: 8,
            };
          } catch (error) {
            console.log("all collection query", { error });
            return collection;
          }
        })
      );

      return {
        collections: updatedCollections.reverse(),
        totalCount: response.data.totalCount,
      };
    },
    enabled: !!limit && !!page,
    // refetchInterval: 5000,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

export function useSingleCollectionInfoQuery({
  contractAddress,
}: {
  contractAddress: string;
}) {
  return useQuery({
    queryKey: [queryKeys.collection.single, { contractAddress }, "info"],
    queryFn: async () => {
      const response = await axios.get<SingleCollection>(
        `${backendURL}/collection/${contractAddress}`
      );

      const { collection, nftLength, nfts } = response.data;

      const updatedNFTs = nfts.filter((nft) => {
        return nft.owner !== undefined && nft.owner !== null;
      });

      return {
        collection,
        collectionNFTs: updatedNFTs,
        totalNFTs: nftLength,
      };
    },
    enabled: !!contractAddress,
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
    gcTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
  });
}

export function useSingleCollectionQuery({
  contractAddress,
}: {
  contractAddress: string;
}) {
  const { data: liveAuction } = useAllAuctionsBlockchainQuery({
    type: "live-auction-collection",
    contractAddress,
  });

  const { data: completedAuction } = useAllAuctionsBlockchainQuery({
    type: "completed-auction-collection",
    contractAddress,
  });

  const { data: liveListing } = useAllListingBlockchainQuery({
    type: "live-listing-collection",
    contractAddress,
  });

  const { data: completedListing } = useAllListingBlockchainQuery({
    type: "completed-listing-collection",
    contractAddress,
  });

  const { data: liveOffer } = useAllOffersBlockchainQuery({
    type: "live-offer-collection",
    contractAddress,
  });

  const { data: completedOffer } = useAllOffersBlockchainQuery({
    type: "completed-offer-collection",
    contractAddress,
  });

  return useQuery({
    queryKey: [queryKeys.collection.single, { contractAddress }],
    queryFn: async () => {
      const [
        collectionTransfersResponse,
        collectionDetailsResponse,
        collectionFee,
        marketplaceFee,
      ] = await Promise.all([
        axios.get<NFTActivityResponse>(
          `${CROSSFI_API_URL}/token-transfers?contractAddress=${contractAddress}&tokenType=CFC-721&page=1&limit=20000&sort=-blockNumber`
        ),
        axios.get(`${CROSSFI_API_URL}/tokens/${contractAddress}`),
        getPlatformFeeInfoCustom({ contractAddress }).catch(() => ({})),
        getPlatformFeeInfoCustom({
          contractAddress: MARKETPLACE_ADDRESS_TESTNET,
        }).catch(() => ({})),
      ]);

      const tokenTransfers = collectionTransfersResponse.data.docs;

      const totalSupply = collectionDetailsResponse.data.totalSupply;
      const listedNFTs = liveListing?.length;
      const auctionedNFTs = liveAuction?.length;
      const percentageOfListed = ((listedNFTs ?? 0) / totalSupply) * 100;
      const percentageOfAuctioned = ((auctionedNFTs ?? 0) / totalSupply) * 100;

      const collectionDetails = {
        listedNFTs,
        auctionedNFTs,
        percentageOfListed,
        percentageOfAuctioned,
        holderCount: collectionDetailsResponse.data.holderCount,
        totalVolume: 1000,
        totalSupply,
        floorPrice: 5,
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

      return {
        tokenTransfers: updatedTokenTransfers,
        marketplaceFee,
        collectionDetails,
        collectionFee,
        collectionOffers: {
          allOffers: liveOffer,
          completedOffer: completedOffer,
        },
        collectionAuctions: {
          completedAuction,
          allAuctions: liveAuction,
        },
        collectionListings: {
          allListings: liveListing,
          completedListing,
        },
      };
    },
    enabled: !!contractAddress,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

export function usePromotedCollectionsQuery() {
  return useQuery({
    queryKey: [queryKeys.collection.promoted],
    queryFn: async () => {
      const response = await axios.get<CollectionsQueryResponse>(
        `${backendURL}/collection/promoted/collections`
      );

      const promotedCollections = response.data.collections;

      return promotedCollections;
    },
    // refetchInterval: 60000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
