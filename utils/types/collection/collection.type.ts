import { NFTMetadata } from "../graphql";

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
  nfts: CollectionNFTType[];
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

export type CollectionsQueryResponse = {
  collections: Collection[];
  totalCount: number;
};

export type CollectionNFTType = {
  tokenId: string;
  owner: string;
  type: string;
  tokenURI: string;
  metadata: NFTMetadata;
};
