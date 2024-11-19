import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxProvider,
} from "@ariakit/react";
import * as RadixPopover from "@radix-ui/react-popover";
import { useRef, useState, startTransition, useMemo, ReactNode } from "react";
import CloseIcon from "@/assets/close.svg";
import { matchSorter } from "match-sorter";
import SearchIcon from "@/assets/search-lg.svg";
import { Button } from "../button";
import { cn } from "../../utils";
import { ScrollArea } from "../scroll-area/scroll-area";

const popular_tags = [
  { label: "NFTS", link: "" },
  { label: "Listed", link: "" },
];
const links = [
  {
    href: "https://x.com/ariakitjs",
    children: "Twitter",
    target: "_blank",
  },
  {
    href: "https://www.facebook.com/ariakitjs",
    children: "Facebook",
    target: "_blank",
  },
  {
    href: "https://www.instagram.com/ariakitjs",
    children: "Instagram",
    target: "_blank",
  },
  { href: "https://ariakit.org", children: "Ariakit.org" },
];

export function Search() {
  const comboboxRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const matches = useMemo(() => {
    return matchSorter(links, searchValue, {
      keys: ["children"],
      baseSort: (a, b) => (a.index < b.index ? -1 : 1),
    });
  }, [searchValue]);

  const handleToggleTag = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const handleClearInput = () => {
    setSearchValue("");
    setOpen(false);
    setActiveTag(null);
  };

  return (
    <RadixPopover.Root open={open} onOpenChange={setOpen}>
      <ComboboxProvider
        open={open}
        setOpen={setOpen}
        setValue={(value) => startTransition(() => setSearchValue(value))}
      >
        <RadixPopover.Anchor asChild>
          <div className="flex bg-new-muted-bg min-w-[315px] h-10 items-center gap-1 border border-border rounded-xl p-2">
            <SearchIcon className="size-4 text-muted-foreground" />
            <Combobox
              ref={comboboxRef}
              placeholder="Search for collections, NFT or Users"
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
          className="bg-background/90 backdrop-blur-lg max-w-[--radix-popover-trigger-width] h-[351px] min-w-[--radix-popover-trigger-width] border border-border rounded-2xl z-40 overflow-hidden"
        >
          <ScrollArea.Root>
            <div className="flex-col flex gap-4">
              <div className="flex flex-col gap-2 p-4 border-b border-b-border">
                <p className="text-xs text-muted-foreground">Searching for</p>
                <div className="flex items-center gap-1">
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
                      <CloseIcon className="text-muted-foreground size-3 cursor-pointer" />
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-4 flex flex-col">
                {matches.length ? (
                  matches.map(({ children, ...props }) => (
                    <ComboboxItem
                      key={children}
                      focusOnHover
                      hideOnClick
                      className="combobox-item"
                      render={<a {...props} />}
                    >
                      {children}
                    </ComboboxItem>
                  ))
                ) : (
                  <div className="no-results">No results found</div>
                )}
              </div>
            </div>
          </ScrollArea.Root>
        </RadixPopover.Content>
      </ComboboxProvider>
    </RadixPopover.Root>
  );
}
