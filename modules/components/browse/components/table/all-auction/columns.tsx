"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { getFormatAddress } from "@/utils/functions";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";
import { Auction } from "@/modules/query/utils";

export function makeAllAuctionsColumn() {
  const columns = createColumnHelper<Auction>();

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
    cell: ({ row }) => {
      const { name, image } = row.original.nft.metadata;

      return (
        <div className="flex items-center gap-3 w-full">
          <div className="text-center min-w-[30px]">{row.index + 1}</div>
          <div className="flex items-center gap-3">
            <MediaRenderer
              client={client}
              src={image}
              alt={name}
              className="mr-3 size-10 rounded-xl border border-border"
            />
            <span className="text-sm">{name}</span>
          </div>
        </div>
      );
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * Buyout Price column
   * -----------------------------------------------------------------------------------------------*/
  const MINIMUM_BID_HEADER_NAME = "Minimum Bid";
  const minimumBidAmountColumn = columns.accessor("minimumBidAmount", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{MINIMUM_BID_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <XFI className="size-4" />
        <p>{getValue()} BOT</p>
      </div>
    ),
    meta: { headerName: MINIMUM_BID_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Buyout Price column
   * -----------------------------------------------------------------------------------------------*/
  const BUYOUT_BID_HEADER_NAME = "Buyout Price";
  const buyoutBidAmountColumn = columns.accessor("buyoutBidAmount", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{BUYOUT_BID_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <XFI className="size-4" />
        <p>{getValue()} BOT</p>
      </div>
    ),
    meta: { headerName: BUYOUT_BID_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Creator column
   * -----------------------------------------------------------------------------------------------*/
  const AUCTION_CREATOR_HEADER_NAME = "Creator";
  const auctionCreatorColumn = columns.accessor("auctionCreator", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>
          {AUCTION_CREATOR_HEADER_NAME}
        </ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div>
        <p>{getFormatAddress(getValue())}</p>
      </div>
    ),
    meta: { headerName: AUCTION_CREATOR_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * End Time column
   * -----------------------------------------------------------------------------------------------*/
  const ENDTIME_HEADER_NAME = "End Time";
  const endTimestampColumn = columns.accessor("endTimestamp", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>{ENDTIME_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div>
        <p>{getValue()}</p>
      </div>
    ),
    meta: { headerName: ENDTIME_HEADER_NAME },
  });

  return [
    collectionColumn,
    minimumBidAmountColumn,
    buyoutBidAmountColumn,
    auctionCreatorColumn,
    endTimestampColumn,
  ];
}
