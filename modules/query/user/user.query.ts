import { useQuery } from "@tanstack/react-query";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { queryKeys } from "../query-keys";
import axios from "axios";
import { backendURL, CROSSFI_API_TESTNET } from "@/utils/configs";
import { NFTActivityResponse, UserNFTResponse } from "@/utils/types/global";
import {
  useAllOffersQuery,
  useFilteredAllAuctionsQuery,
  useFilteredAllListingsQuery,
  useFilteredAllOffersQuery,
  useFilteredUserNewBidsQuery,
} from "..";
import { decimalOffChain, getContractCustom } from "@/modules/blockchain";
import { getNFT } from "thirdweb/extensions/erc721";
import {
  formatBlockchainTimestamp,
  to3DP,
  tryParseJSON,
} from "@/utils/functions";
import {
  AllAuctionsQueryResponse,
  AllListingsQueryResponse,
  AllOffersQueryResponse,
  Auction,
  Listing,
  NewSaleListingsQueryResponse,
  Offer,
} from "@/utils/types/graphql";
import { Collection } from "@/utils/types/collection/collection.type";
import {
  filteredAllListingsQuery,
  filteredNewSaleListingsQuery,
} from "@/utils/graphql/queries/listing.queries";
import request from "graphql-request";
import { indexerEndpoint } from "@/utils/graphql";
import { filteredAllAuctionsQuery } from "@/utils/graphql/queries/auction.queries";
import { filteredAllOffersQuery } from "@/utils/graphql/queries/offers.queries";

export function useUserChainInfo() {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();

  return { activeAccount, activeWallet };
}

export function useUserNFTsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userListedNFTs } = useFilteredAllListingsQuery({
    address: userAddress?.toLowerCase() || "",
  });

  return useQuery({
    queryKey: [queryKeys.user.nfts],
    queryFn: async () => {
      const response = await axios.get<UserNFTResponse>(
        `${CROSSFI_API_TESTNET}/token-holders?address=${userAddress}&tokenType=CFC-721&page=1&limit=1000&sort=-balance`
      );

      const userNFTs = response.data.docs;

      const updatedNFTs = await Promise.all(
        userNFTs.map(async (nfts) => {
          const { tokenIds, contractAddress } = nfts;

          const uniqueTokenIds = Array.from(new Set(tokenIds));

          const tokenIdNFTs = await Promise.all(
            uniqueTokenIds.map(async (ids) => {
              const contract = getContractCustom({
                contractAddress: contractAddress,
              });

              const nft = await getNFT({
                contract: contract,
                tokenId: BigInt(ids),
                includeOwner: true,
              });

              let updatedNFT = nft;

              const uri = nft.tokenURI;
              const parsedMetadata =
                typeof uri === "string" ? tryParseJSON(uri) : uri;

              if (parsedMetadata && typeof parsedMetadata === "object") {
                updatedNFT = {
                  ...nft,
                  tokenURI: parsedMetadata.image,
                  metadata: {
                    ...parsedMetadata,
                  },
                };
              }

              return {
                ...nfts,
                nft: { ...updatedNFT, tokenId: ids },
                type: "NFTs",
                tokenId: ids,
              };
            })
          );

          return tokenIdNFTs;
        })
      );

      const flatNFTs = updatedNFTs.flat();

      const userNFTsNotListed = flatNFTs?.filter((nft: any) => {
        const nftTokenId = nft.tokenId;

        return !userListedNFTs?.some(
          (listing: Listing) =>
            listing.assetContract.toLowerCase() ===
              nft.contractAddress.toLowerCase() &&
            listing.tokenId.toString() === nftTokenId
        );
      });

      return userNFTsNotListed;
    },
    enabled: !!userAddress,
    refetchInterval: 5000,
  });
}

export function useUserOffersQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userOffers } = useFilteredAllOffersQuery({
    address: userAddress?.toLowerCase() || "",
  });

  return useQuery({
    queryKey: [queryKeys.user.offers],
    queryFn: async () => {
      return {
        userOffers,
        offerLength: userOffers?.length,
      };
    },
    enabled: !!userAddress,
    refetchInterval: 5000,
  });
}

export function useUserAuctionsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userAuctions } = useFilteredAllAuctionsQuery({
    address: userAddress?.toLowerCase() || "",
  });

  return useQuery({
    queryKey: [queryKeys.user.auctions],
    queryFn: async () => {
      return {
        userAuctions,
        auctionLength: userAuctions?.length,
      };
    },
    enabled: !!userAddress,
    refetchInterval: 5000,
  });
}

export function useUserListingsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userListings } = useFilteredAllListingsQuery({
    address: userAddress?.toLowerCase() || "",
  });

  return useQuery({
    queryKey: [queryKeys.user.listings],
    queryFn: async () => {
      return {
        userListings,
        userListingsLength: userListings?.length,
      };
    },
    enabled: !!userAddress,
    refetchInterval: 5000,
  });
}

export function useUserBidsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userBids } = useFilteredUserNewBidsQuery({
    address: userAddress?.toLowerCase() || "",
  });

  return useQuery({
    queryKey: [queryKeys.user.listings],
    queryFn: async () => {
      return {
        userBids,
        userBidsLength: userBids?.length,
      };
    },
    enabled: !!userAddress,
    refetchInterval: 5000,
  });
}

export function useUserOffersReceivedQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: allOffers } = useAllOffersQuery({});

  // First filter offers received by the user
  const userOffersReceived = allOffers?.filter((offer) => {
    const offerOwner = offer.nft.owner.toLowerCase();
    return offerOwner === userAddress?.toLowerCase();
  });

  return useQuery({
    queryKey: [queryKeys.user.offersReceived],
    queryFn: async () => {
      // Group offers by tokenId and assetContract
      const groupedOffers = userOffersReceived?.reduce((acc, offer) => {
        const key = `${offer.nft.assetContract}_${offer.nft.tokenId}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(offer);
        return acc;
      }, {} as Record<string, typeof userOffersReceived>);

      // Get highest offer for each NFT
      const highestOffers = Object.values(groupedOffers || {}).map((offers) => {
        return offers.reduce((highest, current) => {
          const highestPrice = parseFloat(highest.totalPrice);
          const currentPrice = parseFloat(current.totalPrice);
          return currentPrice > highestPrice ? current : highest;
        });
      });

      return {
        userOffersReceived: highestOffers,
        userOffersReceivedLength: highestOffers?.length,
      };
    },
    enabled: !!userAddress,
    refetchInterval: 5000,
  });
}

export function useUserExpiredListingsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: [queryKeys.user.expiredListings],
    queryFn: async () => {
      const response = await request<AllListingsQueryResponse>(
        indexerEndpoint,
        filteredAllListingsQuery,
        {
          contractAddress: "",
          address: userAddress?.toLowerCase(),
        }
      );

      const expiredListings: Listing[] | undefined =
        response.allListings?.filter((listing: Listing) => {
          const endTime = formatBlockchainTimestamp(listing.endTimestamp);
          const endTimeFormatted = new Date(endTime).getTime();
          const currentTime = new Date().getTime();

          // looking for expired listings
          return endTimeFormatted < currentTime;
        });

      return {
        expiredListings,
        expiredListingsLength: expiredListings?.length,
      };
    },
    enabled: !!userAddress,
    refetchInterval: 5000,
  });
}

export function useUserExpiredAuctionsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: [queryKeys.user.expiredAuctions],
    queryFn: async () => {
      const response = await request<AllAuctionsQueryResponse>(
        indexerEndpoint,
        filteredAllAuctionsQuery,
        {
          contractAddress: "",
          address: userAddress?.toLowerCase(),
        }
      );

      const expiredAuctions: Auction[] | undefined =
        response.allAuctions?.filter((auction) => {
          const endTime = formatBlockchainTimestamp(auction.endTimestamp);
          const endTimeFormatted = new Date(endTime).getTime();
          const currentTime = new Date().getTime();

          return endTimeFormatted < currentTime;
        });

      return {
        expiredAuctions,
        expiredAuctionsLength: expiredAuctions?.length,
      };
    },
    enabled: !!userAddress,
    refetchInterval: 5000,
  });
}

export function useUserExpiredOffersQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: [queryKeys.user.expiredAuctions],
    queryFn: async () => {
      const response = await request<AllOffersQueryResponse>(
        indexerEndpoint,
        filteredAllOffersQuery,
        {
          contractAddress: "",
          address: userAddress?.toLowerCase(),
        }
      );

      const expiredOffers: Offer[] | undefined = response.allOffers?.filter(
        (offer) => {
          const endTime = formatBlockchainTimestamp(offer.expirationTimestamp);
          const endTimeFormatted = new Date(endTime).getTime();
          const currentTime = new Date().getTime();

          return endTimeFormatted < currentTime;
        }
      );

      return {
        expiredOffers,
        expiredOffersLength: expiredOffers?.length,
      };
    },
    enabled: !!userAddress,
    refetchInterval: 5000,
  });
}

export function useUserCollectionsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: [queryKeys.user.all],
    queryFn: async () => {
      const response = await axios.get(
        `${backendURL}/collection/user/${userAddress?.toLowerCase()}`
      );

      const collections = response.data.filteredCollections as Collection[];

      for (const collection of collections) {
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

      return collections;
    },
    enabled: !!userAddress,
    refetchInterval: 5000,
  });
}

export function useUserNFTActivitiesQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: [queryKeys.user.nftActivities],
    queryFn: async () => {
      const response = await axios.get<NFTActivityResponse>(
        `${CROSSFI_API_TESTNET}/token-transfers?address=${userAddress?.toLowerCase()}&tokenType=CFC-721&page=1&limit=1000&sort=-blockNumber`
      );

      const tokenTransfers = response.data.docs;

      const updatedTokenTransfers = await Promise.all(
        tokenTransfers.map(async (transfer) => {
          try {
            const contract = getContractCustom({
              contractAddress: transfer.contractAddress,
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

      return updatedTokenTransfers;
    },
    enabled: !!userAddress,
    refetchInterval: 5000,
  });
}
