import { useInView } from "react-intersection-observer";
import { EmptyState } from "@/modules/app";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";

import { getFormatAddress } from "@/utils/functions";
import Link from "next/link";
import { chainInfo } from "@/utils/configs";

import LinkIcon from "@/assets/link-external-02.svg";
import { useCollectionFilters } from ".";

interface CollectionActivityTabProps {
  collectionAddress: string;
  searchQuery: string;
}

export const CollectionActivityTab = ({
  collectionAddress,
  searchQuery,
}: CollectionActivityTabProps) => {
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
    delay: 100,
  });

  const { filteredTransfers, paginatedTransfers, displayCount } =
    useCollectionFilters(collectionAddress, searchQuery, "All");

  if (!filteredTransfers || filteredTransfers.length === 0) {
    return (
      <div className="col-span-full w-full flex items-center justify-center min-h-[400px]">
        <EmptyState
          message={
            searchQuery.length > 0
              ? "No item found"
              : "No activity in this collection"
          }
        />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div>
        {Object.entries(
          paginatedTransfers.reduce((acc, transfer) => {
            const date = new Date(transfer.timestamp).toLocaleDateString();
            return {
              ...acc,
              [date]: [...(acc[date] || []), transfer],
            };
          }, {} as Record<string, typeof paginatedTransfers>)
        ).map(([date, transfers]) => (
          <div key={date} className="mb-8">
            <div className="bg-card w-full py-2 px-3 rounded-lg mb-4">
              <p className="text-sm font-medium">{date}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transfers.map((transfer, index) => {
                const image = transfer.nft?.metadata?.image;
                const name =
                  transfer.nft?.metadata?.name || `NFT #${transfer.tokenId}`;

                if (!image) return null;

                return (
                  <div
                    key={`${transfer.txHash}-${index}`}
                    className="bg-card rounded-2xl p-4 flex items-center gap-4"
                  >
                    <div className="flex-shrink-0">
                      <ImageHolder
                        src={image}
                        alt={name}
                        className="rounded-lg object-cover size-20"
                        width="80px"
                        height="80px"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      {/* <p className="font-medium text-lg mb-2">Received NFT</p> */}
                      <span className="flex items-center w-full justify-between">
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
                          className="flex-shrink-0"
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
        {filteredTransfers.length > displayCount && (
          <div ref={loadMoreRef} className="w-full h-20" />
        )}
      </div>
    </div>
  );
};
