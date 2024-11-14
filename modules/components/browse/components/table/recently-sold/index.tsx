
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
import { NewSaleListing } from "@/utils/types/graphql";


type CollectionTableProps = {
  isCollectionLoading: boolean;
  collectionData: NewSaleListing[];
};

export function CollectionTable({
  isCollectionLoading,
  collectionData,
}: CollectionTableProps) {
  const router = useRouter();

  const table = useReactTable<NewSaleListing>({
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
