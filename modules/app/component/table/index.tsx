import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { TableEmptyState } from "./empty";
import { cn } from "../../utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import { PointerEvent, useRef } from "react";

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
};

export function Table<T>({
  table,
  fallbackMessage,
  fallbackTitle,
  hasHover,
  onRowClick,
  isLoading,
}: TableProps<T>) {
  return (
    <div className="!p-4 bg-card rounded-2xl">
      <table className="w-full table-fixed rounded-2xl">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="font-normal text-left px-4 h-[52px] border-b border-b-border first:rounded-l-lg last:rounded-r-lg"
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
              <tbody className="p-4 mx-4">
                <tr className="h-8 px-6" />
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(
                      "bg-transparent transition duration-300 ease-in-out px-6 cursor-pointer",
                      hasHover ? "hover:bg-table-hover px-6" : "",
                      row.depth > 0 && "bg-terciary"
                    )}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "h-[72px] px-4 text-left font-medium text-sm",
                          index === 0 && "rounded-l-lg min-w-[800px]",
                          index === row.getVisibleCells().length - 1 &&
                            "rounded-r-lg",
                          row.depth > 0 && "bg-terciary"
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </>
        )}
      </table>

      {table.getRowModel().rows.length === 0 && (
        <TableEmptyState message={fallbackMessage} title={fallbackTitle} />
      )}
    </div>
  );
}

function Skeleton() {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const columns = isMobile ? 3 : isTablet ? 4 : 5;
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
