import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import {
  backendURL,
  EXPLORER_API_URL,
  MARKETPLACE_ADDRESS_TESTNET,
} from "@/utils/configs";
import { getPlatformFeeInfoCustom } from "@/modules/blockchain/global/global.blockchain";
import { getContractCustom } from "@/modules/blockchain";
import {
  getNFT,
  getNFTs,
  isERC721,
  totalSupply,
} from "thirdweb/extensions/erc721";
import { Collection } from "@/utils/types/collection/collection.type";
import { NFTActivityResponse } from "@/utils/types/global";
import { useAllAuctionsBlockchainQuery } from "../auction/auction.blockchain.query";
import { useAllListingBlockchainQuery } from "../listing/listing.blockchain.query";
import { useAllOffersBlockchainQuery } from "../offers/offers.blockchain.query";
import ERC721Abi from "@/utils/abi/erc721.json";

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
        `${EXPLORER_API_URL}/contracts?contractAddress=${contractAddress}&page=1&limit=10&sort=-blockNumber`
      );
      const nftData = response.data.docs;

      const isCFC721 = nftData.some(
        (doc: { tokenType: string }) => doc.tokenType === "CFC-721"
      );

      return { isCFC721, nftData };
    },
    enabled: !!contractAddress,
    refetchInterval: 5000,
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

export function useAllCollectionsQuery({ limit = 10, page = 1 }) {
  return useQuery({
    queryKey: [queryKeys.collection.all, limit, page],
    queryFn: async () => {
      const response = await axios.get(
        `${backendURL}/collection?limit=${limit}&page=${page}`
      );

      return {
        collections: response.data.collections as Collection[],
        totalCount: response.data.total,
      };
    },
    enabled: !!limit && !!page,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
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
      const response = await axios.get(
        `${backendURL}/collection/${contractAddress}?withoutNFT=true`
      );

      const collection = response.data.collection as Collection;

      const contract = getContractCustom({
        contractAddress,
        abi: ERC721Abi,
      });

      const nfts = await getNFTs({
        contract,
        includeOwners: true,
        useIndexer: false,
      });

      const collectionNFTs = nfts.map((nft) => ({
        contractAddress,
        tokenId: nft.id.toString(),
        ownerAddress: nft.owner,
        metadata: {
          ...nft.metadata,
          name: nft.metadata.name ?? "",
          image: nft.metadata.image ?? "",
        },
      }));

      return {
        collection,
        collectionNFTs,
        totalNFTs: nfts.length,
      };
    },
    enabled: !!contractAddress,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function useSingleCollectionStatsQuery({
  contractAddress,
}: {
  contractAddress: string;
}) {
  const { data: liveAuction, isLoading: isLoadingLiveAuction } =
    useAllAuctionsBlockchainQuery({
      type: "live-auction-collection",
      contractAddress,
    });

  const { data: completedAuction, isLoading: isLoadingCompletedAuction } =
    useAllAuctionsBlockchainQuery({
      type: "completed-auction-collection",
      contractAddress,
    });

  const { data: liveListing, isLoading: isLoadingLiveListing } =
    useAllListingBlockchainQuery({
      type: "live-listing-collection",
      contractAddress,
    });

  const { data: completedListing, isLoading: isLoadingCompletedListing } =
    useAllListingBlockchainQuery({
      type: "completed-listing-collection",
      contractAddress,
    });

  const { data: liveOffer, isLoading: isLoadingLiveOffer } =
    useAllOffersBlockchainQuery({
      type: "live-offer-collection",
      contractAddress,
    });

  const { data: completedOffer, isLoading: isLoadingCompletedOffer } =
    useAllOffersBlockchainQuery({
      type: "completed-offer-collection",
      contractAddress,
    });

  return useQuery({
    queryKey: [queryKeys.collection.single, { contractAddress }],
    queryFn: async () => {
      try {
        const contract = getContractCustom({
          contractAddress,
          abi: ERC721Abi,
        });

        const [
          collectionTransfersResponse,
          collectionDetailsResponse,
          collectionFee,
          marketplaceFee,
        ] = await Promise.all([
          axios.get<NFTActivityResponse>(
            `${EXPLORER_API_URL}/token-transfers?contractAddress=${contractAddress}&tokenType=CFC-721&page=1&limit=20000&sort=-blockNumber`
          ),
          axios.get(`${EXPLORER_API_URL}/tokens/${contractAddress}`),
          getPlatformFeeInfoCustom({ contractAddress }).catch(() => ({})),
          getPlatformFeeInfoCustom({
            contractAddress: MARKETPLACE_ADDRESS_TESTNET,
          }).catch(() => ({})),
        ]);

        const tokenTransfers = collectionTransfersResponse.data.docs;
        const listedNFTs = liveListing?.length || 0;

        const auctionedNFTs = liveAuction?.length || 0;
        const totalSupplyResult = await totalSupply({
          contract,
        });
        const percentageOfListed =
          Number(totalSupplyResult) > 0
            ? (listedNFTs / Number(totalSupplyResult)) * 100
            : 0;
        const percentageOfAuctioned =
          Number(totalSupplyResult) > 0
            ? (auctionedNFTs / Number(totalSupplyResult)) * 100
            : 0;

        const totalListingVolume = completedListing?.reduce(
          (acc: number, listing) => {
            const price = listing.pricePerToken;
            return acc + price;
          },
          0
        );

        const totalAuctionVolume = completedAuction?.reduce((acc, auction) => {
          const price = auction.buyoutBidAmount;
          return acc + price;
        }, 0);

        const totalVolume = totalListingVolume! + totalAuctionVolume!;
        const formattedTotalVolume = Number(totalVolume || 0).toFixed(3);

        const floorPrice = (() => {
          let floor = Infinity;

          if (liveListing) {
            for (const listing of liveListing) {
              const listingPrice = listing.pricePerToken;
              floor = Math.min(floor, listingPrice);
            }
          }

          if (liveAuction) {
            for (const auction of liveAuction) {
              const auctionPrice = auction.minimumBidAmount;
              floor = Math.min(floor, auctionPrice);
            }
          }

          return floor === Infinity ? 0 : floor;
        })();

        const collectionDetails = {
          listedNFTs,
          auctionedNFTs,
          percentageOfListed,
          percentageOfAuctioned,
          holderCount: collectionDetailsResponse.data.holderCount,
          totalVolume: formattedTotalVolume,
          totalSupplyResult: Number(totalSupplyResult),
          floorPrice: floorPrice,
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
            completedAuction: completedAuction,
            allAuctions: liveAuction,
          },
          collectionListings: {
            allListings: liveListing,
            completedListing: completedListing,
          },
        };
      } catch (error) {
        console.log("single collection query", { error });
      }
    },
    enabled:
      !!contractAddress &&
      !isLoadingLiveAuction &&
      !isLoadingLiveListing &&
      !isLoadingLiveOffer &&
      !isLoadingCompletedOffer &&
      !isLoadingCompletedAuction &&
      !isLoadingCompletedListing,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function usePromotedCollectionsQuery() {
  return useQuery({
    queryKey: [queryKeys.collection.promoted],
    queryFn: async () => {
      const response = await axios.get(`${backendURL}/collection/promoted/`);
      const promotedCollections = response.data;
      return promotedCollections;
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}
