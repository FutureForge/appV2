"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { Auction, Listing } from "@/utils/types/graphql";

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
                <span>{name}</span>
              </div>
            </div>
          </div>
        </div>
      );
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * Bid Price column
   * -----------------------------------------------------------------------------------------------*/
  const buyoutBidAmountColumn = columns.accessor("buyoutBidAmount", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>Bid Price</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2">
        <XFI className="size-4" />
        <p>{getValue()} XFI</p>
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
        <p>{getValue()}</p>
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
        <p>{getValue()}</p>
      </div>
    ),
  });

  return [collectionColumn, buyoutBidAmountColumn, endTimestampColumn, auctionCreatorColumn];
}
