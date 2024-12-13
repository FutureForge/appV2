"use client";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { cn } from "../../utils";
import { TableEmptyState } from "./empty";
import { ScrollArea } from "../scroll-area";
import { motion } from "framer-motion";

type TableProps<T> = {
  table: ReactTable<T>;
  fallbackTitle?: string;
  fallbackMessage?: string;
  hasHover?: boolean;
  rowDivider?: boolean;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  onRowPointerEnter?: (event: PointerEvent) => void;
  onRowPointerLeave?: (event?: PointerEvent) => void;
  isSingleNFT?: boolean;
};

export function Table<T>({
  table,
  hasHover,
  onRowClick,
  isLoading,
  isSingleNFT = false,
  fallbackTitle,
  fallbackMessage,
}: TableProps<T>) {
  return (
    <div
      className="p-4 max-sm:p-2 pt-2 bg-card rounded-2xl overflow-auto"
      suppressHydrationWarning
    >
      <div className="overflow-x-auto w-full">
        <ScrollArea.Root>
          <table className="w-full rounded-2xl">
            {isLoading ? (
              <Skeleton />
            ) : (
              <>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header, index) => (
                        <th
                          key={header.id}
                          className={cn(
                            "h-9 px-3 text-sm text-new-muted-foreground bg-special-bg font-normal text-left align-middle font-sans whitespace-nowrap min-w-[200px]",
                            "first:sticky first:left-0 first:bg-special-bg first:pl-6 first:z-10 first:rounded-l-md last:rounded-r-md",
                            "md:last:sticky md:last:right-0 md:last:bg-special-bg md:last:z-10"
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                {table.getRowModel().rows.length > 0 && (
                  <tbody className="p-4 mx-4 max-sm:mx-0 max-sm:p-0">
                    <tr className="h-8 max-sm:px-0 px-6" />
                    {table.getRowModel().rows.map((row, index) => (
                      <motion.tr
                        key={row.id}
                        onClick={() => onRowClick?.(row.original)}
                        initial={{ opacity: 0, y: -34 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 340,
                          damping: 48,
                          delay: index * 0.08,
                        }}
                        className="hover:bg-table-hover hover:z-20 cursor-pointer z-20"
                      >
                        {/* First Column Sticky with Padding to the Right */}
                        {row.getVisibleCells().map((cell, index) => {
                          return (
                            <motion.td
                              key={cell.id}
                              initial={{
                                opacity: 0,
                                y: -24,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 340,
                                damping: 48,
                                delay: index * 0.05,
                              }}
                              className={cn(
                                "group/row h-16 min-w-[200px] hover:bg-table-hover",
                                "first:sticky first:left-0 max-md:first:bg-card first:pl-3 first:z-10 group-first/row:hover:bg-table-hover",
                                "md:last:sticky md:last:right-0 md:last:card md:last:pr-3 md:last:z-10 first:rounded-l-xl last:rounded-r-xl"
                              )}
                            >
                              <div className="h-full flex items-center group-last/row:justify-start first:pl-3 last:pr-3 group-last/row:rounded-r-xl group-data-[highlighted]:ring-2 ring-new-terciary group-first/row:rounded-l-xl first:group-data-[highlighted]:bg-tertiary">
                                {" "}
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </div>
                            </motion.td>
                          );
                        })}
                      </motion.tr>
                    ))}
                  </tbody>
                )}
              </>
            )}
          </table>
        </ScrollArea.Root>
      </div>
      {table.getRowModel().rows.length === 0 && isSingleNFT && (
        <TableEmptyState message={fallbackMessage} title={fallbackTitle} />
      )}
    </div>
  );
}


function Skeleton() {
  return (
    <div>
      <div className="flex w-full justify-between gap-4 p-4 border-b border-b-border">
        <div className={cn("skeleton-el", "mt-4 !rounded-lg !w-full !h-7")} />
      </div>

      <div className="flex flex-col pt-2 p-4 w-full">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className={cn(
              "skeleton-el",
              "!rounded-[14px] mt-4 !h-[64px] !w-full"
            )}
          />
        ))}
      </div>
    </div>
  );
}
