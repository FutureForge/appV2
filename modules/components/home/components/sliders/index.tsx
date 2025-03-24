import { CustomSlider, ErrorComponent, NFTCard } from "@/modules/app";
import {
  useAllCollectionsQuery,
  useAllAuctionsBlockchainQuery,
  useAllListingBlockchainQuery,
  useAllOffersBlockchainQuery,
  useCompletedListingEventQuery,
  useCompletedAuctionEventQuery,
  useAcceptedOfferEventQuery,
  useAuctionBidEventQuery,
  useNewOfferEventQuery,
} from "@/modules/query";
import React, { useEffect } from "react";
import {
  CollectionNFTCardProps,
  CollectionsNFTCard,
} from "../collections-nft-card/collections-nft-card";
import { useRouter } from "next/navigation";
import { TransitionLinks } from "@/modules/app/component/nav/transition-links";
import { useWindowSize } from "@uidotdev/usehooks";
import {
  AcceptedOfferEvent,
  Auction,
  AuctionBidEvent,
  CompletedAuctionEvent,
  CompletedListingEvent,
  Listing,
  Offer,
} from "@/modules/query/utils";
import { QueryBrowsePageFilters } from "@/modules/components/browse/components/browse-page/browse-page";

export function Sliders() {
  const router = useRouter();
  const {
    data: collectionQuery,
    isLoading: isCollectionLoading,
    isError: isErrorCollectionQuery,
  } = useAllCollectionsQuery({});

  const {
    data: newAuction,
    isLoading: isLoadingNewAuction,
    isError: isErrorNewAuction,
    error: errorNewAuction,
  } = useAllAuctionsBlockchainQuery({
    limit: 2,
    type: "new-auction",
  });

  const {
    data: newListing,
    isLoading: isLoadingNewListing,
    isError: isErrorNewListing,
    error: errorNewListing,
  } = useAllListingBlockchainQuery({
    limit: 2,
    type: "new-listing",
  });

  const {
    data: newOffer,
    isLoading: isLoadingNewOffer,
    isError: isErrorNewOffer,
    error: errorNewOffer,
  } = useAllOffersBlockchainQuery({
    limit: 2,
    type: "new-offer",
  });

  const {
    data: auctionBidEventQuery,
    isLoading: isLoadingAuctionBidEvent,
    isError: isErrorAuctionBidEvent,
    error: errorAuctionBidEvent,
  } = useAuctionBidEventQuery({});

  const {
    data: completedListingEventQuery,
    isLoading: isLoadingCompletedListing,
    isError: isErrorCompletedListing,
    error: errorCompletedListing,
  } = useCompletedListingEventQuery({});

  const {
    data: completedAuctionEventQuery,
    isLoading: isLoadingCompletedAuction,
    isError: isErrorCompletedAuction,
    error: errorCompletedAuction,
  } = useCompletedAuctionEventQuery({});

  const {
    data: acceptedOfferEventQuery,
    isLoading: isLoadingAcceptedOffer,
    isError: isErrorAcceptedOffer,
    error: errorAcceptedOffer,
  } = useAcceptedOfferEventQuery({});

  // console.log({
  //   errorAcceptedOffer,
  //   errorAuctionBidEvent,
  //   errorCompletedListing,
  //   errorCompletedAuction,
  //   errorNewOffer,
  //   errorNewListing,
  //   errorNewAuction,
  // });

  // console.log({
  //   isErrorCollectionQuery,
  //   isErrorNewAuction,
  //   isErrorNewListing,
  //   isErrorAuctionBidEvent,
  //   isErrorCompletedListing,
  //   isErrorCompletedAuction,
  //   isErrorAcceptedOffer,
  //   isErrorNewOffer,
  // });

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
    <div className="px-6 w-full overflow-hidden flex flex-col max-w-[1730px] mx-auto">
      {/* collection List */}
      <DataSlider
        isLoading={isCollectionLoading}
        title="Collection List"
        cta="View More"
        href="/collections"
        data={collectionQuery?.collections || []}
        renderItem={(collection: CollectionNFTCardProps) => {
          const handleClick = () => {
            router.push(`/collections/${collection.collectionAddress}`);
          };
          return (
            <CollectionsNFTCard
              key={collection.collectionAddress}
              collectionAddress={collection.collectionAddress}
              collectionImage={collection.collectionImage}
              collectionName={collection.collectionName}
              floorPrice={collection.floorPrice}
              totalVolume={collection.totalVolume}
              onClick={handleClick}
              cta="Shop Collections"
            />
          );
        }}
      />

      {/* Completed Listing */}
      <DataSlider
        isLoading={isLoadingCompletedListing}
        title="Completed Listing"
        cta="View More"
        href={`/browse?filter=${QueryBrowsePageFilters.COMPLETED_LISTING}`}
        data={isErrorCompletedListing ? [] : completedListingEventQuery || []}
        renderItem={(completedListing: CompletedListingEvent) => {
          return (
            <NFTCard
              key={completedListing.listingId}
              data={completedListing}
              type="completed-listing"
              cta="View Item"
              nft={completedListing.nft}
              onClick={() => {
                handleViewItem({
                  contractAddress: completedListing.assetContract,
                  tokenId: completedListing.tokenId.toString(),
                });
              }}
            />
          );
        }}
      />

      {/* Recently Listed */}
      <DataSlider
        isLoading={isLoadingNewListing}
        title="Recently Listed"
        cta="View More"
        href={`/browse?filter=${QueryBrowsePageFilters.ALL_LISTINGS}`}
        data={isErrorNewListing ? [] : newListing || []}
        renderItem={(listing: Listing) => {
          return (
            <NFTCard
              key={listing.listingId}
              data={listing}
              type="listing"
              nft={listing.nft}
              cta="View Item"
              onClick={() => {
                handleViewItem({
                  contractAddress: listing.assetContract,
                  tokenId: listing.tokenId.toString(),
                });
              }}
            />
          );
        }}
      />

      {/* Completed Auction */}
      <DataSlider
        isLoading={isLoadingCompletedAuction}
        title="Completed Auction"
        cta="View More"
        href={`/browse?filter=${QueryBrowsePageFilters.COMPLETED_AUCTION}`}
        data={isErrorCompletedAuction ? [] : completedAuctionEventQuery || []}
        renderItem={(completedAuction: CompletedAuctionEvent) => {
          return (
            <NFTCard
              key={completedAuction.auctionId}
              data={completedAuction}
              nft={completedAuction.nft}
              type="completed-auction"
              cta="View Item"
              onClick={() => {
                handleViewItem({
                  contractAddress: completedAuction.assetContract,
                  tokenId: completedAuction.tokenId.toString(),
                });
              }}
            />
          );
        }}
      />

      {/* Recently Auctioned */}
      <DataSlider
        isLoading={isLoadingNewAuction}
        title="Recently Auctioned NFTs"
        cta="View More"
        href={`/browse?filter=${QueryBrowsePageFilters.ALL_AUCTIONS}`}
        data={isErrorNewAuction ? [] : newAuction || []}
        renderItem={(auction: Auction) => {
          return (
            <NFTCard
              key={auction.auctionId}
              data={auction}
              type="new-auction"
              cta="View Item"
              nft={auction.nft}
              onClick={() => {
                handleViewItem({
                  contractAddress: auction.assetContract,
                  tokenId: auction.tokenId.toString(),
                });
              }}
            />
          );
        }}
      />

      {/* Accepted Offers */}
      <DataSlider
        isLoading={isLoadingAcceptedOffer}
        title="Accepted Offers"
        cta="View More"
        href={`/browse?filter=${QueryBrowsePageFilters.ACCEPTED_OFFERS}`}
        data={isErrorAcceptedOffer ? [] : acceptedOfferEventQuery || []}
        renderItem={(acceptedOfferEvent: AcceptedOfferEvent) => {
          return (
            <NFTCard
              key={acceptedOfferEvent.offerId}
              data={acceptedOfferEvent}
              nft={acceptedOfferEvent.nft}
              type="accepted-offers"
              cta="View Item"
              onClick={() => {
                handleViewItem({
                  contractAddress: acceptedOfferEvent.assetContract,
                  tokenId: acceptedOfferEvent.tokenId.toString(),
                });
              }}
            />
          );
        }}
      />

      {/* Recent Offers */}
      <DataSlider
        isLoading={isLoadingNewOffer}
        title="Recent Offers"
        cta="View More"
        href={`/browse?filter=${QueryBrowsePageFilters.ALL_OFFERS}`}
        data={isErrorNewOffer ? [] : newOffer || []}
        renderItem={(offer: Offer) => {
          return (
            <NFTCard
              key={offer.offerId}
              data={offer}
              type="new-offers"
              cta="View Item"
              nft={offer.nft}
              onClick={() => {
                handleViewItem({
                  contractAddress: offer.assetContract,
                  tokenId: offer.tokenId.toString(),
                });
              }}
            />
          );
        }}
      />

      {/* Recent Auction Bids */}
      <DataSlider
        isLoading={isLoadingAuctionBidEvent}
        title="Recent Auction Bids"
        cta="View More"
        href={`/browse?filter=${QueryBrowsePageFilters.AUCTION_BIDS}`}
        data={isErrorAuctionBidEvent ? [] : auctionBidEventQuery || []}
        renderItem={(auctionBid: AuctionBidEvent) => {
          return (
            <NFTCard
              key={auctionBid.auctionId}
              data={auctionBid}
              type="auction-bids"
              cta="View Item"
              nft={auctionBid.auction.nft}
              onClick={() => {
                handleViewItem({
                  contractAddress: auctionBid.assetContract,
                  tokenId: auctionBid.auction.tokenId.toString(),
                });
              }}
            />
          );
        }}
      />
    </div>
  );
}

type DataSliderProps = {
  title: string;
  cta: string;
  href: string;
  isLoading: boolean;
  data: any[];
  renderItem: (item: any) => React.ReactNode;
};

export const DataSlider: React.FC<DataSliderProps> = ({
  title,
  cta,
  href,
  isLoading,
  data,
  renderItem,
}) => {
  const { width } = useWindowSize();
  const isMobile = width && width <= 550;

  if (data.length === 0) {
    return (
      <div className="flex gap-8 flex-col mt-12">
        <div className="flex items-center w-full justify-between">
          <h3 className="font-medium text-2xl text-white">{title}</h3>
        </div>
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="text-white/50 text-2xl">No {title} found</span>
        </div>
      </div>
    );
  }

  if (data.length <= 3 && (!isMobile || data.length <= 1)) {
    return (
      <div className="flex gap-8 flex-col mt-12">
        <div className="flex items-center w-full justify-between">
          <h3 className="font-medium text-2xl text-white">{title}</h3>
          <TransitionLinks
            href={href}
            className="text-white bg-border rounded-xl px-3 py-2 hover:bg-border/70 transition-all duration-300 ease-in-out"
          >
            {cta}
          </TransitionLinks>
        </div>
        <div className="flex items-center gap-7">{data.map(renderItem)}</div>
      </div>
    );
  }

  return (
    <CustomSlider isLoading={isLoading} title={title} cta={cta} href={href}>
      {data.map(renderItem)}
    </CustomSlider>
  );
};
