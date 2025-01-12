import { useQuery } from "@tanstack/react-query";
import {
  useActiveAccount,
  useActiveWallet,
  useWalletBalance,
} from "thirdweb/react";
import { queryKeys } from "../query-keys";
import axios from "axios";
import {
  chainInfo,
  client,
  CROSSFI_API_URL,
  NFT_FACTORY_ADDRESS,
  WRAPPED_TOKEN_CONTRACT,
} from "@/utils/configs";
import { NFTActivityResponse, UserNFTResponse } from "@/utils/types/global";
import {
  useUserAuctionBlockchainQuery,
  useUserListingBlockchainQuery,
  useUserOfferBlockchainQuery,
} from "..";
import { getContractEthers, getIsAuctionExpired } from "@/modules/blockchain";
import { tryParseJSON } from "@/utils/functions";
import nftFactoryABI from "@/utils/abi/nftFactory.json";
import nftBaseABI from "@/utils/abi/nftBase.json";
import { Auction, fetchNFT, Listing } from "../utils/index.utils.query";

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

export function getUserWrappedTokenBalance() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const {
    data: wrappedBalance,
    isLoading: isWrappedBalanceLoading,
    isError: isWrappedBalanceError,
  } = useWalletBalance(
    {
      chain: chainInfo,
      address: userAddress,
      client,
      tokenAddress: WRAPPED_TOKEN_CONTRACT,
    },
    {
      enabled: !!userAddress,
      refetchInterval: 5000,
    }
  );

  return { wrappedBalance, isWrappedBalanceLoading, isWrappedBalanceError };
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
      const response = await axios.get<UserNFTResponse>(
        `${CROSSFI_API_URL}/token-holders?address=${userAddress}&tokenType=CFC-721&page=1&limit=1000&sort=-balance`
      );

      const userNFTs = response.data.docs;

      const updatedNFTs = await Promise.all(
        userNFTs.map(async (nfts) => {
          const { tokenIds, contractAddress } = nfts;

          const uniqueTokenIds = Array.from(new Set(tokenIds));

          const tokenIdNFTs = await Promise.all(
            uniqueTokenIds.map(async (ids) => {
              const nft = await fetchNFT({
                assetContract: contractAddress,
                tokenId: BigInt(ids),
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

      const userNFTsNotAuctioned = userNFTsNotListed?.filter(
        (nft: any) =>
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
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    // refetchInterval: 5000,
    // staleTime: Infinity,
    // gcTime: Infinity,
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
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
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
    refetchInterval: 5000,
    // staleTime: Infinity,
    // gcTime: Infinity,
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
    staleTime: Infinity,
    gcTime: Infinity,
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
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

// export function useUserBidsQuery() {
//   const { activeAccount } = useUserChainInfo();
//   const userAddress = activeAccount?.address;

//   const { data: userBids, isLoading: isUserBidsLoading } =
//     useFilteredUserNewBidsQuery({
//       address: userAddress?.toLowerCase() || "",
//     });

//   return useQuery({
//     queryKey: [queryKeys.user.bids, userAddress],
//     queryFn: async () => {
//       return {
//         userBids,
//         userBidsLength: userBids?.length,
//       };
//     },
//     enabled: !!userAddress && !isUserBidsLoading,
//     // refetchInterval: 5000,
//     staleTime: Infinity,
//     gcTime: Infinity,
//   });
// }

// export function useUserOffersReceivedQuery() {
//   const { activeAccount } = useUserChainInfo();
//   const userAddress = activeAccount?.address;

//   const { data: allOffers, isLoading: isAllOffersLoading } = useAllOffersQuery(
//     {}
//   );

//   // First filter offers received by the user
//   const userOffersReceived = allOffers?.filter((offer) => {
//     const offerOwner = offer.nft?.owner?.toLowerCase();
//     return offerOwner === userAddress?.toLowerCase();
//   });

//   return useQuery({
//     queryKey: [queryKeys.user.offersReceived, userAddress],
//     queryFn: async () => {
//       // Group offers by tokenId and assetContract
//       const groupedOffers = userOffersReceived?.reduce((acc, offer) => {
//         const key = `${offer.nft.assetContract}_${offer.nft.tokenId}`;
//         if (!acc[key]) {
//           acc[key] = [];
//         }
//         acc[key].push(offer);
//         return acc;
//       }, {} as Record<string, typeof userOffersReceived>);

//       // Get highest offer for each NFT
//       const highestOffers = Object.values(groupedOffers || {}).map((offers) => {
//         return offers.reduce((highest, current) => {
//           const highestPrice = parseFloat(highest.totalPrice);
//           const currentPrice = parseFloat(current.totalPrice);
//           return currentPrice > highestPrice ? current : highest;
//         });
//       });

//       return {
//         userOffersReceived: highestOffers,
//         userOffersReceivedLength: highestOffers?.length,
//       };
//     },
//     enabled: !!userAddress && !isAllOffersLoading,
//     // refetchInterval: 5000,
//     staleTime: Infinity,
//     gcTime: Infinity,
//   });
// }

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
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
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
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
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
    queryKey: [queryKeys.user.expiredAuctions, { userAddress }],
    queryFn: async () => {
      return {
        expiredOffers: userExpiredOffer,
        expiredOffersLength: userExpiredOffer?.length,
      };
    },
    enabled: !!userAddress && !isUserOfferLoading,
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

// export function useUserCollectionsQuery() {
//   const { activeAccount } = useUserChainInfo();
//   const userAddress = activeAccount?.address;

//   return useQuery({
//     queryKey: [queryKeys.user.all, { userAddress }],
//     queryFn: async () => {
//       const response = await axios.get(
//         `${backendURL}/collection/user/${userAddress?.toLowerCase()}`
//       );

//       const collections = response.data.filteredCollections as Collection[];

//       for (const collection of collections) {
//         try {
//           const [newListingResponse, allListingsResponse] = await Promise.all([
//             request<NewSaleListingsQueryResponse>(
//               indexerEndpoint,
//               filteredNewSaleListingsQuery,
//               {
//                 contractAddress: collection.collectionAddress.toLowerCase(),
//                 address: "",
//               }
//             ),
//             request<AllListingsQueryResponse>(
//               indexerEndpoint,
//               filteredAllListingsQuery,
//               {
//                 contractAddress: collection.collectionAddress.toLowerCase(),
//                 address: "",
//               }
//             ),
//           ]);

//           const newSaleListings = newListingResponse.newSaleListings;
//           const allListings = allListingsResponse.allListings;

//           const totalListingVolume =
//             newSaleListings?.reduce((acc, listing) => {
//               const price = parseFloat(
//                 decimalOffChain(listing.totalPricePaid) || "0"
//               );
//               return acc + price;
//             }, 0) ?? 0;

//           const formattedTotalVolume = to3DP(totalListingVolume || 0);

//           const floorPrice = (() => {
//             let floor = 0;
//             for (const listing of allListings || []) {
//               const price = decimalOffChain(listing.pricePerToken) || "0";
//               const listingPrice = parseFloat(price);
//               floor = Math.min(floor, listingPrice);
//             }
//             return floor;
//           })();

//           collection.floorPrice = floorPrice;
//           collection.totalVolume = Number(formattedTotalVolume);
//         } catch (error) {}
//       }

//       return collections;
//     },
//     enabled: !!userAddress,
//     // refetchInterval: 5000,
//     staleTime: Infinity,
//     gcTime: Infinity,
//   });
// }

export function useUserNFTActivitiesQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: [queryKeys.user.nftActivities, { userAddress }],
    queryFn: async () => {
      const response = await axios.get<NFTActivityResponse>(
        `${CROSSFI_API_URL}/token-transfers?address=${userAddress?.toLowerCase()}&tokenType=CFC-721&page=1&limit=1000&sort=-blockNumber`
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
    //  refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
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
    // refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
