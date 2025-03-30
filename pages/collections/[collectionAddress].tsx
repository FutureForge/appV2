// pages/collection/[collectionAddress].tsx
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect } from "react";

import { ErrorComponent } from "@/modules/app";
import {
  CollectionHeader,
  CollectionTabs,
  useCollectionData,
} from "@/modules/components/single-collection";
import SingleCollectionSkeleton from "@/modules/components/collections/components/skeleton/single-collection-skeleton";

export default function CollectionPage() {
  const router = useRouter();
  const { collectionAddress } = router.query;

  const {
    collection,
    collectionDetails,
    isLoading,
    isError,
    filter,
    setFilter,
    isCollectionOwner,
  } = useCollectionData(collectionAddress as string);

  if (isError) {
    return <ErrorComponent />;
  }

  if (isLoading) {
    return <SingleCollectionSkeleton />;
  }

  return (
    <div className="mt-20 w-full min-h-screen px-4">
      <Head>
        <title>
          MintMingles Marketplace - {collection?.collectionName || "Collection"}
        </title>
        <meta
          name="description"
          content={`Collection: ${
            collection?.collectionName || "Collection"
          } on Mint Mingle Marketplace`}
        />
      </Head>

      <CollectionHeader collection={collection!} details={collectionDetails} />

      <CollectionTabs
        filter={filter}
        setFilter={setFilter}
        isCollectionOwner={isCollectionOwner}
        collectionAddress={collectionAddress as string}
      />
    </div>
  );
}
