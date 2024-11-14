import React, { useState } from "react";
import { BrowsePageHeader } from "../header/header";
import { useAllAuctionsQuery, useAllListingsQuery } from "@/modules/query";
import Head from "next/head";
import { NFTCard } from "@/modules/app";
import { useRouter } from "next/navigation";
import { cn } from "@/modules/app/utils";
import Caret from "@/assets/arrow-left-s-line.svg";
import { Auction, Listing } from "@/utils/types/graphql";

const filters = [
  "All Listings",
  "All Auctions",
  "Recently Listed",
  "Recently Sold",
  "Recently Auctioned",
  "Recently Sold Auction",
];

export function BrowsePage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

  const itemsPerPage = 1;
  const fetchLimit = 50;
  const currentBatch = Math.ceil((currentPage * itemsPerPage) / fetchLimit);

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
      case "All Listings":
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
      case "All Auctions":
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
      {selectedFilter === "All Listings" && (
        <>
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
                type="listing"
                cta="View Listing"
                onClick={handleClick}
              />
            );
          })}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageNumbers={pageNumbers}
          />
        </>
      )}
      {selectedFilter === "All Auctions" && (
        <>
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
                type="auction"
                cta="View Auction"
                onClick={handleClick}
              />
            );
          })}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageNumbers={pageNumbers}
          />
        </>
      )}
      {selectedFilter === "Recently Listed" && <div>Recently Listed</div>}
      {selectedFilter === "Recently Sold" && <div>Recently Sold</div>}
      {selectedFilter === "Recently Auctioned" && <div>Recently Auctioned</div>}
      {selectedFilter === "Recently Sold Auction" && (
        <div>Recently Sold Auction</div>
      )}
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
