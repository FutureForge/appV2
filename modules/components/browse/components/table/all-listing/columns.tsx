"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { getFormatAddress } from "@/utils/functions";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";
import { Listing } from "@/modules/query/utils/index.utils.query";

export function makeAllListingsColumn() {
  const columns = createColumnHelper<Listing>();

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
   *Price Per Token column
   * -----------------------------------------------------------------------------------------------*/
  const LISTING_PRICE_HEADER_NAME = "Listing Price";
  const pricePerTokenColumn = columns.accessor("pricePerToken", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{LISTING_PRICE_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <XFI className="size-4" />
        <p>{getValue()} XFI</p>
      </div>
    ),
    meta: { headerName: LISTING_PRICE_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Listing Creator column
   * -----------------------------------------------------------------------------------------------*/
  const LISTING_CREATOR_HEADER_NAME = "Creator";
  const listingCreatorColumn = columns.accessor("listingCreator", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>
          {LISTING_CREATOR_HEADER_NAME}
        </ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div>
        <p>{getFormatAddress(getValue())}</p>
      </div>
    ),
    meta: { headerName: LISTING_CREATOR_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * End Timestamp column
   * -----------------------------------------------------------------------------------------------*/
  const ENDTIME_HEADER_NAME = "Ends";
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
    pricePerTokenColumn,
    listingCreatorColumn,
    endTimestampColumn,
  ];
}
