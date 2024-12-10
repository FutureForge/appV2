import React, { useEffect, useState } from "react";
import {
  useAcceptedOffersQuery,
  useAllAuctionsQuery,
  useAllListingsQuery,
  useAllOffersQuery,
  useAuctionClosedQuery,
  useNewAuctionsQuery,
  useNewBidsQuery,
  useNewListingsQuery,
  useNewSaleListingsQuery,
} from "@/modules/query";
import { EmptyState, ErrorComponent, Header, NFTCard } from "@/modules/app";
import { cn } from "@/modules/app/utils";
import Caret from "@/assets/arrow-left-s-line.svg";
import {
  AcceptedOffer,
  Auction,
  AuctionClosed,
  Listing,
  NewBid,
  NewSaleListing,
  Offer,
} from "@/utils/types/graphql";
import { motion } from "framer-motion";
import { AllListingTable } from "../table/all-listing";
import { AllAuctionTable } from "../table/all-auction";
import { AllOffersTable } from "../table/all-offers";
import { RecentlyListedTable } from "../table/recently-listed";
import { RecentlySoldListingTable } from "../table/recently-sold";
import { RecentlyAuctionedTable } from "../table/recently-auctioned";
import { RecentlySoldAuctionTable } from "../table/recently-sold-auction";
import { RecentBidsTable } from "../table/recent-bids";
import { Pagination } from "@/modules/app/component/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { AcceptedOfferTable } from "../table/accepted-offers";

const filters = [
  "All Listings",
  "All Auctions",
  "All Offers",
  "Recent Listings",
  "Recent Sales",
  "Recent Auctions",
  "Recent Sold Auctions",
  "Recent Bids",
  "Accepted Offers",
];

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
  } = useAllListingsQuery({ limit: fetchLimit });

  const {
    data: AllAuctions,
    isLoading: isAllAuctionsLoading,
    isError: isAllAuctionsError,
  } = useAllAuctionsQuery({
    limit: fetchLimit,
  });

  // const recentlyListed = AllListings?.slice(-5);
  const {
    data: NewListings,
    isLoading: isNewListingsLoading,
    isError: isNewListingsError,
  } = useNewListingsQuery({ limit: fetchLimit });

  const {
    data: NewSaleListings,
    isLoading: isNewSaleListingsLoading,
    isError: isNewSaleListingsError,
  } = useNewSaleListingsQuery({ limit: fetchLimit });

  const {
    data: NewAuctioned,
    isLoading: isNewAuctionedLoading,
    isError: isNewAuctionedError,
  } = useNewAuctionsQuery({ limit: fetchLimit });

  const {
    data: AuctionClosed,
    isLoading: isAuctionClosedLoading,
    isError: isAuctionClosedError,
  } = useAuctionClosedQuery({ limit: fetchLimit });

  const {
    data: NewBids,
    isLoading: isNewBidsLoading,
    isError: isNewBidsError,
  } = useNewBidsQuery({ limit: fetchLimit });

  const {
    data: AllOffers,
    isLoading: isAllOffersLoading,
    isError: isAllOffersError,
  } = useAllOffersQuery({ limit: fetchLimit });

  const {
    data: AcceptedOffers,
    isLoading: isAcceptedOfferLoading,
    isError: isAcceptedOfferError,
  } = useAcceptedOffersQuery({ limit: fetchLimit });

  const isError =
    isAllListingsError ||
    isAllOffersError ||
    isNewAuctionedError ||
    isAuctionClosedError ||
    isNewSaleListingsError ||
    isAcceptedOfferError ||
    isNewListingsError ||
    isAllAuctionsError ||
    isNewBidsError;

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
            const tokenIdNoSpace = listing?.nft?.tokenId
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
            const tokenIdNoSpace = auction.nft.tokenId
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
          const tokenIdNoSpace = auction?.nft?.tokenId
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredAllOffers as Offer[];

      case filters[3]:
        const filteredNewListings = NewListings?.filter((listing) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = listing?.nft?.metadata?.name
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const tokenIdNoSpace = listing.nft.tokenId
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredNewListings as Listing[];

      case filters[4]:
        const filteredNewSaleListings = NewSaleListings?.filter((listing) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = listing?.nft?.metadata?.name
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const tokenIdNoSpace = listing.nft.tokenId
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredNewSaleListings as NewSaleListing[];

      case filters[5]:
        const filteredNewAuctioned = NewAuctioned?.filter((auction) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = auction?.nft?.metadata?.name
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const tokenIdNoSpace = auction?.nft?.tokenId
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredNewAuctioned as Auction[];

      case filters[6]:
        const filteredNewSoldAuction = AuctionClosed?.filter((auction) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = auction?.nft?.metadata?.name
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const tokenIdNoSpace = auction?.nft?.tokenId
            ?.toLowerCase()
            .replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredNewSoldAuction as AuctionClosed[];

      case filters[7]:
        const filteredNewBids = NewBids?.filter((bid) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = bid?.nft?.metadata?.name
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const tokenIdNoSpace = bid.nft.tokenId
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredNewBids as NewBid[];

      case filters[8]:
        const filteredAcceptedOffers = AcceptedOffers?.filter((auction) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = auction?.nft?.metadata?.name
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const tokenIdNoSpace = auction?.nft?.tokenId
            ?.toLowerCase()
            ?.replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredAcceptedOffers as AcceptedOffer[];

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
                              tokenId: listing.nft.tokenId,
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
                              tokenId: auction.nft.tokenId,
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
                              tokenId: offers.nft.tokenId,
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

        {/* Recent Listings */}
        {selectedFilter === filters[3] && (
          <>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <RecentlyListedTable
                    isLoading={isNewListingsLoading}
                    data={currentPageData as Listing[]}
                  />
                ) : (
                  <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
                    {currentPageData?.map((listing, index) => {
                      return (
                        <NFTCard
                          key={index}
                          data={listing}
                          type="new-listing"
                          cta="View Item"
                          extraCTA="Buy Now"
                          status="listed"
                          onClick={() => {
                            handleViewItem({
                              contractAddress: listing.assetContract,
                              tokenId: listing.nft.tokenId,
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
                    : "No recently listed items found"
                }
              />
            )}
          </>
        )}

        {/* Recently Sold Listings */}
        {selectedFilter === filters[4] && (
          <>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <RecentlySoldListingTable
                    isLoading={isNewSaleListingsLoading}
                    data={currentPageData as NewSaleListing[]}
                  />
                ) : (
                  <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
                    {currentPageData?.map((listing, index) => {
                      return (
                        <NFTCard
                          key={index}
                          data={listing}
                          type="new-sale-listing"
                          cta="View Item"
                          onClick={() => {
                            handleViewItem({
                              contractAddress: listing.assetContract,
                              tokenId: listing.nft.tokenId,
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
                    : "No recently sold listings found"
                }
              />
            )}
          </>
        )}

        {/* Recent Auctions */}
        {selectedFilter === filters[5] && (
          <>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <RecentlyAuctionedTable
                    isLoading={isNewAuctionedLoading}
                    data={currentPageData as Auction[]}
                  />
                ) : (
                  <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
                    {currentPageData?.map((auction, index) => {
                      return (
                        <NFTCard
                          key={index}
                          data={auction}
                          type="new-auction"
                          cta="View Item"
                          extraCTA="Buy Auction"
                          status="auctioned"
                          onClick={() => {
                            handleViewItem({
                              contractAddress: auction.assetContract,
                              tokenId: auction.nft.tokenId,
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
                    : "No recently auctioned items found"
                }
              />
            )}
          </>
        )}

        {/* Recent Sold Auctions */}
        {selectedFilter === filters[6] && (
          <>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <RecentlySoldAuctionTable
                    isLoading={isAuctionClosedLoading}
                    data={currentPageData as AuctionClosed[]}
                  />
                ) : (
                  <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
                    {currentPageData?.map((auction, index) => {
                      return (
                        <NFTCard
                          key={index}
                          data={auction}
                          type="new-sold-auction"
                          cta="View Item"
                          onClick={() => {
                            handleViewItem({
                              contractAddress: auction.assetContract,
                              tokenId: auction.nft.tokenId,
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
                    : "No recently sold auctions found"
                }
              />
            )}
          </>
        )}

        {/* Recent Bids */}
        {selectedFilter === filters[7] && (
          <>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <RecentBidsTable
                    isLoading={isNewBidsLoading}
                    data={currentPageData as NewBid[]}
                  />
                ) : (
                  <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
                    {currentPageData?.map((bid, index) => {
                      return (
                        <NFTCard
                          key={index}
                          data={bid}
                          type="bids"
                          cta="View Item"
                          onClick={() => {
                            handleViewItem({
                              contractAddress: bid.assetContract,
                              tokenId: bid.nft.tokenId,
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
                    ? "No item found according to your search"
                    : "No recently bid items found"
                }
              />
            )}
          </>
        )}

        {/* Accepted Offers */}
        {selectedFilter === filters[8] && (
          <>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <AcceptedOfferTable
                    isLoading={isAcceptedOfferLoading}
                    data={currentPageData as AcceptedOffer[]}
                  />
                ) : (
                  <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
                    {currentPageData?.map((acceptedOffer, index) => {
                      return (
                        <NFTCard
                          key={index}
                          data={acceptedOffer}
                          type="new-accepted-offers"
                          cta="View Item"
                          onClick={() => {
                            handleViewItem({
                              contractAddress: acceptedOffer.assetContract,
                              tokenId: acceptedOffer.nft.tokenId,
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
                    ? "No item found according to your search"
                    : "No accepted offers found"
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  pageNumbers,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageNumbers: number[];
}) {
  {
    /* Add pagination controls */
  }
  return (
    <div className="flex items-center justify-between w-full">
      <button
        title="previous-page"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "w-8 h-[30px] rounded-lg text-sm flex items-center justify-center bg-transparent hover:bg-tertiary",
          {
            "cursor-not-allowed hover:bg-transparent": currentPage === 1,
          }
        )}
      >
        <Caret />
      </button>
      <div className="flex justify-center gap-4 mt-4 mb-8">
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-[30px] rounded-lg text-sm  transition duration-300 ease-in-out ${
              currentPage === pageNum
                ? "bg-primary text-white"
                : "bg-transparent border border-border text-muted-foreground hover:bg-tertiary"
            }`}
          >
            {pageNum}
          </button>
        ))}
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <>
            <span className="text-muted-foreground">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-[30px] rounded-lg bg-transparent border border-border text-muted-foreground hover:bg-tertiary transition duration-300 ease-in-out"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      <button
        title="next-page"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "w-8 h-[30px] rounded-lg text-sm flex items-center justify-center bg-transparent hover:bg-tertiary",
          {
            "cursor-not-allowed hover:bg-transparent":
              currentPage === totalPages,
          }
        )}
      >
        <Caret className="rotate-180" />
      </button>
    </div>
  );
}
