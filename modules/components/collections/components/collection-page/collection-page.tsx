"use client";

import React, { useState, useEffect } from "react";
import { CollectionsHeader } from "../header/header";
import { ErrorComponent, NftCardSkeleton } from "@/modules/app";
import { CollectionTable } from "../../table";
import { useAllCollectionsQuery } from "@/modules/query";
import { useWindowSize } from "@uidotdev/usehooks";
import { Collection } from "@/utils/types/collection/collection.type";
import { useRouter } from "next/navigation";
import { CollectionsNFTCard } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { motion } from "framer-motion";
import { Pagination } from "@/modules/app/component/pagination";

export function CollectionPage() {
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const itemsPerPage = 5;
  const fetchLimit = 50;
  const currentBatch = Math.ceil((currentPage * itemsPerPage) / fetchLimit);

  const {
    data: CollectionQuery,
    isLoading,
    isPending,
    isError,
  } = useAllCollectionsQuery({
    limit: fetchLimit,
    page: currentBatch,
  });

  const { width } = useWindowSize();
  const router = useRouter();
  const length = width && width > 1720 ? 5 : 4;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredCollections =
    CollectionQuery?.collections?.filter((collection) => {
      const searchTerm = searchQuery.toLowerCase().trim().replace(/\s+/g, "");
      const nameNoSpace = collection.collectionName
        .toLowerCase()
        .replace(/\s+/g, "");
      const combinedField = `${nameNoSpace}`;

      return combinedField.includes(searchTerm);
    }) ?? [];

  const totalCount =
    filteredCollections?.length || CollectionQuery?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo(0, 0);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredCollections?.slice(startIndex, endIndex);

  if (!mounted) {
    return null;
  }

  if (isError) {
    return <ErrorComponent />;
  }

  return (
    <div
      className="pt-12 flex flex-col gap-8 min-h-screen"
      suppressHydrationWarning
    >
      <CollectionsHeader
        isActive={isActive}
        setIsActive={setIsActive}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
      />
      {mounted && (
        <motion.div>
          {!isActive ? (
            <motion.div>
              <CollectionTable
                isCollectionLoading={isLoading || isPending}
                collectionData={currentPageData ?? []}
              />
            </motion.div>
          ) : (
            <div className="flex items-center justify-center">
              <motion.div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center gap-5">
                {isLoading || isPending || isError ? (
                  <>
                    {Array.from({ length }).map((_, index) => (
                      <NftCardSkeleton key={index} />
                    ))}
                  </>
                ) : (
                  <div className="flex max-sm:items-center max-sm:flex-col gap-6 max-sm:justify-center">
                    {currentPageData
                      ?.slice(0, length)
                      .map((collection: Collection) => {
                        const handleClick = () => {
                          router.push(
                            `/collections/${collection.collectionAddress}`
                          );
                        };
                        return (
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
                        );
                      })}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
