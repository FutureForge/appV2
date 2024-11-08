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
};

export type SingleCollection = {
  collection: Collection;
  nftLength: number;
  nfts: {
    tokenId: string;
    owner: string;
    type: string;
    tokenURI: string;
    metadata: NFTMetadata;
  }[];
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
};

