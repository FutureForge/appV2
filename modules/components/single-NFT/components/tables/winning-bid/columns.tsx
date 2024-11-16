"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { WinningBid } from "@/utils/types/graphql";
import { decimalOffChain } from "@/modules/blockchain";
import { formatBlockchainTimestamp, getFormatAddress } from "@/utils/functions";
import { Button } from "@/modules/app";

export function makeWinningBidColumn() {
  const columns = createColumnHelper<WinningBid>();

  /* -------------------------------------------------------------------------------------------------
   * Bidder column
   * -----------------------------------------------------------------------------------------------*/
  const bidderColumn = columns.accessor("bidder", {
    header: ({ column }) => (
      <div className="flex items-center gap-3 min-w-[193px]">
        <ColumnHeader column={column}>Bidder</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div className="flex items-center gap-3 w-full ">
          {getFormatAddress(getValue())}
        </div>
      );
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * Bid Amount column
   * -----------------------------------------------------------------------------------------------*/
  const bidAmountColumn = columns.accessor("bidAmount", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>Amount</ColumnHeader>
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
  });

  return [bidderColumn, bidAmountColumn];
}
