import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import {
  CROSSFI_API_TESTNET,
  MARKETPLACE_ADDRESS_TESTNET,
} from "@/utils/configs";
import { getPlatformFeeInfoCustom } from "@/modules/blockchain/global/global.blockchain";
import { getNFT } from "thirdweb/extensions/erc721";
import { getContractCustom } from "@/modules/blockchain";
import ERC721ABI from "@/utils/abi/erc721.json";
import { NFT } from "thirdweb";
import { tryParseJSON } from "@/utils/functions";
import {
  useSingleAuctionQuery,
  useSingleListingQuery,
  useSingleOfferQuery,
  useUserExpiredAuctionsQuery,
  useUserExpiredListingsQuery,
  useUserExpiredOffersQuery,
} from "..";
import { NFTActivityResponse } from "@/utils/types/global";
import { Auction, Listing, Offer } from "@/utils/types/graphql";

export function useSingleNFTQuery({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) {
  const { data: singleListing, isLoading: isLoadingListing } =
    useSingleListingQuery({
      contractAddress,
      tokenId,
    });

  const { data: singleAuction, isLoading: isLoadingAuction } =
    useSingleAuctionQuery({
      contractAddress,
      tokenId,
    });

  const { data: singleOffer, isLoading: isLoadingOffer } = useSingleOfferQuery({
    contractAddress,
    tokenId,
  });

  const { data: expiredListings, isLoading: isLoadingExpiredListings } =
    useUserExpiredListingsQuery();
  const { data: expiredAuctions, isLoading: isLoadingExpiredAuctions } =
    useUserExpiredAuctionsQuery();
  const { data: expiredOffers, isLoading: isLoadingExpiredOffers } =
    useUserExpiredOffersQuery();

  const expiredListing = expiredListings?.expiredListings;
  const expiredAuction = expiredAuctions?.expiredAuctions;
  const expiredOffer = expiredOffers?.expiredOffers;

  const filteredExpiredListing: Listing | undefined = expiredListing?.filter(
    (listing: Listing) => listing.tokenId === tokenId
  )[0];
  const filteredExpiredAuction: Auction | undefined = expiredAuction?.filter(
    (auction: Auction) => auction.tokenId === tokenId
  )[0];
  const filteredExpiredOffer: Offer | undefined = expiredOffer?.filter(
    (offer: Offer) => offer.tokenId === tokenId
  )[0];

  return useQuery({
    queryKey: [queryKeys.nft.single, contractAddress, tokenId],
    queryFn: async () => {
      const [tokenTransfersResponse, collectionFee, marketplaceFee] =
        await Promise.all([
          axios.get<NFTActivityResponse>(
            `${CROSSFI_API_TESTNET}/token-transfers?contractAddress=${contractAddress}&tokenId=${tokenId}&tokenType=CFC-721&page=1&limit=100&sort=-blockNumber`
          ),
          getPlatformFeeInfoCustom({ contractAddress }).catch(() => ({})),
          getPlatformFeeInfoCustom({
            contractAddress: MARKETPLACE_ADDRESS_TESTNET,
          }).catch(() => ({})),
        ]);

      const nftActivity = tokenTransfersResponse.data.docs;

      const contract = getContractCustom({
        contractAddress,
        abi: ERC721ABI,
      });

      let updatedNFT: NFT | null = null;

      const nft = await getNFT({
        contract,
        tokenId: BigInt(tokenId),
        includeOwner: true,
      });

      const uri = nft.tokenURI;
      const parsedMetadata = typeof uri === "string" ? tryParseJSON(uri) : uri;

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

      const activeType =
        singleListing?.length! > 0
          ? "listing"
          : singleAuction?.length! > 0
          ? "auction"
          : "none";

      let activeTypeData;
      let expiredData;

      switch (activeType) {
        case "listing":
          activeTypeData = singleListing;
          expiredData = filteredExpiredListing;
          break;
        case "auction":
          activeTypeData = singleAuction;
          expiredData = filteredExpiredAuction;
          break;
        default:
          activeTypeData = null;
          expiredData = filteredExpiredOffer;
      }

      return {
        collectionFee,
        marketplaceFee,
        nftActivity,
        nft: updatedNFT,
        activeType,
        offers: singleOffer,
        activeTypeData,
        expiredData,
      };
    },
    enabled:
      !!contractAddress &&
      !isLoadingListing &&
      !isLoadingAuction &&
      !isLoadingOffer &&
      !isLoadingExpiredListings &&
      !isLoadingExpiredAuctions &&
      !isLoadingExpiredOffers,
    refetchInterval: 5000,
  });
}
