import {
  useUserAuctionsQuery,
  useUserChainInfo,
  useUserCollectionsQuery,
  useUserExpiredAuctionsQuery,
  useUserExpiredListingsQuery,
  useUserExpiredOffersQuery,
  useUserListingsQuery,
  useUserNFTActivitiesQuery,
  useUserNFTsQuery,
  useUserOffersQuery,
  useUserOffersReceivedQuery,
  useUserPendingPayoutQuery,
} from "@/modules/query";
import { Auction, Listing, Offer } from "@/modules/query/utils";
import { ITEMS_PER_PAGE } from "@/pages/collections/old-[collectionAddress]";
import {
  Collection,
  UserNFTData,
} from "@/utils/types/collection/collection.type";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export const useProfileFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "";

  const filters = [
    "NFTS",
    "Listed",
    "Auctions",
    "Offers Made",
    "NFT Activities",
    "Expired",
    "Pending Payout",
    "Offers Received",
    "Collections",
  ];

  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

  useEffect(() => {
    if (currentFilter) {
      const matchingFilter = filters.find(
        (filter) => filter.toLowerCase().replace(/\s+/g, "_") === currentFilter
      );
      if (matchingFilter) {
        setSelectedFilter(matchingFilter);
      }
    } else {
      setSelectedFilter(filters[0]);
    }
  }, [currentFilter]);

  const handleFilterClick = (filter: string) => {
    if (filter) {
      setSelectedFilter(filter);
      const queryFilter = filter.toLowerCase().replace(/\s+/g, "_");
      router.push(`/profile?filter=${queryFilter}`);
    }
  };

  return { filters, selectedFilter, handleFilterClick };
};

export const useInfiniteLoading = (initialCount = ITEMS_PER_PAGE) => {
  const [displayCount, setDisplayCount] = useState(initialCount);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
    delay: 100,
  });

  useEffect(() => {
    if (inView) {
      const timeoutId = setTimeout(() => {
        setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [inView]);

  const resetDisplayCount = () => setDisplayCount(initialCount);

  return { displayCount, loadMoreRef, resetDisplayCount };
};

export const useProfileData = (selectedFilter: string, searchQuery: string) => {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  // All query hooks
  const {
    data: userNFTs,
    isLoading: isUserNFTsLoading,
    isError: isUserNFTsError,
    error: userNFTsError,
  } = useUserNFTsQuery();

  const {
    data: userListings,
    isLoading: isUserListingsLoading,
    isError: isUserListingsError,
    error: userListingsError,
  } = useUserListingsQuery();

  const {
    data: userAuctions,
    isLoading: isUserAuctionsLoading,
    isError: isUserAuctionsError,
    error: userAuctionsError,
  } = useUserAuctionsQuery();

  const {
    data: userPendingPayout,
    isLoading: isUserPendingPayoutLoading,
    isError: isUserPendingPayoutError,
    error: userPendingPayoutError,
  } = useUserPendingPayoutQuery();

  const {
    data: userOffers,
    isLoading: isUserOffersLoading,
    isError: isUserOffersError,
    error: userOffersError,
  } = useUserOffersQuery();

  const {
    data: userOffersReceived,
    isLoading: isUserOffersReceivedLoading,
    isError: isUserOffersReceivedError,
    error: userOffersReceivedError,
  } = useUserOffersReceivedQuery();

  const {
    data: userExpiredListings,
    isLoading: isUserExpiredListingsLoading,
    isError: isUserExpiredListingsError,
    error: userExpiredListingsError,
  } = useUserExpiredListingsQuery();

  const {
    data: userExpiredAuctions,
    isLoading: isUserExpiredAuctionsLoading,
    isError: isUserExpiredAuctionsError,
    error: userExpiredAuctionsError,
  } = useUserExpiredAuctionsQuery();

  const {
    data: userExpiredOffers,
    isLoading: isUserExpiredOffersLoading,
    isError: isUserExpiredOffersError,
    error: userExpiredOffersError,
  } = useUserExpiredOffersQuery();

  const {
    data: userCollections,
    isLoading: isUserCollectionsLoading,
    isError: isUserCollectionsError,
    error: userCollectionsError,
  } = useUserCollectionsQuery();

  const {
    data: userNFTActivities,
    isLoading: isUserNFTActivitiesLoading,
    isError: isUserNFTActivitiesError,
    error: userNFTActivitiesError,
  } = useUserNFTActivitiesQuery();

  // Filter functions
  const filterData = (data: any[], searchTerm: string) => {
    if (!data) return [];

    return data.filter((item) => {
      if (!item?.nft?.metadata?.name && !item?.tokenId) return false;

      const searchTermNormalized = searchTerm
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "");

      const nameNoSpace = item?.nft?.metadata?.name
        ?.toLowerCase()
        .replace(/\s+/g, "");
      const tokenIdNoSpace = item.tokenId
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "");
      const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

      return combinedField.includes(searchTermNormalized);
    });
  };

  // Get data based on selected filter
  const getFilteredData = () => {
    switch (selectedFilter) {
      case "NFTS":
        return {
          data: filterData(userNFTs || [], searchQuery),
          isLoading: isUserNFTsLoading,
          error: isUserNFTsError ? userNFTsError : undefined,
        };
      case "Listed":
        return {
          data: filterData(userListings?.userListings || [], searchQuery),
          isLoading: isUserListingsLoading,
          error: isUserListingsError ? userListingsError : undefined,
        };
      case "Auctions":
        return {
          data: filterData(userAuctions?.userAuctions || [], searchQuery),
          isLoading: isUserAuctionsLoading,
          error: isUserAuctionsError ? userAuctionsError : undefined,
        };
      case "Offers Made":
        return {
          data: filterData(userOffers?.userOffers || [], searchQuery),
          isLoading: isUserOffersLoading,
          error: isUserOffersError ? userOffersError : undefined,
        };
      case "Pending Payout":
        return {
          data: filterData(
            userPendingPayout?.userPendingPayout || [],
            searchQuery
          ),
          isLoading: isUserPendingPayoutLoading,
          error: isUserPendingPayoutError ? userPendingPayoutError : undefined,
        };
      case "Offers Received":
        return {
          data: filterData(
            userOffersReceived?.userOffersReceived || [],
            searchQuery
          ),
          isLoading: isUserOffersReceivedLoading,
          error: isUserOffersReceivedError
            ? userOffersReceivedError
            : undefined,
        };
      case "Expired":
        return {
          listingsData: filterData(
            userExpiredListings?.expiredListings || [],
            searchQuery
          ),
          auctionsData: filterData(
            userExpiredAuctions?.expiredAuctions || [],
            searchQuery
          ),
          offersData: filterData(
            userExpiredOffers?.expiredOffers || [],
            searchQuery
          ),
          isLoading:
            isUserExpiredListingsLoading ||
            isUserExpiredAuctionsLoading ||
            isUserExpiredOffersLoading,
          error: isUserExpiredListingsError
            ? userExpiredListingsError
            : isUserExpiredAuctionsError
            ? userExpiredAuctionsError
            : isUserExpiredOffersError
            ? userExpiredOffersError
            : undefined,
        };
      case "Collections":
        return {
          data: userCollections || [],
          isLoading: isUserCollectionsLoading,
          error: isUserCollectionsError ? userCollectionsError : undefined,
        };
      case "NFT Activities":
        return {
          data: userNFTActivities || [],
          isLoading: isUserNFTActivitiesLoading,
          error: isUserNFTActivitiesError ? userNFTActivitiesError : undefined,
        };
      default:
        return {
          data: [],
          isLoading: false,
          error: undefined,
        };
    }
  };

  const filteredData = getFilteredData();

  return {
    nftsData:
      selectedFilter === "NFTS"
        ? (filteredData.data as UserNFTData[])
        : ([] as UserNFTData[]),
    listingsData:
      selectedFilter === "Listed"
        ? (filteredData.data as Listing[])
        : ([] as Listing[]),
    auctionsData:
      selectedFilter === "Auctions"
        ? (filteredData.data as Auction[])
        : ([] as Auction[]),
    offersData:
      selectedFilter === "Offers Made"
        ? (filteredData.data as Offer[])
        : ([] as Offer[]),
    pendingPayoutData:
      selectedFilter === "Pending Payout"
        ? (filteredData.data as Auction[])
        : ([] as Auction[]),
    offersReceivedData:
      selectedFilter === "Offers Received"
        ? (filteredData.data as Offer[])
        : ([] as Offer[]),
    collectionsData:
      selectedFilter === "Collections"
        ? (filteredData.data as Collection[])
        : ([] as Collection[]),
    nftActivitiesData:
      selectedFilter === "NFT Activities"
        ? (filteredData.data as any[])
        : ([] as any[]),
    expiredListingsData:
      selectedFilter === "Expired"
        ? (filteredData.listingsData as Listing[])
        : ([] as Listing[]),
    expiredAuctionsData:
      selectedFilter === "Expired"
        ? (filteredData.auctionsData as Auction[])
        : ([] as Auction[]),
    expiredOffersData:
      selectedFilter === "Expired"
        ? (filteredData.offersData as Offer[])
        : ([] as Offer[]),
    isLoading: filteredData.isLoading,
    error: filteredData.error,
  };
};
