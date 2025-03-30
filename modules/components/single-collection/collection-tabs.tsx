import { useState } from "react";
import { Card, TextField, IconButton, Select } from "@/modules/app";
import { ToggleGroup } from "@/modules/app";
import FilterIcon from "@/assets/filter-lines.svg";
import {
  CollectionActivityTab,
  CollectionItemsTab,
  CollectionOffersTab,
  CollectionSalesTab,
  CollectionSettingsTab,
} from ".";

export const COLLECTION_FILTERS = [
  "Items",
  "Offers",
  "Sales",
  "Activity",
  "Collection Settings",
];

interface CollectionTabsProps {
  filter: string;
  setFilter: (filter: string) => void;
  isCollectionOwner: boolean;
  collectionAddress: string;
}

export const CollectionTabs = ({
  filter,
  setFilter,
  isCollectionOwner,
  collectionAddress,
}: CollectionTabsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const renderTabContent = () => {
    switch (filter) {
      case "Items":
        return (
          <CollectionItemsTab
            collectionAddress={collectionAddress}
            searchQuery={searchQuery}
            selectedFilter={selectedFilter}
          />
        );
      case "Offers":
        return (
          <CollectionOffersTab
            collectionAddress={collectionAddress}
            searchQuery={searchQuery}
          />
        );
      case "Sales":
        return (
          <CollectionSalesTab
            collectionAddress={collectionAddress}
            searchQuery={searchQuery}
          />
        );
      case "Activity":
        return (
          <CollectionActivityTab
            collectionAddress={collectionAddress}
            searchQuery={searchQuery}
          />
        );
      case "Collection Settings":
        return isCollectionOwner ? (
          <CollectionSettingsTab collectionAddress={collectionAddress} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="mt-7 flex flex-col gap-6">
      <div className="w-full flex justify-between max-md:flex-col gap-4 md:items-center">
        <Card className="bg-transparent border border-new-muted-text p-1 rounded-xl h-10 w-fit">
          <ToggleGroup.Root
            type="single"
            value={filter}
            onValueChange={(value) => {
              if (value) setFilter(value);
            }}
          >
            {COLLECTION_FILTERS.filter(
              (value) => isCollectionOwner || value !== COLLECTION_FILTERS[4]
            ).map((value) => (
              <ToggleGroup.Item
                key={value}
                variant="select"
                value={value}
                className="data-[state=on]:bg-tertiary data-[state=on]:text-primary"
              >
                {value}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </Card>

        <div className="flex items-center gap-2 justify-end">
          {filter !== COLLECTION_FILTERS[4] && (
            <TextField
              type="search"
              placeholder="Search by collections"
              containerClass="bg-new-muted-bg w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
          {filter === COLLECTION_FILTERS[0] && (
            <div className="flex items-center gap-2">
              <span className="text-sm h-[42px] flex items-center justify-center text-muted-foreground bg-tertiary px-3 py-1 rounded-lg font-medium">
                {selectedFilter}
              </span>
              <Select.Root
                value={selectedFilter}
                onValueChange={setSelectedFilter}
              >
                <Select.Trigger>
                  <IconButton size="xl" variant="ghost">
                    <FilterIcon className="size-4 text-muted-foreground" />
                  </IconButton>
                </Select.Trigger>
                <Select.Content align="end" className="w-[103px]">
                  {["All", "Auction", "Listing"].map((item) => (
                    <Select.Item key={item} value={item}>
                      {item}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          )}
        </div>
      </div>

      {renderTabContent()}
    </div>
  );
};
