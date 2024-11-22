import {
  Card,
  IconButton,
  Select,
  SwitchView,
  TextField,
  ToggleGroup,
} from "@/modules/app";
import React, { useState } from "react";
import { cn } from "@/modules/app/utils";
import { ScrollArea } from "../scroll-area/scroll-area";

// icons
import List from "@/assets/list.svg";
import Grid from "@/assets/grid.svg";
import FilterIcon from "@/assets/filter-lines.svg";

type HeaderProps = {
  title?: string;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery?: string;
  handleSearch?: (query: string) => void;
  filters: string[];
  onFilterClick?: (filter: string) => void;
  showDurationToggle?: boolean;
  showRightSide?: boolean;
  renderDurationToggle?: boolean;
  selectedFilter?: string;
  disabled?: boolean;
};

export function Header({
  isActive,
  setIsActive,
  searchQuery,
  handleSearch,
  filters,
  onFilterClick,
  showDurationToggle = false,
  showRightSide = true,
  renderDurationToggle = false,
  selectedFilter,
  disabled = false,
}: HeaderProps) {
  const [filter, setFilter] = useState<string>(filters[0]);
  const [duration, setDuration] = useState<string>("1H");

  return (
    <div className="w-full flex md:items-center gap-4 justify-between max-md:flex-col">
      <div className="w-full flex justify-between items-center">
        <Card className="bg-transparent w-fit border overflow-x-auto border-new-muted-text p-1 rounded-xl h-10">
          <ScrollArea.Root
            onScroll={(event) => {
              const target = event.target as HTMLElement;
              const scrollLeft = target.scrollLeft;
              const scrollWidth = target.scrollWidth;
              const clientWidth = target.clientWidth;
              if (scrollLeft === 0) {
                target.style.setProperty("--right-black", "0%");
              } else if (scrollLeft + clientWidth === scrollWidth) {
                //
              } else {
                target.style.setProperty("--right-black", "8%");
              }
            }}
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black var(--right-black, 0%), black 95%, transparent 100%)",
            }}
          >
            <ToggleGroup.Root
              type="single"
              value={selectedFilter ? selectedFilter : filter}
              onValueChange={(value) => {
                if (value) setFilter(value);
                onFilterClick && onFilterClick(value);
              }}
              className={cn({ "justify-between": !showRightSide })}
            >
              {filters.map((value) => (
                <ToggleGroup.Item
                  key={value}
                  variant="select"
                  value={value}
                  disabled={!!selectedFilter || disabled}
                  className={cn(
                    "data-[state=on]:bg-tertiary data-[state=on]:text-primary",
                    "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-transparent",
                    { "min-w-[142px] justify-center": !showRightSide }
                  )}
                >
                  {value}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </ScrollArea.Root>
        </Card>

        {/* <Select.Root
          value={selectedFilter ? selectedFilter : filter}
          onValueChange={(value) => {
            if (value) setFilter(value);
            onFilterClick && onFilterClick(value);
          }}
        >
          <Select.Trigger>
            <IconButton size="xl" variant="ghost" className="">
              <FilterIcon className="size-4 text-muted-foreground" />
            </IconButton>
          </Select.Trigger>
          <Select.Content align="end" className="w-fit">
            {filters.map((item) => (
              <Select.Item key={item} value={item}>
                {item}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root> */}
      </div>

      {showRightSide && (
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
