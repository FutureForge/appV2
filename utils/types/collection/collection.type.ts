export type Attribute = {
  trait_type: string;
  value: string;
};

type Property = {
  name: string;
  value: string;
};

export type WinningBid = {
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

export type Collection = {
  _id: number;
  collectionName: string;
  collectionDescription: string;
  collectionAddress: string;
  collectionImage: string;
  collectionBackgroundImage: string;
  collectionOwnerAddress: string;
  floorPrice: number;
  totalVolume: number;
  holderCount: number;
  collectionSocials: ISocial[];
  isPromoted: boolean;
  promotionBackgroundImage: string;
  promotionStartDate: Date;
  promotionEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

interface ISocial {
  socialName: string;
  socialLink: string;
}

export type SingleCollection = {
  collection: Collection;
  nftLength: number;
  // nfts: CollectionNFTType[];
  nfts: CollectionNFTData[];
  hasMetadataField: boolean;
};

export type TokenDetails = {
  contractAddress: string;
  blockNumberCreate: string;
  creatorAddress: string;
  timestamp: string;
  tokenType: string;
  txHashCreate: string;
  holderCount: number;
  transferCount: number;
};

// export type CollectionsQueryResponse = {
//   collections: Collection[];
//   totalCount: number;
// };

export type CollectionNFTType = {
  id?: bigint | string | number;
  tokenId: string;
  owner: string;
  type: string;
  tokenURI: string;
  metadata: NFTMetadata;
};

export type UserNFTData = {
  address: string;
  balance: string;
  blockNumber: number;
  contractAddress: string;
  nft: CollectionNFTType;
  timestamp: string;
  tokenId: string;
  tokenIds: string[];
  tokenType: string;
  type: string;
};

export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface CollectionNFTMetadata {
  image: string;
  external_url: string;
  description: string;
  name: string;
  attributes: NFTAttribute[];
  background_color: string;
  animation_url: string;
  tokenId: string;
}

export interface CollectionNFTData {
  contractAddress: string;
  tokenId: string;
  blockNumber: number;
  creatorAddress: string;
  ownerAddress: string;
  timestamp: string;
  tokenType: string;
  tokenURI: string;
  transferCount: number;
  metadata: CollectionNFTMetadata;
}

export interface NFTResultMetadata {
  id: string;
  uri: string;
  name: string;
  description: string;
  image: string;
  attributes: Attribute[];
  external_url: string;
}

export interface NFTResult {
  metadata: NFTResultMetadata;
  owner: string;
  type: string;
  supply: string;
}

export interface NFTResultResponse {
  result: NFTResult;
}
