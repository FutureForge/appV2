import { Card, SwitchView, TextField, ToggleGroup } from "@/modules/app";
import React, { useState } from "react";
// icons
import List from "@/assets/list.svg";
import Grid from "@/assets/grid.svg";
import { cn } from "@/modules/app/utils";

type HeaderProps = {
  title?: string;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  // setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (query: string) => void;
};

export function CollectionsHeader({ 
  isActive, 
  setIsActive, 
  searchQuery,
  handleSearch 
}: HeaderProps) {
  return (
    <div className="w-full flex md:items-center gap-4 justify-between max-md:flex-col">
      <h4 className="font-medium tex-[28px]">Collections</h4>
      <div className="flex items-center gap-2 justify-end">
        <TextField
          type="search"
          placeholder="Search by collections"
          containerClass="bg-new-muted-bg w-[300px]"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {/* <Card className="bg-new-muted-bg border border-new-muted-text p-1 rounded-lg">
          <ToggleGroup.Root type="single">
            {["1H", "1D", "7D", "30D"].map((value) => (
              <ToggleGroup.Item variant="select" value={value}>
                {value}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </Card> */}
        <SwitchView.Root
          falseoption="list"
          trueoption="grid"
          active={isActive}
          onChange={() => setIsActive(!isActive)}
        >
          <SwitchView.FirstOption>
            <div
              className={cn(
                "duration-300 ease-out text-muted-foreground size-8 text-center flex items-center justify-center",
                { "text-white": !isActive }
              )}
            >
              <List className="size-4" />
            </div>
          </SwitchView.FirstOption>
          <SwitchView.SecondOption>
            <div
              className={cn(
                "duration-300 ease-out text-muted-foreground size-8 text-center justify-center flex items-center",
                { "text-white": isActive }
              )}
            >
              <Grid />
            </div>
          </SwitchView.SecondOption>
        </SwitchView.Root>
      </div>
    </div>
  );
}
