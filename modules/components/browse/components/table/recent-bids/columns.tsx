"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { NewBid } from "@/utils/types/graphql";
import { formatBlockchainTimestamp, getFormatAddress } from "@/utils/functions";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { decimalOffChain } from "@/modules/blockchain";

export function makeRecentBidsColumns() {
  const columns = createColumnHelper<NewBid>();

  /* -------------------------------------------------------------------------------------------------
   * Collection column
   * -----------------------------------------------------------------------------------------------*/
  const collectionColumn = columns.accessor("nft", {
    header: ({ column }) => (
      <div className="flex items-center gap-3 min-w-[193px]">
        <div className="text-center min-w-[30px] text-muted-foreground">#</div>{" "}
        <ColumnHeader column={column}>NFT</ColumnHeader>
      </div>
    ),
    cell: ({ row, getValue }) => {
      const { name, image } = row.original.nft.metadata;

      return (
        <div className="flex items-center gap-3 w-full">
          <div className="text-center min-w-[30px]">{row.index + 1}</div>
          <div className="flex items-center gap-3">
            <ImageHolder src={image} alt={name} width={40} height={40} />
            <span className="text-sm">{name}</span>
          </div>
        </div>
      );
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * Buyer column
   * -----------------------------------------------------------------------------------------------*/
  const bidPriceColumn = columns.accessor("bidAmount", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>Bid Price</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div>
          <p>{decimalOffChain(getValue())} XFI</p>
        </div>
      );
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * Bidder column
   * -----------------------------------------------------------------------------------------------*/
  const bidderColumn = columns.accessor("bidder", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>Bidder</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div className="flex gap-2">
          <XFI className="size-4" />
          <p>{getFormatAddress(getValue())}</p>
        </div>
      );
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * End Time column
   * -----------------------------------------------------------------------------------------------*/
  const endTimestampColumn = columns.accessor("endTimestamp", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>End Time</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div>
        <p>{formatBlockchainTimestamp(getValue())}</p>
      </div>
    ),
  });

  return [collectionColumn, bidPriceColumn, bidderColumn, endTimestampColumn];
}
