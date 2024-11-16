import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeRecentBidsColumns } from "./columns";

import { Table } from "@/modules/app";
import { useRouter } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { NewBid } from "@/utils/types/graphql";

type RecentBidsTableProps = {
  isLoading: boolean;
  data: NewBid[];
};

export function RecentBidsTable({ isLoading, data }: RecentBidsTableProps) {
  const router = useRouter();

  const table = useReactTable<NewBid>({
    columns: makeRecentBidsColumns(),
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
