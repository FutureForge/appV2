import React from "react";
import { useRouter } from "next/router";
import { NFTCard } from "@/modules/app";
import { Auction, Listing, Offer } from "@/modules/query/utils";
import {
  ProfileCustomNFTCard,
  ErrorState,
  LoadingSkeleton,
  LoadMoreTrigger,
} from "./profile-component";
import {
  CollectionsNFTCard,
  ImageHolder,
} from "../home/components/collections-nft-card/collections-nft-card";
import {
  Collection,
  UserNFTData,
} from "@/utils/types/collection/collection.type";
import Link from "next/link";
import { chainInfo } from "@/utils/configs";
import { getFormatAddress } from "@/utils/functions";
import { useUserChainInfo } from "@/modules/query";

import LinkIcon from "@/assets/link-external-02.svg";

// Section components for each filter type
export const NFTsSection = ({
  data,
  isLoading,
  searchQuery,
  displayCount,
  loadMoreRef,
}: {
  data: UserNFTData[];
  isLoading: boolean;
  searchQuery: string;
  displayCount: number;
  loadMoreRef: React.Ref<HTMLDivElement>;
}) => {
  if (isLoading) return <LoadingSkeleton />;
  if (!data || data.length === 0) {
    return <ErrorState message={searchQuery ? "No NFTs found" : "No NFTs"} />;
  }

  return (
    <div className="w-full grid min-[1250px]:grid-cols-4 min-[1680px]:grid-cols-5 min-[675px]:grid-cols-2 min-[960px]:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
      {data.slice(0, displayCount).map((nft, index) => (
        <ProfileCustomNFTCard key={index} data={nft} />
      ))}
      {data.length > displayCount && <LoadMoreTrigger ref={loadMoreRef} />}
    </div>
  );
};

export const ListingsSection = ({
  data,
  isLoading,
  searchQuery,
  displayCount,
  loadMoreRef,
  onViewItem,
  onCancel,
  isDisabled,
}: {
  data: Listing[];
  isLoading: boolean;
  searchQuery: string;
  displayCount: number;
  loadMoreRef: React.Ref<HTMLDivElement>;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
  onCancel: (item: { listingId: string }) => void;
  isDisabled: boolean;
}) => {
  if (isLoading) return <LoadingSkeleton />;
  if (!data || data.length === 0) {
    return (
      <ErrorState message={searchQuery ? "No NFTs found" : "No NFT Listed"} />
    );
  }

  return (
    <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
      {data.slice(0, displayCount).map((listing) => (
        <NFTCard
          key={listing.listingId}
          data={listing}
          type="user-listing"
          cta="View Item"
          nft={listing.nft}
          onClick={() =>
            onViewItem({
              contractAddress: listing.assetContract,
              tokenId: listing.tokenId.toString(),
            })
          }
          actionCTA="Cancel Listing"
          actionOnClick={() =>
            onCancel({ listingId: listing.listingId.toString() })
          }
          isDisabled={isDisabled}
        />
      ))}
      {data.length > displayCount && <LoadMoreTrigger ref={loadMoreRef} />}
    </div>
  );
};

// Add these to profile-sections.tsx

export const AuctionsSection = ({
  data,
  isLoading,
  searchQuery,
  displayCount,
  loadMoreRef,
  onViewItem,
  onCancel,
  isDisabled,
}: {
  data: Auction[];
  isLoading: boolean;
  searchQuery: string;
  displayCount: number;
  loadMoreRef: React.Ref<HTMLDivElement>;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
  onCancel: (item: { auctionId: string }) => void;
  isDisabled: boolean;
}) => {
  if (isLoading) return <LoadingSkeleton />;
  if (!data || data.length === 0) {
    return (
      <ErrorState
        message={searchQuery ? "No NFTs found" : "No NFT Auctioned"}
      />
    );
  }

  return (
    <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
      {data.slice(0, displayCount).map((auction) => (
        <NFTCard
          key={auction.auctionId}
          data={auction}
          type="user-auction"
          cta="View Item"
          nft={auction.nft}
          onClick={() =>
            onViewItem({
              contractAddress: auction.assetContract,
              tokenId: auction.tokenId.toString(),
            })
          }
          actionCTA="Cancel Auction"
          actionOnClick={() =>
            onCancel({ auctionId: auction.auctionId.toString() })
          }
          isDisabled={isDisabled}
        />
      ))}
      {data.length > displayCount && <LoadMoreTrigger ref={loadMoreRef} />}
    </div>
  );
};

export const OffersSection = ({
  data,
  isLoading,
  searchQuery,
  displayCount,
  loadMoreRef,
  onViewItem,
  onCancel,
  isDisabled,
}: {
  data: Offer[];
  isLoading: boolean;
  searchQuery: string;
  displayCount: number;
  loadMoreRef: React.Ref<HTMLDivElement>;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
  onCancel: (item: { offerId: string }) => void;
  isDisabled: boolean;
}) => {
  if (isLoading) return <LoadingSkeleton />;
  if (!data || data.length === 0) {
    return (
      <ErrorState message={searchQuery ? "No NFTs found" : "No NFT Offers"} />
    );
  }

  return (
    <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
      {data.slice(0, displayCount).map((offer) => (
        <NFTCard
          key={offer.offerId}
          data={offer}
          type="offers"
          cta="View Item"
          nft={offer.nft}
          onClick={() =>
            onViewItem({
              contractAddress: offer.assetContract,
              tokenId: offer.tokenId.toString(),
            })
          }
          actionCTA="Cancel Offer"
          actionOnClick={() => onCancel({ offerId: offer.offerId.toString() })}
          isDisabled={isDisabled}
        />
      ))}
      {data.length > displayCount && <LoadMoreTrigger ref={loadMoreRef} />}
    </div>
  );
};

export const NFTActivitiesSection = ({
  data,
  isLoading,
  searchQuery,
  displayCount,
  loadMoreRef,
}: {
  data: any[];
  isLoading: boolean;
  searchQuery: string;
  displayCount: number;
  loadMoreRef: React.Ref<HTMLDivElement>;
}) => {
  const { activeAccount } = useUserChainInfo();
  const walletAddress = activeAccount?.address;

  if (isLoading) return <LoadingSkeleton />;
  if (!data || data.length === 0) {
    return (
      <ErrorState
        message={searchQuery ? "No NFTs found" : "No NFT Activities"}
      />
    );
  }

  return (
    <div className="flex items-center gap-8 flex-wrap w-full">
      {data && data.length > 0 && (
        <div className="mt-6 w-full">
          {Object.entries(
            data.reduce((acc, transfer) => {
              const date = new Date(transfer.timestamp).toLocaleDateString();
              return {
                ...acc,
                [date]: [...(acc[date] || []), transfer],
              };
            }, {} as Record<string, any[]>)
          ).map(([date, transfers]) => (
            <div key={date} className="mb-8">
              <div className="bg-card w-full py-2 px-3 rounded-lg mb-4">
                <p className="text-sm font-medium">{date}</p>
              </div>

              <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center gap-5">
                {(transfers as any[]).map((transfer, index) => {
                  const image = transfer?.nft.metadata.image;
                  const name = transfer?.nft.metadata.name;

                  const isReceiver =
                    transfer?.addressTo.toLowerCase() ===
                    walletAddress?.toLowerCase();

                  const isSender =
                    transfer?.addressFrom.toLowerCase() ===
                    walletAddress?.toLowerCase();

                  return (
                    <div
                      key={index}
                      className="bg-card rounded-2xl p-4 flex items-center gap-4"
                    >
                      <div className="flex-shrink-0">
                        <ImageHolder
                          src={image!}
                          alt={name!}
                          className="rounded-lg object-cover size-20"
                          width="80px"
                          height="80px"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-medium text-lg mb-2">
                          {isSender
                            ? "Sent NFT"
                            : isReceiver
                            ? "Received NFT"
                            : ""}
                        </p>
                        <span className="flex items-center gap-1 w-full justify-between">
                          <p className="text-sm text-muted-foreground truncate">
                            From{" "}
                            <span className="text-foreground font-medium">
                              {getFormatAddress(transfer.addressFrom)}
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            To{" "}
                            <span className="text-foreground font-medium">
                              {getFormatAddress(transfer.addressTo)}
                            </span>
                          </p>
                        </span>

                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-muted-foreground">
                            {new Date(transfer.timestamp).toLocaleTimeString()}
                          </p>
                          <Link
                            href={`${chainInfo.blockExplorers?.[0]?.url}/tx/${transfer.txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-shrink-0 "
                          >
                            <LinkIcon className="size-5 text-muted-foreground hover:text-foreground transition-colors duration-300 ease-in-out" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {data.length > displayCount && <LoadMoreTrigger ref={loadMoreRef} />}
        </div>
      )}
    </div>
  );
};

export const ExpiredSection = ({
  selectedOption,
  listingsData,
  auctionsData,
  offersData,
  isLoading,
  searchQuery,
  displayCount,
  loadMoreRef,
  onViewItem,
  onCancelListing,
  onCancelAuction,
  onCancelOffer,
  isDisabled,
}: {
  selectedOption: string;
  listingsData: Listing[];
  auctionsData: Auction[];
  offersData: Offer[];
  isLoading: boolean;
  searchQuery: string;
  displayCount: number;
  loadMoreRef: React.Ref<HTMLDivElement>;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
  onCancelListing: (item: { listingId: string }) => void;
  onCancelAuction: (item: { auctionId: string }) => void;
  onCancelOffer: (item: { offerId: string }) => void;
  isDisabled: boolean;
}) => {
  if (isLoading) return <LoadingSkeleton />;

  return (
    <>
      {selectedOption === "Expired Listing" && (
        <ListingsSection
          data={listingsData}
          isLoading={isLoading}
          searchQuery={searchQuery}
          displayCount={displayCount}
          loadMoreRef={loadMoreRef}
          onViewItem={onViewItem}
          onCancel={onCancelListing}
          isDisabled={isDisabled}
        />
      )}

      {selectedOption === "Expired Auction" && (
        <AuctionsSection
          data={auctionsData}
          isLoading={isLoading}
          searchQuery={searchQuery}
          displayCount={displayCount}
          loadMoreRef={loadMoreRef}
          onViewItem={onViewItem}
          onCancel={onCancelAuction}
          isDisabled={isDisabled}
        />
      )}

      {selectedOption === "Expired Offer" && (
        <OffersSection
          data={offersData}
          isLoading={isLoading}
          searchQuery={searchQuery}
          displayCount={displayCount}
          loadMoreRef={loadMoreRef}
          onViewItem={onViewItem}
          onCancel={onCancelOffer}
          isDisabled={isDisabled}
        />
      )}
    </>
  );
};

export const PendingPayoutSection = ({
  data,
  isLoading,
  searchQuery,
  displayCount,
  loadMoreRef,
  onViewItem,
  onCollect,
  isDisabled,
}: {
  data: Auction[];
  isLoading: boolean;
  searchQuery: string;
  displayCount: number;
  loadMoreRef: React.Ref<HTMLDivElement>;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
  onCollect: (item: { auctionId: string }) => void;
  isDisabled: boolean;
}) => {
  if (isLoading) return <LoadingSkeleton />;
  if (!data || data.length === 0) {
    return (
      <ErrorState
        message={searchQuery ? "No NFTs found" : "No NFT Pending Payout"}
      />
    );
  }

  return (
    <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
      {data.slice(0, displayCount).map((auction) => (
        <NFTCard
          key={auction.auctionId}
          data={auction}
          type="user-auction"
          cta="View Item"
          nft={auction.nft}
          onClick={() =>
            onViewItem({
              contractAddress: auction.assetContract,
              tokenId: auction.tokenId.toString(),
            })
          }
          actionCTA="Collect Payout"
          actionOnClick={() =>
            onCollect({ auctionId: auction.auctionId.toString() })
          }
          isDisabled={isDisabled}
        />
      ))}
      {data.length > displayCount && <LoadMoreTrigger ref={loadMoreRef} />}
    </div>
  );
};

export const OffersReceivedSection = ({
  data,
  isLoading,
  searchQuery,
  displayCount,
  loadMoreRef,
  onViewItem,
}: {
  data: Offer[];
  isLoading: boolean;
  searchQuery: string;
  displayCount: number;
  loadMoreRef: React.Ref<HTMLDivElement>;
  onViewItem: (item: { contractAddress: string; tokenId: string }) => void;
}) => {
  if (isLoading) return <LoadingSkeleton />;
  if (!data || data.length === 0) {
    return (
      <ErrorState
        message={searchQuery ? "No NFTs found" : "No NFT Offers Received"}
      />
    );
  }

  return (
    <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
      {data.slice(0, displayCount).map((offer) => (
        <NFTCard
          key={offer.offerId}
          data={offer}
          type="user-offers-received"
          cta="View Item"
          nft={offer.nft}
          onClick={() =>
            onViewItem({
              contractAddress: offer.assetContract,
              tokenId: offer.tokenId.toString(),
            })
          }
          extraTitle="Total Offers"
          extraInfo={data.length}
        />
      ))}
      {data.length > displayCount && <LoadMoreTrigger ref={loadMoreRef} />}
    </div>
  );
};

export const CollectionsSection = ({
  data,
  isLoading,
  searchQuery,
  displayCount,
  loadMoreRef,
}: {
  data: Collection[];
  isLoading: boolean;
  searchQuery: string;
  displayCount: number;
  loadMoreRef: React.Ref<HTMLDivElement>;
}) => {
  const router = useRouter();

  if (isLoading) return <LoadingSkeleton />;
  if (!data || data.length === 0) {
    return (
      <ErrorState
        message={searchQuery ? "No Collections found" : "No Collection Created"}
      />
    );
  }

  return (
    <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
      {data.slice(0, displayCount).map((collection) => (
        <CollectionsNFTCard
          key={collection.collectionAddress}
          {...collection}
          onClick={() =>
            router.push(`/collections/${collection.collectionAddress}`)
          }
          cta="View Collection"
        />
      ))}
      {data.length > displayCount && <LoadMoreTrigger ref={loadMoreRef} />}
    </div>
  );
};
