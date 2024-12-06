import {
  Card,
  IconButton,
  Select,
  SwitchView,
  TextField,
  ToggleGroup,
  Tooltip,
} from "@/modules/app";
import React, { useEffect, useState } from "react";
import { cn } from "@/modules/app/utils";
import { ScrollArea } from "../scroll-area/scroll-area";

// icons
import List from "@/assets/list.svg";
import Grid from "@/assets/grid.svg";
import FilterIcon from "@/assets/filter-lines.svg";
import { useSearchParams } from "next/navigation";

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

  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "";

  useEffect(() => {
    if (currentFilter) {
      const matchingFilter = filters.find(
        (filter) => filter.toLowerCase().replace(/\s+/g, "_") === currentFilter
      );
      if (matchingFilter) {
        setFilter(matchingFilter);
      }
    } else {
      setFilter(filters[0]);
    }
  }, [currentFilter]);
  const visibleFilters = filters.slice(0, 5); // First 5 filters
  const remainingFilters = filters.slice(5); // Filters beyond the first 5
  return (
    <div className="w-full flex min-[1160px]:items-center gap-4 justify-between max-[1160px]:flex-col">
      <div className="w-full flex justify-between items-center">
        <Card className="bg-transparent w-fit border overflow-x-auto border-new-muted-text p-1 rounded-xl h-10 max-[1160px]:h-[42px]">
          <ToggleGroup.Root
            type="single"
            value={selectedFilter ? selectedFilter : filter}
            onValueChange={(value) => {
              if (value) setFilter(value);
              onFilterClick && onFilterClick(value);
            }}
            className={cn({ "justify-between": !showRightSide })}
          >
            {visibleFilters.map((value) => (
              <ToggleGroup.Item
                key={value}
                variant="select"
                value={value}
                disabled={!!selectedFilter || disabled}
                className={cn(
                  "data-[state=on]:bg-tertiary data-[state=on]:text-primary",
                  "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-transparent",
                  { "justify-center": !showRightSide }
                )}
              >
                {value}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </Card>
      </div>
      <div className="flex items-center gap-4 justify-end">
        <Select.Root
          value={selectedFilter ? selectedFilter : filter}
          onValueChange={(value) => {
            if (value) setFilter(value);
            onFilterClick && onFilterClick(value);
          }}
        >
          <Tooltip content={"More Filters"}>
            <Select.Trigger>
              <IconButton variant="ghost" className="size-[42px]">
                <FilterIcon className="size-4 text-muted-foreground" />
              </IconButton>
            </Select.Trigger>
          </Tooltip>
          <Select.Content align="end" className="w-fit border border-border">
            {remainingFilters.map((item) => (
              <Select.Item key={item} value={item}>
                {item}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        {showRightSide && (
          <div className="flex items-center gap-2 justify-end">
            <TextField
              type="search"
              placeholder="Search by collections"
              containerClass="bg-new-muted-bg w-[300px] max-[1160px]:w-full"
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
    </div>
  );
}
