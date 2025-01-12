import { CustomSlider, ErrorComponent, NFTCard } from "@/modules/app";
import {
  useAllCollectionsQuery,
  useAllAuctionsBlockchainQuery,
  useAllListingBlockchainQuery,
  useAllOffersBlockchainQuery,
  useUserListingBlockchainQuery,
  useUserAuctionBlockchainQuery,
  useUserOfferBlockchainQuery,
} from "@/modules/query";
import React from "react";
import {
  CollectionNFTCardProps,
  CollectionsNFTCard,
} from "../collections-nft-card/collections-nft-card";
import { useRouter } from "next/navigation";
import { TransitionLinks } from "@/modules/app/component/nav/transition-links";
import { useWindowSize } from "@uidotdev/usehooks";
import {
  Auction,
  Listing,
  Offer,
} from "@/modules/query/utils/index.utils.query";

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
  } = useAllAuctionsBlockchainQuery({
    limit: 2,
    type: "new-auction",
  });

  const {
    data: newListing,
    isLoading: isLoadingNewListing,
    isError: isErrorNewListing,
  } = useAllListingBlockchainQuery({
    limit: 2,
    type: "new-listing",
  });

  const {
    data: newOffer,
    isLoading: isLoadingNewOffer,
    isError: isErrorNewOffer,
  } = useAllOffersBlockchainQuery({
    limit: 2,
    type: "new-offer",
  });

  const { data: userListing } = useUserListingBlockchainQuery({
    limit: 2,
    type: "expired-listing",
  });

  const { data: userAuction } = useUserAuctionBlockchainQuery({
    limit: 2,
    type: "expired-auction",
  });

  const { data: userOffer } = useUserOfferBlockchainQuery({
    limit: 2,
    type: "expired-offer",
  });

  const isError =
    isErrorCollectionQuery ||
    isErrorNewAuction ||
    isErrorNewListing ||
    isErrorNewOffer;

  const handleViewItem = ({
    contractAddress,
    tokenId,
  }: {
    contractAddress: string;
    tokenId: string;
  }) => {
    router.push(`/nft/${contractAddress}/${tokenId}`);
  };

  if (isError) {
    return <ErrorComponent />;
  }

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

      {/* Recently Listed */}
      <DataSlider
        isLoading={isLoadingNewListing}
        title="Recently Listed"
        cta="View More"
        href="/browse?filter=recent_listings"
        data={newListing || []}
        renderItem={(listing: Listing) => {
          return (
            <NFTCard
              key={listing.listingId}
              data={listing}
              type="listing"
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

      {/* Recently Auctioned */}
      <DataSlider
        isLoading={isLoadingNewAuction}
        title="Recently Auctioned NFTs"
        cta="View More"
        href="/browse?filter=recent_auctions"
        data={newAuction || []}
        renderItem={(auction: Auction) => {
          return (
            <NFTCard
              key={auction.auctionId}
              data={auction}
              type="new-auction"
              cta="View Item"
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

      {/* Recent Offers */}
      <DataSlider
        isLoading={isErrorNewOffer}
        title="Recent Offers"
        cta="View More"
        href="/browse?filter=recent_offers"
        data={newOffer || []}
        renderItem={(offer: Offer) => {
          return (
            <NFTCard
              key={offer.offerId}
              data={offer}
              type="new-offers"
              cta="View Item"
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

      {/* Recent Bids */}
      {/* <DataSlider
        isLoading={isNewBidsLoading}
        title="Recent Bids"
        cta="View More"
        href="/browse?filter=recent_bids"
        data={NewBids || []}
        renderItem={(bid: NewBid) => {
          return (
            <NFTCard
              key={bid.id}
              data={bid}
              type="bids"
              cta="View Item"
              onClick={() => {
                handleViewItem({
                  contractAddress: bid.assetContract,
                  tokenId: bid.tokenId,
                });
              }}
            />
          );
        }}
      /> */}

      {/* Recently Sold Listing */}
      {/* <DataSlider
        isLoading={isNewSalesLoading}
        title="Recently Sold Listing"
        cta="View More"
        href="/browse?filter=recent_sales"
        data={NewSalesListing || []}
        renderItem={(sale: Listing) => {
          return (
            <NFTCard
              key={sale.id}
              data={sale}
              type="new-sale-listing"
              cta="View Item"
              onClick={() => {
                handleViewItem({
                  contractAddress: sale.assetContract,
                  tokenId: sale.tokenId,
                });
              }}
            />
          );
        }}
      /> */}

      {/* Recently Sold Auction */}
      {/* <DataSlider
        isLoading={isLoadingCompletedAuction}
        title="Recently Sold Auction"
        cta="View More"
        href="/browse?filter=recent_sold_auctions"
        data={completedAuction || []}
        renderItem={(auction: Auction) => {
          return (
            <NFTCard
              key={auction.id}
              data={auction}
              type="new-sold-auction"
              cta="View Item"
              onClick={() => {
                handleViewItem({
                  contractAddress: auction.assetContract,
                  tokenId: auction.tokenId,
                });
              }}
            />
          );
        }}
      /> */}

      {/* Accepted Offers */}
      {/* <DataSlider
        isLoading={isAcceptedOffersLoading}
        title="Accepted Offers"
        cta="View More"
        href="/browse?filter=accepted_offers"
        data={AcceptedOffers || []}
        renderItem={(offer: Offer) => {
          return (
            <NFTCard
              key={offer.id}
              data={offer}
              type="new-accepted-offers"
              cta="View Item"
              onClick={() => {
                handleViewItem({
                  contractAddress: offer.assetContract,
                  tokenId: offer.tokenId,
                });
              }}
            />
          );
        }}
      /> */}
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
