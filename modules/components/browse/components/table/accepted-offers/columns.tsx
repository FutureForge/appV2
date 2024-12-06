"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { AcceptedOffer } from "@/utils/types/graphql";
import { formatBlockchainTimestamp, getFormatAddress } from "@/utils/functions";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { decimalOffChain } from "@/modules/blockchain";

export function makeRecentBidsColumns() {
  const columns = createColumnHelper<AcceptedOffer>();

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
    cell: ({ row, getValue }) => {
      const { name, image } = row.original.nft.metadata;

      return (
        <div className="flex items-center gap-3 w-full">
          <div className="text-center min-w-[30px]">{row.index + 1}</div>
          <div className="flex items-center gap-3">
            <ImageHolder src={image} alt={name} width={40} height={40} />
            <span className="text-sm">{name}</span>
          </div>
        </div>
      );
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * Total Price Paid column
   * -----------------------------------------------------------------------------------------------*/
  const totalPricePaidColumn = columns.accessor("totalPricePaid", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>Total Price Paid</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div>
          <p>{decimalOffChain(getValue())} WXFI</p>
        </div>
      );
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * Offeror column
   * -----------------------------------------------------------------------------------------------*/
  const offerorColumn = columns.accessor("offeror", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>Offeror</ColumnHeader>
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
  });

  /* -------------------------------------------------------------------------------------------------
   * Seller column
   * -----------------------------------------------------------------------------------------------*/
  const sellerColumn = columns.accessor("seller", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>Seller</ColumnHeader>
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
  });

  return [collectionColumn, totalPricePaidColumn, offerorColumn, sellerColumn];
}
