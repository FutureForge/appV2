import React from "react";
import Link from "next/link";
import { Fee } from "@/modules/components/now-dialog/store";
import { Listing, Auction } from "@/modules/query/utils";
import { formatBlockchainTimestamp, getFormatAddress } from "@/utils/functions";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";

import XFI from "@/assets/xfi.svg";
import LinkIcon from "@/assets/arrow-right-up-line.svg";
import { Collection } from "@/utils/types/collection/collection.type";
import { decimalOffChain } from "@/modules/blockchain";

// Basic reusable components
export const FeeRow = ({
  label,
  value,
  isAddress = false,
}: {
  label: string;
  value: string;
  isAddress?: boolean;
}) => (
  <div className="flex items-center justify-between">
    <p className="text-muted-foreground capitalize text-sm">{label}</p>
    <p className="font-medium text-sm">
      {isAddress ? getFormatAddress(value) : `${value}%`}
    </p>
  </div>
);

export const NFTDetailItem = ({
  label,
  value,
  icon,
  link,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  link?: string;
}) => (
  <div>
    <span className="flex items-center gap-2">
      {icon}
      <p className="font-medium">
        {link ? (
          <Link
            href={link}
            className="font-medium text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </Link>
        ) : (
          value
        )}
      </p>
    </span>
    <p className="text-muted-foreground capitalize text-sm">{label}</p>
  </div>
);

export const PricingDetailItem = ({
  icon = <XFI className="size-[18px]" />,
  value,
  label,
}: {
  icon?: React.ReactNode;
  value: string | number;
  label: string;
}) => {
  const noSymbol =
    label !== "Available From" &&
    label !== "Starts From" &&
    label !== "Expires On" &&
    label !== "Ends On";
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-2">
        {icon && icon}
        <p className="font-medium text-sm">
          {value}
          {noSymbol && " XFI"}
        </p>
      </span>
      <p className="text-muted-foreground capitalize text-sm">{label}</p>
    </div>
  );
};

// Pricing details helper
export const getPricingDetails = (
  activeType: string,
  listingInfo: Listing,
  auctionInfo: Auction
) => {
  return [
    {
      id: "mainPrice",
      icon: <XFI className="size-[18px]" />,
      value: (() => {
        switch (activeType) {
          case "listing":
            return decimalOffChain(listingInfo?.pricePerToken);
          case "auction":
            return decimalOffChain(auctionInfo?.minimumBidAmount);
          case "expired":
            return listingInfo
              ? decimalOffChain(listingInfo?.pricePerToken)
              : decimalOffChain(auctionInfo?.minimumBidAmount);
          case "pending-payout":
            return decimalOffChain(auctionInfo?.minimumBidAmount);
          default:
            return "0";
        }
      })(),
      label:
        activeType === "listing" ||
        (activeType === "expired" && listingInfo !== null)
          ? "Listing Price"
          : "Minimum Bid Amount",
      show: true,
    },
    {
      id: "buyoutPrice",
      icon: <XFI className="size-[18px]" />,
      value: (() => {
        switch (activeType) {
          case "auction":
            return decimalOffChain(auctionInfo?.buyoutBidAmount);
          case "expired":
            return auctionInfo
              ? decimalOffChain(auctionInfo?.buyoutBidAmount)
              : "0";
          case "pending-payout":
            return decimalOffChain(auctionInfo?.buyoutBidAmount);
          default:
            return "0";
        }
      })(),
      label: "Buyout Price",
      show:
        activeType === "auction" ||
        activeType === "pending-payout" ||
        (activeType === "expired" && auctionInfo),
    },
    {
      id: "startTime",
      icon: null,
      value:
        formatBlockchainTimestamp(listingInfo?.startTimestamp) ||
        formatBlockchainTimestamp(auctionInfo?.startTimestamp),
      label:
        activeType === "listing" ||
        (activeType === "expired" && listingInfo !== null)
          ? "Available From"
          : "Starts From",
      show: true,
    },
    {
      id: "endTime",
      icon: null,
      value:
        formatBlockchainTimestamp(listingInfo?.endTimestamp) ||
        formatBlockchainTimestamp(auctionInfo?.endTimestamp),
      label:
        activeType === "listing" ||
        (activeType === "expired" && listingInfo !== null)
          ? "Expires On"
          : "Ends On",
      show: true,
    },
  ];
};

// Collection header component
export const CollectionHeader = ({
  collectionDetails,
}: {
  collectionDetails: Collection;
}) => {
  return (
    <div className="w-full bg-tertiary p-4 rounded-xl flex items-center justify-between">
      <span>
        <p className="font-medium">{collectionDetails.collectionName}</p>
        <p className="text-muted-foreground text-sm mt-2">Collection</p>
      </span>
      <Link
        href={`/collections/${collectionDetails.collectionAddress}`}
        className="text-muted-foreground hover:text-foreground group duration-300 transition-all ease-in-out flex items-center gap-1"
      >
        View Collection{" "}
        <LinkIcon className="size-4 text-muted-foreground group-hover:text-foreground duration-300 transition-all ease-in-out" />
      </Link>
    </div>
  );
};

// NFT Image component
export const NFTImage = ({ image, name }: { image: string; name?: string }) => (
  <div className="w-full relative h-full z-40 rounded-2xl border-2 border-border overflow-hidden">
    <MediaRenderer
      src={image}
      client={client}
      alt={name}
      className="object-cover w-full h-full aspect-square"
    />
    <div className="w-full h-[257px] absolute bottom-0 left-0 right-0 bg-gradient-to-t rounded-2xl via-black/80 from-background to-transparent" />
  </div>
);

// NFT Status component
export const NFTStatus = ({ activeType }: { activeType: string }) => {
  const getStatus = () => {
    if (activeType === "listing")
      return { type: "Direct Listing", color: "text-success" };
    if (activeType === "auction")
      return { type: "English Auction", color: "text-blue-500" };
    if (activeType === "expired")
      return { type: "Expired", color: "text-red-500" };
    if (activeType === "pending-payout")
      return { type: "Pending Payout", color: "text-yellow-500" };
    return { type: "Not Listed", color: "text-muted-foreground" };
  };

  const status = getStatus();

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
    >
      {status.type}
    </span>
  );
};
