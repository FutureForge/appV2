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
