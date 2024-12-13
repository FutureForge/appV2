import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeCollectionColumns } from "./columns";

import { Table, TableLayout } from "@/modules/app";
import { Collection } from "@/utils/types/collection/collection.type";
import { useRouter } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

type CollectionTableProps = {
  isCollectionLoading: boolean;
  collectionData: Collection[];
};

export function CollectionTable({
  isCollectionLoading,
  collectionData,
}: CollectionTableProps) {
  const router = useRouter();

  const table = useReactTable<Collection>({
    columns: makeCollectionColumns(),
    data: collectionData ?? [],
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <HydrationBoundary state={dehydrate}>
      <div suppressHydrationWarning>
        <TableLayout
          table={table}
          title="Collections"
        >
          <Table
            onRowClick={(_row) => {
              const collectionAddress = _row.collectionAddress;
              router.push(`/collections/${collectionAddress}`);
            }}
            isLoading={isCollectionLoading}
            hasHover
            table={table}
          />
        </TableLayout>
      </div>
    </HydrationBoundary>
  );
}
