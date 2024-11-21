// "use client";
// import { flexRender, Table as ReactTable } from "@tanstack/react-table";
// import { cn } from "../../utils";
// import { TableEmptyState } from "./empty";
// import { ScrollArea } from "../scroll-area";

// type TableProps<T> = {
//   table: ReactTable<T>;
//   fallbackTitle?: string;
//   fallbackMessage?: string;
//   hasHover?: boolean;
//   rowDivider?: boolean;
//   onRowClick?: (row: T) => void;
//   isLoading?: boolean;
//   onRowPointerEnter?: (event: PointerEvent) => void;
//   onRowPointerLeave?: (event?: PointerEvent) => void;
//   isSingleNFT?: boolean;
// };

// export function Table<T>({
//   table,
//   hasHover,
//   onRowClick,
//   isLoading,
//   isSingleNFT = false,
//   fallbackTitle,
//   fallbackMessage,
// }: TableProps<T>) {
//   return (
//     <div
//       className="!p-4 bg-card rounded-2xl overflow-auto"
//       suppressHydrationWarning
//     >
//       <div className="overflow-x-auto">
//         <table className="w-full table-fixed rounded-2xl">
//           {isLoading ? (
//             <Skeleton />
//           ) : (
//             <>
//               <thead>
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <tr key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                       <th
//                         key={header.id}
//                         className="font-normal first:sticky  text-left px-4 h-[52px] border-b border-b-border first:rounded-l-lg last:rounded-r-lg"
//                       >
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               {table.getRowModel().rows.length > 0 && (
//                 <tbody className="p-4 mx-4">
//                   <tr className="h-8 px-6" />
//                   {table.getRowModel().rows.map((row) => (
//                     <tr
//                       key={row.id}
//                       onClick={() => onRowClick?.(row.original)}
//                       className={cn(
//                         "bg-transparent transition duration-300 ease-in-out px-6 cursor-pointer",
//                         hasHover ? "hover:bg-table-hover px-6" : "",
//                         row.depth > 0 && "bg-terciary"
//                       )}
//                     >
//                       {row.getVisibleCells().map((cell, index) => (
//                         <td
//                           key={cell.id}
//                           className={cn(
//                             "h-[72px] px-4 text-left font-medium text-sm",
//                             index === 0 && "rounded-l-lg sticky",
//                             index === row.getVisibleCells().length - 1 &&
//                               "rounded-r-lg",
//                             row.depth > 0 && "bg-terciary"
//                           )}
//                         >
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               )}
//             </>
//           )}
//         </table>
//       </div>
//       {table.getRowModel().rows.length === 0 && isSingleNFT && (
//         <TableEmptyState message={fallbackMessage} title={fallbackTitle} />
//       )}
//     </div>
//   );
// }

"use client";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { cn } from "../../utils";
import { TableEmptyState } from "./empty";
import { ScrollArea } from "../scroll-area";

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
      className="p-4 max-sm:p-2 bg-card rounded-2xl overflow-auto"
      suppressHydrationWarning
    >
      <div className="overflow-x-auto w-full">
        <ScrollArea.Root>
          <table className="w-full table-fixed rounded-2xl">
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
                            "font-normal text-left px-4 h-[52px] border-b border-b-border",
                            index === 0 && "sticky first:left-0  z-10",
                            index === headerGroup.headers.length - 1 &&
                              "last:sticky last:right-0 z-10",
                            "first:rounded-l-lg last:rounded-r-lg"
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
                        {/* First Column Sticky with Padding to the Right */}
                        {row.getVisibleCells().map((cell, index) => {
                          const isLastCell =
                            index === row.getVisibleCells().length - 1;
                          return (
                            <td
                              key={cell.id}
                              className={cn(
                                "h-[72px] px-4 text-left font-medium text-sm",
                                index === 0 &&
                                  "sticky left-0 max-sm:min-w-[800px] w-full z-10 rounded-l-lg pr-4", // First column with padding
                                isLastCell &&
                                  "sticky right-0 z-10 rounded-r-lg", // Last column sticky
                                row.depth > 0 && "bg-terciary",
                                // Add margin between all columns for spacing on overflow
                                "space-x-2" // Add spacing between columns
                              )}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
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
