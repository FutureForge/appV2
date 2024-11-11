"use client";
import React, { useState } from "react";
import { CollectionsHeader } from "../header/header";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredCollections = CollectionQuery?.collections?.filter(
    (collection) =>
      collection.collectionName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  console.log({ filteredCollections });

  const totalCount = filteredCollections?.length || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo(0, 0);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredCollections?.slice(startIndex, endIndex);

  return (
    <div className="pt-12 flex flex-col gap-8 h-screen">
      <CollectionsHeader
        isActive={isActive}
        setIsActive={setIsActive}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
      />
      <motion.div layout>
        {!isActive ? (
          <motion.div>
            <CollectionTable
              isCollectionLoading={isLoading || isPending}
              collectionData={currentPageData ?? []}
            />
          </motion.div>
        ) : (
          <motion.div className="w-full grid grid-cols-4 gap-5">
            {isLoading || isPending || isError ? (
              <>
                {Array.from({ length }).map((_, index) => (
                  <NftCardSkeleton />
                ))}
              </>
            ) : (
              <>
                {currentPageData
                  ?.slice(0, length)
                  .map((collection: Collection) => {
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
                  })}
              </>
            )}
          </motion.div>
        )}
      </motion.div>
      {/* Add pagination controls */}
      <div className="flex justify-center gap-2 mt-4 mb-8">
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`w-8 h-8 rounded ${
              currentPage === pageNum
                ? "bg-purple-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {pageNum}
          </button>
        ))}
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <>
            <span className="px-2">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
