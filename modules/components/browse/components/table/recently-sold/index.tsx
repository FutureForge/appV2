
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeRecentlySoldListingColumn } from "./columns";

import { Table } from "@/modules/app";
import { useRouter } from "next/navigation";
import { dehydrate,  HydrationBoundary, } from "@tanstack/react-query";
import { NewSaleListing } from "@/utils/types/graphql";


type RecentlySoldListingTableProps = {
  isLoading: boolean;
  data: NewSaleListing[];
};

export function RecentlySoldListingTable({
  isLoading,
  data,
}: RecentlySoldListingTableProps) {
  const router = useRouter();

  const table = useReactTable<NewSaleListing>({
    columns: makeRecentlySoldListingColumn(),
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
