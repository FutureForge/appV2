import { Header } from "@/modules/app";
import React, { useState } from "react";

export function BrowsePage() {
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const [selectedFilter, setSelectedFilter] = useState("Recently Listed");

const handleSearch = (query: string) => {
  setSearchQuery(query);
  setCurrentPage(1);
};

const handleFilterClick = (filter: string) => {
  setSelectedFilter(filter);
};
  return (
    <div className="pt-[17px]">
      <Header
        isActive={isActive}
        setIsActive={setIsActive}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        onFilterClick={handleFilterClick}
        filters={[
          "Recently Listed",
          "Recently Sold",
          "Recently Auctioned",
          "Recently Sold Auction",
        ]}
      />
      {/* Conditionally render based on selectedFilter */}
      {selectedFilter === "Recently Listed" && <div>Recently Listed</div>}
      {selectedFilter === "Recently Sold" && <div>Recently Sold</div>}
      {selectedFilter === "Recently Auctioned" && <div>Recently Auctioned</div>}
      {selectedFilter === "Recently Sold Auction" && (
        <div>Recently Sold Auction</div>
      )}
    </div>
  );
}
