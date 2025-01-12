import { formatBlockchainTimestamp } from "@/utils/functions";
import {
  decimalOffChain,
  getContractCustom,
  getIsAuctionExpired,
  getWinningBid,
} from "@/modules/blockchain";
import { getNFT } from "thirdweb/extensions/erc721";
import { NFT as ThirdwebNFTType } from "thirdweb";

export interface Auction {
  assetContract: string;
  auctionCreator: string;
  auctionId: number;
  bidBufferBps: number;
  buyoutBidAmount: number;
  currency: string;
  endTimestamp: string;
  minimumBidAmount: number;
  quantity: number;
  startTimestamp: string;
  status: number;
  timeBufferInSeconds: number;
  tokenId: number;
  isAuctionExpired?: boolean;
  isAuctionActivityExpired?: boolean;
  winningBid?: {
    bidder: string;
    currency: string;
    bidAmount: string;
  };
  nft: ThirdwebNFTType;
}

export interface Listing {
  assetContract: string;
  currency: string;
  endTimestamp: string;
  listingCreator: string;
  listingId: number;
  pricePerToken: number;
  quantity: number;
  reserved: boolean;
  startTimestamp: string;
  status: number;
  tokenId: number;
  isListingExpired?: boolean;
  nft: ThirdwebNFTType;
}

export interface Offer {
  assetContract: string;
  currency: string;
  expirationTimestamp: string;
  offerId: number;
  offeror: string;
  quantity: number;
  status: number;
  tokenId: number;
  totalPrice: number;
  isOfferExpired?: boolean;
  nft: ThirdwebNFTType;
}

export async function formatAuctionData(
  rawAuction: any,
  nft: ThirdwebNFTType
): Promise<Auction> {
  const endTime = formatBlockchainTimestamp(rawAuction.endTimestamp);
  const endTimeFormatted = new Date(endTime).getTime();
  const currentTime = new Date().getTime();

  const isExpired = currentTime > endTimeFormatted;

  const isAuctionActive = await getIsAuctionExpired({
    auctionId: rawAuction.auctionId,
  });

  const isAuctionExpired = !isAuctionActive;

  const winningBid = await getWinningBid({
    auctionId: rawAuction.auctionId,
  });

  const winningBidBody = {
    bidder: winningBid[0],
    currency: winningBid[1],
    bidAmount: decimalOffChain(winningBid[2].toString())!,
  };

  return {
    assetContract: rawAuction.assetContract,
    auctionCreator: rawAuction.auctionCreator,
    auctionId: Number(rawAuction.auctionId),
    bidBufferBps: Number(rawAuction.bidBufferBps),
    buyoutBidAmount: Number(decimalOffChain(rawAuction.buyoutBidAmount)),
    currency: rawAuction.currency,
    endTimestamp: formatBlockchainTimestamp(rawAuction.endTimestamp.toString()),
    minimumBidAmount: Number(decimalOffChain(rawAuction.minimumBidAmount)),
    nft,
    quantity: Number(rawAuction.quantity),
    startTimestamp: formatBlockchainTimestamp(
      rawAuction.startTimestamp.toString()
    ),
    status: rawAuction.status,
    timeBufferInSeconds: Number(rawAuction.timeBufferInSeconds),
    tokenId: Number(rawAuction.tokenId),
    isAuctionExpired: isExpired,
    winningBid: winningBidBody,
    isAuctionActivityExpired: isExpired,
  };
}

export async function formatListingData(
  rawListing: any,
  nft: ThirdwebNFTType
): Promise<Listing> {
  const endTime = formatBlockchainTimestamp(rawListing.endTimestamp);
  const endTimeFormatted = new Date(endTime).getTime();
  const currentTime = new Date().getTime();

  const isExpired = currentTime > endTimeFormatted;

  return {
    assetContract: rawListing.assetContract,
    listingCreator: rawListing.listingCreator,
    listingId: Number(rawListing.listingId),
    currency: rawListing.currency,
    endTimestamp: formatBlockchainTimestamp(rawListing.endTimestamp),
    pricePerToken: Number(decimalOffChain(rawListing.pricePerToken)),
    nft,
    quantity: Number(rawListing.quantity),
    startTimestamp: formatBlockchainTimestamp(
      rawListing.startTimestamp.toString()
    ),
    status: rawListing.status,
    tokenId: Number(rawListing.tokenId),
    reserved: false,
    isListingExpired: isExpired,
  };
}

export async function formatOfferData(
  rawOffer: any,
  nft: ThirdwebNFTType
): Promise<Offer> {
  const endTime = formatBlockchainTimestamp(rawOffer.expirationTimestamp);
  const endTimeFormatted = new Date(endTime).getTime();
  const currentTime = new Date().getTime();

  const isExpired = currentTime > endTimeFormatted;

  return {
    assetContract: rawOffer.assetContract,
    offeror: rawOffer.offeror,
    offerId: Number(rawOffer.offerId),
    currency: rawOffer.currency,
    expirationTimestamp: formatBlockchainTimestamp(
      rawOffer.expirationTimestamp
    ),
    totalPrice: Number(decimalOffChain(rawOffer.totalPrice)),
    nft,
    quantity: Number(rawOffer.quantity),
    status: rawOffer.status,
    tokenId: Number(rawOffer.tokenId),
    isOfferExpired: isExpired,
  };
}

export async function fetchNFT({
  assetContract,
  tokenId,
}: {
  assetContract: string;
  tokenId: bigint;
}) {
  const contract = getContractCustom({ contractAddress: assetContract });
  return getNFT({
    contract,
    tokenId: tokenId,
    includeOwner: true,
  });
}
