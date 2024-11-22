"use client";
import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxProvider,
} from "@ariakit/react";
import * as RadixPopover from "@radix-ui/react-popover";
import {
  useRef,
  useState,
  startTransition,
  useMemo,
  ComponentPropsWithoutRef,
} from "react";
import CloseIcon from "@/assets/close.svg";
import { matchSorter } from "match-sorter";
import SearchIcon from "@/assets/search-lg.svg";
import { Button } from "../button";
import { cn } from "../../utils";
import { ScrollArea } from "../scroll-area/scroll-area";
import {
  useAllCollectionsQuery,
  useAllAuctionsQuery,
  useAllNFTQuery,
  useAllListingsQuery,
} from "@/modules/query";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@uidotdev/usehooks";

const popular_tags = [
  { label: "All", type: null },
  { label: "NFTS", type: "collection-nft" },
  { label: "NFTS", type: "nft" },
  { label: "Listed", type: "listing" },
  { label: "Auctions", type: "auction" },
  { label: "Collections", type: "collection" },
] as { label: string; type: SearchType }[];

type SearchType =
  | "collection"
  | "listing"
  | "auction"
  | "collection-nft"
  | "nft";

export function Search() {
  const comboboxRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { width } = useWindowSize();
  const isTab = width && width <= 1170;

  const { data: allCollectionsQuery } = useAllCollectionsQuery({ limit: 100 });
  const { data: listingData } = useAllListingsQuery({ limit: 100 });
  const { data: auctionData } = useAllAuctionsQuery({ limit: 100 });
  const { data: allNFTs } = useAllNFTQuery();

  const collectionData = allCollectionsQuery?.collections;

  const searchResults = useMemo(() => {
    setIsSearching(true);
    if (!searchValue) {
      setIsSearching(false);
      return [];
    }

    const results = new Map();

    listingData?.forEach((listing) => {
      if (
        listing.nft.metadata.name
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        results.set(listing.nft.metadata.name.toLowerCase(), {
          ...listing,
          type: "listing" as SearchType,
        });
      }
    });

    auctionData?.forEach((auction) => {
      if (
        auction.nft.metadata.name
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        results.set(auction.nft.metadata.name.toLowerCase(), {
          ...auction,
          type: "auction" as SearchType,
        });
      }
    });

    collectionData?.forEach((collection) => {
      if (
        collection.collectionName
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        results.set(collection.collectionName.toLowerCase(), {
          ...collection,
          type: "collection" as SearchType,
        });
      }
    });

    allNFTs?.forEach((nft) => {
      if (nft.metadata.name.toLowerCase().includes(searchValue.toLowerCase())) {
        collectionData?.forEach((collection) => {
          if (
            collection.collectionAddress.toLowerCase() ===
            nft.assetContract.toLowerCase()
          ) {
            results.set(nft.metadata.name.toLowerCase(), {
              ...nft,
              type: "collection-nft" as SearchType,
              collectionName: collection.collectionName,
            });
          } else {
            results.set(nft.metadata.name.toLowerCase(), {
              ...nft,
              type: "nft" as SearchType,
            });
          }
        });
      }
    });

    setIsSearching(false);
    return Array.from(results.values());
  }, [searchValue, collectionData, listingData, auctionData, allNFTs]);

  const matches = useMemo(() => {
    return matchSorter(searchResults, searchValue, {
      keys: [
        "metadata.name",
        "collectionName",
        (item) => (item.type === "collection-nft" ? item.collectionName : null),
      ],
      baseSort: (a, b) => (a.index < b.index ? -1 : 1),
    });
  }, [searchValue, searchResults]);

  const filteredMatches = useMemo(() => {
    if (!activeTag || activeTag === "All") return matches;

    const tagType = popular_tags.find((tag) => tag.label === activeTag)?.type;
    return matches.filter((match) => match.type === tagType);
  }, [matches, activeTag]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setIsSearching(true);
    setShowResults(true);
  };

  const handleClearInput = () => {
    setSearchValue("");
    setOpen(false);
    setActiveTag(null);
    setShowResults(false);
  };

  const handleToggleTag = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <RadixPopover.Root open={open} onOpenChange={setOpen}>
      <ComboboxProvider
        open={open}
        setOpen={setOpen}
        setValue={(value) => startTransition(() => setSearchValue(value))}
      >
        <RadixPopover.Anchor asChild>
          <div className="flex bg-new-muted-bg min-[1170px]:min-w-[315px] w-[113px] min-[1170px]:w-full h-10 items-center gap-1 border border-border rounded-xl p-2">
            <SearchIcon className="size-4 text-muted-foreground" />
            <Combobox
              ref={comboboxRef}
              placeholder={
                isTab ? "Search" : "Search for collections, NFT or Users"
              }
              className="outline-none placeholder:text-xs placeholder:text-muted-foreground bg-transparent w-full"
              onChange={handleSearchChange}
              value={searchValue}
            />
            {searchValue && (
              <CloseIcon
                onClick={handleClearInput}
                className="text-muted-foreground size-3 cursor-pointer"
              />
            )}
          </div>
        </RadixPopover.Anchor>
        <RadixPopover.Content
          asChild
          sideOffset={8}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            const target = event.target as Element | null;
            const isCombobox = target === comboboxRef.current;
            const inListbox = target && listboxRef.current?.contains(target);
            if (isCombobox || inListbox) {
              event.preventDefault();
            }
          }}
          className="bg-background/95 filter backdrop-blur-2xl max-w-[--radix-popover-trigger-width] h-[351px] min-w-[315px] border border-border rounded-2xl z-40 overflow-hidden"
        >
          <ScrollArea.Root>
            <div className="flex-col flex gap-4">
              <div className="flex flex-col gap-2 p-4 border-b border-b-border relative">
                <p className="text-xs text-muted-foreground z-30">
                  Searching for
                </p>
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {popular_tags.map((tag) => (
                    <Button
                      onClick={() => handleToggleTag(tag.label)}
                      key={tag.label}
                      shape="square"
                      variant="outline"
                      className={cn("text-xs h-[26px] whitespace-nowrap", {
                        "bg-tertiary text-primary border-0":
                          activeTag === tag.label,
                      })}
                    >
                      {tag.label}
                      <CloseIcon
                        className="text-muted-foreground size-3 cursor-pointer"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setActiveTag(null);
                        }}
                      />
                    </Button>
                  ))}
                  <div className="bg-gradient-to-l from-black via-background to-transparent w-14 h-full top-0 absolute right-1" />
                  <div className="bg-gradient-to-r from-black via-background to-transparent w-14 h-full top-0 absolute left-0" />
                </div>
              </div>

              <div className="p-4 flex flex-col">
                {showResults && searchValue && (
                  <>
                    {isSearching ? (
                      <div className="w-full flex items-center justify-center">
                        <Spinner />
                      </div>
                    ) : filteredMatches.length ? (
                      filteredMatches.map(({ children, ...props }, index) => {
                        const type = props?.type as SearchType;
                        return (
                          <ComboboxItem
                            key={index}
                            focusOnHover
                            hideOnClick
                            className="combobox-item"
                            render={
                              <SearchResultItem
                                type={type}
                                data={props}
                                setOpen={setOpen}
                              />
                            }
                          />
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                        No results found
                      </div>
                    )}
                  </>
                )}

                {!showResults && !searchValue && (
                  <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                    Search for collections, listings, auctions, or NFTs
                  </div>
                )}
              </div>
            </div>
          </ScrollArea.Root>
        </RadixPopover.Content>
      </ComboboxProvider>
    </RadixPopover.Root>
  );
}
interface SearchResultItemProps {
  type: SearchType;
  data: any;
  setOpen: (open: boolean) => void;
}

export function SearchResultItem({
  type,
  data,
  setOpen,
}: SearchResultItemProps) {
  const router = useRouter();

  const handleClick = () => {
    setOpen(false);
    if (type === "collection") {
      router.push(`/collections/${data?.collectionAddress}`);
    } else {
      router.push(`/nft/${data?.assetContract}/${data?.tokenId}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-2 hover:bg-table-hover rounded-xl group cursor-pointer"
    >
      <div className="relative">
        {type === "collection" ? (
          <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg group cursor-pointer">
            <div className="relative w-10 h-10">
              <img
                src={data?.collectionImage}
                alt={data?.collectionName}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        ) : (
          <ImageHolder
            src={data?.metadata?.image}
            alt={data?.metadata?.name}
            width={40}
            height={40}
            className="rounded-lg object-cover"
          />
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium truncate">
          {type === "collection" ? data?.collectionName : data?.metadata?.name}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground capitalize">
            {type.replace("-", " ")}
          </span>
        </div>
      </div>
    </div>
  );
}

type SpinnerProps = ComponentPropsWithoutRef<"svg">;

export function Spinner(props: SpinnerProps) {
  const { className, ...svgProps } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={cn("text-[#C4C4C4] size-[33px] animate-spin", className)}
      {...svgProps}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
