import React from "react";
import {
  BrowseEmptyState,
  BrowseCardView,
  BrowsePagination,
} from "./browse-components";
import {
  AllListingTable,
  AllAuctionTable,
  AllOffersTable,
  CompletedListingTable,
  CompletedAuctionTable,
  AcceptedOfferTable,
  AuctionBidsTable,
} from "../table";
import { motion } from "framer-motion";
import {
  AcceptedOfferEvent,
  Auction,
  AuctionBidEvent,
  CompletedAuctionEvent,
  CompletedListingEvent,
  Listing,
  Offer,
} from "@/modules/query/utils";
import { ErrorComponent } from "@/modules/app";

export const ListingsSection = ({
  data,
  isLoading,
  isActive,
  searchQuery,
  currentPageData,
  totalPages,
  currentPage,
  onPageChange,
  onViewItem,
  isError,
}: {
  data: Listing[];
  isLoading: boolean;
  isActive: boolean;
  searchQuery: string;
  currentPageData: Listing[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
  isError: boolean;
}) => {
  if (isError) {
    return (
      <ErrorComponent
        className="h-[80vh] max-md:h-[50vh]"
        message="Something went WRONG! Can't view listings"
      />
    );
  }

  if (!data || data.length === 0) {
    return <BrowseEmptyState searchQuery={searchQuery} filterName="listings" />;
  }

  return (
    <motion.div>
      {!isActive ? (
        <AllListingTable isLoading={isLoading} data={currentPageData} />
      ) : (
        <BrowseCardView
          data={currentPageData}
          type="listing"
          onViewItem={onViewItem}
        />
      )}
      <BrowsePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </motion.div>
  );
};

export const AuctionsSection = ({
  data,
  isLoading,
  isActive,
  searchQuery,
  currentPageData,
  totalPages,
  currentPage,
  onPageChange,
  onViewItem,
  isError,
}: {
  data: Auction[];
  isLoading: boolean;
  isActive: boolean;
  searchQuery: string;
  currentPageData: Auction[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
  isError: boolean;
}) => {
  if (isError) {
    return (
      <ErrorComponent
        className="h-[80vh] max-md:h-[50vh]"
        message="Something went WRONG! Can't view auctions"
      />
    );
  }

  if (!data || data.length === 0) {
    return <BrowseEmptyState searchQuery={searchQuery} filterName="auctions" />;
  }

  return (
    <>
      {!isActive ? (
        <AllAuctionTable isLoading={isLoading} data={currentPageData} />
      ) : (
        <BrowseCardView
          data={currentPageData}
          type="auction"
          onViewItem={onViewItem}
        />
      )}
      <BrowsePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export const OffersSection = ({
  data,
  isLoading,
  isActive,
  searchQuery,
  currentPageData,
  totalPages,
  currentPage,
  onPageChange,
  onViewItem,
  isError,
}: {
  data: Offer[];
  isLoading: boolean;
  isActive: boolean;
  searchQuery: string;
  currentPageData: Offer[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
  isError: boolean;
}) => {
  if (isError) {
    return (
      <ErrorComponent
        className="h-[80vh] max-md:h-[50vh]"
        message="Something went WRONG! Can't view offers"
      />
    );
  }

  if (!data || data.length === 0) {
    return <BrowseEmptyState searchQuery={searchQuery} filterName="offers" />;
  }

  return (
    <>
      {!isActive ? (
        <AllOffersTable isLoading={isLoading} data={currentPageData} />
      ) : (
        <BrowseCardView
          data={currentPageData}
          type="offers"
          onViewItem={onViewItem}
        />
      )}
      <BrowsePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export const CompletedListingSection = ({
  data,
  isLoading,
  isActive,
  searchQuery,
  currentPageData,
  totalPages,
  currentPage,
  onPageChange,
  onViewItem,
  isError,
}: {
  data: CompletedListingEvent[];
  isLoading: boolean;
  isActive: boolean;
  searchQuery: string;
  currentPageData: CompletedListingEvent[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
  isError: boolean;
}) => {
  if (isError) {
    return (
      <ErrorComponent
        className="h-[80vh] max-md:h-[50vh]"
        message="Something went WRONG! Can't view completed listings"
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <BrowseEmptyState
        searchQuery={searchQuery}
        filterName="completed listings"
      />
    );
  }

  return (
    <>
      {!isActive ? (
        <CompletedListingTable isLoading={isLoading} data={currentPageData} />
      ) : (
        <BrowseCardView
          data={currentPageData}
          type="completed-listing"
          onViewItem={onViewItem}
        />
      )}
      <BrowsePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export const CompletedAuctionSection = ({
  data,
  isLoading,
  isActive,
  searchQuery,
  currentPageData,
  totalPages,
  currentPage,
  onPageChange,
  onViewItem,
  isError,
}: {
  data: CompletedAuctionEvent[];
  isLoading: boolean;
  isActive: boolean;
  searchQuery: string;
  currentPageData: CompletedAuctionEvent[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
  isError: boolean;
}) => {
  if (isError) {
    return (
      <ErrorComponent
        className="h-[80vh] max-md:h-[50vh]"
        message="Something went WRONG! Can't view completed auction"
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <BrowseEmptyState
        searchQuery={searchQuery}
        filterName="completed auctions"
      />
    );
  }

  return (
    <>
      {!isActive ? (
        <CompletedAuctionTable isLoading={isLoading} data={currentPageData} />
      ) : (
        <BrowseCardView
          data={currentPageData}
          type="completed-auction"
          onViewItem={onViewItem}
        />
      )}
      <BrowsePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export const AcceptedOffersSection = ({
  data,
  isLoading,
  isActive,
  searchQuery,
  currentPageData,
  totalPages,
  currentPage,
  onPageChange,
  onViewItem,
  isError,
}: {
  data: AcceptedOfferEvent[];
  isLoading: boolean;
  isActive: boolean;
  searchQuery: string;
  currentPageData: AcceptedOfferEvent[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
  isError: boolean;
}) => {
  if (isError) {
    return (
      <ErrorComponent
        className="h-[80vh] max-md:h-[50vh]"
        message="Something went WRONG! Can't view accepted offers"
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <BrowseEmptyState
        searchQuery={searchQuery}
        filterName="accepted offers"
      />
    );
  }

  return (
    <>
      {!isActive ? (
        <AcceptedOfferTable isLoading={isLoading} data={currentPageData} />
      ) : (
        <BrowseCardView
          data={currentPageData}
          type="accepted-offers"
          onViewItem={onViewItem}
        />
      )}
      <BrowsePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export const AuctionBidsSection = ({
  data,
  isLoading,
  isActive,
  searchQuery,
  currentPageData,
  totalPages,
  currentPage,
  onPageChange,
  onViewItem,
  isError,
}: {
  data: AuctionBidEvent[];
  isLoading: boolean;
  isActive: boolean;
  searchQuery: string;
  currentPageData: AuctionBidEvent[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
  isError: boolean;
}) => {
  if (isError) {
    return (
      <ErrorComponent
        className="h-[80vh] max-md:h-[50vh]"
        message="Something went WRONG! Can't view auction bids"
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <BrowseEmptyState searchQuery={searchQuery} filterName="auction bids" />
    );
  }

  return (
    <>
      {!isActive ? (
        <AuctionBidsTable isLoading={isLoading} data={currentPageData} />
      ) : (
        <BrowseCardView
          data={currentPageData}
          type="auction-bids"
          onViewItem={onViewItem}
        />
      )}
      <BrowsePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};
