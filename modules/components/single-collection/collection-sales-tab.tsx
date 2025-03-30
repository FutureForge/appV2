import { useInView } from "react-intersection-observer";
import { EmptyState, NFTCard } from "@/modules/app";
import { useCollectionFilters } from "./hooks/useCollectionFilters";
import {
  NFTCardInfo,
  NFTStatus,
} from "@/modules/app/component/nft-card/utils/nft-card.utils";
import { useRouter } from "next/router";

interface CollectionSalesTabProps {
  collectionAddress: string;
  searchQuery: string;
}

export const CollectionSalesTab = ({
  collectionAddress,
  searchQuery,
}: CollectionSalesTabProps) => {
  const router = useRouter();

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
    delay: 100,
  });

  const { filteredSales, paginatedSales, displayCount } = useCollectionFilters(
    collectionAddress,
    searchQuery,
    "All"
  );

  console.log({ filteredSales, paginatedSales });

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
        {paginatedSales && paginatedSales.length > 0 ? (
          <>
            {paginatedSales.map((sale, index) => (
              <NFTCard
                key={index}
                data={sale}
                type={sale.saleType as NFTCardInfo}
                status={sale.nftStatus as NFTStatus}
                nft={sale.nft}
                cta="View Item"
                onClick={() => {
                  handleViewItemClick({
                    contractAddress: sale.assetContract,
                    tokenId: sale.tokenId.toString(),
                  });
                }}
              />
            ))}
            {filteredSales.length > displayCount && (
              <div ref={loadMoreRef} className="w-full h-20" />
            )}
          </>
        ) : (
          <div className="col-span-full w-full flex items-center justify-center min-h-[400px]">
            <EmptyState
              message={
                searchQuery.length > 0
                  ? "No sales found"
                  : "No sales in this collection"
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
