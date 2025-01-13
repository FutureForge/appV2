import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeOffersColumn } from "./columns";
import { Table } from "@/modules/app";
import { useRouter } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Offer } from "@/modules/query/utils";

type OffersTableProps = {
  isLoading: boolean;
  data: Offer[];
  isOwner: boolean;
  userAddress: string;
};

export function OffersTable({
  isLoading,
  data,
  isOwner,
  userAddress,
}: OffersTableProps) {
  const router = useRouter();

  const table = useReactTable<Offer>({
    columns: makeOffersColumn({ isOwner, userAddress }),
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
