"use client";

import React, { useState, useEffect } from "react";
import { CollectionsHeader } from "../header/header";
import { NftCardSkeleton } from "@/modules/app";
import { CollectionTable } from "../../table";
import { useAllCollectionsQuery } from "@/modules/query";
import { useWindowSize } from "@uidotdev/usehooks";
import { Collection } from "@/utils/types/collection/collection.type";
import { useRouter } from "next/navigation";
import { CollectionsNFTCard } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { motion } from "framer-motion";
import Caret from "@/assets/arrow-left-s-line.svg";
import { cn } from "@/modules/app/utils";

export function CollectionPage() {
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
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
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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

  return (
    <div
      className="pt-12 flex flex-col gap-8 h-screen"
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
            <motion.div className="w-full grid grid-cols-4 gap-5">
              {isLoading || isPending || isError ? (
                <>
                  {Array.from({ length }).map((_, index) => (
                    <NftCardSkeleton key={index} />
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
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
      {/* Add pagination controls */}
      <div className="flex items-center justify-between w-full">
        <button
          title="previous-page"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "w-8 h-[30px] rounded-lg text-sm flex items-center justify-center bg-transparent hover:bg-tertiary",
            {
              "cursor-not-allowed hover:bg-transparent": currentPage === 1,
            }
          )}
        >
          <Caret />
        </button>
        <div className="flex justify-center gap-4 mt-4 mb-8">
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-8 h-[30px] rounded-lg text-sm  transition duration-300 ease-in-out ${
                currentPage === pageNum
                  ? "bg-primary text-white"
                  : "bg-transparent border border-border text-muted-foreground hover:bg-tertiary"
              }`}
            >
              {pageNum}
            </button>
          ))}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="text-muted-foreground">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="w-8 h-[30px] rounded-lg bg-transparent border border-border text-muted-foreground hover:bg-tertiary transition duration-300 ease-in-out"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        <button
          title="next-page"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "w-8 h-[30px] rounded-lg text-sm flex items-center justify-center bg-transparent hover:bg-tertiary",
            {
              "cursor-not-allowed hover:bg-transparent":
                currentPage === totalPages,
            }
          )}
        >
          <Caret className="rotate-180" />
        </button>
      </div>
    </div>
  );
}
