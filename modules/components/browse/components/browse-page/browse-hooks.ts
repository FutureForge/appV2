import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  useAcceptedOfferEventQuery,
  useAllAuctionsBlockchainQuery,
  useAllListingBlockchainQuery,
  useAllOffersBlockchainQuery,
  useAuctionBidEventQuery,
  useCompletedAuctionEventQuery,
  useCompletedListingEventQuery,
} from "@/modules/query";
import { Listing } from "@/modules/query/utils";

export enum QueryBrowsePageFilters {
  ALL_LISTINGS = "all_listings",
  ALL_AUCTIONS = "all_auctions",
  ALL_OFFERS = "all_offers",
  COMPLETED_LISTING = "completed_listing",
  COMPLETED_AUCTION = "completed_auction",
  ACCEPTED_OFFERS = "accepted_offers",
  AUCTION_BIDS = "auction_bids",
}

export const useBrowseFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "";

  const browsePageFilters = [
    "All Listings",
    "All Auctions",
    "All Offers",
    "Completed Listing",
    "Completed Auction",
    "Accepted Offers",
    "Auction Bids",
  ];

  const [selectedFilter, setSelectedFilter] = useState(browsePageFilters[0]);

  useEffect(() => {
    if (currentFilter) {
      const matchingFilter = browsePageFilters.find(
        (filter) => filter.toLowerCase().replace(/\s+/g, "_") === currentFilter
      );
      if (matchingFilter) {
        setSelectedFilter(matchingFilter);
      }
    } else {
      setSelectedFilter(browsePageFilters[0]);
    }
  }, [currentFilter]);

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
    const queryFilter = filter.toLowerCase().replace(/\s+/g, "_");
    router.push(`/browse?filter=${queryFilter}`);
  };

  return { browsePageFilters, selectedFilter, handleFilterClick };
};

export const useBrowseData = (selectedFilter: string, searchQuery: string) => {
  const fetchLimit = 50;

  // All query hooks
  const {
    data: allListings,
    isLoading: isAllListingsLoading,
    isError: isAllListingsError,
  } = useAllListingBlockchainQuery({
    limit: fetchLimit,
    type: "live-listing",
  });

  const {
    data: allAuctions,
    isLoading: isAllAuctionsLoading,
    isError: isAllAuctionsError,
  } = useAllAuctionsBlockchainQuery({
    limit: fetchLimit,
    type: "live-auction",
  });

  const {
    data: allOffers,
    isLoading: isAllOffersLoading,
    isError: isAllOffersError,
  } = useAllOffersBlockchainQuery({
    limit: fetchLimit,
    type: "live-offer",
  });

  const {
    data: completedListingEventQuery,
    isLoading: isLoadingCompletedListing,
    isError: isErrorCompletedListing,
  } = useCompletedListingEventQuery({
    limit: fetchLimit,
  });

  const {
    data: completedAuctionEventQuery,
    isLoading: isLoadingCompletedAuction,
    isError: isErrorCompletedAuction,
  } = useCompletedAuctionEventQuery({
    limit: fetchLimit,
  });

  const {
    data: acceptedOfferEventQuery,
    isLoading: isLoadingAcceptedOffer,
    isError: isErrorAcceptedOffer,
  } = useAcceptedOfferEventQuery({
    limit: fetchLimit,
  });

  const {
    data: auctionBidEventQuery,
    isLoading: isLoadingAuctionBidEvent,
    isError: isErrorAuctionBidEvent,
  } = useAuctionBidEventQuery({
    limit: fetchLimit,
  });

  // Filter function
  const filterData = (data: any[], searchTerm: string) => {
    if (!data) return [];

    return data.filter((item) => {
      const nft = item.nft || item.auction?.nft;
      if (!nft?.metadata?.name && !item.tokenId && !item.auction?.tokenId)
        return false;

      const searchTermNormalized = searchTerm
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "");

      const nameNoSpace = nft?.metadata?.name
        ?.toLowerCase()
        .replace(/\s+/g, "");
      const tokenIdNoSpace = (item.tokenId || item.auction?.tokenId)
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
      case "All Listings":
        return {
          data: filterData(
            (allListings as Listing[]) || ([] as Listing[]),
            searchQuery
          ),
          isLoading: isAllListingsLoading,
          error: isAllListingsError,
        };
      case "All Auctions":
        return {
          data: filterData(allAuctions || [], searchQuery),
          isLoading: isAllAuctionsLoading,
          error: isAllAuctionsError,
        };
      case "All Offers":
        return {
          data: filterData(allOffers || [], searchQuery),
          isLoading: isAllOffersLoading,
          error: isAllOffersError,
        };
      case "Completed Listing":
        return {
          data: filterData(completedListingEventQuery || [], searchQuery),
          isLoading: isLoadingCompletedListing,
          error: isErrorCompletedListing,
        };
      case "Completed Auction":
        return {
          data: filterData(completedAuctionEventQuery || [], searchQuery),
          isLoading: isLoadingCompletedAuction,
          error: isErrorCompletedAuction,
        };
      case "Accepted Offers":
        return {
          data: filterData(acceptedOfferEventQuery || [], searchQuery),
          isLoading: isLoadingAcceptedOffer,
          error: isErrorAcceptedOffer,
        };
      case "Auction Bids":
        return {
          data: filterData(auctionBidEventQuery || [], searchQuery),
          isLoading: isLoadingAuctionBidEvent,
          error: isErrorAuctionBidEvent,
        };
      default:
        return {
          data: [],
          isLoading: false,
          error: false,
        };
    }
  };

  const filteredData = getFilteredData();

  return {
    data: filteredData.data,
    isLoading: filteredData.isLoading,
    error: filteredData.error,
  };
};

export const useBrowsePagination = (data: any[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalCount = data?.length || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = data?.slice(startIndex, endIndex);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo(0, 0);
  };

  return {
    currentPage,
    totalPages,
    currentPageData,
    handlePageChange,
  };
};
