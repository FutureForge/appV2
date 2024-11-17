import {
  Button,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Label,
  TextField,
} from "@/modules/app";
import React, { useState } from "react";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";
import {
  useApprovedForAllMutation,
  useCreateListingMutation,
} from "@/modules/mutation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Calendar from "@/assets/calendar.svg";
import Check from "@/assets/Checkbox [1.0].svg";

type ListDialogProps = {
  src: string;
  alt: string;
  name: string;
  tokenId: string;
  isApproved: boolean;
  assetContract: string;
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
}: ListDialogProps) {
  console.log({ isApproved });

  const [value, setValue] = useState("");
  const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const [selectedDate, setSelectedDate] = useState<Date>(oneWeekFromNow);

  console.log({ selectedDate });

  const createListingMutation = useCreateListingMutation();
  const approveMutation = useApprovedForAllMutation();

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
        },
        onError() {
          setValue("");
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

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {name} - {tokenId}
        </DialogTitle>
      </DialogHeader>
      <DialogBody>
        <div className="flex gap-6">
          <div className="w-[384px]">
            <div className="gradient-box rounded-2xl overflow-hidden">
              <MediaRenderer
                src={src}
                client={client}
                alt={alt}
                className="w-full h-full object-cover aspect-square"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-[#0F1629] rounded-2xl p-4 mb-6">
              <p className="font-medium mb-4">Note:</p>
              <div className="flex flex-col gap-4">
                {notes[0].map((note) => (
                  <div key={note} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white" />
                    <span className="text-sm text-white">{note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Listing Price</Label>
                <TextField
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-transparent"
                  placeholder="Listing Price"
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label className="mb-2 block">Duration</Label>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  placeholderText="Select date"
                  className="w-full bg-[#0F1629] text-white border border-[#1F2937] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  minDate={oneWeekFromNow}
                  showPopperArrow={false}
                />

                <div className="bg-[#0F1629] border border-[#1F2937] rounded-xl flex justify-between py-2 px-4">
                  <p className="font-medium text-sm text-white">
                    {selectedDate ? selectedDate.toDateString() : "Select Date"}
                  </p>
                  <p className="font-medium text-sm text-white">
                    {selectedDate ? selectedDate.toLocaleTimeString() : "Time"}
                  </p>
                </div>
              </div>

              <Button
                disabled={isDisabled}
                onClick={
                  !isApproved ? handleApproveSpending : handleCreateListing
                }
                className="w-full mt-6"
                variant="primary"
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
