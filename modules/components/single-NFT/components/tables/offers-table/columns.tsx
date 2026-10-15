"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import XFI from "@/assets/xfi.svg";
import { getFormatAddress } from "@/utils/functions";
import { Button } from "@/modules/app";
import {
  useAcceptOfferMutation,
  useCancelOfferMutation,
} from "@/modules/mutation";
import { Offer } from "@/modules/query/utils";

export function makeOffersColumn({
  isOwner,
  userAddress,
}: {
  isOwner: boolean;
  userAddress: string;
}) {
  const columns = createColumnHelper<Offer>();
  const acceptOfferMutation = useAcceptOfferMutation();
  const cancelOfferMutation = useCancelOfferMutation();

  const handleAcceptOffer = (offerId: string) => {
    acceptOfferMutation.mutateAsync({ offerId });
  };

  const handleCancelOffer = (offerId: string) => {
    cancelOfferMutation.mutateAsync({ offerId });
  };

  /* -------------------------------------------------------------------------------------------------
   * Offeror column
   * -----------------------------------------------------------------------------------------------*/
  const offerorColumn = columns.accessor("offeror", {
    header: ({ column }) => (
      <div className="flex items-center gap-3 min-w-[193px]">
        <ColumnHeader column={column}>Offeror</ColumnHeader>
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
   * Amount column
   * -----------------------------------------------------------------------------------------------*/
  const amountColumn = columns.accessor("totalPrice", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>Amount</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => {
      return (
        <div className="flex gap-2">
          <XFI className="size-4" />
          <p>{getValue()} USDT</p>
        </div>
      );
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
        <p>{getValue()}</p>
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
      const { offeror, offerId } = row.original;
      const isOfferor = offeror.toLowerCase() === userAddress.toLowerCase();

      return (
        <div className="pr-6 flex justify-center items-center gap-2">
          {isOwner && (
            <Button
              onClick={() => handleAcceptOffer(offerId.toString())}
              shape="square"
            >
              Accept Offer
            </Button>
          )}
          {isOfferor && (
            <Button
              onClick={() => handleCancelOffer(offerId.toString())}
              shape="square"
            >
              Cancel Offer
            </Button>
          )}
        </div>
      );
    },
  });

  return [offerorColumn, amountColumn, endTimestampColumn, actionsColumns];
}
