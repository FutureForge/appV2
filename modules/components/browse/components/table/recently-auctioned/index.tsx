
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeYourPositionsColumn } from "./columns";
import { Table } from "@/modules/app";
import { useRouter } from "next/navigation";
import { dehydrate,  HydrationBoundary, } from "@tanstack/react-query";
import { Auction} from "@/utils/types/graphql";


type CollectionTableProps = {
  isCollectionLoading: boolean;
  collectionData: Auction[];
};

export function ListingTable({
  isCollectionLoading,
  collectionData,
}: CollectionTableProps) {
  const router = useRouter();

  const table = useReactTable<Auction>({
    columns: makeYourPositionsColumn(),
    data: collectionData ?? [],
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
          isLoading={isCollectionLoading}
          hasHover
          table={table}
        />
      </div>
    </HydrationBoundary>
  );
}
