// browse-component.tsx
import React from "react";
import { EmptyState, NFTCard } from "@/modules/app";
import { Pagination } from "@/modules/app/component/pagination";
import { NFTCardInfo } from "@/modules/app/component/nft-card/utils/nft-card.utils";
import {
  AcceptedOfferEvent,
  Auction,
  AuctionBidEvent,
  CompletedAuctionEvent,
  CompletedListingEvent,
  Listing,
  Offer,
} from "@/modules/query/utils";
import { NFT } from "thirdweb";

export const BrowseEmptyState = ({
  searchQuery,
  filterName,
}: {
  searchQuery: string;
  filterName: string;
}) => (
  <EmptyState
    message={
      searchQuery.length > 0
        ? "No items found according to your search"
        : `No ${filterName.toLowerCase()} found`
    }
  />
);

// Enhanced type guards with proper type predicates
const isListing = (item: any): item is Listing =>
  "listingId" in item && "nft" in item;
const isAuction = (item: any): item is Auction =>
  "auctionId" in item && "nft" in item;
const isAuctionBidEvent = (item: any): item is AuctionBidEvent =>
  "auctionId" in item && "auction" in item;
const isCompletedListingEvent = (item: any): item is CompletedListingEvent =>
  "listingId" in item && "nft" in item;
const isCompletedAuctionEvent = (item: any): item is CompletedAuctionEvent =>
  "auctionId" in item && "nft" in item;
const isAcceptedOfferEvent = (item: any): item is AcceptedOfferEvent =>
  "offerId" in item && "nft" in item;

interface BrowseCardViewProps {
  data: (
    | Listing
    | Auction
    | Offer
    | CompletedListingEvent
    | CompletedAuctionEvent
    | AcceptedOfferEvent
    | AuctionBidEvent
  )[];
  type: NFTCardInfo;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
}

export const BrowseCardView: React.FC<BrowseCardViewProps> = ({
  data,
  type,
  onViewItem,
}) => {
  const getExtraCTA = (): string | undefined => {
    switch (type) {
      case "listing":
        return "Buy Now";
      case "auction":
        return "Buy Auction";
      default:
        return undefined;
    }
  };

  const getStatus = (): "listed" | "auctioned" | undefined => {
    switch (type) {
      case "listing":
        return "listed";
      case "auction":
        return "auctioned";
      default:
        return undefined;
    }
  };

  const getNFTData = (
    item: any
  ): {
    nft: NFT;
    contractAddress: string;
    tokenId: string;
  } | null => {
    if (
      isListing(item) ||
      isAuction(item) ||
      isCompletedListingEvent(item) ||
      isCompletedAuctionEvent(item) ||
      isAcceptedOfferEvent(item)
    ) {
      return {
        nft: item.nft,
        contractAddress: item.assetContract,
        tokenId: item.tokenId.toString(),
      };
    } else if (isAuctionBidEvent(item)) {
      return {
        nft: item.auction.nft,
        contractAddress: item.auction.assetContract,
        tokenId: item.auction.tokenId.toString(),
      };
    }
    return null;
  };

  return (
    <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
      {data.map((item, index) => {
        const nftData = getNFTData(item);
        if (!nftData) return null;

        return (
          <NFTCard
            key={`${nftData.contractAddress}-${nftData.tokenId}-${index}`}
            data={item}
            nft={nftData.nft}
            type={type}
            cta="View Item"
            extraCTA={getExtraCTA()}
            status={getStatus()}
            onClick={() =>
              onViewItem({
                contractAddress: nftData.contractAddress,
                tokenId: nftData.tokenId,
              })
            }
          />
        );
      })}
    </div>
  );
};

export const BrowsePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="mt-8">
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  </div>
);
