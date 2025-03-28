import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useUserImageStore } from "@/utils/store/user-image.store";
import {
  NFTsSection,
  ListingsSection,
  AuctionsSection,
  OffersSection,
  NFTActivitiesSection,
  ExpiredSection,
  PendingPayoutSection,
  OffersReceivedSection,
  CollectionsSection,
} from "./profile-sections";
import {
  useProfileFilters,
  useInfiniteLoading,
  useProfileData,
} from "./profile-hooks";
import { useUserChainInfo } from "@/modules/query";
import {
  useCancelAuctionMutation,
  useCancelDirectListingMutation,
  useCancelOfferMutation,
  useCollectAuctionPayoutMutation,
} from "@/modules/mutation";
import { Header } from "@/modules/app";
import {
  ConnectWalletPrompt,
  ExpiredOptionsFilter,
  ProfileHeader,
} from "./profile-component";

export const ITEMS_PER_PAGE = 12;

export function ProfilePage() {
  const router = useRouter();

  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  // State and hooks
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Expired Listing");

  const { filters, selectedFilter, handleFilterClick } = useProfileFilters();
  const { displayCount, loadMoreRef, resetDisplayCount } =
    useInfiniteLoading(ITEMS_PER_PAGE);

  // Mutation hooks
  const cancelListingMutation = useCancelDirectListingMutation();
  const cancelAuctionMutation = useCancelAuctionMutation();
  const cancelOfferMutation = useCancelOfferMutation();
  const collectAuctionPayoutMutation = useCollectAuctionPayoutMutation();

  const isDisabled =
    cancelListingMutation.isPending ||
    cancelAuctionMutation.isPending ||
    cancelOfferMutation.isPending;

  // Data hooks
  const {
    nftsData,
    listingsData,
    auctionsData,
    offersData,
    pendingPayoutData,
    offersReceivedData,
    collectionsData,
    nftActivitiesData,
    expiredListingsData,
    expiredAuctionsData,
    expiredOffersData,
    isLoading,
    error,
  } = useProfileData(selectedFilter, searchQuery);

  // Handlers
  const handleViewItemClick = ({
    contractAddress,
    tokenId,
  }: {
    contractAddress: string;
    tokenId: string;
  }) => {
    router.push(`/nft/${contractAddress}/${tokenId}`);
  };

  const handleCancelListing = ({ listingId }: { listingId: string }) => {
    if (!listingId) return;
    cancelListingMutation.mutate({ listingId });
  };

  const handleCancelAuction = ({ auctionId }: { auctionId: string }) => {
    if (!auctionId) return;
    cancelAuctionMutation.mutate({ auctionId });
  };

  const handleCollectAuctionPayout = ({ auctionId }: { auctionId: string }) => {
    if (!auctionId) return;
    collectAuctionPayoutMutation.mutate({ auctionId });
  };

  const handleCancelOffer = ({ offerId }: { offerId: string }) => {
    if (!offerId) return;
    cancelOfferMutation.mutate({ offerId });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    resetDisplayCount();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="mt-20 w-full min-h-screen pb-20">
      <Head>
        <title>Mint Mingle - Profile</title>
        <meta name="description" content="View your profile on Mint Mingle" />
      </Head>

      <ProfileHeader userAddress={userAddress} />

      <div className="pt-12 flex flex-col gap-8 min-h-screen w-full">
        <div className="flex items-center w-full justify-between gap-6 flex-col">
          <Header
            isActive={isActive}
            setIsActive={setIsActive}
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            onFilterClick={handleFilterClick}
            filters={filters}
            showRightSide={false}
            showFilters
            disabled={!userAddress || isLoading}
          />

          {selectedFilter === "Expired" && (
            <ExpiredOptionsFilter
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          )}
        </div>

        {userAddress ? (
          <div className="flex flex-wrap items-center gap-6 w-full">
            {/* NFTs Section */}
            {selectedFilter === "NFTS" && (
              <NFTsSection
                data={nftsData}
                isLoading={isLoading}
                searchQuery={searchQuery}
                displayCount={displayCount}
                loadMoreRef={loadMoreRef}
              />
            )}

            {/* Listings Section */}
            {selectedFilter === "Listed" && (
              <ListingsSection
                data={listingsData}
                isLoading={isLoading}
                searchQuery={searchQuery}
                displayCount={displayCount}
                loadMoreRef={loadMoreRef}
                onViewItem={handleViewItemClick}
                onCancel={handleCancelListing}
                isDisabled={isDisabled}
              />
            )}

            {/* Auctions Section */}
            {selectedFilter === "Auctions" && (
              <AuctionsSection
                data={auctionsData}
                isLoading={isLoading}
                searchQuery={searchQuery}
                displayCount={displayCount}
                loadMoreRef={loadMoreRef}
                onViewItem={handleViewItemClick}
                onCancel={handleCancelAuction}
                isDisabled={isDisabled}
              />
            )}

            {/* Offers Section */}
            {selectedFilter === "Offers Made" && (
              <OffersSection
                data={offersData}
                isLoading={isLoading}
                searchQuery={searchQuery}
                displayCount={displayCount}
                loadMoreRef={loadMoreRef}
                onViewItem={handleViewItemClick}
                onCancel={handleCancelOffer}
                isDisabled={isDisabled}
              />
            )}

            {/* NFT Activities Section */}
            {selectedFilter === "NFT Activities" && (
              <NFTActivitiesSection
                data={nftActivitiesData}
                isLoading={isLoading}
                searchQuery={searchQuery}
                displayCount={displayCount}
                loadMoreRef={loadMoreRef}
              />
            )}

            {/* Expired Section */}
            {selectedFilter === "Expired" && (
              <ExpiredSection
                selectedOption={selectedOption}
                listingsData={expiredListingsData}
                auctionsData={expiredAuctionsData}
                offersData={expiredOffersData}
                isLoading={isLoading}
                searchQuery={searchQuery}
                displayCount={displayCount}
                loadMoreRef={loadMoreRef}
                onViewItem={handleViewItemClick}
                onCancelListing={handleCancelListing}
                onCancelAuction={handleCancelAuction}
                onCancelOffer={handleCancelOffer}
                isDisabled={isDisabled}
              />
            )}

            {/* Pending Payout Section */}
            {selectedFilter === "Pending Payout" && (
              <PendingPayoutSection
                data={pendingPayoutData}
                isLoading={isLoading}
                searchQuery={searchQuery}
                displayCount={displayCount}
                loadMoreRef={loadMoreRef}
                onViewItem={handleViewItemClick}
                onCollect={handleCollectAuctionPayout}
                isDisabled={isDisabled}
              />
            )}

            {/* Offers Received Section */}
            {selectedFilter === "Offers Received" && (
              <OffersReceivedSection
                data={offersReceivedData}
                isLoading={isLoading}
                searchQuery={searchQuery}
                displayCount={displayCount}
                loadMoreRef={loadMoreRef}
                onViewItem={handleViewItemClick}
              />
            )}

            {/* Collections Section */}
            {selectedFilter === "Collections" && (
              <CollectionsSection
                data={collectionsData}
                isLoading={isLoading}
                searchQuery={searchQuery}
                displayCount={displayCount}
                loadMoreRef={loadMoreRef}
              />
            )}
          </div>
        ) : (
          <ConnectWalletPrompt />
        )}
      </div>
    </div>
  );
}
