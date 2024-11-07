import { CustomSlider, NFTCard } from "@/modules/app";
import {
  useAllCollectionsQuery,
  useNewListingsQuery,
  useNewSaleListingsQuery,
} from "@/modules/query";
import React from "react";
import {
  CollectionNFTCardProps,
  CollectionsNFTCard,
} from "../collections-nft-card/collections-nft-card";
import { useRouter } from "next/navigation";
import { Listing } from "@/utils/types/graphql";
import { TransitionLinks } from "@/modules/app/component/nav/transition-links";

export function Sliders() {
  const router = useRouter();
  const {
    data: CollectionQuery,
    isLoading,
    isError,
  } = useAllCollectionsQuery();
  const { data: NewListings, isLoading: isNewListingsLoading } =
    useNewListingsQuery({});
  const { data: NewSalesListing, isLoading: isNewSalesLoading } =
    useNewSaleListingsQuery({});
  console.log("====================================");
  console.log(NewSalesListing, "Hello");
  console.log("====================================");

  return (
    <div className="px-6 w-full overflow-hidden flex flex-col">
      {/* collection List */}
      <DataSlider
        isLoading={isLoading}
        title="Collection List"
        cta="View More"
        href="/collections"
        data={CollectionQuery || []}
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
        href="/collections"
        data={NewListings || []}
        renderItem={(listing: Listing) => {
          return <NFTCard key={listing.id} data={listing} type="new-listing" />;
        }}
      />

      {/* Recently Sold */}
      <DataSlider
        isLoading={isNewSalesLoading}
        title="Recently Sold Listing"
        cta="View More"
        href="/collections"
        data={NewSalesListing || []}
        renderItem={(sale: Listing) => {
          return <NFTCard key={sale.id} data={sale} type="new-sale-listing" />;
        }}
      />
    </div>
  );
}

interface DataSliderProps {
  title: string;
  cta: string;
  href: string;
  isLoading: boolean;
  data: any[];
  renderItem: (item: any) => React.ReactNode;
}

export const DataSlider: React.FC<DataSliderProps> = ({
  title,
  cta,
  href,
  isLoading,
  data,
  renderItem,
}) => {
  if (data.length <= 3) {
    return (
      <div className="flex gap-8 flex-col mt-12">
        <div className="flex items-center w-full justify-between">
          <h3 className="font-medium text-2xl text-white">{title}</h3>
          <TransitionLinks
            href={href}
            className="text-white bg-border rounded-full px-3 py-2 hover:bg-border/70 transition-all duration-300 ease-in-out"
          >
            {cta}
          </TransitionLinks>
        </div>
        <div className="flex items-center gap-7">{data.map(renderItem)}</div>
      </div>
    );
  } else {
    return (
      <CustomSlider isLoading={isLoading} title={title} cta={cta} href={href}>
        {data.map(renderItem)}
      </CustomSlider>
    );
  }
};
