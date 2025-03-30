import { useInView } from "react-intersection-observer";
import { EmptyState, NFTCard } from "@/modules/app";
import { useCollectionFilters } from "./hooks/useCollectionFilters";
import { useRouter } from "next/router";

interface CollectionOffersTabProps {
  collectionAddress: string;
  searchQuery: string;
}

export const CollectionOffersTab = ({
  collectionAddress,
  searchQuery,
}: CollectionOffersTabProps) => {
  const router = useRouter();
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
    delay: 100,
  });

  const { filteredOffers, paginatedOffers, displayCount } =
    useCollectionFilters(collectionAddress, searchQuery, "All");

  const handleViewItemClick = ({
    contractAddress,
    tokenId,
  }: {
    contractAddress: string;
    tokenId: string;
  }) => {
    router.push(`/nft/${contractAddress}/${tokenId}`);
  };

  return (
    <div className="mt-6">
      <div className="w-full grid min-[1250px]:grid-cols-4 min-[1550px]:grid-cols-5 min-[970px]:grid-cols-3 max-[970px]:flex flex-wrap grid-cols-1 place-content-center gap-5">
        {paginatedOffers && paginatedOffers.length > 0 ? (
          <>
            {paginatedOffers.map((offer, index) => (
              <NFTCard
                key={index}
                data={offer}
                type="offers"
                cta="View Items"
                nft={offer.nft}
                onClick={() => {
                  handleViewItemClick({
                    contractAddress: offer.assetContract,
                    tokenId: offer.tokenId.toString(),
                  });
                }}
              />
            ))}
            {filteredOffers.length > displayCount && (
              <div ref={loadMoreRef} className="w-full h-20" />
            )}
          </>
        ) : (
          <div className="col-span-full w-full flex items-center justify-center min-h-[400px]">
            <EmptyState
              message={
                searchQuery.length > 0
                  ? "No offers found"
                  : "No offers in this collection"
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
