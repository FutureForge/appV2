import { CustomSlider, ErrorComponent, NFTCard } from "@/modules/app";
import {
  useAllCollectionsQuery,
  useAuctionClosedQuery,
  useNewAuctionsQuery,
  useNewBidsQuery,
  useNewListingsQuery,
  useNewOffersQuery,
  useNewSaleListingsQuery,
} from "@/modules/query";
import React from "react";
import {
  CollectionNFTCardProps,
  CollectionsNFTCard,
} from "../collections-nft-card/collections-nft-card";
import { useRouter } from "next/navigation";
import { Auction, Listing, NewBid, Offer } from "@/utils/types/graphql";
import { TransitionLinks } from "@/modules/app/component/nav/transition-links";
import { useWindowSize } from "@uidotdev/usehooks";

export function Sliders() {
  const router = useRouter();
  const { data: CollectionQuery, isLoading: isCollectionLoading } =
    useAllCollectionsQuery({});

  const {
    data: NewListings,
    isLoading: isNewListingsLoading,
    isError: isNewListingError,
  } = useNewListingsQuery({ limit: 15 });

  const {
    data: NewSalesListing,
    isLoading: isNewSalesLoading,
    isError: isNewSalesError,
  } = useNewSaleListingsQuery({ limit: 15 });

  const {
    data: NewAuction,
    isLoading: isNewAuctionLoading,
    isError: isNewAuctionError,
  } = useNewAuctionsQuery({ limit: 15 });

  const {
    data: AuctionClosed,
    isLoading: isAuctionClosedLoading,
    isError: isAuctionClosedError,
  } = useAuctionClosedQuery({ limit: 15 });

  const {
    data: RecentOffers,
    isLoading: isRecentOffersLoading,
    isError: isRecentOffersError,
  } = useNewOffersQuery({ limit: 15 });

  const {
    data: NewBids,
    isLoading: isNewBidsLoading,
    isError: isNewBidsError,
  } = useNewBidsQuery({
    limit: 15,
  });

  const isError =
    isNewBidsError ||
    isNewListingError ||
    isNewSalesError ||
    isNewAuctionError ||
    isAuctionClosedError ||
    isRecentOffersError;

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
    <div className="px-6 w-full overflow-hidden flex flex-col">
      {/* collection List */}
      <DataSlider
        isLoading={isCollectionLoading}
        title="Collection List"
        cta="View More"
        href="/collections"
        data={CollectionQuery?.collections || []}
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
        isLoading={isNewListingsLoading}
        title="Recently Listed"
        cta="View More"
        href="/browse?filter=recent_listings"
        data={NewListings || []}
        renderItem={(listing: Listing) => {
          return (
            <NFTCard
              key={listing.id}
              data={listing}
              type="listing"
              cta="View Item"
              onClick={() => {
                handleViewItem({
                  contractAddress: listing.assetContract,
                  tokenId: listing.tokenId,
                });
              }}
            />
          );
        }}
      />

      {/* Recently Auctioned */}
      <DataSlider
        isLoading={isNewAuctionLoading}
        title="Recently Auctioned NFTs"
        cta="View More"
        href="/browse?filter=recent_auctions"
        data={NewAuction || []}
        renderItem={(auction: Auction) => {
          return (
            <NFTCard
              key={auction.id}
              data={auction}
              type="new-auction"
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
      />

      {/* Recent Bids */}
      <DataSlider
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
      />

      {/* Recently Sold Listing */}
      <DataSlider
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
      />

      {/* Recently Sold Auction */}
      <DataSlider
        isLoading={isAuctionClosedLoading}
        title="Recently Sold Auction"
        cta="View More"
        href="/browse?filter=recent_sold_auctions"
        data={AuctionClosed || []}
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
      />

      {/* Recent Offers */}
      <DataSlider
        isLoading={isRecentOffersLoading}
        title="Recent Offers"
        cta="View More"
        href="/browse?filter=recent_offers"
        data={RecentOffers || []}
        renderItem={(offer: Offer) => {
          return (
            <NFTCard
              key={offer.id}
              data={offer}
              type="new-offers"
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
      />

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
