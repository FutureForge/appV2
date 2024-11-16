import React from "react";
import { useFilterStore } from "../../store";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/modules/app";
import { getFormatAddress } from "@/utils/functions";
import Link from "next/link";
import { AuctionTable, ExpiredTable, ListedTable, NotListedTable } from "../tables";



const traits = [
  {
    label: "background",
    value: "full red",
  },
  {
    label: "background",
    value: "full red",
  },
  {
    label: "background",
    value: "full red",
  },
  {
    label: "background",
    value: "full red",
  },
  {
    label: "face",
    value: "bubble",
  },
  {
    label: "head",
    value: "Cap",
  },
];
const transfers = Array.from({ length: 20 }, (_, index) => ({
  date: `about 4 days ago (${index + 1})`,
  from: `0x794D4548899cb005467f47028aAA4e5F5e56C06F`,
  to: `0x794D4548899cb005467f47028aAA4e5F5e56C06F`,
}));
export function TraitsOffers() {
  const { selectedFilter } = useFilterStore();
  return (
    <div className="flex w-full items-start justify-between gap-10">
      <div className="w-1/2 flex flex-col gap-4">
        <div className="border border-border rounded-2xl p-4 flex flex-col gap-4">
          <p>Traits</p>
          <div className="flex  items-center w-full justify-between">
            {traits.map((trait, index) => (
              <div key={`trait-key-${index}`}>
                <span>
                  <p className="capitalize font-medium text-sm">
                    {trait.value}
                  </p>
                  <p className="capitalize text-muted-foreground text-sm">
                    {trait.label}
                  </p>
                </span>
              </div>
            ))}
          </div>
        </div>
        <Accordion.Root
          className="AccordionRoot bg-card rounded-2xl"
          type="single"
          collapsible
        >
          <Accordion.Item className="AccordionItem" value="transfers">
            <Accordion.Trigger className="w-full items-center flex [&[data-state=open]>svg]:rotate-180 transition-all duration-300 ease-in-out justify-between h-14 rounded-2xl px-4">
              Recent Transfers
              <ChevronDownIcon className="AccordionChevron" aria-hidden />
            </Accordion.Trigger>
            <Accordion.Content className="rounded-2xl h-[250px] p-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <ScrollArea>
                <div className="flex flex-col gap-2">
                  {transfers.map((transfer, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-table-hover transition-all duration-300 ease-in-out rounded-2xl bg-transparent flex items-center w-full justify-between"
                    >
                      <span>
                        <p className="font-medium text-sm">
                          From: {getFormatAddress(transfer.from)}
                        </p>
                        <p className="text-muted-foreground text-sm mt-2">
                          To: {getFormatAddress(transfer.to)}
                        </p>
                      </span>
                      <span>
                        <Link href="" className="font-medium text-sm">
                          View Transaction
                        </Link>
                        <p className="text-muted-foreground text-sm mt-2">
                          {transfer.date}
                        </p>
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
      <div className="w-1/2 p-4 flex flex-col gap-4 rounded-2xl border border-border">
        {/* <p>Currently Selected Filter: {selectedFilter}</p> */}
        <p>Offers</p>

        {selectedFilter === "Not Listed" && (
          <NotListedTable data={[]} isLoading={false} />
        )}
        {selectedFilter === "Listed" && (
          <ListedTable data={[]} isLoading={false} />
        )}
        {selectedFilter === "Auction" && (
          <AuctionTable data={[]} isLoading={false} />
        )}
        {selectedFilter === "Expired" && (
          <ExpiredTable data={[]} isLoading={false} />
        )}
      </div>
    </div>
  );
}
