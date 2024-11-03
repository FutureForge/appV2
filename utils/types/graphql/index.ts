type Attribute = {
  traitType: string;
  value: string;
};

type Property = {
  name: string;
  value: string;
};

type WinningBid = {
  bidAmount: string;
  bidder: string;
  currency: string;
};

export type NFTMetadata = {
  animationUrl: string;
  attributes: Attribute[];
  backgroundColor: string;
  customAnimationUrl: string;
  customImage: string;
  description: string;
  externalUrl: string;
  image: string;
  imageUrl: string;
  name: string;
  properties: Property[];
  supply: number;
};

export type NFT = {
  assetContract: string;
  id: string;
  metadata: NFTMetadata;
  owner: string;
  tokenId: string;
  tokenURI: string;
  type: string;
};

export type Listing = {
  assetContract: string;
  currency: string;
  endTimestamp: string;
  id: string;
  listingCreator: string;
  listingId: string;
  pricePerToken: string;
  quantity: string;
  reserved: boolean;
  startTimestamp: string;
  status: number;
  tokenId: string;
  tokenType: number;
  nft: NFT;
  transactionHash?: string;
};

export type NewSaleListing = {
  assetContract: string;
  buyer: string;
  id: string;
  listingCreator: string;
  listingId: string;
  tokenId: string;
  quantityBought: string;
  totalPricePaid: string;
  transactionHash: string;
};

export type Auction = {
  assetContract: string;
  auctionCreator: string;
  auctionId: string;
  bidBufferBps: number;
  buyoutBidAmount: string;
  currency: string;
  endTimestamp: string;
  id: string;
  isAuctionExpired: boolean;
  minimumBidAmount: string;
  quantity: string;
  startTimestamp: string;
  status: number;
  timeBufferInSeconds: number;
  tokenId: string;
  tokenType: number;
  nft: NFT;
  transactionHash?: string;
  winningBid: WinningBid;
};

export type AuctionClosed = {
  assetContract: string;
  auctionCreator: string;
  auctionId: string;
  closer: string;
  id: string;
  tokenId: string;
  transactionHash: string;
  winningBidder: string;
  //   nft: NFT;
};

export type Offer = {
  assetContract: string;
  currency: string;
  expirationTimestamp: string;
  id: string;
  offerId: string;
  offeror: string;
  quantity: string;
  status: string;
  tokenId: string;
  tokenType: string;
  totalPrice: string;
  transactionHash?: string;
  nft: NFT;
};

export type AcceptedOffer = {
  assetContract: string;
  id: string;
  offerId: string;
  offeror: string;
  quantityBought: string;
  seller: string;
  tokenId: string;
  totalPricePaid: string;
  nft: NFT;
};

/* -------------------------------------------------------------------------------------------------
 * QUERY RESPONSE TYPES
 * -----------------------------------------------------------------------------------------------*/

export type AllListingsQueryResponse = {
  allListings: Listing[];
};

export type SingleListingQueryResponse = {
  allListings: Listing[];
};

export type CompletedListingsQueryResponse = {
  completedListings: Listing[];
};

export type NewListingsQueryResponse = {
  newListings: Listing[];
};

export type NewSaleListingsQueryResponse = {
  newSaleListings: NewSaleListing[];
};

export type AllAuctionsQueryResponse = {
  allAuctions: Auction[];
};

export type SingleAuctionQueryResponse = {
  allAuctions: Auction[];
};

export type CompletedAuctionsQueryResponse = {
  completedAuctions: Auction[];
};

export type NewAuctionsQueryResponse = {
  newAuctions: Auction[];
};

export type AuctionClosedQueryResponse = {
  auctionCloseds: AuctionClosed[];
};

export type AllOffersQueryResponse = {
  allOffers: Offer[];
};

export type SingleOfferQueryResponse = {
  allOffers: Offer[];
};

export type CompletedOffersQueryResponse = {
  completedOffers: Offer[];
};

export type AcceptedOffersQueryResponse = {
  acceptedOffers: AcceptedOffer[];
};

export type NewOffersQueryResponse = {
  newOffers: Offer[];
};

export type NewBidsQueryResponse = {
  newBids: Auction[];
};

export type NewBidsUserQueryResponse = {
  newBids: Auction[];
};
