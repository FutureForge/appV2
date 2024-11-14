"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { Auction } from "@/utils/types/graphql";
import { getFormatAddress } from "@/utils/functions";

export function makeYourPositionsColumn() {
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
      const { name, imageUrl } = row.original.nft.metadata;
      return (
        <div className="flex items-center gap-3 w-full">
          <div className="text-center min-w-[30px]">{row.index + 1}</div>
          <div className="flex items-center">
            <img
              src={imageUrl}
              alt={name}
              className="mr-3 size-10 rounded-xl"
            />
            <div className="flex flex-col gap-1.5">
              <div className="text-sm">
                <span>
                  {name}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * Sold Price column
   * -----------------------------------------------------------------------------------------------*/
  const winningBidColumn = columns.accessor("winningBid", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>Sold Price</ColumnHeader>
      </div>
    ),
    cell: ({row }) => {
      const {bidAmount} = row.original.winningBid;
      return (
        <div className="flex gap-2">
          <XFI className="size-4" />
          <p>{bidAmount} XFI</p>
        </div>
      );
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * Buyer column
   * -----------------------------------------------------------------------------------------------*/
  const buyerColumn = columns.accessor("winningBid", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>Buyer</ColumnHeader>
      </div>
    ),
    cell: ({row }) => {
      const { bidder } = row.original.winningBid;
      return (
        <div>
          <p>{getFormatAddress(bidder)}</p>
        </div>
      );
    },
  });



  return [collectionColumn, winningBidColumn, buyerColumn];
}
