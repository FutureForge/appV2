type Collection = {
  collectionName: string;
  collectionDescription: string;
  collectionAddress: string;
  collectionImage: string;
  collectionBackgroundImage: string;
  collectionOwnerAddress: string;
};

type SingleCollection = {
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

type CollectionsQueryResponse = {
  collections: Collection[];
};

type SingleCollectionQueryResponse = {
  collection: SingleCollection;
};
