"use client";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { makeYourPositionsColumn } from "./columns";

import { Table } from "@/modules/app";
import { Collection } from "@/utils/types/collection/collection.type";
import { useAllCollectionsQuery } from "@/modules/query";
import { useRouter } from "next/navigation";

export function CollectionTable() {
  const collectionQuery = useAllCollectionsQuery();
  const router = useRouter();

  const table = useReactTable<Collection>({
    columns: makeYourPositionsColumn(),
    data: collectionQuery?.data ?? [],
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Table
      onRowClick={(_row) => {
        const collectionAddress = _row.collectionAddress;
        router.push(`/collections/${collectionAddress}`);
      }}
      isLoading={collectionQuery.isPending}
      hasHover
      table={table}
      fallbackTitle="No collections found"
      fallbackMessage="Please create a collection"
    />
  );
}
