import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import {
  CROSSFI_API_TESTNET,
  MARKETPLACE_ADDRESS_TESTNET,
} from "@/utils/configs";
import { getPlatformFeeInfoCustom } from "@/modules/blockchain/global/global.blockchain";
import { getNFT } from "thirdweb/extensions/erc721";
import {
  decimalOffChain,
  getAllAuctions,
  getContractCustom,
  getIsAuctionExpired,
  getTotalAuctions,
  getWinningBid,
} from "@/modules/blockchain";
import ERC721ABI from "@/utils/abi/erc721.json";
import { NFT as ThirdwebNFTType } from "thirdweb";
import {
  ensureSerializable,
  formatBlockchainTimestamp,
  tryParseJSON,
} from "@/utils/functions";
import { useSingleCollectionWithoutNFTsQuery, useSingleOfferQuery } from "..";
import { NFTActivityResponse } from "@/utils/types/global";
import {
  Auction,
  Listing,
  NFT as CustomNFTType,
  Offer,
} from "@/utils/types/graphql";
import { Collection } from "@/utils/types/collection/collection.type";
import {
  getAllListing,
  getTotalListings,
} from "@/modules/blockchain/listing/listing.blockchain";
import {
  getAllOffers,
  getTotalOffers,
} from "@/modules/blockchain/offer/offer.blockchain";
import { indexerEndpoint } from "@/utils/graphql";
import { allNFTsQuery } from "@/utils/graphql/queries/nft.queries";
import request from "graphql-request";

export const StatusType = {
  UNSET: 0,
  CREATED: 1,
  COMPLETED: 2,
  CANCELLED: 3,
  ACTIVE: 4,
  EXPIRED: 5,
};

export function useSingleNFTQuery({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) {
  const { data: collectionWithoutNFTs } = useSingleCollectionWithoutNFTsQuery({
    contractAddress,
  });

  const { data: nftOffers, isLoading: isLoadingOffers } = useSingleOfferQuery({
    contractAddress,
    tokenId,
  });

  return useQuery({
    queryKey: [queryKeys.nft.single, tokenId],
    queryFn: async () => {
      try {
        const [
          tokenTransfersResponse,
          collectionFee,
          marketplaceFee,
          allListings,
          allAuctions,
        ] = await Promise.all([
          axios.get<NFTActivityResponse>(
            `${CROSSFI_API_TESTNET}/token-transfers?contractAddress=${contractAddress}&tokenId=${tokenId}&tokenType=CFC-721&page=1&limit=100&sort=-blockNumber`
          ),
          getPlatformFeeInfoCustom({ contractAddress }).catch(() => ({})),
          getPlatformFeeInfoCustom({
            contractAddress: MARKETPLACE_ADDRESS_TESTNET,
          }).catch(() => ({})),
          getAllListing(),
          getAllAuctions(),
        ]);

        const nftAuctionList = allAuctions.find(
          (auction) =>
            auction.assetContract.toLowerCase() ===
              contractAddress.toLowerCase() &&
            auction.tokenId === BigInt(tokenId) &&
            auction.status === StatusType.CREATED
        );

        const nftListingList = allListings.find(
          (listing) =>
            listing.assetContract.toLowerCase() ===
              contractAddress.toLowerCase() &&
            listing.tokenId === BigInt(tokenId) &&
            listing.status === StatusType.CREATED
        );

        const nftActivity = tokenTransfersResponse.data.docs;

        const contract = getContractCustom({
          contractAddress,
          abi: ERC721ABI,
        });

        let updatedNFT: ThirdwebNFTType | null = null;

        const nft = await getNFT({
          contract,
          tokenId: BigInt(tokenId),
          includeOwner: true,
        });

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
        } else {
          updatedNFT = nft;
        }

        let isAuctionExpired;
        let winningBidBody;

        if (nftAuctionList) {
          const isAuctionActive = await getIsAuctionExpired({
            auctionId: nftAuctionList.auctionId,
          });

          isAuctionExpired = !isAuctionActive;

          const winningBid = await getWinningBid({
            auctionId: nftAuctionList.auctionId,
          });

          winningBidBody = {
            bidder: winningBid[0],
            currency: winningBid[1],
            bidAmount: winningBid[2].toString(),
          };
        }

        const isListingExpired =
          nftListingList &&
          new Date(
            formatBlockchainTimestamp(
              nftListingList.endTimestamp.toString()
            ).toString()
          ).getTime() < new Date().getTime();

        const isAuctionStatusExpired =
          nftAuctionList &&
          new Date(
            formatBlockchainTimestamp(
              nftAuctionList.endTimestamp.toString()
            ).toString()
          ).getTime() < new Date().getTime();

        const isAuctionPendingPayout =
          Number(winningBidBody?.bidAmount.toString()) ===
          Number(nftAuctionList?.buyoutBidAmount.toString());

        const isActiveTypeExpired = isAuctionStatusExpired || isListingExpired;

        const activeType =
          (nftAuctionList && isAuctionPendingPayout) || isAuctionExpired
            ? "pending-payout"
            : isListingExpired || isAuctionStatusExpired
            ? "expired"
            : nftListingList
            ? "listing"
            : nftAuctionList
            ? "auction"
            : "none";

        return {
          collectionFee,
          marketplaceFee,
          nftActivity,
          nft: updatedNFT,
          activeType,
          isAuctionExpired,
          isAuctionPendingPayout,
          isActiveTypeExpired,
          winningBidBody,
          offers: nftOffers as Offer[],
          collectionDetails: collectionWithoutNFTs?.collection as Collection,
          listingData: ensureSerializable(nftListingList) as Listing,
          auctionData: ensureSerializable(nftAuctionList) as Auction,
        };
      } catch (error) {
        console.log("single nft error", { error });
      }
    },
    enabled: !!contractAddress && !!tokenId && !isLoadingOffers,
    refetchInterval: 5000,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useAllNFTQuery() {
  return useQuery({
    queryKey: [queryKeys.nft.single, "global-nft"],
    queryFn: async () => {
      const response = await request<{ nfts: CustomNFTType[] }>(
        indexerEndpoint,
        allNFTsQuery
      );

      return response.nfts;
    },
    enabled: true,
    refetchInterval: 600000,
  });
}
