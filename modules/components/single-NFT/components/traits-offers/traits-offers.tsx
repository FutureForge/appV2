import React from "react";
import { useFilterStore } from "../../store";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/modules/app";
import { getFormatAddress } from "@/utils/functions";
import Link from "next/link";
import { useSingleNFTQuery, useUserChainInfo } from "@/modules/query";
import { Attribute } from "@/utils/types/graphql";
import { chainInfo } from "@/utils/configs";
import { singleNFTFilters } from "../details/details";
import { WinningBidTable } from "../tables/winning-bid";
import { OffersTable } from "../tables/offers-table";
import { TraitsSkeleton } from "../skeleton/traits-skeleton";

type Traits_OffersProps = {
  contractAddress: string;
  tokenId: string;
};

export function TraitsOffers({ contractAddress, tokenId }: Traits_OffersProps) {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;
  const { selectedFilter } = useFilterStore();

  const {
    data: nftData,
    isLoading: isNFTDataLoading,
    isPending: isNFTDataPending,
    isError,
  } = useSingleNFTQuery({
    contractAddress: contractAddress as string,
    tokenId: tokenId as string,
  });

  const activeType = nftData?.activeType;
  const nftActivities = nftData?.nftActivity;
  const nftOffers = nftData?.offers;
  const auctionPricingData = nftData?.auctionData;
  const winningBid = nftData?.winningBidBody;

  const nft = nftData?.nft;
  const { metadata } = nft || {};
  const attributes = (
    Array.isArray(metadata?.attributes) ? metadata.attributes : []
  ) as Attribute[];

  const isOwner = userAddress?.toLowerCase() === nft?.owner?.toLowerCase();

  return (
    <>
      {isNFTDataLoading || isNFTDataPending || isError ? (
        <TraitsSkeleton />
      ) : (
        <>
          <div className="flex w-full items-start justify-between gap-10">
            <div className="w-1/2 flex flex-col gap-4">
              <div className="bg-transparent border border-border p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Traits</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {attributes?.map(
                    (
                      trait: { trait_type: string; value: string },
                      index: number
                    ) => (
                      <div key={index} className="bg-card p-3 rounded-lg">
                        <p className="text-sm text-gray-400 first-letter:uppercase">
                          {trait.trait_type}
                        </p>
                        <p className="font-semibold first-letter:uppercase">
                          {trait.value}
                        </p>
                      </div>
                    )
                  )}
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
                    <ScrollArea.Root>
                      <div className="flex flex-col gap-2">
                        {nftActivities?.map((transfer, index) => (
                          <div
                            key={index}
                            className="p-4 hover:bg-table-hover transition-all duration-300 ease-in-out rounded-2xl bg-transparent flex items-center w-full justify-between"
                          >
                            <span>
                              <p className="font-medium text-sm">
                                From: {getFormatAddress(transfer.addressFrom)}
                              </p>
                              <p className="text-muted-foreground text-sm mt-2">
                                To: {getFormatAddress(transfer.addressTo)}
                              </p>
                            </span>
                            <span>
                              <Link
                                href={`${chainInfo.blockExplorers?.[0]?.url}/tx/${transfer.txHash}`}
                                className="font-medium text-sm"
                                target="_blank"
                                rel="noreferrer"
                              >
                                View Transaction
                              </Link>
                              <p className="text-muted-foreground text-sm mt-2">
                                {new Date(transfer.timestamp).toLocaleString()}
                              </p>
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea.Root>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>

            <div className="w-1/2 p-4 flex flex-col gap-4 rounded-2xl border border-border">
              <p>
                {activeType === "listing"
                  ? "Offers"
                  : activeType === "auction" || activeType === "pending-payout"
                  ? "Winning Bid"
                  : "Offers"}
              </p>

              {selectedFilter !== singleNFTFilters[2] &&
                selectedFilter !== singleNFTFilters[4] && (
                  <OffersTable
                    data={nftOffers ?? []}
                    isLoading={isNFTDataLoading || isNFTDataPending}
                    isOwner={isOwner}
                    userAddress={userAddress!}
                  />
                )}

              {selectedFilter === singleNFTFilters[2] ||
                (selectedFilter === singleNFTFilters[4] && (
                  <WinningBidTable
                    data={winningBid ? [winningBid] : []}
                    isLoading={isNFTDataLoading || isNFTDataPending}
                  />
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
