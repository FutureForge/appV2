import React, { useEffect, useState } from "react";
import {
  useAllAuctionsBlockchainQuery,
  useAllListingBlockchainQuery,
  useAllOffersBlockchainQuery,
} from "@/modules/query";
import { EmptyState, ErrorComponent, Header, NFTCard } from "@/modules/app";
import { motion } from "framer-motion";
import { AllListingTable } from "../table/all-listing";
import { AllAuctionTable } from "../table/all-auction";
import { AllOffersTable } from "../table/all-offers";
import { Pagination } from "@/modules/app/component/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Listing,
  Offer,
  Auction,
} from "@/modules/query/utils/index.utils.query";

const filters = ["All Listings", "All Auctions", "All Offers"];

export function BrowsePage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");

  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "";

  const itemsPerPage = 5;
  const fetchLimit = 50;

  const {
    data: AllListings,
    isLoading: isAllListingsLoading,
    isError: isAllListingsError,
  } = useAllListingBlockchainQuery({
    limit: fetchLimit,
    type: "live-listing",
  });

  const {
    data: AllAuctions,
    isLoading: isAllAuctionsLoading,
    isError: isAllAuctionsError,
  } = useAllAuctionsBlockchainQuery({
    limit: fetchLimit,
    type: "live-auction",
  });

  const {
    data: AllOffers,
    isLoading: isAllOffersLoading,
    isError: isAllOffersError,
  } = useAllOffersBlockchainQuery({
    limit: fetchLimit,
    type: "live-offer",
  });

  const isError = isAllListingsError || isAllOffersError || isAllAuctionsError;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterClick = (filter: string) => {
    // if (filter) setSelectedFilter(filter);
    if (filter) {
      setSelectedFilter(filter);
      const queryFilter = filter.toLowerCase().replace(/\s+/g, "_");
      router.push(`/browse?filter=${queryFilter}`);
    }
  };

  const getFilteredData = () => {
    switch (selectedFilter) {
      case filters[0]:
        const filteredAllListings =
          AllListings?.filter((listing) => {
            const searchTerm = searchQuery
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "");
            const nameNoSpace = listing?.nft?.metadata?.name
              ?.toLowerCase()
              ?.replace(/\s+/g, "");
            const tokenIdNoSpace = listing.tokenId
              .toString()
              ?.toLowerCase()
              ?.replace(/\s+/g, "");
            const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

            return combinedField.includes(searchTerm);
          }) ?? [];

        return filteredAllListings as Listing[];

      case filters[1]:
        const filteredAllAuctions =
          AllAuctions?.filter((auction) => {
            const searchTerm = searchQuery
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "");
            const nameNoSpace = auction?.nft?.metadata?.name
              ?.toLowerCase()
              ?.replace(/\s+/g, "");
            const tokenIdNoSpace = auction.tokenId
              .toString()
              ?.toLowerCase()
              ?.replace(/\s+/g, "");
            const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

            return combinedField.includes(searchTerm);
          }) ?? [];

        return filteredAllAuctions as Auction[];

      case filters[2]:
        const filteredAllOffers = AllOffers?.filter((auction) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = auction?.nft?.metadata?.name
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const tokenIdNoSpace = auction?.tokenId
            .toString()
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredAllOffers as Offer[];

      default:
        return null;
    }
  };

  const filteredData = getFilteredData();

  const totalCount = filteredData?.length || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData?.slice(startIndex, endIndex);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo(0, 0);
  };

  const handleViewItem = ({
    contractAddress,
    tokenId,
  }: {
    contractAddress: string;
    tokenId: string;
  }) => {
    router.push(`/nft/${contractAddress}/${tokenId}`);
  };

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

  if (isError) {
    return <ErrorComponent />;
  }

  return (
    <div className="pt-[17px]">
      <Header
        isActive={isActive}
        setIsActive={setIsActive}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        onFilterClick={handleFilterClick}
        filters={filters}
        showFilters
      />
      {/* Conditionally render based on selectedFilter */}
      <div className="mt-8 w-full">
        {/* All Listings */}
        {selectedFilter === filters[0] && (
          <motion.div>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <AllListingTable
                    isLoading={isAllListingsLoading}
                    data={currentPageData as Listing[]}
                  />
                ) : (
                  <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
                    {currentPageData?.map((listing, index) => {
                      return (
                        <NFTCard
                          key={index}
                          data={listing}
                          type="listing"
                          cta="View Item"
                          extraCTA="Buy Now"
                          status="listed"
                          onClick={() => {
                            handleViewItem({
                              contractAddress: listing.assetContract,
                              tokenId: listing.tokenId.toString(),
                            });
                          }}
                        />
                      );
                    })}
                  </div>
                )}
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <EmptyState
                message={
                  searchQuery.length > 0
                    ? "No items found according to your search"
                    : "No listings found"
                }
              />
            )}
          </motion.div>
        )}

        {/* All Auctions */}
        {selectedFilter === filters[1] && (
          <>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <AllAuctionTable
                    isLoading={isAllAuctionsLoading}
                    data={currentPageData as Auction[]}
                  />
                ) : (
                  <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
                    {currentPageData?.map((auction, index) => {
                      return (
                        <NFTCard
                          key={index}
                          data={auction}
                          type="auction"
                          cta="View Item"
                          extraCTA="Buy Auction"
                          status="auctioned"
                          onClick={() => {
                            handleViewItem({
                              contractAddress: auction.assetContract,
                              tokenId: auction.tokenId.toString(),
                            });
                          }}
                        />
                      );
                    })}
                  </div>
                )}
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <EmptyState
                message={
                  searchQuery.length > 0
                    ? "No items found according to your search"
                    : "No auctions found"
                }
              />
            )}
          </>
        )}

        {/* All Offers */}
        {selectedFilter === filters[2] && (
          <>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <AllOffersTable
                    isLoading={isAllOffersLoading}
                    data={currentPageData as Offer[]}
                  />
                ) : (
                  <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
                    {currentPageData?.map((offers, index) => {
                      return (
                        <NFTCard
                          key={index}
                          data={offers}
                          type="offers"
                          cta="View Item"
                          onClick={() => {
                            handleViewItem({
                              contractAddress: offers.assetContract,
                              tokenId: offers.tokenId.toString(),
                            });
                          }}
                        />
                      );
                    })}
                  </div>
                )}
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <EmptyState
                message={
                  searchQuery.length > 0
                    ? "No items found according to your search"
                    : "No offers found"
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
