import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import {
  backendURL,
  chainInfo,
  CROSSFI_API_URL,
  MARKETPLACE_ADDRESS_TESTNET,
  THIRDWEB_ENGINE_TOKEN,
  THIRDWEB_ENGINE_URL,
} from "@/utils/configs";
import { getPlatformFeeInfoCustom } from "@/modules/blockchain/global/global.blockchain";
import { decimalOffChain, getContractCustom } from "@/modules/blockchain";
import { getNFT, isERC721, totalSupply } from "thirdweb/extensions/erc721";
import {
  Collection,
  NFTResultResponse,
  SingleCollection,
} from "@/utils/types/collection/collection.type";
import { NFTActivityResponse } from "@/utils/types/global";
import {
  useAllAuctionsBaseQuery,
  useAllAuctionsBlockchainQuery,
} from "../auction/auction.blockchain.query";
import {
  useAllListingBaseQuery,
  useAllListingBlockchainQuery,
} from "../listing/listing.blockchain.query";
import { useAllOffersBlockchainQuery } from "../offers/offers.blockchain.query";
import { to3DP } from "@/utils/functions";
import { StatusType } from "@/utils/enums/messages/index.enum";
import ERC721Abi from "@/utils/abi/erc721.json";

const formatIPFSURL = (url: string): string => {
  if (!url) return url;

  const ipfsMatch =
    url.match(/ipfs\/([^/]+)(.*)/)?.[1] ||
    url.match(/\/ipfs\/([^/]+)(.*)/)?.[1];
  const pathMatch =
    url.match(/ipfs\/[^/]+(.*)/)?.[1] || url.match(/\/ipfs\/[^/]+(.*)/)?.[1];

  if (!ipfsMatch) return url;

  return `https://ipfs.io/ipfs/${ipfsMatch}${pathMatch || ""}`;
};

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

function calculateCollectionVolumeData({
  liveAuction = [],
  completedAuction = [],
  liveListing = [],
  completedListing = [],
}: {
  liveAuction?: any[];
  completedAuction?: any[];
  liveListing?: any[];
  completedListing?: any[];
}) {
  const totalListingVolume = completedListing.reduce((acc: number, listing) => {
    const typePrice =
      typeof listing.pricePerToken === "string"
        ? listing.pricePerToken
        : typeof listing.pricePerToken === "bigint"
        ? decimalOffChain(listing.pricePerToken)
        : "0";

    const price = parseFloat(typePrice);
    return acc + price;
  }, 0);

  const totalAuctionVolume = completedAuction.reduce((acc, auction) => {
    const typePrice =
      typeof auction.buyoutBidAmount === "string"
        ? auction.buyoutBidAmount
        : typeof auction.buyoutBidAmount === "bigint"
        ? decimalOffChain(auction.buyoutBidAmount)
        : "0";

    const price = parseFloat(typePrice);
    return acc + price;
  }, 0);

  const totalVolume = totalListingVolume + totalAuctionVolume;
  const formattedTotalVolume = to3DP(totalVolume || 0);

  const floorPrice = (() => {
    let floor = Infinity;

    for (const listing of liveListing) {
      const price =
        typeof listing.pricePerToken === "string"
          ? listing.pricePerToken
          : typeof listing.pricePerToken === "bigint"
          ? decimalOffChain(listing.pricePerToken)
          : "0";

      const listingPrice = parseFloat(price);
      floor = Math.min(floor, listingPrice);
    }

    for (const auction of liveAuction) {
      const price =
        typeof auction.minimumBidAmount === "string"
          ? auction.minimumBidAmount
          : typeof auction.minimumBidAmount === "bigint"
          ? decimalOffChain(auction.minimumBidAmount)
          : "0";

      const auctionPrice = parseFloat(price);
      floor = Math.min(floor, auctionPrice);
    }

    return floor === Infinity ? 0 : floor;
  })();

  return {
    floorPrice: floorPrice,
    formattedTotalVolume: Number(formattedTotalVolume),
  };
}

export function useAllCollectionsQuery({ limit = 10, page = 1 }) {
  const { data: allListingQuery } = useAllListingBaseQuery();
  const { data: allAuctionsQuery } = useAllAuctionsBaseQuery();

  const activeListing = allListingQuery?.filter((listing) => {
    return listing.status === StatusType.CREATED;
  });

  const activeAuction = allAuctionsQuery?.filter((auction) => {
    return auction.status === StatusType.CREATED;
  });

  const completedListing = allListingQuery?.filter((listing) => {
    return listing.status === StatusType.COMPLETED;
  });

  const completedAuction = allAuctionsQuery?.filter((auction) => {
    return auction.status === StatusType.COMPLETED;
  });

  return useQuery({
    queryKey: [queryKeys.collection.all, limit, page],
    queryFn: async () => {
      const response = await axios.get(
        `${backendURL}/collection?limit=${limit}&page=${page}`
      );

      const collections = response.data.collections as Collection[];

      const updatedCollections = await Promise.all(
        collections.map(async (collection) => {
          try {
            const collectionDetailsResponse = await axios.get(
              `${CROSSFI_API_URL}/tokens/${collection.collectionAddress}`
            );

            const contractAddress = collection.collectionAddress.toLowerCase();

            const holderCount = collectionDetailsResponse.data.holderCount;

            const updatedActiveListing = activeListing?.filter(
              (listing) =>
                listing.assetContract.toLowerCase() === contractAddress
            );

            const updatedCompletedListing = completedListing?.filter(
              (listing) =>
                listing.assetContract.toLowerCase() === contractAddress
            );

            const updatedActiveAuction = activeAuction?.filter(
              (listing) =>
                listing.assetContract.toLowerCase() === contractAddress
            );

            const updatedCompletedAuction = completedAuction?.filter(
              (listing) =>
                listing.assetContract.toLowerCase() === contractAddress
            );

            const { floorPrice, formattedTotalVolume } =
              calculateCollectionVolumeData({
                liveAuction: updatedActiveAuction,
                liveListing: updatedActiveListing,
                completedAuction: updatedCompletedAuction,
                completedListing: updatedCompletedListing,
              });

            return {
              ...collection,
              holderCount,
              floorPrice: floorPrice,
              totalVolume: formattedTotalVolume,
            };
          } catch (error) {
            // console.log("all collection query", { error });
            return collection;
          }
        })
      );

      return {
        collections: updatedCollections.reverse(),
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
      const response = await axios.get<SingleCollection>(
        `${backendURL}/collection/${contractAddress}`
      );
      const { collection, nftLength, nfts, hasMetadataField } = response.data;

      const fetchNFTMetadata = async (nft: any) => {
        const {
          data: { result },
        } = await axios.get<NFTResultResponse>(
          `${THIRDWEB_ENGINE_URL}/contract/${chainInfo.id}/${contractAddress}/erc721/get?tokenId=${nft.tokenId}`,
          {
            headers: {
              Authorization: `Bearer ${THIRDWEB_ENGINE_TOKEN}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const { metadata } = result;

        return {
          ...nft,
          metadata: {
            tokenId: metadata.id,
            image: formatIPFSURL(metadata.image),
            external_url: formatIPFSURL(metadata.external_url),
            description: metadata.description,
            name: metadata.name,
            attributes: metadata.attributes,
          },
        };
      };

      const updatedNFTs = await Promise.all(
        nfts.map(async (nft) => {
          if (hasMetadataField) {
            return {
              ...nft,
              metadata: {
                ...nft.metadata,
                tokenId: nft.tokenId,
              },
            };
          }
          return fetchNFTMetadata(nft);
        })
      );

      return {
        collection,
        collectionNFTs: updatedNFTs,
        totalNFTs: nftLength,
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
            `${CROSSFI_API_URL}/token-transfers?contractAddress=${contractAddress}&tokenType=CFC-721&page=1&limit=20000&sort=-blockNumber`
          ),
          axios.get(`${CROSSFI_API_URL}/tokens/${contractAddress}`),
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
