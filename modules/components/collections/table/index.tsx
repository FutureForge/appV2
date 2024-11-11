
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
import { useRouter } from "next/navigation";
import { dehydrate, DehydratedState, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";

type Props = {
  dehydratedState: DehydratedState;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  // if (process.env.VERCEL_ENV === 'production') {
  //   return {
  //     notFound: true,
  //   };
  // }

  const queryClient = new QueryClient();
  const address = ctx.req.cookies.userAddress;

  if (!address) return { props: { dehydratedState: dehydrate(queryClient) } };

  const page = 1;
  const pageCount = 10;

  await Promise.all([
  
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
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
          onRowClick={(_row) => {
            const collectionAddress = _row.collectionAddress;
            router.push(`/collections/${collectionAddress}`);
          }}
          isLoading={isCollectionLoading}
          hasHover
          table={table}
        />
      </div>
    </HydrationBoundary>
  );
}
