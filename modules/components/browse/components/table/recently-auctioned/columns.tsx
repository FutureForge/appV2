"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { Auction, Listing } from "@/utils/types/graphql";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { formatBlockchainTimestamp, getFormatAddress } from "@/utils/functions";
import { decimalOffChain } from "@/modules/blockchain";

export function makeRecentlyAuctionedColumns() {
  const columns = createColumnHelper<Auction>();

  /* -------------------------------------------------------------------------------------------------
   * Collection column
   * -----------------------------------------------------------------------------------------------*/
  const collectionColumn = columns.accessor("nft", {
    header: ({ column }) => (
      <div className="flex items-center gap-3 min-w-[193px]">
        <div className="text-center min-w-[30px] text-muted-foreground">#</div>{" "}
        <ColumnHeader column={column}>Collection</ColumnHeader>
      </div>
    ),
    cell: ({ row, getValue }) => {
      const { name, image } = row.original.nft.metadata;

      return (
        <div className="flex items-center gap-3 w-full">
          <div className="text-center min-w-[30px]">{row.index + 1}</div>
          <div className="flex items-center">
            <ImageHolder
              src={image}
              alt={name}
              className="mr-3 size-10 rounded-xl"
            />
            <div className="flex flex-col gap-1.5">
              <div className="text-sm">
                <span>{name}</span>
              </div>
            </div>
          </div>
        </div>
      );
    },
  });

  // minimumBidAmount

    /* -------------------------------------------------------------------------------------------------
   * Bid Price column
   * -----------------------------------------------------------------------------------------------*/
  const minimumBidAmountColumn = columns.accessor("minimumBidAmount", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>Minimum Bid</ColumnHeader>
      </div>
    ),
      cell: ({ getValue }) => (
        <div className="flex gap-2">
        <XFI className="size-4" />
        <p>{decimalOffChain(getValue())} XFI</p>
      </div>
    ),
  });

  /* -------------------------------------------------------------------------------------------------
   * Bid Price column
   * -----------------------------------------------------------------------------------------------*/
  const buyoutBidAmountColumn = columns.accessor("buyoutBidAmount", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>Buyout Bid</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <XFI className="size-4" />
        <p>{decimalOffChain(getValue())} XFI</p>
      </div>
    ),
  });

  /* -------------------------------------------------------------------------------------------------
   * Creator column
   * -----------------------------------------------------------------------------------------------*/
  const auctionCreatorColumn = columns.accessor("auctionCreator", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>End Time</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div>
        <p>{getFormatAddress(getValue())}</p>
      </div>
    ),
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

  return [
    collectionColumn,
    auctionCreatorColumn,
    minimumBidAmountColumn,
    buyoutBidAmountColumn,
    endTimestampColumn,
  ];
}
