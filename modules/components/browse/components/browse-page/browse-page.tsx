import React, { useState } from "react";
import {
  useAllAuctionsQuery,
  useAllListingsQuery,
  useAuctionClosedQuery,
  useNewAuctionsQuery,
  useNewBidsQuery,
  useNewListingsQuery,
  useNewSaleListingsQuery,
  useUserChainInfo,
} from "@/modules/query";
import { EmptyState, Header, NFTCard } from "@/modules/app";
import { useRouter } from "next/navigation";
import { cn } from "@/modules/app/utils";
import Caret from "@/assets/arrow-left-s-line.svg";
import {
  Auction,
  AuctionClosed,
  Listing,
  NewBid,
  NewSaleListing,
} from "@/utils/types/graphql";
import { motion } from "framer-motion";
import { AllListingTable } from "../table/all-listing";
import { AllAuctionTable } from "../table/all-auction";
import { RecentlyListedTable } from "../table/recently-listed";
import { RecentlySoldListingTable } from "../table/recently-sold";
import { RecentlyAuctionedTable } from "../table/recently-auctioned";
import { RecentlySoldAuctionTable } from "../table/recently-sold-auction";
import { RecentBidsTable } from "../table/recent-bids";
import { ExtraProps } from "@/modules/app/component/nft-card/utils/nft-card.utils";
import {
  useBidInAuctionMutation,
  useBuyFromDirectListingMutation,
} from "@/modules/mutation";
import { useToast } from "@/modules/app/hooks/useToast";
import { decimalOffChain } from "@/modules/blockchain";

const filters = [
  "All Listings",
  "All Auctions",
  "Recent Listings",
  "Recent Sales",
  "Recent Auctions",
  "Recent Sold Auctions",
  "Recent Bids",
];

// TODO: run the get platform fee and collection fee queries

export function BrowsePage() {
  const bidInAuctionMutation = useBidInAuctionMutation();
  const buyListingMutation = useBuyFromDirectListingMutation();

  const { activeAccount } = useUserChainInfo();
  const toast = useToast();
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

  const {
    data: NewBids,
    isLoading: isNewBidsLoading,
    isError: isNewBidsError,
  } = useNewBidsQuery({ limit: fetchLimit });

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

      case filters[6]:
        const filteredNewBids = NewBids?.filter((bid) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = bid.nft.metadata.name
            .toLowerCase()
            .replace(/\s+/g, "");
          const tokenIdNoSpace = bid.nft.tokenId
            .toLowerCase()
            .replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredNewBids as NewBid[];
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
    // router.push(`/item/${contractAddress}/${tokenId}`);
    console.log("view item", { contractAddress, tokenId });
  };

  const handleBuyListingNow = ({
    listingId,
    quantity,
    totalPrice,
    nativeTokenValue,
  }: {
    listingId: string;
    quantity: string;
    totalPrice: string;
    nativeTokenValue: string;
  }) => {
    if (!activeAccount) return toast.error("Please connect your wallet");
    if (!listingId || !quantity || !totalPrice || !nativeTokenValue)
      return toast.error("Please fill in all fields");

    buyListingMutation.mutate({
      buyFromListing: {
        buyFor: activeAccount.address,
        listingId,
        quantity,
        totalPrice: decimalOffChain(totalPrice) as unknown as string,
        nativeTokenValue: decimalOffChain(
          nativeTokenValue
        ) as unknown as string,
      },
    });
  };

  const handleBuyAuctionNow = ({
    auctionId,
    bidAmount,
  }: {
    auctionId: string;
    bidAmount: string;
  }) => {
    if (!activeAccount) return toast.error("Please connect your wallet");
    if (!auctionId || !bidAmount)
      return toast.error("Please fill in all fields");

    bidInAuctionMutation.mutate({
      auctionId,
      bidAmount: decimalOffChain(bidAmount) as unknown as string,
    });
  };

  const isDisabled =
    bidInAuctionMutation.isPending || buyListingMutation.isPending;

  return (
    <div className="pt-[17px]">
      <Header
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
                      const listingId =
                        "listingId" in listing ? listing.listingId : "";
                      const quantity =
                        "quantity" in listing ? listing.quantity : "";
                      const totalPrice =
                        "pricePerToken" in listing ? listing.pricePerToken : "";

                      const extraProps: ExtraProps = {
                        disabled: isDisabled,
                        price: totalPrice,
                        collectionFee: { address: "", percent: 0 },
                        marketplaceFee: { address: "", percent: 0 },
                      };

                      return (
                        <NFTCard
                          key={index}
                          data={listing}
                          type="listing"
                          cta="View Item"
                          extraCTA="Buy Now"
                          onClick={() => {
                            handleViewItem({
                              contractAddress: listing.assetContract,
                              tokenId: listing.nft.tokenId,
                            });
                          }}
                          extraOnClick={() =>
                            handleBuyListingNow({
                              listingId: listingId,
                              quantity: quantity,
                              totalPrice: totalPrice,
                              nativeTokenValue: totalPrice,
                            })
                          }
                          extraProps={extraProps}
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
                  <div className="flex flex-wrap gap-6">
                    {currentPageData?.map((auction, index) => {
                      console.log({ auction });
                      const buyoutBidAmount =
                        "buyoutBidAmount" in auction
                          ? auction.buyoutBidAmount
                          : "";
                      const auctionId =
                        "auctionId" in auction ? auction.auctionId : "";

                      const extraProps: ExtraProps = {
                        disabled: isDisabled,
                        price: buyoutBidAmount,
                        collectionFee: { address: "", percent: 0 },
                        marketplaceFee: { address: "", percent: 0 },
                      };

                      return (
                        <NFTCard
                          key={index}
                          data={auction}
                          type="auction"
                          cta="View Item"
                          extraCTA="Buy Auction"
                          onClick={() => {
                            handleViewItem({
                              contractAddress: auction.assetContract,
                              tokenId: auction.nft.tokenId,
                            });
                          }}
                          extraOnClick={() =>
                            handleBuyAuctionNow({
                              auctionId,
                              bidAmount: buyoutBidAmount,
                            })
                          }
                          extraProps={extraProps}
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

        {/* Recent Listings */}
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
                      const listingId =
                        "listingId" in listing ? listing.listingId : "";
                      const quantity =
                        "quantity" in listing ? listing.quantity : "";
                      const totalPrice =
                        "pricePerToken" in listing ? listing.pricePerToken : "";

                      const extraProps: ExtraProps = {
                        disabled: isDisabled,
                        price: totalPrice,
                        collectionFee: { address: "", percent: 0 },
                        marketplaceFee: { address: "", percent: 0 },
                      };

                      return (
                        <NFTCard
                          key={index}
                          data={listing}
                          type="new-listing"
                          cta="View Item"
                          extraCTA="Buy Now"
                          onClick={() => {
                            handleViewItem({
                              contractAddress: listing.assetContract,
                              tokenId: listing.nft.tokenId,
                            });
                          }}
                          extraOnClick={() =>
                            handleBuyListingNow({
                              listingId: listingId,
                              quantity: quantity,
                              totalPrice: totalPrice,
                              nativeTokenValue: totalPrice,
                            })
                          }
                          extraProps={extraProps}
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
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  pageNumbers={pageNumbers}
                />
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
                      const buyoutBidAmount =
                        "buyoutBidAmount" in auction
                          ? auction.buyoutBidAmount
                          : "";
                      const auctionId =
                        "auctionId" in auction ? auction.auctionId : "";

                      const extraProps: ExtraProps = {
                        disabled: isDisabled,
                        price: buyoutBidAmount,
                        collectionFee: { address: "", percent: 0 },
                        marketplaceFee: { address: "", percent: 0 },
                      };

                      return (
                        <NFTCard
                          key={index}
                          data={auction}
                          type="new-auction"
                          cta="View Item"
                          extraCTA="Buy Auction"
                          onClick={() => {
                            handleViewItem({
                              contractAddress: auction.assetContract,
                              tokenId: auction.nft.tokenId,
                            });
                          }}
                          extraOnClick={() =>
                            handleBuyAuctionNow({
                              auctionId,
                              bidAmount: buyoutBidAmount,
                            })
                          }
                          extraProps={extraProps}
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
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  pageNumbers={pageNumbers}
                />
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
        {selectedFilter === filters[6] && (
          <>
            {currentPageData && currentPageData.length > 0 ? (
              <>
                {!isActive ? (
                  <RecentBidsTable
                    isLoading={isNewBidsLoading}
                    data={currentPageData as NewBid[]}
                  />
                ) : (
                  <div className="flex flex-wrap gap-6">
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
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  pageNumbers={pageNumbers}
                />
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
