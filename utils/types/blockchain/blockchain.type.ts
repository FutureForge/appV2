export type AuctionBaseType = {
  assetContract: string;
  tokenId: string;
  quantity: string;
  currency?: string;
  minimumBidAmount: string;
  buyoutBidAmount: string;
  timeBufferInSeconds?: string;
  bidBufferBps?: string;
  startTimestamp?: string;
  endTimestamp: Date;
};

export type CreateAuctionType = AuctionBaseType;

export type CreateDirectListingType = {
  assetContract: string;
  tokenId: string;
  quantity: string;
  pricePerToken: string;
  currency?: string;
  startTimestamp?: string;
  endTimestamp?: Date;
  reserved?: boolean;
};

export type BuyFromDirectListingType = {
  listingId: string;
  buyFor: string;
  quantity: string;
  currency?: string;
  totalPrice: string;
  nativeTokenValue: string;
};

export type MakeOfferListingType = {
  assetContract: string;
  tokenId: string;
  quantity: string;
  currency: string;
  totalPrice: string;
  expirationTimestamp?: Date;
};
