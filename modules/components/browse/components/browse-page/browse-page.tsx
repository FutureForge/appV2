import React, { useState } from "react";
import { BrowsePageHeader } from "../header/header";
import {
  useAllAuctionsQuery,
  useAllListingsQuery,
  useAuctionClosedQuery,
  useNewAuctionsQuery,
  useNewListingsQuery,
  useNewSaleListingsQuery,
} from "@/modules/query";
import Head from "next/head";
import { NFTCard } from "@/modules/app";
import { useRouter } from "next/navigation";
import { cn } from "@/modules/app/utils";
import Caret from "@/assets/arrow-left-s-line.svg";
import {
  Auction,
  AuctionClosed,
  Listing,
  NewSaleListing,
} from "@/utils/types/graphql";
import { motion } from "framer-motion";
import { AllListingTable } from "../table/all-listing";
import { AllAuctionTable } from "../table/all-auction";
import { RecentlyListedTable } from "../table/recently-listed";
import { RecentlySoldListingTable } from "../table/recently-sold";
import { RecentlyAuctionedTable } from "../table/recently-auctioned";
import { RecentlySoldAuctionTable } from "../table/recently-sold-auction";

const filters = [
  "All Listings",
  "All Auctions",
  "Recently Listed",
  "Recently Sold Listing",
  "Recently Auctioned",
  "Recently Sold Auction",
];

export function BrowsePage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

  const itemsPerPage = 2;
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

  console.log({ AllListings, AllAuctions });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
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
            const nameNoSpace = listing.nft.metadata.name
              .toLowerCase()
              .replace(/\s+/g, "");
            const tokenIdNoSpace = listing.nft.tokenId
              .toLowerCase()
              .replace(/\s+/g, "");
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
            const nameNoSpace = auction.nft.metadata.name
              .toLowerCase()
              .replace(/\s+/g, "");
            const tokenIdNoSpace = auction.nft.tokenId
              .toLowerCase()
              .replace(/\s+/g, "");
            const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

            return combinedField.includes(searchTerm);
          }) ?? [];

        return filteredAllAuctions as Auction[];
      case filters[2]:
        const filteredNewListings = NewListings?.filter((listing) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = listing.nft.metadata.name
            .toLowerCase()
            .replace(/\s+/g, "");
          const tokenIdNoSpace = listing.nft.tokenId
            .toLowerCase()
            .replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredNewListings as Listing[];
      case filters[3]:
        const filteredNewSaleListings = NewSaleListings?.filter((listing) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = listing.nft.metadata.name
            .toLowerCase()
            .replace(/\s+/g, "");
          const tokenIdNoSpace = listing.nft.tokenId
            .toLowerCase()
            .replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredNewSaleListings as NewSaleListing[];
      case filters[4]:
        const filteredNewAuctioned = NewAuctioned?.filter((auction) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = auction.nft.metadata.name
            .toLowerCase()
            .replace(/\s+/g, "");
          const tokenIdNoSpace = auction.nft.tokenId
            .toLowerCase()
            .replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredNewAuctioned as Auction[];
      case filters[5]:
        const filteredNewSoldAuction = AuctionClosed?.filter((auction) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = auction.nft.metadata.name
            .toLowerCase()
            .replace(/\s+/g, "");
          const tokenIdNoSpace = auction.nft.tokenId
            .toLowerCase()
            .replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredNewSoldAuction as AuctionClosed[];
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

  return (
    <div className="pt-[17px]">
      <Head>
        <title>
          MintMingles Marketplace - Browse All Listings and Auctions
        </title>
        <meta
          name="description"
          content={`Browse all listings and auctions on Mint Mingle Marketplace`}
        />
      </Head>
      <BrowsePageHeader
        isActive={isActive}
        setIsActive={setIsActive}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        onFilterClick={handleFilterClick}
        filters={filters}
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
                  <div className="flex flex-wrap gap-6">
                    {currentPageData?.map((listing, index) => {
                      console.log({ listing} , 'listing');
                      const handleClick = () => {
                        router.push(
                          `/nft/${listing?.assetContract}/${listing?.tokenId}`
                        );
                        console.log("clicked");
                      };
                      const handleBuyNow = () => {
                        console.log("buy now clicked");
                      };

                      return (
                        <NFTCard
                          key={index}
                          data={listing}
                          type="listing"
                          cta="View Item"
                          extraCTA="Buy Now"
                          onClick={handleClick}
                          extraOnClick={handleBuyNow}
                        />
                      );
                    })}
                  </div>
                )}
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  pageNumbers={pageNumbers}
                />
              </>
            ) : (
              <div className="w-full !p-4 bg-card rounded-2xl items-center justify-center flex h-64">
                {searchQuery.length > 0
                  ? "No items found according to your search"
                  : "No listings found"}
              </div>
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
                  <div className="flex flex-wrap gap-6">
                    {currentPageData?.map((auction, index) => {
                      console.log({ auction });
                      const handleClick = () => {
                        // router.push(`/listing/${listing.listingId}`);
                        console.log("clicked");
                      };
                      const handleBuyAuction = () => {
                        console.log("buy auction clicked");
                      };

                      return (
                        <NFTCard
                          key={index}
                          data={auction}
                          type="auction"
                          cta="View Item"
                          extraCTA="Buy Auction"
                          onClick={handleClick}
                          extraOnClick={handleBuyAuction}
                        />
                      );
                    })}
                  </div>
                )}
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  pageNumbers={pageNumbers}
                />
              </>
            ) : (
              <div className="w-full !p-4 bg-card rounded-2xl items-center justify-center flex h-64">
                {searchQuery.length > 0
                  ? "No items found according to your search"
                  : "No auctions found"}
              </div>
            )}
          </>
        )}

        {/* Recently Listed */}
        {selectedFilter === filters[2] && (
          <>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <RecentlyListedTable
                    isLoading={isNewListingsLoading}
                    data={currentPageData as Listing[]}
                  />
                ) : (
                  <div className="flex flex-wrap gap-6">
                    {currentPageData?.map((listing, index) => {
                      console.log({ listing });
                      const handleClick = () => {
                        // router.push(`/listing/${listing.listingId}`);
                        console.log("clicked");
                      };
                      const handleBuyNow = () => {
                        console.log("buy now clicked");
                      };

                      return (
                        <NFTCard
                          key={index}
                          data={listing}
                          type="new-listing"
                          cta="View Item"
                          extraCTA="Buy Now"
                          onClick={handleClick}
                          extraOnClick={handleBuyNow}
                        />
                      );
                    })}
                  </div>
                )}
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  pageNumbers={pageNumbers}
                />
              </>
            ) : (
              <div className="w-full !p-4 bg-card rounded-2xl items-center justify-center flex h-64">
                {searchQuery.length > 0
                  ? "No items found according to your search"
                  : "No recently listed items found"}
              </div>
            )}
          </>
        )}

        {/* Recently Sold Listing */}
        {selectedFilter === filters[3] && (
          <>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <RecentlySoldListingTable
                    isLoading={isNewSaleListingsLoading}
                    data={currentPageData as NewSaleListing[]}
                  />
                ) : (
                  <div className="flex flex-wrap gap-6">
                    {currentPageData?.map((listing, index) => {
                      console.log({ listing });
                      const handleClick = () => {
                        // router.push(`/listing/${listing.listingId}`);
                        console.log("clicked");
                      };

                      return (
                        <NFTCard
                          key={index}
                          data={listing}
                          type="new-sale-listing"
                          cta="View Item"
                          onClick={handleClick}
                        />
                      );
                    })}
                  </div>
                )}
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  pageNumbers={pageNumbers}
                />
              </>
            ) : (
              <div className="w-full !p-4 bg-card rounded-2xl items-center justify-center flex h-64">
                {searchQuery.length > 0
                  ? "No items found according to your search"
                  : "No recently sold listings found"}
              </div>
            )}
          </>
        )}

        {/* Recently Auctioned */}
        {selectedFilter === filters[4] && (
          <>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <RecentlyAuctionedTable
                    isLoading={isNewAuctionedLoading}
                    data={currentPageData as Auction[]}
                  />
                ) : (
                  <div className="flex flex-wrap gap-6">
                    {currentPageData?.map((auction, index) => {
                      console.log({ auction });
                      const handleClick = () => {
                        // router.push(`/listing/${listing.listingId}`);
                        console.log("clicked");
                      };
                      const handleBuyAuction = () => {
                        console.log("buy auction clicked");
                      };

                      return (
                        <NFTCard
                          key={index}
                          data={auction}
                          type="new-auction"
                          cta="View Item"
                          extraCTA="Buy Auction"
                          onClick={handleClick}
                          extraOnClick={handleBuyAuction}
                        />
                      );
                    })}
                  </div>
                )}
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  pageNumbers={pageNumbers}
                />
              </>
            ) : (
              <div className="w-full !p-4 bg-card rounded-2xl items-center justify-center flex h-64">
                {searchQuery.length > 0
                  ? "No items found according to your search"
                  : "No recently auctioned items found"}
              </div>
            )}
          </>
        )}

        {/* Recently Sold Auction */}
        {selectedFilter === filters[5] && (
          <>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <RecentlySoldAuctionTable
                    isLoading={isAuctionClosedLoading}
                    data={currentPageData as AuctionClosed[]}
                  />
                ) : (
                  <div className="flex flex-wrap gap-6">
                    {currentPageData?.map((auction, index) => {
                      console.log({ auction });
                      const handleClick = () => {
                        // router.push(`/listing/${listing.listingId}`);
                        console.log("clicked");
                      };

                      return (
                        <NFTCard
                          key={index}
                          data={auction}
                          type="new-sold-auction"
                          cta="View Item"
                          onClick={handleClick}
                        />
                      );
                    })}
                  </div>
                )}
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  pageNumbers={pageNumbers}
                />
              </>
            ) : (
              <div className="w-full !p-4 bg-card rounded-2xl items-center justify-center flex h-64">
                {searchQuery.length > 0
                  ? "No items found according to your search"
                  : "No recently sold auctions found"}
              </div>
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
