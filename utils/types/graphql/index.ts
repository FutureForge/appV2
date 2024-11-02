
type Attribute = {
  traitType: string;
  value: string;
};

type Property = {
  name: string;
  value: string;
};

type NFTMetadata = {
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

type NFT = {
  assetContract: string;
  id: string;
  metadata: NFTMetadata;
  owner: string;
  tokenId: string;
  tokenURI: string;
  type: string;
};

type Listing = {
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

type NewSaleListing = {
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

type Auction = {
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
};

type AuctionClosed = {
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

type Offer = {
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

type AcceptedOffer = {
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

type AllListingsQueryResponse = {
  allListings: Listing[];
};

type CompletedListingsQueryResponse = {
  completedListings: Listing[];
};

type NewListingsQueryResponse = {
  newListings: Listing[];
};

type NewSaleListingsQueryResponse = {
  newSaleListings: NewSaleListing[];
};

type AllAuctionsQueryResponse = {
  allAuctions: Auction[];
};

type CompletedAuctionsQueryResponse = {
  completedAuctions: Auction[];
};

type NewAuctionsQueryResponse = {
  newAuctions: Auction[];
};

type AuctionClosedQueryResponse = {
  auctionCloseds: AuctionClosed[];
};

type AllOffersQueryResponse = {
  allOffers: Offer[];
};

type CompletedOffersQueryResponse = {
  completedOffers: Offer[];
};

type AcceptedOffersQueryResponse = {
  acceptedOffers: AcceptedOffer[];
};

type NewOffersQueryResponse = {
  newOffers: Offer[];
};
