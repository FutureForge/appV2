"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { Auction } from "@/utils/types/graphql";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { decimalOffChain } from "@/modules/blockchain";
import { formatBlockchainTimestamp, getFormatAddress } from "@/utils/functions";

export function makeAllAuctionsColumn() {
  const columns = createColumnHelper<Auction>();

  /* -------------------------------------------------------------------------------------------------
   * Bidder column
   * -----------------------------------------------------------------------------------------------*/
  const bidderColumn = columns.accessor("winningBid", {
    header: ({ column }) => (
      <div className="flex items-center gap-3 min-w-[193px]">
        <ColumnHeader column={column}>Bidder</ColumnHeader>
      </div>
    ),
    cell: ({ row }) => {
      const { bidder } = row.original.winningBid;

      return (
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center gap-3">{bidder}</div>
        </div>
      );
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * Amount column
   * -----------------------------------------------------------------------------------------------*/
  const amountColumn = columns.accessor("winningBid", {
    header: ({ column }) => (
      <div className="flex items-center gap-3 min-w-[193px]">
        <ColumnHeader column={column}>Amount</ColumnHeader>
      </div>
    ),
    cell: ({ row }) => {
      const { bidAmount } = row.original.winningBid;

      return (
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center gap-3">{bidAmount}</div>
        </div>
      );
    },
  });

  return [bidderColumn, amountColumn];
}
