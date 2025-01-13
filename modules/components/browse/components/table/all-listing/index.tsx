import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeAllListingsColumn } from "./columns";

import { Table, TableLayout } from "@/modules/app";
import { useRouter } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Listing } from "@/modules/query/utils";
// import { Listing } from "@/utils/types/graphql";

type AllListingTableProps = {
  isLoading: boolean;
  data: Listing[];
};

export function AllListingTable({ isLoading, data }: AllListingTableProps) {
  const router = useRouter();

  const table = useReactTable<Listing>({
    columns: makeAllListingsColumn(),
    data: data ?? [],
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <HydrationBoundary state={dehydrate}>
      <div suppressHydrationWarning>
        <TableLayout table={table} title="All Listings">
          <Table
            onRowClick={(_row) => {
              const collectionAddress = _row.assetContract;
              const tokenId = _row.tokenId;
              router.push(`/nft/${collectionAddress}/${tokenId}`);
            }}
            isLoading={isLoading}
            hasHover
            table={table}
          />
        </TableLayout>
      </div>
    </HydrationBoundary>
  );
}
