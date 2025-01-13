import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeWinningBidColumn } from "./columns";
import { Table } from "@/modules/app";
import { useRouter } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

type WinningBidTableProps = {
  isLoading: boolean;
  data: {
    bidder: string;
    bidAmount: string;
  }[];
};

export function WinningBidTable({ isLoading, data }: WinningBidTableProps) {
  const router = useRouter();

  const table = useReactTable<{
    bidder: string;
    bidAmount: string;
  }>({
    columns: makeWinningBidColumn(),
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
          isLoading={isLoading}
          hasHover
          table={table}
          isSingleNFT
          fallbackMessage="No Winning Bid"
        />
      </div>
    </HydrationBoundary>
  );
}
