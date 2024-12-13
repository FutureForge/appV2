import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeAllAuctionsColumn } from "./columns";
import { Table, TableLayout } from "@/modules/app";
import { useRouter } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Auction } from "@/utils/types/graphql";

type AllAuctionTableProps = {
  isLoading: boolean;
  data: Auction[];
};

export function AllAuctionTable({ isLoading, data }: AllAuctionTableProps) {
  const router = useRouter();

  const table = useReactTable<Auction>({
    columns: makeAllAuctionsColumn(),
    data: data ?? [],
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <HydrationBoundary state={dehydrate}>
      <div suppressHydrationWarning>
        <TableLayout table={table} title="All Auctions">
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
        </TableLayout>
      </div>
    </HydrationBoundary>
  );
}
