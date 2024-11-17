import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeRecentlyAuctionedColumns } from "./columns";
import { Table } from "@/modules/app";
import { useRouter } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Auction } from "@/utils/types/graphql";

type RecentlyAuctionedProps = {
  isLoading: boolean;
  data: Auction[];
};

export function RecentlyAuctionedTable({
  isLoading,
  data,
}: RecentlyAuctionedProps) {
  const router = useRouter();

  const table = useReactTable<Auction>({
    columns: makeRecentlyAuctionedColumns(),
    data: data ?? [],
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <HydrationBoundary state={dehydrate}>
      <div suppressHydrationWarning>
        <Table
          onRowClick={(_row) => {
            const collectionAddress = _row.assetContract;
            const tokenId = _row.nft.tokenId;
            router.push(`/nft/${collectionAddress}/${tokenId}`);
          }}
          isLoading={isLoading}
          hasHover
          table={table}
        />
      </div>
    </HydrationBoundary>
  );
}
