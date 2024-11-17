import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeRecentlyListedColumn } from "./columns";

import { Table } from "@/modules/app";
import { Collection } from "@/utils/types/collection/collection.type";
import { useRouter } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Listing } from "@/utils/types/graphql";

type RecentlyListedTableProps = {
  isLoading: boolean;
  data: Listing[];
};

export function RecentlyListedTable({
  isLoading,
  data,
}: RecentlyListedTableProps) {
  const router = useRouter();

  const table = useReactTable<Listing>({
    columns: makeRecentlyListedColumn(),
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
