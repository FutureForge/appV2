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
  searchQuery?: string;
  handleSearch?: (query: string) => void;
  filters: string[];
  onFilterClick: (filter: string) => void;
  showDurationToggle?: boolean;
  showRightSide?: boolean;
  renderDurationToggle?: boolean
};

export function Header({
  isActive,
  setIsActive,
  searchQuery,
  handleSearch,
  filters,
  onFilterClick,
  showDurationToggle = false,
  showRightSide = false,
  renderDurationToggle = false
}: HeaderProps) {
  const [filter, setFilter] = useState<string>(filters[0]);
  const [duration, setDuration] = useState<string>("1H");

  return (
    <div className="w-full flex items-center justify-between">
      <div className="w-full flex justify-between items-center">
        <Card className="bg-transparent w-full border border-new-muted-text p-1 rounded-xl h-10">
          <ToggleGroup.Root
            type="single"
            value={filter}
            onValueChange={(value) => {
              if (value) setFilter(value);
              onFilterClick(value);
            }}
            className={cn({ "justify-between": !showRightSide })}
          >
            {filters.map((value) => (
              <ToggleGroup.Item
                key={value}
                variant="select"
                value={value}
                className={cn(
                  "data-[state=on]:bg-tertiary data-[state=on]:text-primary",
                  { "min-w-[142px] justify-center": !showRightSide }
                )}
              >
                {value}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </Card>
      </div>

      {!showRightSide && (
        <div className="flex items-center gap-2 justify-end">
          <TextField
            type="search"
            placeholder="Search by collections"
            containerClass="bg-new-muted-bg w-[300px]"
            value={searchQuery}
            onChange={(e) => handleSearch && handleSearch(e.target.value)}
          />
          {showDurationToggle && (
            <Card className="bg-new-muted-bg border border-new-muted-text p-1 rounded-lg">
              <ToggleGroup.Root
                value={duration}
                onValueChange={(value) => {
                  if (value) {
                    setDuration(value);
                  }
                }}
                type="single"
              >
                {["1H", "1D", "7D", "30D"].map((value) => (
                  <ToggleGroup.Item variant="select" value={value}>
                    {value}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            </Card>
          )}

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
      )}
    </div>
  );
}
