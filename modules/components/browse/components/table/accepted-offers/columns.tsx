"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { AcceptedOffer } from "@/utils/types/graphql";
import { formatBlockchainTimestamp, getFormatAddress } from "@/utils/functions";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { decimalOffChain } from "@/modules/blockchain";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";

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
   * Total Price Paid column
   * -----------------------------------------------------------------------------------------------*/
  const TOTALPRICE_HEADER_NAME = "Total Price Paid";
  const totalPricePaidColumn = columns.accessor("totalPricePaid", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>{TOTALPRICE_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div>
          <p>{decimalOffChain(getValue())} WXFI</p>
        </div>
      );
    },
    meta: { headerName: TOTALPRICE_HEADER_NAME },
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
    cell: ({ getValue }) => {
      return (
        <div className="flex gap-2">
          <XFI className="size-4" />
          <p>{getFormatAddress(getValue())}</p>
        </div>
      );
    },
    meta: { headerName: OFFEROR_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Seller column
   * -----------------------------------------------------------------------------------------------*/
  const SELLER_HEADER_NAME = "Seller";
  const sellerColumn = columns.accessor("seller", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{SELLER_HEADER_NAME}</ColumnHeader>
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
    meta: { headerName: SELLER_HEADER_NAME },
  });

  return [collectionColumn, totalPricePaidColumn, offerorColumn, sellerColumn];
}
