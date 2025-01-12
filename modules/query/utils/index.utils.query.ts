import { formatBlockchainTimestamp } from "@/utils/functions";
import { decimalOffChain, getContractCustom } from "@/modules/blockchain";
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
  nft: ThirdwebNFTType;
}

export async function formatAuctionData(
  rawAuction: any,
  nft: ThirdwebNFTType
): Promise<Auction> {
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
  };
}

export async function formatListingData(
  rawListing: any,
  nft: ThirdwebNFTType
): Promise<Listing> {
  return {
    assetContract: rawListing.assetContract,
    listingCreator: rawListing.listingCreator,
    listingId: Number(rawListing.listingId),
    currency: rawListing.currency,
    endTimestamp: formatBlockchainTimestamp(rawListing.endTimestamp.toString()),
    pricePerToken: Number(decimalOffChain(rawListing.pricePerToken)),
    nft,
    quantity: Number(rawListing.quantity),
    startTimestamp: formatBlockchainTimestamp(
      rawListing.startTimestamp.toString()
    ),
    status: rawListing.status,
    tokenId: Number(rawListing.tokenId),
    reserved: false,
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
