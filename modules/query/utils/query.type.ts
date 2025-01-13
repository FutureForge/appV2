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

export interface CompletedListingEvent {
  assetContract: string;
  buyer: string;
  listingCreator: string;
  listingId: number;
  quantityBought: number;
  tokenId: number;
  totalPricePaid: number;
  nft: ThirdwebNFTType;
}

export interface CompletedAuctionEvent {
  assetContract: string;
  auctionCreator: string;
  auctionId: number;
  closer: string;
  tokenId: number;
  winningBidder: string;
  bidAmount: number;
  nft: ThirdwebNFTType;
}

export interface AcceptedOfferEvent {
  assetContract: string;
  offerId: number;
  offeror: string;
  quantityBought: number;
  seller: string;
  tokenId: number;
  totalPricePaid: number;
  nft: ThirdwebNFTType;
}

export interface AuctionBidEvent {
  assetContract: string;
  auction: Auction;
  auctionId: number;
  bidAmount: number;
  bidder: string;
}

export interface OfferEvent {
  assetContract: string;
  offer: Offer;
  offerId: number;
  offeror: string;
}
