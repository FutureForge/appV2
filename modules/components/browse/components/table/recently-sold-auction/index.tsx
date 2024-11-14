import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeRecentlySoldAuctionColumns } from "./columns";

import { Table } from "@/modules/app";
import { useRouter } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AuctionClosed } from "@/utils/types/graphql";

type RecentlySoldAuctionTableProps = {
  isLoading: boolean;
  data: AuctionClosed[];
};

export function RecentlySoldAuctionTable({
  isLoading,
  data,
}: RecentlySoldAuctionTableProps) {
  const router = useRouter();

  const table = useReactTable<AuctionClosed>({
    columns: makeRecentlySoldAuctionColumns(),
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
          // onRowClick={(_row) => {
          //   const collectionAddress = _row.collectionAddress;
          //   router.push(`/collections/${collectionAddress}`);
          // }}
          isLoading={isLoading}
          hasHover
          table={table}
        />
      </div>
    </HydrationBoundary>
  );
}
