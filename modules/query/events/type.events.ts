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
  listingId: number;
  quantityBought: number;
  tokenId: number;
  totalPricePaid: number;
}

export interface RawCompletedAuctionEvent {
  assetContract: string;
  auctionCreator: string;
  auctionId: string;
  closer: string;
  tokenId: string;
  winningBidder: string;
}

export interface RawAcceptedOfferEvent {
  assetContract: string;
  offerId: string;
  offeror: string;
  quantityBought: string;
  seller: string;
  tokenId: string;
  totalPricePaid: string;
}

export interface RawAuctionBidEvent {
  assetContract: string;
  auction: RawAuctionEvent;
  auctionId: string;
  bidAmount: string;
  bidder: string;
}

export interface RawAuctionEvent {
  assetContract: string;
  auctionCreator: string;
  auctionId: string;
  bidBufferBps: string;
  buyoutBidAmount: string;
  currency: string;
  endTimestamp: string;
  minimumBidAmount: string;
  quantity: string;
  startTimestamp: string;
  status: number;
  timeBufferInSeconds: string;
  tokenId: string;
  tokenType: number;
}

export interface RawOfferEvent {
  assetContract: string;
  offer: {
    assetContract: string;
    currency: string;
    expirationTimestamp: string;
    offerId: string;
    offeror: string;
    quantity: string;
    status: number;
    tokenId: string;
    tokenType: number;
    totalPrice: string;
  };
  offerId: string;
  offeror: string;
}
