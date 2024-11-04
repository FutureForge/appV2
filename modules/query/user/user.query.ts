import { useQuery } from "@tanstack/react-query";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { queryKeys } from "../query-keys";
import axios from "axios";
import { CROSSFI_API_TESTNET } from "@/utils/configs";
import { UserNFTResponse } from "@/utils/types/global";
import {
  useAllOffersQuery,
  useFilteredAllAuctionsQuery,
  useFilteredAllListingsQuery,
  useFilteredAllOffersQuery,
  useFilteredUserNewBidsQuery,
} from "..";
import { getContractCustom } from "@/modules/blockchain";
import { getNFT } from "thirdweb/extensions/erc721";
import {
  ensureSerializable,
  formatBlockchainTimestamp,
  tryParseJSON,
} from "@/utils/functions";
import { Auction, Listing, Offer } from "@/utils/types/graphql";

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
                nft: updatedNFT,
                type: "NFTs",
                tokenId: nft.id.toString(),
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
          (listing) =>
            listing.assetContract.toLowerCase() ===
              nft.contractAddress.toLowerCase() &&
            listing.tokenId.toString() === nftTokenId
        );
      });

      return ensureSerializable(userNFTsNotListed);
    },
    enabled: !!userAddress,
    refetchInterval: 1000000,
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
      return ensureSerializable({
        userOffers,
        offerLength: userOffers?.length,
      });
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
      return ensureSerializable({
        userAuctions,
        auctionLength: userAuctions?.length,
      });
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
      return ensureSerializable({
        userListings,
        userListingsLength: userListings?.length,
      });
    },
    enabled: !!userAddress,
    refetchInterval: 1000000,
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
      return ensureSerializable({
        userBids,
        userBidsLength: userBids?.length,
      });
    },
    enabled: !!userAddress,
    refetchInterval: 1000000,
  });
}

export function useUserOffersReceivedQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: allOffers } = useAllOffersQuery({});

  const userOffersReceived = allOffers?.filter((offer) => {
    const offerOwner = offer.nft.owner.toLowerCase();

    return offerOwner === userAddress?.toLowerCase();
  });

  return useQuery({
    queryKey: [queryKeys.user.offersReceived],
    queryFn: async () => {
      return ensureSerializable({
        userOffersReceived,
        userOffersReceivedLength: userOffersReceived?.length,
      });
    },
    enabled: !!userAddress,
    refetchInterval: 5000000,
  });
}

export function useUserExpiredListingsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: filteredListings } = useFilteredAllListingsQuery({
    address: userAddress?.toLowerCase(),
  });

  return useQuery({
    queryKey: [queryKeys.user.expiredListings],
    queryFn: async () => {
      const expiredListings: Listing[] | undefined = filteredListings?.filter(
        (listing) => {
          const endTime = formatBlockchainTimestamp(listing.endTimestamp);
          const endTimeFormatted = new Date(endTime).getTime();
          const currentTime = new Date().getTime();

          return endTimeFormatted < currentTime;
        }
      );

      return ensureSerializable({
        expiredListings,
        expiredListingsLength: expiredListings?.length,
      });
    },
    enabled: !!userAddress,
    refetchInterval: 5000000,
  });
}

export function useUserExpiredAuctionsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: filteredAuctions } = useFilteredAllAuctionsQuery({
    address: userAddress?.toLowerCase(),
  });

  return useQuery({
    queryKey: [queryKeys.user.expiredAuctions],
    queryFn: async () => {
      const expiredAuctions: Auction[] | undefined = filteredAuctions?.filter(
        (auction) => {
          const endTime = formatBlockchainTimestamp(auction.endTimestamp);
          const endTimeFormatted = new Date(endTime).getTime();
          const currentTime = new Date().getTime();

          return endTimeFormatted < currentTime;
        }
      );

      return ensureSerializable({
        expiredAuctions,
        expiredAuctionsLength: expiredAuctions?.length,
      });
    },
    enabled: !!userAddress,
    refetchInterval: 5000000,
  });
}

export function useUserExpiredOffersQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: filteredOffers } = useFilteredAllOffersQuery({
    address: userAddress?.toLowerCase(),
  });

  return useQuery({
    queryKey: [queryKeys.user.expiredAuctions],
    queryFn: async () => {
      const expiredOffers: Offer[] | undefined = filteredOffers?.filter(
        (offer) => {
          const endTime = formatBlockchainTimestamp(offer.expirationTimestamp);
          const endTimeFormatted = new Date(endTime).getTime();
          const currentTime = new Date().getTime();

          return endTimeFormatted < currentTime;
        }
      );

      return ensureSerializable({
        expiredOffers,
        expiredOffersLength: expiredOffers?.length,
      });
    },
    enabled: !!userAddress,
    refetchInterval: 5000000,
  });
}
