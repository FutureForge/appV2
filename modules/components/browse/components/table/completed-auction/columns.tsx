"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { getFormatAddress } from "@/utils/functions";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";
import { CompletedAuctionEvent } from "@/modules/query/utils/";

export function makeCompletedAuctionColumn() {
  const columns = createColumnHelper<CompletedAuctionEvent>();

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
   * Sold price column
   * -----------------------------------------------------------------------------------------------*/
  const SOLD_PRICE_HEADER_NAME = "Sold Price";
  const soldPriceColumn = columns.accessor("bidAmount", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{SOLD_PRICE_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <XFI className="size-4" />
        <p>{getValue()} BOT</p>
      </div>
    ),
    meta: { headerName: SOLD_PRICE_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Buyer column
   * -----------------------------------------------------------------------------------------------*/
  const BUYER_HEADER_NAME = "Buyer";
  const buyerColumn = columns.accessor("closer", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{BUYER_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <p>{getFormatAddress(getValue())}</p>
      </div>
    ),
    meta: { headerName: BUYER_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Seller column
   * -----------------------------------------------------------------------------------------------*/
  const SELLER_HEADER_NAME = "Seller";
  const sellerColumn = columns.accessor("auctionCreator", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>{SELLER_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <p>{getFormatAddress(getValue())}</p>
      </div>
    ),
    meta: { headerName: SELLER_HEADER_NAME },
  });

  return [collectionColumn, soldPriceColumn, buyerColumn, sellerColumn];
}
