"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { NewBid } from "@/utils/types/graphql";
import { formatBlockchainTimestamp, getFormatAddress } from "@/utils/functions";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { decimalOffChain } from "@/modules/blockchain";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";

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
    cell: ({ row}) => {
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
   * Buyer column
   * -----------------------------------------------------------------------------------------------*/
  const BIDPRICE_HEADER_NAME = "Bid Price";
  const bidPriceColumn = columns.accessor("bidAmount", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>{BIDPRICE_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div>
          <p>{decimalOffChain(getValue())} XFI</p>
        </div>
      );
    },
    meta: { headerName: BIDPRICE_HEADER_NAME },
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
    cell: ({ getValue }) => {
      return (
        <div className="flex gap-2">
          <XFI className="size-4" />
          <p>{getFormatAddress(getValue())}</p>
        </div>
      );
    },
    meta: { headerName: BIDDER_HEADER_NAME },
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

  return [collectionColumn, bidPriceColumn, bidderColumn, endTimestampColumn];
}
