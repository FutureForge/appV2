import { Card, SwitchView, TextField, ToggleGroup } from "@/modules/app";
import React, { useState } from "react";
import { Table } from "@tanstack/react-table";
import { cn } from "@/modules/app/utils";
// icons
import List from "@/assets/list.svg";
import Grid from "@/assets/grid.svg";
import { Columns } from "./columns";


type TableLayoutProps<T> = {
  title?: string;
  children: React.ReactNode;
  table: Table<T>;
};
export function TableLayout<T>({
  title,
  children,
  table
}: TableLayoutProps<T>) {
  return (
    <div className="flex flex-col bg-card rounded-2xl border border-border">
      <div className="w-full flex md:items-center gap-4 justify-between max-md:flex-col p-4">
        <h4 className="font-medium tex-[28px]">{title}</h4>
        <div className="flex items-center gap-2 justify-end">
          <Columns table={table} />
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
