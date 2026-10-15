"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { getFormatAddress } from "@/utils/functions";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";
import { AuctionBidEvent } from "@/modules/query/utils/";

export function makeAuctionBidsColumn() {
  const columns = createColumnHelper<AuctionBidEvent>();

  /* -------------------------------------------------------------------------------------------------
   * Collection column
   * -----------------------------------------------------------------------------------------------*/
  const collectionColumn = columns.accessor("auction.nft", {
    header: ({ column }) => (
      <div className="flex items-center gap-3 min-w-[193px]">
        <div className="text-center min-w-[30px] text-muted-foreground">#</div>{" "}
        <ColumnHeader column={column}>NFT</ColumnHeader>
      </div>
    ),
    cell: ({ row }) => {
      const { name, image } = row.original.auction.nft.metadata;

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
   * Bid amount column
   * -----------------------------------------------------------------------------------------------*/
  const BID_AMOUNT_HEADER_NAME = "Bid Amount";
  const bidAmountColumn = columns.accessor("bidAmount", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{BID_AMOUNT_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <XFI className="size-4" />
        <p>{getValue()} BOT</p>
      </div>
    ),
    meta: { headerName: BID_AMOUNT_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Bidder column
   * -----------------------------------------------------------------------------------------------*/
  const BIDDER_HEADER_NAME = "Bidder";
  const bidderColumn = columns.accessor("bidder", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{BIDDER_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <p>{getFormatAddress(getValue())}</p>
      </div>
    ),
    meta: { headerName: BIDDER_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Auction Creator column
   * -----------------------------------------------------------------------------------------------*/
  const AUCTION_CREATOR_HEADER_NAME = "Auction Creator";
  const auctionCreatorColumn = columns.accessor("auction.auctionCreator", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>
          {AUCTION_CREATOR_HEADER_NAME}
        </ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <p>{getFormatAddress(getValue())}</p>
      </div>
    ),
    meta: { headerName: AUCTION_CREATOR_HEADER_NAME },
  });

  return [
    collectionColumn,
    bidAmountColumn,
    bidderColumn,
    auctionCreatorColumn,
  ];
}
