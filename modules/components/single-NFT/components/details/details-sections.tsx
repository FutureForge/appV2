import React from "react";
import Link from "next/link";
import {
  FeeRow,
  getPricingDetails,
  NFTDetailItem,
  NFTStatus,
  PricingDetailItem,
} from "./details-components";
import { chainInfo, DEAD_ADDRESS } from "@/utils/configs";
import { Auction, Listing } from "@/modules/query/utils";
import { Fee } from "@/modules/components/now-dialog/store";
import { getFormatAddress } from "@/utils/functions";

import Line from "@/assets/line.svg";
import XFI from "@/assets/xfi.svg";

// Basic Info Section
export const BasicInfoSection = ({
  name,
  owner,
  activeType,
}: {
  name: string;
  owner: string;
  activeType: string
}) => (
  <div className="flex w-full items-center justify-between">
    <span>
      <p className="font-medium">{name || "No Name"}</p>
      <p className="text-muted-foreground text-sm mt-2">
        Owned By:{" "}
        <Link
          href={`${chainInfo?.blockExplorers?.[0]?.url}/address/${owner}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary"
        >
          {getFormatAddress(owner || "")}
        </Link>
      </p>
    </span>
    <NFTStatus activeType={activeType} />
  </div>
);

// Description Section
export const DescriptionSection = ({
  description,
}: {
  description?: string;
}) => (
  <div className="flex flex-col gap-6">
    <p>{description || "No Description"}</p>
    <Line />
  </div>
);

// Details Grid Section
export const DetailsGridSection = ({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) => (
  <div className="bg-card rounded-xl p-4 flex items-center justify-between max-lg:grid grid-cols-2 gap-y-2">
    {[
      {
        label: "Contract Address",
        value: getFormatAddress(contractAddress),
        link: `${chainInfo?.blockExplorers?.[0]?.url}/address/${contractAddress}`,
      },
      { label: "Token Id", value: `#${tokenId}` },
      { label: "Token Standard", value: "CRC-721" },
      {
        label: "Chain",
        value: `${chainInfo.name || "Botchain"}`,
        icon: <XFI className="size-5" />,
      },
    ].map((item, index) => (
      <NFTDetailItem
        key={`nft-detail-${index}`}
        label={item.label}
        value={item.value}
        icon={item.icon}
        link={item.link}
      />
    ))}
  </div>
);

// Pricing Section
export const PricingSection = ({
  activeType,
  listingInfo,
  auctionInfo,
  collectionFee,
  marketplaceFee,
  selectedFilter,
}: {
  activeType?: string;
  listingInfo: Listing;
  auctionInfo: Auction;
  collectionFee: Fee;
  marketplaceFee: Fee;
  selectedFilter: string;
}) => (
  <div className="bg-gradient-to-r w-full from-border via-black/70 to-transparent p-3 rounded-2xl flex items-center max-lg:flex-col justify-between gap-6 border border-border">
    <div className="w-1/2 max-lg:w-full flex flex-col gap-6 p-3">
      <p className="font-medium">Pricing Details</p>
      <div className="grid grid-cols-2 gap-5">
        {selectedFilter !== "Not Listed" ? (
          getPricingDetails(activeType!, listingInfo, auctionInfo)
            .filter((detail) => detail.show)
            .map((detail) => (
              <PricingDetailItem
                key={detail.id}
                icon={detail.icon}
                value={detail.value!}
                label={detail.label}
              />
            ))
        ) : (
          <div className="col-span-2 flex items-center w-full p-6 bg-tertiary/30 rounded-xl border border-border/50">
            <p className="text-sm text-muted-foreground">
              This NFT is neither auctioned nor listed. You can make an offer at
              any time.
            </p>
          </div>
        )}
      </div>
    </div>

    <div className="border border-border rounded-xl w-1/2 max-lg:w-full">
      <div className="border-b border-b-border p-3">
        <p>Market Details</p>
      </div>
      <div className="p-3 flex-col flex gap-3 mt-3">
        <FeeRow
          label="marketplace fee"
          value={marketplaceFee?.percent?.toString() || "0"}
        />
        <FeeRow
          label="marketplace fee address"
          value={marketplaceFee?.address || DEAD_ADDRESS}
          isAddress={true}
        />
        <FeeRow
          label="collection fee"
          value={collectionFee?.percent?.toString() || "0"}
        />
        <FeeRow
          label="collection fee address"
          value={collectionFee?.address || DEAD_ADDRESS}
          isAddress={true}
        />
      </div>
    </div>
  </div>
);
