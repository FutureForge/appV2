"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { getFormatAddress } from "@/utils/functions";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";
import { Offer } from "@/modules/query/utils/index.utils.query";

export function makeAllOffersColumn() {
  const columns = createColumnHelper<Offer>();

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
   * Offered Price column
   * -----------------------------------------------------------------------------------------------*/
  const OFFERED_PRICE_HEADER_NAME = "Offered Price";
  const offeredPrice = columns.accessor("totalPrice", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{OFFERED_PRICE_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <XFI className="size-4" />
        <p>{getValue()} XFI</p>
      </div>
    ),
    meta: { headerName: OFFERED_PRICE_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Offeror column
   * -----------------------------------------------------------------------------------------------*/
  const OFFEROR_HEADER_NAME = "Offeror";
  const offerorColumn = columns.accessor("offeror", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{OFFEROR_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <XFI className="size-4" />
        <p>{getFormatAddress(getValue())}</p>
      </div>
    ),
    meta: { headerName: OFFEROR_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * End Time column
   * -----------------------------------------------------------------------------------------------*/
  const ENDTIME_HEADER_NAME = "End Time<";
  const endTimestampColumn = columns.accessor("expirationTimestamp", {
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

  return [collectionColumn, offeredPrice, offerorColumn, endTimestampColumn];
}
