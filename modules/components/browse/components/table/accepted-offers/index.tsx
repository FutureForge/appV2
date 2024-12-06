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
import { AcceptedOffer } from "@/utils/types/graphql";

type AcceptedOfferTableProps = {
  isLoading: boolean;
  data: AcceptedOffer[];
};

export function AcceptedOfferTable({ isLoading, data }: AcceptedOfferTableProps) {
  const router = useRouter();

  const table = useReactTable<AcceptedOffer>({
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
