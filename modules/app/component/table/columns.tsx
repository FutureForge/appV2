import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Table } from "@tanstack/react-table";
import { cn } from "@/modules/app/utils";
import { ScrollArea } from "../scroll-area";
import { Button } from "../button";
import { Popover } from "../popover";

type ColumnsProps<T> = {
  table: Table<T> | undefined;
};

function ColumnsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 21"
      fill="none"
      className="text-foreground"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.25 5.25H4.75V15.75H9.25V5.25ZM10.75 5.25V15.75H15.25V5.25H10.75ZM4 3.75H16C16.1989 3.75 16.3897 3.82902 16.5303 3.96967C16.671 4.11032 16.75 4.30109 16.75 4.5V16.5C16.75 16.6989 16.671 16.8897 16.5303 17.0303C16.3897 17.171 16.1989 17.25 16 17.25H4C3.80109 17.25 3.61032 17.171 3.46967 17.0303C3.32902 16.8897 3.25 16.6989 3.25 16.5V4.5C3.25 4.30109 3.32902 4.11032 3.46967 3.96967C3.61032 3.82902 3.80109 3.75 4 3.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Columns<T>({ table }: ColumnsProps<T>) {
  const columns = table?.getAllColumns().filter((col) => !!col.columnDef.meta?.headerName);

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button
          shape="square"
          variant="secondary"
          className="!h-9 !px-2 gap-2 !text-sm !text-new-foreground !font-sans !bg-new-terciary !border !border-new-elements-border !font-medium"
        >
          <ColumnsIcon />
          Columns
        </Button>
      </Popover.Trigger>
      <Popover.Content
        align="end"
        sideOffset={16}
        className="max-w-[300px] break-all overflow-hidden z-50"
      >
        <div className="w-full h-[0.5px] bg-new-elements-border" />
        <ScrollArea.Root className="p-3 flex flex-col gap-1 max-h-[300px]">
          {columns?.map((col) => (
            <div
              key={col.id}
              className="flex items-center  gap-2 py-2 text-sm cursor-pointer"
            >
              <Checkbox.Root
                id={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={() => col.toggleVisibility()}
                className={cn(
                  "size-4 !rounded-[4px] transition-none flex items-center justify-center",
                  "data-[state=unchecked]:ring-1 data-[state=unchecked]:ring-new-elements-border",
                  "data-[state=checked]:bg-primary"
                )}
              >
                <Checkbox.Indicator>
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.53032 2.03039L4 7.56072L0.469666 4.03039L1.53033 2.96973L4 5.4394L8.46967 0.969727L9.53032 2.03039Z"
                      fill="white"
                    />
                  </svg>
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label htmlFor={col.id} className="cursor-pointer">
                {col.columnDef.meta?.headerName}
              </label>
            </div>
          ))}
        </ScrollArea.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
