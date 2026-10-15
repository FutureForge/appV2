import {
  Button,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Label,
  TextField,
} from "@/modules/app";
import React, { useEffect, useState } from "react";
import Check from "@/assets/Checkbox [1.0].svg";
import { MediaRenderer } from "thirdweb/react";
import { client, USDT_TOKEN_CONTRACT } from "@/utils/configs";
import { TransitionLinks } from "@/modules/app/component/nav/transition-links";
import { getUserUSDTBalance, useUserChainInfo } from "@/modules/query";
import { useMakeListingOfferMutation } from "@/modules/mutation";
import DatePicker from "react-datepicker";

import XFI from "@/assets/xfi.svg";

type MakeOfferDialogProps = {
  src: string;
  alt: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  name: string;
  tokenId: string;
  assetContract: string;
  setIsDialogOpen: (open: boolean) => void;
};

const notes = [
  [
    "Offers are made in USDT.",
    "Don’t have USDT? Don’t worry, you can acquire some to get started.",
  ],

  ["You can also", "swap for USDT", "manually."],
];

export function MakeOfferDialog({
  src,
  alt,
  name,
  tokenId,
  assetContract,
  setIsDialogOpen,
}: MakeOfferDialogProps) {
  const { activeAccount } = useUserChainInfo();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const [selectedDate, setSelectedDate] = useState<Date>(oneWeekFromNow);

  const makeOfferMutation = useMakeListingOfferMutation();

  const isDisabled: boolean =
    !value ||
    !selectedDate ||
    makeOfferMutation.isPending ||
    !activeAccount ||
    Boolean(error);

  const { usdtBalance, isUSDTBalanceLoading } = getUserUSDTBalance();

  const handleDateChange = (date: Date | null) => {
    const newDate = date || oneWeekFromNow;
    setSelectedDate(newDate);
  };

  const handleMakeOffer = () => {
    if (!assetContract || !tokenId || !value || !selectedDate)
      throw new Error("Provide all fields");

    makeOfferMutation.mutateAsync(
      {
        makeOffer: {
          assetContract,
          tokenId,
          totalPrice: value,
          quantity: "1",
          expirationTimestamp: selectedDate,
          currency: USDT_TOKEN_CONTRACT,
        },
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
        onError: () => {
          setIsDialogOpen(false);
        },
      }
    );
  };

  const balance = isUSDTBalanceLoading
    ? "0"
    : Number(usdtBalance?.displayValue).toFixed(2) || 0;

  const symbol = usdtBalance?.symbol || "USDT";

  useEffect(() => {
    if (Number(value) > Number(balance)) {
      setError("Insufficient balance");
    } else {
      setError("");
    }
  }, [value, balance]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {name} - {tokenId}
        </DialogTitle>
      </DialogHeader>
      <DialogBody>
        <div className="flex gap-6 items-stretch max-[440px]:flex-col max-h-[76vh] h-full max-[440px]:h-full max-[440px]:overflow-x-hidden">
          <div className="relative h-full w-1/2 max-[440px]:w-full">
            <div className="w-full relative h-[500px] border-2 border-border z-40 rounded-2xl">
              <MediaRenderer
                src={src}
                client={client}
                alt={alt}
                className="object-cover w-full absolute inset-0 size-full rounded-2xl"
              />
              <div className="w-full h-[257px] absolute bottom-0 left-0 right-0 bg-gradient-to-t rounded-2xl via-black/80 from-background to-transparent" />
            </div>
          </div>
          <div className="w-1/2 flex flex-col h-full max-[440px]:w-full">
            <div className="bg-gradient-to-r from-border to-transparent p-4 rounded-2xl border border-border flex flex-col gap-6">
              <p className="font-medium">Note:</p>
              <div className="flex flex-col gap-4">
                {notes[0].map((note) => (
                  <p key={note} className="flex items-center w-full">
                    <span className="min-w-2.5">
                      <Check className="min-w-2.5 mr-2" />
                    </span>
                    <span className="text-sm font-medium w-[273px]">
                      {note}
                    </span>
                  </p>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {notes[1].map((note, index) => (
                  <p key={note} className="flex">
                    {index === 0 && (
                      <span className="min-w-2.5">
                        <Check className="min-w-2.5 mr-2" />
                      </span>
                    )}
                    {index === 1 ? (
                      <TransitionLinks
                        href="/your-link"
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        {note}
                      </TransitionLinks>
                    ) : (
                      <span className="text-sm font-medium">{note}</span>
                    )}
                  </p>
                ))}
              </div>
            </div>

            <form className="flex flex-col mt-6 gap-2">
              <Label>Offer Amount</Label>
              <div className="relative">
                <TextField
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  containerClass="bg-transparent rounded-lg"
                  placeholder={`Balance: ${
                    balance === "NaN" ? "0" : balance
                  } ${symbol}`}
                  type="number"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setValue(balance.toString())}
                    className="text-primary text-sm hover:text-primary/80 transition-colors mr-2"
                  >
                    MAX
                  </button>
                  <XFI className="size-4" />
                  <span className="text-gray-400">USDT</span>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>

            <div className="flex w-full mt-8 flex-col gap-4 max-[440px]:pb-4">
              <div className="flex flex-col gap-3 bg-gradient-to-r from-border/80 via-black/95 to-transparent p-3 max-[440px]:p-2 rounded-xl w-full border border-border">
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
                onClick={handleMakeOffer}
                disabled={isDisabled}
                className="w-full"
                shape="square"
              >
                {!activeAccount ? "Connect Your Wallet" : "Make Offer"}
              </Button>
            </div>
          </div>
        </div>
      </DialogBody>
    </>
  );
}
