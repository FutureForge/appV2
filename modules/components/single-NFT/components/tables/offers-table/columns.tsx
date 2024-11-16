"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { Offer } from "@/utils/types/graphql";
import { decimalOffChain } from "@/modules/blockchain";
import { formatBlockchainTimestamp, getFormatAddress } from "@/utils/functions";
import { Button } from "@/modules/app";

export function makeOffersColumn({
  isOwner,
  userAddress,
}: {
  isOwner: boolean;
  userAddress: string;
}) {
  const columns = createColumnHelper<Offer>();

  /* -------------------------------------------------------------------------------------------------
   * Offeror column
   * -----------------------------------------------------------------------------------------------*/
  const offerorColumn = columns.accessor("offeror", {
    header: ({ column }) => (
      <div className="flex items-center gap-3 min-w-[193px]">
        <ColumnHeader column={column}>Offeror</ColumnHeader>
      </div>
    ),
    cell: ({ row }) => {
      const { offeror } = row.original;
      return <div className="flex items-center gap-3 w-full ">{offeror}</div>;
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * Amount column
   * -----------------------------------------------------------------------------------------------*/
  const amountColumn = columns.accessor("totalPrice", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>Amount</ColumnHeader>
      </div>
    ),
    cell: ({ row }) => {
      const { totalPrice } = row.original;
      <div className="flex gap-2">
        <XFI className="size-4" />
        <p>{decimalOffChain(totalPrice)} XFI</p>
      </div>;
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * End Time column
   * -----------------------------------------------------------------------------------------------*/
  const endTimestampColumn = columns.accessor("expirationTimestamp", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>End Time</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div>
        <p>{formatBlockchainTimestamp(getValue())}</p>
      </div>
    ),
  });

  /* -------------------------------------------------------------------------------------------------
   * Actions column
   * -----------------------------------------------------------------------------------------------*/
  const actionsColumns = columns.display({
    id: "actions",
    header: () => <div className="min-w-[125px] pr-6" />,
    cell: ({ row }) => {
      const { offeror } = row.original;
      const isOfferor = offeror.toLowerCase() === userAddress.toLowerCase();

      return (
        <div className="pr-6 flex justify-center items-center gap-2">
          {isOwner && <Button shape="square">Accept Offer</Button>}
          {isOfferor && <Button shape="square">Cancel Offer</Button>}
        </div>
      );
    },
  });

  return [offerorColumn, amountColumn, endTimestampColumn, actionsColumns];
}
