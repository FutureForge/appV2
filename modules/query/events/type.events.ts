export interface EventLog {
  hasNext: false;
  limit: number;
  page: 1;
  docs: [
    {
      contractAddress: string;
      logIndex: number;
      transactionHash: string;
      blockHash: string;
      blockNumber: number;
      originAddress: string;
      rawData: {
        address: string;
        topics: string[]; // Usually contains event signature and indexed parameters
        data: string; // Contains non-indexed parameters in hex format
      };
      removed: boolean;
      timestamp: string;
      transactionIndex: number;
    }
  ];
}

export interface RawCompletedListingEvent {
  assetContract: string;
  buyer: string;
  listingCreator: string;
  listingId: bigint;
  quantityBought: bigint;
  tokenId: bigint;
  totalPricePaid: bigint;
}

export interface RawCompletedAuctionEvent {
  assetContract: string;
  auctionCreator: string;
  auctionId: bigint;
  closer: string;
  tokenId: bigint;
  winningBidder: string;
}

export interface RawAcceptedOfferEvent {
  assetContract: string;
  offerId: bigint;
  offeror: string;
  quantityBought: bigint;
  seller: string;
  tokenId: bigint;
  totalPricePaid: bigint;
}

export interface RawAuctionBidEvent {
  assetContract: string;
  auction: RawAuctionEvent;
  auctionId: bigint;
  bidAmount: bigint;
  bidder: string;
}

export interface RawAuctionEvent {
  assetContract: string;
  auctionCreator: string;
  auctionId: bigint;
  bidBufferBps: bigint;
  buyoutBidAmount: bigint;
  currency: string;
  endTimestamp: bigint;
  minimumBidAmount: bigint;
  quantity: bigint;
  startTimestamp: bigint;
  status: number;
  timeBufferInSeconds: bigint;
  tokenId: bigint;
  tokenType: number;
}

export interface RawOfferEvent {
  assetContract: string;
  offer: {
    assetContract: string;
    currency: string;
    expirationTimestamp: bigint;
    offerId: bigint;
    offeror: string;
    quantity: bigint;
    status: number;
    tokenId: bigint;
    tokenType: number;
    totalPrice: bigint;
  };
  offerId: bigint;
  offeror: string;
}
