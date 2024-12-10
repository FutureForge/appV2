"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { AuctionClosed } from "@/utils/types/graphql";
import { getFormatAddress } from "@/utils/functions";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { decimalOffChain } from "@/modules/blockchain";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";

export function makeRecentlySoldAuctionColumns() {
  const columns = createColumnHelper<AuctionClosed>();

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
      const { name, image } = row.original.nft?.metadata || {};

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
   * Sold Price column
   * -----------------------------------------------------------------------------------------------*/
  const SOLDPRICE_HEADER_NAME = "Sold Price";
  const winningBidColumn = columns.accessor("bidAmount", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{SOLDPRICE_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div className="flex gap-2">
          <XFI className="size-4" />
          <p>{decimalOffChain(getValue())} XFI</p>
        </div>
      );
    },
    meta: { headerName: SOLDPRICE_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Buyer column
   * -----------------------------------------------------------------------------------------------*/
  const BUYER_HEADER_NAME = "Buyer";
  const buyerColumn = columns.accessor("closer", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>{BUYER_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div>
          <p>{getFormatAddress(getValue())}</p>
        </div>
      );
    },
    meta: { headerName: BUYER_HEADER_NAME },
  });

  return [collectionColumn, winningBidColumn, buyerColumn];
}
