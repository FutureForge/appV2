import { Button, Header } from "@/modules/app";
import Image from "next/image";
import React, { useState } from "react";
import { getFormatAddress } from "@/utils/functions";
import { useFilterStore } from "../../store";
// icons
import Line from "@/assets/line.svg";
import XFI from "@/assets/xfi.svg";

const details = {
  subDetails_1: [
    {
      label: "contract address",
      value: "0x794D4548899cb005467f47028aAA4e5F5e56C06F",
    },
    {
      label: "token id",
      value: "#1134 ",
    },
    {
      label: "token standard",
      value: "CRC-721",
    },
    {
      label: "chain",
      value: "CrossFi Mainnet",
    },
  ],
  marketDetails: [
    {
      label: "collection fee",
      value: "3%",
    },
    {
      label: "fee collector",
      value: "0x794D4548899cb005467f47028aAA4e5F5e56C06F",
    },
    {
      label: "marketplace fee",
      value: "3%",
    },
    {
      label: "fee collector",
      value: "0x794D4548899cb005467f47028aAA4e5F5e56C06F",
    },
  ],
  pricingDetails: [
    {
      label: "listing price",
      value: "12.45",
    },
    {
      label: "chain",
      value: "CrossFi Mainnet",
    },
    {
      label: "available from",
      value: "Sept 20, 2024. 5:34pm",
    },
    {
      label: "expires on",
      value: "Sept 20, 2024. 5:34pm",
    },
  ],
};
const filters = ["Not Listed", "Listed", "Auction", "Expired"];
export function Details() {
  const [isActive, setIsActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedFilter, setSelectedFilter } = useFilterStore();

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="flex gap-6 pt-14">
      {/* image section */}
      <div className="w-[40%] relative h-[620px] gradient-box z-40 rounded-2xl">
        <Image
          src={"/nft_1.png"}
          width={500}
          height={700}
          alt="nft"
          className="object-cover relative size-full"
        />
        <div className="w-full h-[257px] absolute bottom-0 left-0 right-0 bg-gradient-to-t rounded-2xl via-black/80 from-background to-transparent" />
        <div className="absolute bottom-4 px-8 w-full flex justify-between items-center">
          <p className="font-medium">JungleBear</p>
          <span>
            <p className="font-medium">JungleBear</p>
            <p className="font-medium text-xs text-muted-foreground">
              Collection Name
            </p>
          </span>
        </div>
      </div>

      {/* details section */}
      <div className="flex-1 flex flex-col gap-6 h-fit">
        <Header
          isActive={isActive}
          setIsActive={setIsActive}
          onFilterClick={handleFilterClick}
          filters={filters}
        />
        <div className="flex flex-col gap-6">
          <p>
            Lorem ipsum dolor sit amet consectetur. Orci proin elementum
            faucibus tincidunt ibus tincidunt ibus tincidunt ibus tincidunt ibus
            tincidunt ibus tincidunt id Lorem ipsum dolor sit amet consectetur.
            Orci proin elementum faucibus tincidunt ibus tincidunt ibus
            tincidunt ibus tincidunt ibus tincidunt ibus tincidunt id.
          </p>
          <Line />
          <div className="bg-card rounded-xl p-4 flex items-center justify-between">
            {details.subDetails_1.map((detail) => {
              const { label, value } = detail;
              return (
                <div key={label}>
                  <span className="flex items-center gap-2">
                    {label === "chain" && <XFI className="size-5" />}
                    <p className="font-medium">
                      {label === "contract address"
                        ? getFormatAddress(value)
                        : value}
                    </p>
                  </span>

                  <p className="text-muted-foreground capitalize text-sm">
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r w-full from-border via-black/70 to-transparent p-3 rounded-2xl flex items-center justify-between gap-6 border border-border">
          <div className="w-1/2 flex flex-col gap-6 p-3">
            <p className="font-medium">Pricing Details</p>
            <div className="grid grid-cols-2 gap-5">
              {details.pricingDetails.map((detail, index) => {
                const { label, value } = detail;
                return (
                  <div
                    key={`market-details-key-${index}`}
                    className="flex flex-col gap-2"
                  >
                    <span className="flex items-center gap-2">
                      {label === "listing price" && (
                        <XFI className="size-[18px]" />
                      )}
                      <p className="font-medium text-sm">
                        {value} {label === "listing price" && "XFI"}
                      </p>
                    </span>

                    <p className="text-muted-foreground capitalize text-sm">
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border border-border rounded-xl w-1/2">
            <div className="border-b border-b-border p-3">
              <p>Market Details</p>
            </div>
            <div className="p-3 flex-col flex gap-3 mt-3">
              {details.marketDetails.map((detail, index) => {
                const { label, value } = detail;
                return (
                  <div
                    key={`market-details-key-${index}`}
                    className="flex items-center justify-between"
                  >
                    <p className="text-muted-foreground capitalize text-sm">
                      {label}
                    </p>
                    <p className="font-medium">
                      {label === "fee collector"
                        ? getFormatAddress(value)
                        : value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-full flex items-center gap-3">
          {selectedFilter === filters[0] && (
            <Button shape="square" className="w-full">
              Make Offer
            </Button>
          )}

          {selectedFilter === filters[1] && (
            <>
              <Button variant="secondary" shape="square" className="w-1/2">
                Make Offer
              </Button>
              <Button shape="square" className="w-1/2">
                Buy Now
              </Button>
            </>
          )}
          {selectedFilter === filters[2] && (
            <>
              <Button variant="secondary" shape="square" className="w-1/2">
                Buy Auction
              </Button>
              <Button shape="square" className="w-1/2">
                Place Bid
              </Button>
            </>
          )}
          {selectedFilter === filters[3] && (
            <Button shape="square" variant='error' className="w-full">
              Cancel Listing/Auction
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
