// pages/collection/[collectionAddress].tsx
import { useRouter } from "next/router";
import React from "react";

const CollectionPage = () => {
  const router = useRouter();
  const { collectionAddress } = router.query;

  return (
    <div>
      <h1>Collection Details</h1>
      <p>Collection Address: {collectionAddress}</p>
      {/* Fetch and display collection data based on `collectionAddress` */}
    </div>
  );
};

export default CollectionPage;
