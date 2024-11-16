import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeAllAuctionsColumn } from "./columns";
import { Table } from "@/modules/app";
import { useRouter } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Auction, Offer } from "@/utils/types/graphql";

type NotListedTableProps = {
  isLoading: boolean;
  data: Offer[];
};

export function NotListedTable({ isLoading, data }: NotListedTableProps) {
  const router = useRouter();

  console.log({ data });

  const table = useReactTable<Offer>({
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
        <Table
          isLoading={isLoading}
          hasHover
          table={table}
          isSingleNFT
          fallbackMessage="No Offers available yet"
        />
      </div>
    </HydrationBoundary>
  );
}
