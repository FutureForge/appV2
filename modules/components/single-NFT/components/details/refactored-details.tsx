import React, { useEffect, useState } from "react";
import { ErrorComponent } from "@/modules/app";
import { useFilterStore } from "../../store";
import {
  useCheckApprovalStatusQuery,
  useSingleNFTQuery,
  useUserChainInfo,
} from "@/modules/query";
import {
  Fee,
  useAuctionInfoStore,
  useListingInfoStore,
} from "@/modules/components/now-dialog/store";
import {
  useCancelAuctionMutation,
  useCancelDirectListingMutation,
  useCollectAuctionPayoutMutation,
} from "@/modules/mutation";
import Line from "@/assets/line.svg";

// Import components from our new files
import {
  BasicInfoSection,
  DescriptionSection,
  DetailsGridSection,
  PricingSection,
} from "./details-sections";
import { ActionButtonsSection } from "./action-buttons";
import { Auction, Listing } from "@/modules/query/utils";
import { DetailsSkeleton } from "../skeleton/details-skeleton";
import { CollectionHeader, NFTImage } from "./details-components";

type DetailsProps = {
  contractAddress: string;
  tokenId: string;
};

export const singleNFTFilters = [
  "Not Listed",
  "Listed",
  "Auction",
  "Expired",
  "Pending Payout",
];

export function Details({ contractAddress, tokenId }: DetailsProps) {
  const { activeAccount } = useUserChainInfo();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const userAddress = activeAccount?.address;

  const { selectedFilter, setSelectedFilter } = useFilterStore();
  const { setListingInfo, listingInfo } = useListingInfoStore();
  const { setAuctionInfo, auctionInfo } = useAuctionInfoStore();

  const cancelListingMutation = useCancelDirectListingMutation();
  const cancelAuctionMutation = useCancelAuctionMutation();
  const collectAuctionPayoutMutation = useCollectAuctionPayoutMutation();

  const {
    data: nftData,
    isLoading: isNFTDataLoading,
    isPending: isNFTDataPending,
    isError,
    error,
  } = useSingleNFTQuery({
    contractAddress: contractAddress as string,
    tokenId: tokenId as string,
  });

  const isApproved = useCheckApprovalStatusQuery({
    collectionContractAddress: contractAddress as string,
    tokenId: tokenId as string,
  });

  const activeType = nftData?.activeType;
  const collectionFee = nftData?.collectionFee as Fee;
  const marketplaceFee = nftData?.marketplaceFee as Fee;
  const collectionDetails = nftData?.collectionDetails;
  const listingPricingData = nftData?.listingData;
  const auctionPricingData = nftData?.auctionData;
  const winningBid = nftData?.winningBidBody;

  const nft = nftData?.nft;
  const { metadata } = nft || {};
  const { description, name, image } = metadata || {};

  const isAuctionExpired = auctionPricingData?.isAuctionExpired;
  const isAuctionPendingPayout = nftData?.isAuctionPendingPayout;

  const isAuctionPayoutCollector =
    auctionPricingData?.auctionCreator?.toLowerCase() ===
    userAddress?.toLowerCase();

  const isOwner = listingPricingData?.listingCreator
    ? userAddress?.toLowerCase() ===
      listingPricingData?.listingCreator?.toLowerCase()
    : auctionPricingData?.auctionCreator
    ? userAddress?.toLowerCase() ===
      auctionPricingData?.auctionCreator?.toLowerCase()
    : userAddress?.toLowerCase() === nft?.owner?.toLowerCase();

  const owner = listingPricingData?.listingCreator
    ? listingPricingData.listingCreator.toLowerCase()
    : auctionPricingData?.auctionCreator
    ? auctionPricingData.auctionCreator.toLowerCase()
    : nft?.owner?.toLowerCase() || undefined;

  const isWinningBidder =
    userAddress?.toLowerCase() === winningBid?.bidder?.toLowerCase();

  const handleCancelListing = () => {
    cancelListingMutation.mutate({
      listingId: listingInfo.listingId.toString(),
    });
  };

  const handleCancelAuction = () => {
    cancelAuctionMutation.mutate({
      auctionId: auctionInfo.auctionId.toString(),
    });
  };

  const handleCollectAuctionPayout = () => {
    const auctionId = auctionPricingData?.auctionId;
    if (!auctionId) return;
    collectAuctionPayoutMutation.mutate({
      auctionId: auctionId.toString(),
    });
  };

  const isDisabled =
    cancelListingMutation.isPending ||
    cancelAuctionMutation.isPending ||
    collectAuctionPayoutMutation.isPending;

  const handleSetDialogOpen = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const filter =
      activeType === "listing"
        ? singleNFTFilters[1]
        : activeType === "auction"
        ? singleNFTFilters[2]
        : activeType === "expired"
        ? singleNFTFilters[3]
        : activeType === "pending-payout"
        ? singleNFTFilters[4]
        : singleNFTFilters[0];
    setSelectedFilter(filter);
  }, [activeType, nftData]);

  useEffect(() => {
    setListingInfo(listingPricingData as Listing);
    setAuctionInfo(auctionPricingData as Auction);
  }, [listingPricingData, auctionPricingData]);

  if (isError && !nft?.metadata.image && !isNFTDataLoading) {
    return <ErrorComponent />;
  }

  if (isNFTDataLoading || isNFTDataPending) {
    return <DetailsSkeleton />;
  }

  return (
    <div className="flex gap-6 pt-14 max-[910px]:flex-col items-stretch">
      <div className="flex items-stretch h-full gap-6 max-[1245px]:flex-col">
        {/* Left Column - Image Section */}
        <div className="w-[40%] max-[1245px]:w-full flex flex-col gap-6 h-full">
          {collectionDetails && (
            <CollectionHeader collectionDetails={collectionDetails} />
          )}
          <NFTImage image={image!} name={name} />
        </div>

        {/* Right Column - Details Section */}
        <div className="flex-1 max-[1245px]:w-full flex flex-col gap-6 min-h-full">
          <BasicInfoSection
            name={name!}
            owner={owner!}
            activeType={activeType!}
          />
          <Line />

          <DescriptionSection description={description} />
          <DetailsGridSection
            contractAddress={contractAddress}
            tokenId={tokenId}
          />

          <PricingSection
            activeType={activeType}
            listingInfo={listingInfo}
            auctionInfo={auctionInfo}
            collectionFee={collectionFee}
            marketplaceFee={marketplaceFee}
            selectedFilter={selectedFilter}
          />

          <ActionButtonsSection
            activeType={activeType}
            isOwner={isOwner}
            isAuctionPendingPayout={isAuctionPendingPayout!}
            isAuctionPayoutCollector={isAuctionPayoutCollector}
            isWinningBidder={isWinningBidder}
            selectedFilter={selectedFilter}
            image={image}
            name={name}
            tokenId={tokenId}
            contractAddress={contractAddress}
            isApproved={isApproved}
            listingInfo={listingInfo}
            auctionInfo={auctionInfo}
            handleCancelListing={handleCancelListing}
            handleCancelAuction={handleCancelAuction}
            handleCollectAuctionPayout={handleCollectAuctionPayout}
            isDisabled={isDisabled}
            setIsDialogOpen={handleSetDialogOpen}
          />
        </div>
      </div>
    </div>
  );
}
