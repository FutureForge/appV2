import { useInView } from "react-intersection-observer";
import { EmptyState, NFTCard } from "@/modules/app";
import { useCollectionFilters } from "./hooks/useCollectionFilters";
import { useRouter } from "next/router";
import { CollectionNFTCard } from ".";

interface CollectionItemsTabProps {
  collectionAddress: string;
  searchQuery: string;
  selectedFilter: string;
}

export const CollectionItemsTab = ({
  collectionAddress,
  searchQuery,
  selectedFilter,
}: CollectionItemsTabProps) => {
  const router = useRouter();

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
    delay: 100,
  });

  const {
    filteredNFTs,
    paginatedNFTs,
    displayCount,
    collectionAllListings,
    collectionAllAuctions,
  } = useCollectionFilters(collectionAddress, searchQuery, selectedFilter);

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
        {paginatedNFTs && paginatedNFTs.length > 0 ? (
          <>
            {paginatedNFTs.map((nft, index) => {
              const isListed = collectionAllListings?.find(
                (listing) => Number(listing.tokenId) === Number(nft.tokenId)
              );
              const isAuctioned = collectionAllAuctions?.find(
                (auction) => Number(auction.tokenId) === Number(nft.tokenId)
              );

              const status = isListed
                ? "listed"
                : isAuctioned
                ? "auctioned"
                : "";
              const type = isListed ? "listing" : "auction";
              const data = isListed || isAuctioned;

              return status && data ? (
                <NFTCard
                  key={index}
                  data={data}
                  status={status}
                  type={type}
                  nft={data.nft}
                  cta="View Item"
                  extraCTA={isListed ? "Buy Listing" : "Buy Auction"}
                  ctaStyles="!bg-border"
                  onClick={() => {
                    handleViewItemClick({
                      contractAddress: data.assetContract,
                      tokenId: data.tokenId.toString(),
                    });
                  }}
                />
              ) : (
                <CollectionNFTCard
                  key={index}
                  nft={nft}
                  collectionAddress={collectionAddress}
                />
              );
            })}
            {filteredNFTs.length > displayCount && (
              <div ref={loadMoreRef} className="w-full h-20" />
            )}
          </>
        ) : (
          <div className="col-span-full w-full flex items-center justify-center min-h-[400px]">
            <EmptyState
              message={
                searchQuery.length > 0
                  ? "No items found"
                  : "No items in this collection"
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
