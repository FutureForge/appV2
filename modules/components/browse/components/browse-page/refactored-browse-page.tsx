import Head from "next/head";
import React, { useState } from "react";
import { Header } from "@/modules/app";
import { ErrorComponent } from "@/modules/app";
import { useRouter } from "next/navigation";

// Components
import {
  ListingsSection,
  AuctionsSection,
  OffersSection,
  CompletedAuctionSection,
  AcceptedOffersSection,
  AuctionBidsSection,
  CompletedListingSection,
} from "./browse-sections";
import {
  useBrowseFilters,
  useBrowseData,
  useBrowsePagination,
} from "./browse-hooks";

export function BrowsePage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 5;

  // Hooks
  const { browsePageFilters, selectedFilter, handleFilterClick } =
    useBrowseFilters();
  const { data, isLoading, error } = useBrowseData(selectedFilter, searchQuery);
  const { currentPage, totalPages, currentPageData, handlePageChange } =
    useBrowsePagination(data, itemsPerPage);

  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    handlePageChange(1);
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

  return (
    <div className="pt-[17px]">
      <Head>
        <title>Browse | Mint Mingle</title>
        <meta
          name="description"
          content="Browse listings, auctions and offers"
        />
      </Head>

      <Header
        isActive={isActive}
        setIsActive={setIsActive}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        onFilterClick={handleFilterClick}
        filters={browsePageFilters}
        showFilters
      />

      <div className="mt-8 w-full">
        {/* All Listings */}
        {selectedFilter === "All Listings" && (
          <ListingsSection
            data={data}
            isLoading={isLoading}
            isActive={isActive}
            searchQuery={searchQuery}
            currentPageData={currentPageData}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onViewItem={handleViewItem}
            isError={error}
          />
        )}

        {/* All Auctions */}
        {selectedFilter === "All Auctions" && (
          <AuctionsSection
            data={data}
            isLoading={isLoading}
            isActive={isActive}
            searchQuery={searchQuery}
            currentPageData={currentPageData}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onViewItem={handleViewItem}
            isError={error}
          />
        )}

        {/* All Offers */}
        {selectedFilter === "All Offers" && (
          <OffersSection
            data={data}
            isLoading={isLoading}
            isActive={isActive}
            searchQuery={searchQuery}
            currentPageData={currentPageData}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onViewItem={handleViewItem}
            isError={error}
          />
        )}

        {/* Completed Listing */}
        {selectedFilter === "Completed Listing" && (
          <CompletedListingSection
            data={data}
            isLoading={isLoading}
            isActive={isActive}
            searchQuery={searchQuery}
            currentPageData={currentPageData}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onViewItem={handleViewItem}
            isError={error}
          />
        )}

        {/* Completed Auction */}
        {selectedFilter === "Completed Auction" && (
          <CompletedAuctionSection
            data={data}
            isLoading={isLoading}
            isActive={isActive}
            searchQuery={searchQuery}
            currentPageData={currentPageData}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onViewItem={handleViewItem}
            isError={error}
          />
        )}

        {/* Accepted Offers */}
        {selectedFilter === "Accepted Offers" && (
          <AcceptedOffersSection
            data={data}
            isLoading={isLoading}
            isActive={isActive}
            searchQuery={searchQuery}
            currentPageData={currentPageData}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onViewItem={handleViewItem}
            isError={error}
          />
        )}

        {/* Auction Bids */}
        {selectedFilter === "Auction Bids" && (
          <AuctionBidsSection
            data={data}
            isLoading={isLoading}
            isActive={isActive}
            searchQuery={searchQuery}
            currentPageData={currentPageData}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onViewItem={handleViewItem}
            isError={error}
          />
        )}
      </div>
    </div>
  );
}
