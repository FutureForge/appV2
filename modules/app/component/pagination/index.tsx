import React from "react";
import Caret from "@/assets/arrow-left-s-line.svg";
import { cn } from "@/modules/app";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(start + 4, totalPages);

    if (end === totalPages) {
      start = Math.max(1, end - 4);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <button
        title="previous-page"
        onClick={() => onPageChange(currentPage - 1)}
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
      <div className="flex justify-center gap-4">
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
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
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-[30px] rounded-lg bg-transparent border border-border text-muted-foreground hover:bg-tertiary transition duration-300 ease-in-out"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      <button
        title="next-page"
        onClick={() => onPageChange(currentPage + 1)}
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
  );
};
