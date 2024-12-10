"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { Auction } from "@/utils/types/graphql";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { decimalOffChain } from "@/modules/blockchain";
import { formatBlockchainTimestamp, getFormatAddress } from "@/utils/functions";
import Image from "next/image";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";

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
  const MINIMUMBID_HEADER_NAME = "Minimum Bid";
  const minimumBidAmountColumn = columns.accessor("minimumBidAmount", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{MINIMUMBID_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <XFI className="size-4" />
        <p>{decimalOffChain(getValue())} XFI</p>
      </div>
    ),
    meta: { headerName: MINIMUMBID_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Buyout Price column
   * -----------------------------------------------------------------------------------------------*/
  const BUYOUTBID_HEADER_NAME = "Buyout Price";
  const buyoutBidAmountColumn = columns.accessor("buyoutBidAmount", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{BUYOUTBID_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <XFI className="size-4" />
        <p>{decimalOffChain(getValue())} XFI</p>
      </div>
    ),
    meta: { headerName: BUYOUTBID_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Creator column
   * -----------------------------------------------------------------------------------------------*/
  const AUCTIONCREATOR_HEADER_NAME = "Creator";
  const auctionCreatorColumn = columns.accessor("auctionCreator", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>
          {AUCTIONCREATOR_HEADER_NAME}
        </ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div>
        <p>{getFormatAddress(getValue())}</p>
      </div>
    ),
    meta: { headerName: AUCTIONCREATOR_HEADER_NAME },
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
        <p>{formatBlockchainTimestamp(getValue())}</p>
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
