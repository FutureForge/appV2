// components/collections/CollectionPage/hooks/useCollectionFilters.ts
import { useState, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import {
  useSingleCollectionStatsQuery,
  useSingleCollectionInfoQuery,
} from "@/modules/query";

export const ITEMS_PER_PAGE = 10;
export const INITIAL_FETCH_LIMIT = 50;

export const useCollectionFilters = (
  collectionAddress: string,
  searchQuery: string,
  selectedFilter: string
) => {
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
    delay: 100,
  });

  const { data: singleCollection } = useSingleCollectionStatsQuery({
    contractAddress: collectionAddress,
  });

  const { data: singleCollectionInfo } = useSingleCollectionInfoQuery({
    contractAddress: collectionAddress,
  });

  const collectionNFTs = singleCollectionInfo?.collectionNFTs;
  const collectionAllAuctions =
    singleCollection?.collectionAuctions?.allAuctions;
  const collectionAllListings =
    singleCollection?.collectionListings?.allListings;
  const collectionAllOffers = singleCollection?.collectionOffers?.allOffers;
  const collectionCompletedListing =
    singleCollection?.collectionListings.completedListing;
  const collectionCompletedAuction =
    singleCollection?.collectionAuctions.completedAuction;
  const collectionTokenTransfers = singleCollection?.tokenTransfers;

  const collectionSales = [
    ...(collectionCompletedListing?.map((sale) => ({
      ...sale,
      saleType: "completed-listing",
      nftStatus: "listed",
    })) || []),
    ...(collectionCompletedAuction?.map((sale) => ({
      ...sale,
      saleType: "completed-auction",
      nftStatus: "auctioned",
    })) || []),
  ].flat();

  const filteredNFTs = useMemo(
    () =>
      collectionNFTs?.filter((nft) => {
        const searchTerm = searchQuery.toLowerCase().trim().replace(/\s+/g, "");
        const nameNoSpace = nft.metadata.name.toLowerCase().replace(/\s+/g, "");
        const tokenIdNoSpace = nft.tokenId.toLowerCase().replace(/\s+/g, "");
        const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;
        const matchesSearch = combinedField.includes(searchTerm);

        const isListed = collectionAllListings?.some(
          (listing) => Number(listing.tokenId) === Number(nft.tokenId)
        );
        const isAuctioned = collectionAllAuctions?.some(
          (auction) => Number(auction.tokenId) === Number(nft.tokenId)
        );

        switch (selectedFilter) {
          case "All":
            return matchesSearch;
          case "Auction":
            return matchesSearch && isAuctioned;
          case "Listing":
            return matchesSearch && isListed;
          default:
            return matchesSearch;
        }
      }) ?? [],
    [
      collectionNFTs,
      searchQuery,
      selectedFilter,
      collectionAllListings,
      collectionAllAuctions,
    ]
  );

  const filteredOffers =
    collectionAllOffers?.filter((offer) => {
      const searchTerm = searchQuery.toLowerCase().trim().replace(/\s+/g, "");
      const nameNoSpace = offer.nft.metadata.name
        ?.toLowerCase()
        .replace(/\s+/g, "");
      const tokenIdNoSpace = offer.tokenId
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "");
      const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

      return combinedField.includes(searchTerm);
    }) ?? [];

  const filteredSales =
    collectionSales?.filter((sale) => {
      const searchTerm = searchQuery.toLowerCase().trim().replace(/\s+/g, "");
      const nameNoSpace = sale.nft.metadata.name
        ?.toLowerCase()
        .replace(/\s+/g, "");
      const tokenIdNoSpace = sale.tokenId
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "");
      const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

      return combinedField.includes(searchTerm);
    }) ?? [];

  const filteredTransfers =
    collectionTokenTransfers?.filter((transfer) => {
      const searchTerm = searchQuery.toLowerCase().trim().replace(/\s+/g, "");
      const nameNoSpace =
        transfer?.nft?.metadata?.name?.toLowerCase().replace(/\s+/g, "") || "";
      const tokenIdNoSpace = transfer?.tokenId
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "");
      const addressFromNoSpace = transfer?.addressFrom
        ?.toLowerCase()
        .replace(/\s+/g, "");
      const addressToNoSpace = transfer?.addressTo
        ?.toLowerCase()
        .replace(/\s+/g, "");
      const combinedField = `${nameNoSpace}${tokenIdNoSpace}${addressFromNoSpace}${addressToNoSpace}`;

      return combinedField.includes(searchTerm);
    }) ?? [];

  const paginatedNFTs = useMemo(
    () => filteredNFTs?.slice(0, displayCount),
    [filteredNFTs, displayCount]
  );

  const paginatedOffers = filteredOffers?.slice(0, displayCount);
  const paginatedSales = filteredSales?.slice(0, displayCount);
  const paginatedTransfers = filteredTransfers?.slice(0, displayCount);

  useEffect(() => {
    if (inView) {
      const timeoutId = setTimeout(() => {
        setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [inView]);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedFilter]);

  return {
    filteredNFTs,
    paginatedNFTs,
    filteredOffers,
    paginatedOffers,
    filteredSales,
    paginatedSales,
    filteredTransfers,
    paginatedTransfers,
    displayCount,
    loadMoreRef,
    collectionAllListings,
    collectionAllAuctions,
  };
};
