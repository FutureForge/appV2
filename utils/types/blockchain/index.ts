export type AuctionBaseType = {
  assetContract: string;
  tokenId: string;
  quantity: string;
  currency: string;
  minimumBidAmount: string;
  buyoutBidAmount: string;
  timeBufferInSeconds: string;
  bidBufferBps: string;
  startTimestamp?: string;
  endTimestamp?: Date;
};

export type CreateAuctionType = AuctionBaseType;
