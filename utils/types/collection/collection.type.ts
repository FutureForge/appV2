import { NFTMetadata } from "../graphql";

export type Collection = {
  collectionName: string;
  collectionDescription: string;
  collectionAddress: string;
  collectionImage: string;
  collectionBackgroundImage: string;
  collectionOwnerAddress: string;
};

export type SingleCollection = {
  collection: Collection;
  nftLength: number;
  nfts: {
    tokenId: string;
    owner: string;
    type: string;
    tokenURI: string;
    metadata: NFTMetadata
  }[];
};

export type CollectionsQueryResponse = {
  collections: Collection[];
};

export type SingleCollectionQueryResponse = {
  collection: SingleCollection;
};
