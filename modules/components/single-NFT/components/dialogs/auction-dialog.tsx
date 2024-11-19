import {
  Button,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Label,
  TextField,
  Tooltip,
} from "@/modules/app";
import React, { useState } from "react";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";
import {
  useApprovedForAllMutation,
  useCreateAuctionMutation,
} from "@/modules/mutation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Check from "@/assets/Checkbox [1.0].svg";
import Info from "@/assets/info.svg";

type AuctionDialogProps = {
  src: string;
  alt: string;
  name: string;
  tokenId: string;
  isApproved: boolean;
  assetContract: string;
};

const notes = [
  [
    "Auction must have a duration of at least 7 days.",
    "You can cancel the auction details at any time before the first bid is placed. Once a bid is made, the auction cannot be cancelled.",
  ],
];

export function AuctionDialog({
  src,
  alt,
  name,
  tokenId,
  isApproved,
  assetContract,
}: AuctionDialogProps) {
  const [minimumBidAmount, setMinimumBidAmount] = useState("");
  const [buyoutBidAmount, setBuyoutBidAmount] = useState("");
  const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const [selectedDate, setSelectedDate] = useState<Date>(oneWeekFromNow);

  console.log({ selectedDate });

  const createAuctionMutation = useCreateAuctionMutation();
  const approveMutation = useApprovedForAllMutation();

  const isDisabled = !isApproved
    ? false
    : !minimumBidAmount ||
      !buyoutBidAmount ||
      !selectedDate ||
      createAuctionMutation.isPending;

  const handleDateChange = (date: Date | null) => {
    const newDate = date || oneWeekFromNow;
    setSelectedDate(newDate);
  };

  const handleCreateAuction = () => {
    if (!minimumBidAmount && !buyoutBidAmount) return;

    createAuctionMutation.mutateAsync(
      {
        auctionDetails: {
          assetContract: assetContract,
          tokenId: tokenId,
          quantity: "1",
          minimumBidAmount: minimumBidAmount,
          buyoutBidAmount: buyoutBidAmount,
          endTimestamp: selectedDate,
        },
      },
      {
        onSuccess: () => {
          setMinimumBidAmount("");
          setBuyoutBidAmount("");
        },
        onError() {
          setMinimumBidAmount("");
          setBuyoutBidAmount("");
        },
      }
    );
  };

  const handleApproveSpending = () => {
    if (isApproved) return;

    approveMutation.mutate({
      collectionContractAddress: assetContract,
    });
  };

  const TooltipContent = () => (
    <div className="flex flex-col gap-4">
      {notes[0].map((note) => (
        <div key={note} className="flex items-center gap-2">
          <span className="min-w-4">
            <Check />
          </span>
          <span className="text-sm text-white w-[273px]">{note}</span>
        </div>
      ))}
    </div>
  );
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {name} - {tokenId}
        </DialogTitle>
      </DialogHeader>
      <DialogBody>
        <div className="flex gap-6 items-stretch">
          <div className="gradient-box w-[50%] rounded-2xl overflow-hidden">
            <MediaRenderer
              src={src}
              client={client}
              alt={alt}
              className="w-full h-full object-cover aspect-square"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <span className="flex items-center gap-2 mb-4">
              <p className="font-medium text-muted-foreground">Notes</p>
              <Tooltip content={<TooltipContent />} className="w-[350px]">
                <button>
                  <Info className="size-4 text-muted-foreground"/>
                </button>
              </Tooltip>
            </span>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Minimum Bid Amount</Label>
                <TextField
                  value={minimumBidAmount}
                  onChange={(e) => setMinimumBidAmount(e.target.value)}
                  placeholder="Minimum Bid Amount"
                  containerClass="bg-transparent"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Buyout Bid Amount</Label>
                <TextField
                  value={buyoutBidAmount}
                  onChange={(e) => setBuyoutBidAmount(e.target.value)}
                  placeholder="Buyout Bid Amount"
                  containerClass="bg-transparent"
                />
              </div>
            </div>

            <div className="flex w-full mt-auto flex-col gap-4">
              <div className="flex flex-col gap-3 bg-gradient-to-r from-border/80 via-black/95 to-transparent p-3 rounded-xl w-full border border-border">
                <Label>Duration</Label>
                <div className="flex items-center gap-2 w-full">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    placeholderText="Select date"
                    className="w-full text-foreground placeholder:text-muted-foreground bg-transparent border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    minDate={oneWeekFromNow}
                    showPopperArrow={false}
                  />
                  <div className="border border-border w-full rounded-lg flex justify-between p-2">
                    <p className="font-medium text-sm text-muted-foreground">
                      {selectedDate
                        ? selectedDate.toDateString()
                        : "Select Date"}
                    </p>
                    <p className="font-medium text-sm text-muted-foreground">
                      {selectedDate
                        ? selectedDate.toLocaleTimeString()
                        : "Time"}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                disabled={isDisabled}
                onClick={
                  !isApproved ? handleApproveSpending : handleCreateAuction
                }
                className="w-full mt-auto"
                shape="square"
              >
                {!isApproved ? "Approve Spending" : "Auction NFT"}
              </Button>
            </div>
          </div>
        </div>
      </DialogBody>
    </>
  );
}
