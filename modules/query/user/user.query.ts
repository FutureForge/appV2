import { useQuery } from "@tanstack/react-query";
import {
  useActiveAccount,
  useActiveWallet,
  useWalletBalance,
} from "thirdweb/react";
import { queryKeys } from "../query-keys";
import axios from "axios";
import {
  backendURL,
  chainInfo,
  client,
  EXPLORER_API_URL,
  NFT_FACTORY_ADDRESS,
  USDT_TOKEN_CONTRACT,
} from "@/utils/configs";
import { NFTActivityResponse } from "@/utils/types/global";
import {
  useUserAuctionBlockchainQuery,
  useUserListingBlockchainQuery,
  useUserOfferBlockchainQuery,
} from "..";
import {
  getContractCustom,
  getContractEthers,
  getIsAuctionExpired,
} from "@/modules/blockchain";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import nftFactoryABI from "@/utils/abi/nftFactory.json";
import nftBaseABI from "@/utils/abi/nftBase.json";
import ERC721Abi from "@/utils/abi/erc721.json";
import { Listing, Auction, fetchNFT } from "../utils";
import { Collection } from "@/utils/types/collection/collection.type";

export function useUserChainInfo() {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();

  const chain = activeWallet?.getChain();
  const isChainSupported = chain?.id === chainInfo.id;

  return { activeAccount, activeWallet, isChainSupported };
}

export function getUserNativeBalance() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
  } = useWalletBalance(
    {
      chain: chainInfo,
      address: userAddress,
      client,
    },
    {
      enabled: !!userAddress,
      refetchInterval: 5000,
    }
  );

  return { balanceData, isBalanceLoading, isBalanceError };
}

export function getUserUSDTBalance() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const {
    data: usdtBalance,
    isLoading: isUSDTBalanceLoading,
    isError: isUSDTBalanceError,
  } = useWalletBalance(
    {
      chain: chainInfo,
      address: userAddress,
      client,
      tokenAddress: USDT_TOKEN_CONTRACT,
    },
    {
      enabled: !!userAddress,
      refetchInterval: 5000,
    }
  );

  return { usdtBalance, isUSDTBalanceLoading, isUSDTBalanceError };
}

export function useUserNFTsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userListedNFTs, isLoading: isUserListingsLoading } =
    useUserListingBlockchainQuery({
      type: "active-listing",
    });

  const { data: userListedAuctions, isLoading: isUserAuctionsLoading } =
    useUserAuctionBlockchainQuery({
      type: "active-auction",
    });

  return useQuery({
    queryKey: [queryKeys.user.nfts, { userAddress }],
    queryFn: async () => {
      if (!userAddress) return [];

      const response = await axios.get(
        `${backendURL}/collection?limit=100&page=1`
      );
      const collections = response.data.collections as Collection[];

      const ownedNFTsPerCollection = await Promise.all(
        collections.map(async (collection) => {
          try {
            const contract = getContractCustom({
              contractAddress: collection.collectionAddress,
              abi: ERC721Abi,
            });

            const nfts = await getOwnedNFTs({
              contract,
              owner: userAddress,
              useIndexer: false,
            });

            return nfts.map((nft) => ({
              contractAddress: collection.collectionAddress,
              tokenId: nft.id.toString(),
              type: "NFTs",
              nft: {
                ...nft,
                tokenId: nft.id.toString(),
              },
            }));
          } catch (error) {
            return [];
          }
        })
      );

      const ownedNFTs = ownedNFTsPerCollection.flat();

      const userNFTsNotListed = ownedNFTs.filter(
        (nft) =>
          !userListedNFTs?.some(
            (listing: Listing) =>
              listing.assetContract.toLowerCase() ===
                nft.contractAddress.toLowerCase() &&
              listing.tokenId.toString() === nft.tokenId
          )
      );

      const userNFTsNotAuctioned = userNFTsNotListed.filter(
        (nft) =>
          !userListedAuctions?.some(
            (auction: Auction) =>
              auction.assetContract.toLowerCase() ===
                nft.contractAddress.toLowerCase() &&
              auction.tokenId.toString() === nft.tokenId
          )
      );

      return userNFTsNotAuctioned;
    },
    enabled: !!userAddress && !isUserListingsLoading && !isUserAuctionsLoading,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function useUserListingsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userListings, isLoading: isUserListingsLoading } =
    useUserListingBlockchainQuery({
      type: "active-listing",
    });

  return useQuery({
    queryKey: [queryKeys.user.listings, { userAddress }],
    queryFn: async () => {
      return {
        userListings,
        userListingsLength: userListings?.length,
      };
    },
    enabled: !!userAddress && !isUserListingsLoading,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function useUserAuctionsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userAuctions, isLoading: isUserAuctionsLoading } =
    useUserAuctionBlockchainQuery({
      type: "active-auction",
    });

  return useQuery({
    queryKey: [queryKeys.user.auctions, { userAddress }],
    queryFn: async () => {
      const updatedAuctions = await Promise.all(
        (userAuctions ?? []).map(async (auction) => {
          const isAuctionActive = await getIsAuctionExpired({
            auctionId: BigInt(auction.auctionId),
          });

          const isAuctionExpired = !isAuctionActive;

          return {
            ...auction,
            isAuctionExpired,
          };
        })
      );

      const activeAuctions = updatedAuctions.filter(
        (auction) => auction.isAuctionExpired === false
      );

      return {
        userAuctions: activeAuctions,
        auctionLength: activeAuctions.length,
      };
    },
    enabled: !!userAddress && !isUserAuctionsLoading,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function useUserOffersQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userOffers, isLoading: isUserOffersLoading } =
    useUserOfferBlockchainQuery({
      type: "active-offer",
    });

  return useQuery({
    queryKey: [queryKeys.user.offers, { userAddress }],
    queryFn: async () => {
      return {
        userOffers,
        offerLength: userOffers?.length,
      };
    },
    enabled: !!userAddress && !isUserOffersLoading,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function useUserPendingPayoutQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userAuctions, isLoading: isUserAuctionsLoading } =
    useUserAuctionBlockchainQuery({
      type: "active-auction",
    });

  return useQuery({
    queryKey: [queryKeys.user.pendingPayout, { userAddress }],
    queryFn: async () => {
      const updatedAuctions = await Promise.all(
        (userAuctions ?? []).map(async (auction) => {
          const isAuctionActive = await getIsAuctionExpired({
            auctionId: BigInt(auction.auctionId),
          });

          const isAuctionExpired = !isAuctionActive;

          return {
            ...auction,
            isAuctionExpired,
          };
        })
      );

      const expiredAuctions = updatedAuctions.filter(
        (auction) => auction.isAuctionExpired
      );

      return {
        userPendingPayout: expiredAuctions,
        userPendingPayoutLength: expiredAuctions.length,
      };
    },
    enabled: !!userAddress && !isUserAuctionsLoading,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function useUserOffersReceivedQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userOffersReceived, isLoading: isUserOffersReceivedLoading } =
    useUserOfferBlockchainQuery({
      type: "offer-received",
    });

  return useQuery({
    queryKey: [queryKeys.user.offersReceived, { userAddress }],
    queryFn: async () => {
      // Group offers by tokenId and assetContract
      const groupedOffers = userOffersReceived?.reduce((acc, offer) => {
        const key = `${offer.assetContract}_${offer.tokenId.toString()}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(offer);
        return acc;
      }, {} as Record<string, typeof userOffersReceived>);

      // Get highest offer for each NFT
      const highestOffers = Object.values(groupedOffers || {}).map((offers) => {
        return offers.reduce((highest, current) => {
          const highestPrice = highest.totalPrice;
          const currentPrice = current.totalPrice;
          return currentPrice > highestPrice ? current : highest;
        });
      });
      return {
        userOffersReceived: highestOffers,
        userOffersReceivedLength: highestOffers?.length,
      };
    },
    enabled: !!userAddress && !isUserOffersReceivedLoading,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function useUserExpiredListingsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userExpiredListings, isLoading: isUserListingsLoading } =
    useUserListingBlockchainQuery({
      type: "expired-listing",
    });

  return useQuery({
    queryKey: [queryKeys.user.expiredListings, { userAddress }],
    queryFn: async () => {
      return {
        expiredListings: userExpiredListings,
        expiredListingsLength: userExpiredListings?.length,
      };
    },
    enabled: !!userAddress && !isUserListingsLoading,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function useUserExpiredAuctionsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userExpiredAuction, isLoading: isUserAuctionLoading } =
    useUserAuctionBlockchainQuery({
      type: "expired-auction",
    });

  return useQuery({
    queryKey: [queryKeys.user.expiredAuctions, { userAddress }],
    queryFn: async () => {
      return {
        expiredAuctions: userExpiredAuction,
        expiredAuctionsLength: userExpiredAuction?.length,
      };
    },
    enabled: !!userAddress && !isUserAuctionLoading,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function useUserExpiredOffersQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userExpiredOffer, isLoading: isUserOfferLoading } =
    useUserOfferBlockchainQuery({
      type: "expired-offer",
    });

  return useQuery({
    queryKey: [queryKeys.user.expiredOffers, { userAddress }],
    queryFn: async () => {
      return {
        expiredOffers: userExpiredOffer,
        expiredOffersLength: userExpiredOffer?.length,
      };
    },
    enabled: !!userAddress && !isUserOfferLoading,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function useUserCollectionsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: [queryKeys.user.collection, { userAddress }],
    queryFn: async () => {
      const response = await axios.get(
        `${backendURL}/collection/user/${userAddress}`
      )

      const collections = response.data as Collection[];

      for (const collection of collections) {
        try {
          collection.floorPrice = 8;
          collection.totalVolume = 8;
        } catch (error) {}
      }

      return collections;
    },
    enabled: !!userAddress,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function useUserNFTActivitiesQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: [queryKeys.user.nftActivities, { userAddress }],
    queryFn: async () => {
      const response = await axios.get<NFTActivityResponse>(
        `${EXPLORER_API_URL}/token-transfers?address=${userAddress?.toLowerCase()}&tokenType=CFC-721&page=1&limit=1000&sort=-blockNumber`
      );

      const tokenTransfers = response.data.docs;

      const updatedTokenTransfers = await Promise.all(
        tokenTransfers.map(async (transfer) => {
          try {
            const nft = await fetchNFT({
              assetContract: transfer.contractAddress,
              tokenId: BigInt(transfer.tokenId),
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
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

type UserNFTContract = {
  name: string;
  symbol: string;
  contractAddress: string;
};

export function useUserNFTContractQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: [queryKeys.user.nftContracts, { userAddress }],
    queryFn: async () => {
      const NFTFactoryContract = getContractEthers({
        contractAddress: NFT_FACTORY_ADDRESS,
        abi: nftFactoryABI,
      });

      const userDeployedContracts = await NFTFactoryContract.getUserNFT(
        userAddress
      );

      const deployedContractsUpdated =
        userDeployedContracts.length > 0
          ? await Promise.all(
              userDeployedContracts.map(
                async (contract: string): Promise<UserNFTContract> => {
                  const getContract = getContractEthers({
                    contractAddress: contract,
                    abi: nftBaseABI,
                  });

                  const name = await getContract.name();
                  const symbol = await getContract.symbol();

                  const contractInfo = {
                    name,
                    symbol,
                    contractAddress: contract.toLowerCase(),
                  };

                  return contractInfo;
                }
              )
            )
          : [];

      return deployedContractsUpdated;
    },
    enabled: !!userAddress,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}
