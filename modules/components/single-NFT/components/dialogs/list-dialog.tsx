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
  useApprovalMutation,
  useCreateListingMutation,
} from "@/modules/mutation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Check from "@/assets/Checkbox [1.0].svg";
import Info from "@/assets/info.svg";
import XFI from "@/assets/xfi.svg";

type ListDialogProps = {
  src: string;
  alt: string;
  name: string;
  tokenId: string;
  isApproved: boolean;
  assetContract: string;
  setIsDialogOpen: (open: boolean) => void;
};

const notes = [
  [
    "Listing must have a duration of at least 7 days.",
    "You can cancel and update the listing details at any time before the first bid is placed. Once a bid is made, the listing cannot be cancelled.",
  ],
];

export function ListDialog({
  src,
  alt,
  name,
  tokenId,
  isApproved,
  assetContract,
  setIsDialogOpen,
}: ListDialogProps) {
  const [value, setValue] = useState("");
  const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const [selectedDate, setSelectedDate] = useState<Date>(oneWeekFromNow);

  const createListingMutation = useCreateListingMutation();
  const approveMutation = useApprovalMutation();

  const isDisabled = !isApproved
    ? false
    : !value || !selectedDate || createListingMutation.isPending;

  const handleDateChange = (date: Date | null) => {
    const newDate = date || oneWeekFromNow;
    setSelectedDate(newDate);
  };

  const handleCreateListing = () => {
    if (!value) return;

    createListingMutation.mutate(
      {
        directListing: {
          assetContract,
          tokenId,
          quantity: "1",
          pricePerToken: value,
          endTimestamp: selectedDate,
        },
      },
      {
        onSuccess: () => {
          setValue("");
          setIsDialogOpen(false);
        },
        onError() {
          setValue("");
          setIsDialogOpen(false);
        },
      }
    );
  };

  const handleApproveSpending = () => {
    if (isApproved) return;

    approveMutation.mutate(
      {
        collectionContractAddress: assetContract,
        tokenId,
      },
      {
        onError: () => {
          setIsDialogOpen(false);
        },
      }
    );
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

          <div className="flex-1 flex flex-col h-[380px]">
            <span className="flex items-center gap-2 mb-4">
              <p className="font-medium text-muted-foreground">Notes</p>
              <Tooltip content={<TooltipContent />} className="w-[350px]">
                <button aria-label="View listing notes">
                  <Info className="size-4 text-muted-foreground" />
                </button>
              </Tooltip>
            </span>

            <div className="flex flex-col gap-2">
              <Label>Listing Price</Label>
              <div className="relative">
                <TextField
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Listing Price"
                  containerClass="bg-transparent"
                  type="number"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <XFI className="size-4" />
                  <span className="text-gray-400">XFI</span>
                </div>
              </div>
            </div>
            <div className="flex w-full mt-auto flex-col gap-4">
              <div className="flex flex-col gap-3 bg-gradient-to-r from-border/80 via-black/95 to-transparent p-3 rounded-xl w-full border border-border">
                <Label className="mb-2 block">Duration</Label>
                <div className="flex items-center gap-2 w-full">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    placeholderText="Select date"
                    className="w-full bg-transparent text-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    minDate={oneWeekFromNow}
                    showPopperArrow={false}
                  />

                  <div className="border border-border w-full rounded-lg flex justify-between p-2">
                    <p className="font-medium text-sm text-white">
                      {selectedDate
                        ? selectedDate.toDateString()
                        : "Select Date"}
                    </p>
                    <p className="font-medium text-sm text-white">
                      {selectedDate
                        ? selectedDate.toLocaleTimeString()
                        : "Time"}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                disabled={isApproved ? isDisabled : approveMutation.isPending}
                onClick={
                  isApproved ? handleCreateListing : handleApproveSpending
                }
                className="w-full"
                shape="square"
              >
                {!isApproved ? "Approve Spending" : "List NFT"}
              </Button>
            </div>
          </div>
        </div>
      </DialogBody>
    </>
  );
}
