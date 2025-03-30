// components/collections/CollectionPage/hooks/useCollectionData.ts
import { useState } from "react";
import {
  useSingleCollectionInfoQuery,
  useSingleCollectionStatsQuery,
  useUserChainInfo,
} from "@/modules/query";

export const useCollectionData = (collectionAddress: string) => {
  const [filter, setFilter] = useState<string>("Items");

  const { activeAccount } = useUserChainInfo();

  const {
    data: singleCollection,
    isLoading: isCollectionLoading,
    isError: isCollectionError,
  } = useSingleCollectionStatsQuery({
    contractAddress: collectionAddress,
  });

  const {
    data: singleCollectionInfo,
    isLoading: isCollectionInfoLoading,
    isError: isCollectionInfoError,
  } = useSingleCollectionInfoQuery({
    contractAddress: collectionAddress,
  });

  const collection = singleCollectionInfo?.collection;
  const collectionDetails = {
    ...singleCollection?.collectionDetails,
    totalNFTs: singleCollectionInfo?.totalNFTs,
  };

  const isCollectionOwner =
    collection?.collectionOwnerAddress.toLowerCase() ===
    activeAccount?.address.toLowerCase();

  const isLoading = isCollectionLoading || isCollectionInfoLoading;
  const isError = isCollectionError || isCollectionInfoError;

  return {
    collection,
    collectionDetails,
    isLoading,
    isError,
    filter,
    setFilter,
    isCollectionOwner,
  };
};
