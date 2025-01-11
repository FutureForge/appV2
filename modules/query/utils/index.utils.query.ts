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
