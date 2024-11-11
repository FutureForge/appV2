'use client'
import React, { useState } from "react";
import { Header } from "../header/header";

import { NftCardSkeleton } from "@/modules/app";
import { CollectionTable } from "../../table";
import { useAllCollectionsQuery } from "@/modules/query";
import { useWindowSize } from "@uidotdev/usehooks";
import { Collection } from "@/utils/types/collection/collection.type";
import { useRouter } from "next/navigation";
import { CollectionsNFTCard } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { AnimatePresence, motion } from "framer-motion";

export function CollectionPage() {
  const [isActive, setIsActive] = useState(false);
  const {
    data: CollectionQuery,
    isLoading,
    isError,
  } = useAllCollectionsQuery();
  const { width } = useWindowSize();
  const router = useRouter();
  const length = width && width > 1720 ? 5 : 4;

  return (
    <div className="pt-12 flex flex-col gap-8 h-screen">
      <Header isActive={isActive} setIsActive={setIsActive} />
      <motion.div layout>
        {!isActive ? (
          <motion.div>
            <CollectionTable />
          </motion.div>
        ) : (
          <motion.div className="w-full grid grid-cols-4 gap-5">
            {isLoading || isError ? (
              <>
                {Array.from({ length }).map((_, index) => (
                  <NftCardSkeleton />
                ))}
              </>
            ) : (
              <>
                {CollectionQuery?.slice(0, length).map(
                  (collection: Collection) => {
                    const handleClick = () => {
                      router.push(
                        `/collections/${collection.collectionAddress}`
                      );
                    };
                    return (
                      <AnimatePresence mode="popLayout">
                        <CollectionsNFTCard
                          key={collection._id}
                          collectionAddress={collection.collectionAddress}
                          collectionImage={collection.collectionImage}
                          collectionName={collection.collectionName}
                          floorPrice={collection.floorPrice}
                          totalVolume={collection.totalVolume}
                          onClick={handleClick}
                          cta="Shop Collections"
                        />
                      </AnimatePresence>
                    );
                  }
                )}
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
